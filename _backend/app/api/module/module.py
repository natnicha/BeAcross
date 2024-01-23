import json
from typing import Annotated, Union
from bson import json_util
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from pymongo import MongoClient
from pymongo.cursor import Cursor

import app.crud.module_recommend as MODULE_RECOMMEND
import app.crud.modules as MODULES
from app.crud.module_recommend import ModuleRecommendModel
from app.db.mongodb import get_database
from app.api.module.model import CountRecommendResponseModel, RecommendRequestModel


module = APIRouter()

sortby_database_col_mapping = {"module_name":"name", "degree_program":"degree_program", "degree_level":"degree_level", "ects":"ects", "university":"university", "module_type": "type"}

@module.post("/recommend", status_code=status.HTTP_201_CREATED)
async def recommend(
        request: Request,
        item: RecommendRequestModel = None,
        db: MongoClient = Depends(get_database),
    ):
    try:
        module_recommend = ModuleRecommendModel(
            module_id=ObjectId(item.module_id),
            user_id=ObjectId(request.state.user_id)
        )
    except Exception as e:
        raise HTTPException(
            detail={"message": str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )

    check_conflict(db, module_recommend)
    insert_module_recommend(db, module_recommend)
    return 

def check_conflict(db: MongoClient, module_recommend: ModuleRecommendModel):
    rows = MODULE_RECOMMEND.get_module_recommend(db, module_recommend)
    if len(list(rows)) > 0:
        raise HTTPException(
            detail={"message": "this action is performed"},
            status_code=status.HTTP_409_CONFLICT
        )

def insert_module_recommend(db: MongoClient, module_recommend: ModuleRecommendModel):
    try:
        MODULE_RECOMMEND.insert_one(db, module_recommend)
    except Exception as e:
        raise HTTPException(
            detail={"message": e},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@module.get("/{module_id}/recommend", response_model=CountRecommendResponseModel)
async def no_of_recommend(
        module_id: str = None,
        db: MongoClient = Depends(get_database),
    ):
    module_id_obj = None
    try:
        module_id_obj = ObjectId(module_id)
    except Exception as e:
        raise HTTPException(
            detail={"message": str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )

    count = get_no_of_recommend_module(db, module_id_obj)
    return CountRecommendResponseModel(
        data={
            "module_id": module_id,
            "no_of_recommend": str(count)
        }
    )

def get_no_of_recommend_module(db: MongoClient, module_id: ObjectId):
    count = 0
    try:
        count = MODULE_RECOMMEND.count_module_recommend(db, module_id)
    except Exception as e:
        raise HTTPException(
            detail={"message": e},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    return count


@module.delete("/{module_id}/recommend", status_code=status.HTTP_200_OK)
async def delete_recommend(
        request: Request,
        module_id: str = None,
        db: MongoClient = Depends(get_database),
    ):
    try:
        module_recommend = ModuleRecommendModel(
            module_id=ObjectId(module_id),
            user_id=ObjectId(request.state.user_id)
        )
    except Exception as e:
        raise HTTPException(
            detail={"message": str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )

    check_exist_module_recommend(db, module_recommend)
    delete_module_recommend(db, module_recommend)
    return 

def check_exist_module_recommend(db: MongoClient, module_recommend: ModuleRecommendModel):
    rows = MODULE_RECOMMEND.get_module_recommend(db, module_recommend)
    if len(list(rows)) == 0:
        raise HTTPException(
            detail={"message": "the module recommended by this user is not found"},
            status_code=status.HTTP_404_NOT_FOUND
        )

def delete_module_recommend(db: MongoClient, module_recommend: ModuleRecommendModel):
    try:
        MODULE_RECOMMEND.delete_one(db, module_recommend)
    except Exception as e:
        raise HTTPException(
            detail={"message": e},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@module.get("/search/", status_code=status.HTTP_200_OK)
async def search(
        term: str = Query(min_length=1),
        degree_level: Annotated[Union[list[str], None], Query()] = None,
        ects: Annotated[Union[list[int], None], Query()] = None,
        university: Annotated[Union[list[str], None], Query()] = None,
        module_type: Annotated[Union[list[str], None], Query()] = None,
        limit: int = Query(20, gt=0),
        offset: int = Query(0, gt=0),
        sortby: str = Query('module_name', pattern='^module_name$|^degree_program$|^no_of_recommend$|^no_of_suggested_modules$|^degree_level$|^ects$|^university$|^module_type$'),
        orderby: str = Query('asc', pattern='^asc$|^desc$'),
        db: MongoClient = Depends(get_database),
    ):
    count = MODULES.count(db, term, degree_level, ects, university, module_type)
    if count == 0:
        raise HTTPException(detail={"message": "no module found"}, status_code=status.HTTP_404_NOT_FOUND)
    
    sortby_column = 'module_name'
    if not is_manual_calculated_sortby(sortby=sortby):
        sortby_column = sortby_database_col_mapping[sortby] 
    
    items = MODULES.find(db, term, degree_level, ects, university, module_type, limit, offset, sortby_column, orderby)
    data = prepare_item(db, items)

    if is_manual_calculated_sortby(sortby=sortby):
        data = sort(data, sortby, orderby)

    return {
        "data":{
            "total_results": count,
            "total_items": len(data),
            "items": data
    }}

def prepare_item(db: MongoClient, items: Cursor):
    data = parse_json(items)
    for entry in data:
        entry["module_id"] = entry["_id"]['$oid']
        entry["module_name"] = entry["name"]
        del entry['name']
        del entry["_id"]
        entry['no_of_recommend'] = MODULE_RECOMMEND.count_module_recommend(db, ObjectId(entry["module_id"]))
        # TODO: call OWL service for number of sugggested modules
        entry['no_of_suggested_modules'] = 0
    return data

def sort(data: list, sortby: str, orderby: str):
    is_reverse = False
    if orderby.lower() == 'desc':
        is_reverse = True
    return sorted(data, reverse=is_reverse, key=lambda d: d[sortby])

def is_manual_calculated_sortby(sortby: str):
    return (sortby == 'no_of_recommend' or sortby == 'no_of_suggested_modules')

def parse_json(data):
    return json.loads(json_util.dumps(data))

@module.get("/search/advanced/", status_code=status.HTTP_200_OK)
async def advanced_search(
        term: str = Query(min_length=1, pattern=r'(\("(all_metadata|module_name|degree_program|degree_level|content|ects|university|module_type)":(\w+)\)(AND|OR|NOT)*)+'),
        limit: int = Query(20, gt=0),
        offset: int = Query(0, gt=0),
        sortby: str = Query('no_of_recommend', pattern='^module_name$|^degree_program$|^no_of_recommend$|^no_of_suggested_modules$|^degree_level$|^ects$|^university$|^module_type$'),
        orderby: str = Query('asc', pattern='^asc$|^desc$'),
        db: MongoClient = Depends(get_database),
    ):
    return 
