import json
from typing import Annotated, Union
from bson import json_util
from bson.objectid import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Header, Query, Request, status
from pymongo import MongoClient
from pymongo.cursor import Cursor
from owlready2 import *
from app.owl.modules import add_modules_to_owl
import xml.etree.ElementTree as ET

import app.crud.module_recommend as MODULE_RECOMMEND
import app.crud.modules as MODULES
import app.crud.module_comment as MODULE_COMMENT
import app.owl.modules as OWL_MODULES
from app.crud.module_recommend import ModuleRecommendModel
from app.crud.module_comment import ModuleCommentModel
from app.db.mongodb import get_database
from app.api.module.model import CountRecommendResponseModel, GetModuleCommentItemResponseModel, GetModuleCommentResponseModel, ModuleCommentDataModel, ModuleCommentRequestModel, ModuleCommentResponseModel, RecommendRequestModel
import app.crud.users as USERS

from app.transferability.similiarity_run import start_similarity_for_one, add_module_to_res

from app.owl.modules import find_suggested_modules, delete_file

module = APIRouter()

sortby_database_col_mapping = {"module_name": "name", "degree_program": "degree_program",
                               "degree_level": "degree_level", "ects": "ects", "university": "university",
                               "module_type": "type", "module_code": "module_code", "content": "content"}


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
async def get_no_of_recommend(
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


@module.post("/comment", response_model=ModuleCommentResponseModel, status_code=status.HTTP_201_CREATED)
async def comment(
        request: Request,
        items: ModuleCommentRequestModel,
        db: MongoClient = Depends(get_database),
):
    try:
        module_comment = ModuleCommentModel(
            module_id=ObjectId(items.module_id),
            message=items.message,
            user_id=ObjectId(request.state.user_id)
        )
    except Exception as e:
        raise HTTPException(
            detail={"message": str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )
    inserted = insert_module_comment(db, module_comment)
    data = ModuleCommentDataModel(
        id=inserted.inserted_id,
        module_id=module_comment.module_id,
        message=module_comment.message,
        user_id=module_comment.user_id)
    return ModuleCommentResponseModel(
        message="successful commented",
        data=data
    )


def insert_module_comment(db: MongoClient, module_comment: ModuleCommentModel):
    try:
        return MODULE_COMMENT.insert_one(db, module_comment)
    except Exception as e:
        raise HTTPException(
            detail={"message": e},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@module.delete("/comment/{module_comment_id}", status_code=status.HTTP_200_OK)
async def delete_comment(
        request: Request,
        module_comment_id: str = None,
        db: MongoClient = Depends(get_database),
):
    try:
        module_comment_id_obj = ObjectId(module_comment_id)
        user_id_obj = ObjectId(request.state.user_id)
    except Exception as e:
        raise HTTPException(
            detail={"message": str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )
    check_exist_module_comment(db, module_comment_id_obj, user_id_obj)
    delete_module_comment(db, module_comment_id_obj, user_id_obj)
    return


def check_exist_module_comment(db: MongoClient, module_comment_id: ObjectId, user_id: ObjectId):
    rows = MODULE_COMMENT.find(db, module_comment_id, user_id)
    if len(list(rows)) == 0:
        raise HTTPException(
            detail={"message": "the comment by this user is not found"},
            status_code=status.HTTP_404_NOT_FOUND
        )


def delete_module_comment(db: MongoClient, module_comment_id: ObjectId, user_id: ObjectId):
    try:
        MODULE_COMMENT.delete_one(db, module_comment_id, user_id)
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
        sortby: str = Query('module_name',
                            pattern='^module_name$|^degree_program$|^no_of_recommend$|^no_of_suggested_modules$|^degree_level$|^ects$|^university$|^module_type$'),
        orderby: str = Query('asc', pattern='^asc$|^desc$'),
        db: MongoClient = Depends(get_database),
):
    count = MODULES.count(db, term, degree_level, ects, university, module_type)
    if count == 0:
        raise HTTPException(detail={"message": "No module found"}, status_code=status.HTTP_404_NOT_FOUND)

    sortby_column = 'module_name'
    if not is_manual_calculated_sortby(sortby=sortby):
        sortby_column = sortby_database_col_mapping[sortby]

    items = MODULES.find(db, term, degree_level, ects, university, module_type, limit, offset, sortby_column, orderby)
    data = prepare_item(db, items)

    if is_manual_calculated_sortby(sortby=sortby):
        data = sort(data, sortby, orderby)

    return {
        "data": {
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
        entry['no_of_suggested_modules'] = len(OWL_MODULES.find_suggested_modules(entry["module_id"]))
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


@module.post("/", status_code=status.HTTP_201_CREATED)
async def create_module(
        request: Request,
        content_type: str = Header(...),
        db: MongoClient = Depends(get_database)):
    if content_type != "application/xml":
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail={
                "message": f"Unsupported media type: {content_type}."
                           " It must be application/xml"
            }
        )

    try:
        body = await request.body()
        uploaded_modules_list, db_modules_list = get_data_from_xml(body)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"message": "Expected tag not found or unexpected tag found. Please check you XML file tags",
                    "hint": str(e)},
        )

    inserted_modules = MODULES.insert_many(db, db_modules_list)
    item_response_list = []
    for index, element in enumerate(uploaded_modules_list):
        module_id = str(inserted_modules.inserted_ids[index])
        item = UploadModulesResponseItemModel(
            module_id=module_id,
            module_name=element.name,
            degree_program=element.degree_program,
            degree_level=element.degree_level,
            university=element.university,
            module_code=element.module_code,
            content=element.content,
            ects=int(element.ects or 0),
            type=element.type
        )
        item_response_list.append(item)

    for mod in item_response_list:
        add_module_to_res(mod.module_id)

    for mod in item_response_list:
        start_similarity_for_one(mod)

    add_modules_to_owl()
    
    for mod in item_response_list:
        similar_module_id_list = find_suggested_modules(mod.module_id)

        similar_module_detail_list = []
        for similar_module_id in similar_module_id_list:
            similar_module_detail_list.append(MODULES.find_one(db, ObjectId(similar_module_id)))
        mod.similar_modules = similar_module_detail_list


    return {
        "data": {
            "total_items": len(item_response_list),
            "items": item_response_list,
        }
    }


def get_data_from_xml(text: bytes) -> (list, list):
    tree = ET.ElementTree(ET.fromstring(text))
    modules_graph = tree.getroot()
    uploaded_modules_list = []
    db_modules_list = []
    for module in modules_graph:
        uploading_model = UploadModulesModel()
        for entity in module:
            setattr(uploading_model, sortby_database_col_mapping[entity.tag], entity.text)
        db_model = MODULES.ModulesModel(
            name=uploading_model.name,
            degree_program=uploading_model.degree_program,
            degree_level=uploading_model.degree_level,
            university=uploading_model.university,
            module_code=uploading_model.module_code,
            content=uploading_model.content,
            ects=int(uploading_model.ects or 0),
            year="",
            type=uploading_model.type,
        )
        uploaded_modules_list.append(uploading_model)
        db_modules_list.append(db_model)
    return uploaded_modules_list, db_modules_list


@module.get("/{module_id}/comment", response_model=GetModuleCommentResponseModel, status_code=status.HTTP_200_OK)
async def get_module_comment(
        module_id: str = None,
        db: MongoClient = Depends(get_database),
    ):
    try:
        module_id_obj = ObjectId(module_id)
    except Exception as e:
        raise HTTPException(
            detail={"message": str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )
    module_comments = list(MODULE_COMMENT.find_by_module_id(db, module_id=module_id_obj))
    items = prepare_module_comment_item(db, module_comments)
    return GetModuleCommentResponseModel(
        module_id = module_id,
        total_items = len(module_comments),
        items = items
    )

def prepare_module_comment_item(db: MongoClient, module_comments: list):
    item = []
    for mod_com in module_comments:
        user = USERS.get_user_by_id(db, mod_com["user_id"])
        user_name = ""
        if user is not None:
            user_name = user["first_name"]
        item.append(GetModuleCommentItemResponseModel(
            id = str(mod_com["_id"]),
            message = mod_com["message"],
            user = mask_user_name(user_name),
            created_at = mod_com["created_at"],
            updated_at = mod_com["updated_at"]
        ))
    return item

def mask_user_name(name="", mask="*"):
    if name == "" or name is None:
        return "*****"
    mask_string = mask+mask+mask
    if len(name)>=3:
        return name[0:2]+mask_string+name[-1]
    else:
        return name
