import inspect
import logging
import json
import re
from typing import Annotated, Union
from bson import json_util
from bson.objectid import ObjectId
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Header, Query, Request, status
from pymongo import MongoClient
from pymongo.cursor import Cursor
from owlready2 import *
from app.email_service.email_sender import send_success_calculated_similarity_email
from app.owl.modules import add_modules_to_owl
import xml.etree.ElementTree as ET
from multiprocessing.pool import ThreadPool as Pool

import app.crud.module_recommend as MODULE_RECOMMEND
import app.crud.modules as MODULES
import app.crud.module_comment as MODULE_COMMENT
import app.owl.modules as OWL_MODULES
from app.crud.module_recommend import ModuleRecommendModel
from app.crud.module_comment import ModuleCommentModel
from app.db.mongodb import get_database
from app.api.module.model import CountRecommendResponseModel, GetModuleCommentItemResponseModel, GetModuleCommentResponseModel, ModuleCommentDataModel, ModuleCommentRequestModel, ModuleCommentResponseModel, RecommendRequestModel, UploadModulesModel, UploadModulesResponseItemModel, ModuleResponseModel
import app.crud.users as USERS
from app.transferability.similiarity_run import combine_similarity_results_and_write_back, start_similarity_for_one, add_module_to_res

module = APIRouter()

sortby_database_col_mapping = {"module_name":"name", "degree_program":"degree_program", "degree_level":"degree_level", "ects":"ects", "university":"university", "module_type": "type", "module_code": "module_code", "content":"content"}
all_sortby_database_col = ["name", "degree_program", "degree_level", "ects", "university", "type", "content"]

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
        db: MongoClient = Depends(get_database)
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

@module.get("/search/advanced/", status_code=status.HTTP_200_OK)
async def advanced_search(
        term: str = Query(min_length=1, pattern=r'''(\("(all_metadata|module_name|degree_program|degree_level|content|ects|university|module_type)":([\w ]+)\)[ ]*(AND|OR|NOT)*[ ]*)+''' ),
        limit: int = Query(20, gt=0),
        offset: int = Query(0, gt=0),
        sortby: str = Query('module_name', pattern='^module_name$|^degree_program$|^no_of_recommend$|^no_of_suggested_modules$|^degree_level$|^ects$|^university$|^module_type$'),
        orderby: str = Query('asc', pattern='^asc$|^desc$'),
        db: MongoClient = Depends(get_database),
    ):
    pattern = r'''\("(all_metadata|module_name|degree_program|degree_level|content|ects|university|module_type)":([\w ]+)\)[ ]*(AND|OR|NOT)*[ ]*''' 
    conditions = re.findall(pattern, term, re.IGNORECASE)

    extracted_columns = []
    for condition in conditions:
        if condition[0] != "all_metadata":
            extracted_columns.append(convert_term_to_db_column(condition))
        else:
            extracted_columns.extend(convert_term_to_db_column(condition))

    count = MODULES.advanced_count(db, extracted_columns)
    if count == 0:
        raise HTTPException(detail={"message": "no module found"}, status_code=status.HTTP_404_NOT_FOUND)
    
    sortby_column = 'module_name'
    if not is_manual_calculated_sortby(sortby=sortby):
        sortby_column = sortby_database_col_mapping[sortby] 

    items = MODULES.advanced_find(db, extracted_columns, limit, offset, sortby_column, orderby)
    data = prepare_item(db, items)

    if is_manual_calculated_sortby(sortby=sortby):
        data = sort(data, sortby, orderby)

    return {
        "data": {
            "total_results": count,
            "total_items": len(data),
            "items": data,
        }}

def convert_term_to_db_column(condition: tuple):
    COLUMN_NAME = 0
    VALUE = 1
    OPERATOR = 2

    if condition[COLUMN_NAME] != "all_metadata":
        condition_list = list(condition)
        condition_list[COLUMN_NAME] = sortby_database_col_mapping[condition[COLUMN_NAME]]
        return tuple(condition_list)
    else:
        conditions = []
        for indx, col in enumerate(all_sortby_database_col):
            if indx != len(all_sortby_database_col)-1:
                conditions.append((col, condition[VALUE], "or"))
            else:
                conditions.append((col, condition[VALUE], condition[OPERATOR]))
        return conditions


@module.post("/", status_code=status.HTTP_201_CREATED)
async def create_module(
        request: Request,
        content_type: str = Header(...),
        db: MongoClient = Depends(get_database),
        background_tasks: BackgroundTasks = None):
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

    background_tasks.add_task(add_module_to_res_parallel_process, items=item_response_list)
    background_tasks.add_task(calculate_similarity_for_one_parallel_process, items=item_response_list)
    background_tasks.add_task(add_modules_to_owl)
    background_tasks.add_task(send_email_after_calculation, db=db, user_id=ObjectId(request.state.user_id))

    return {
        "data": {
            "total_items": len(item_response_list),
            "items": item_response_list,
        }
    }


def add_module_to_res_parallel_process(items: list):
    logging.debug('module name: '+__name__+ " | function: "+str(inspect.stack()[0][3])+" | message: started")
    for item in items:
        add_module_to_res(item.module_id)
    logging.debug('module name: '+__name__+ " | function: "+str(inspect.stack()[0][3])+" | message: finished")
        

def calculate_similarity_for_one_parallel_process(items: list):
    pool_size = 8
    similarity_changes = []
    def worker(item):
        logging.debug(str(multiprocessing.Process())+' | module name: '+__name__+ " | function: "+str(inspect.stack()[0][3])+" | message: started")
        a = start_similarity_for_one(item)
        similarity_changes.append(a)
        logging.debug(str(multiprocessing.Process())+' | module name: '+__name__+ " | function: "+str(inspect.stack()[0][3])+" | message: finished")
        

    pool = Pool(pool_size)

    for item in items:
        logging.debug('module name: '+__name__+ " | function: "+str(inspect.stack()[0][3])+" | message: call -> "+str(item.module_id))
        pool.apply_async(worker, (item,))

    pool.close()
    pool.join()
    logging.debug('module name: '+__name__+ " | function: "+str(inspect.stack()[0][3])+" | message: all processes joined")

    logging.debug('module name: '+__name__+ " | function: "+str(inspect.stack()[0][3])+" | message: writing a result json file")
    combine_similarity_results_and_write_back(similarity_changes)
    logging.debug('module name: '+__name__+ " | function: "+str(inspect.stack()[0][3])+" | message: successfully write a result json file")


def get_data_from_xml(text: bytes) -> (list, list): # type: ignore
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


async def send_email_after_calculation(db: MongoClient, user_id: ObjectId):
    user = USERS.get_user_by_id(db, user_id)
    try:
        await send_success_calculated_similarity_email(user_email=user["email"], user_name=user["first_name"])
    except Exception as e:
        raise HTTPException(
            detail={"message": str(e)},
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    logging.debug('module name: '+__name__+ " | function: "+str(inspect.stack()[0][3])+" | message: email sent")


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

@module.get("/{module_id}/", response_model=ModuleResponseModel, status_code=status.HTTP_200_OK)
async def get_module(module_id: str = None, db: MongoClient = Depends(get_database)):
    # Convert the string ID to ObjectId
    try:
        module_id_obj = ObjectId(module_id)
    except Exception as e:
        raise HTTPException(
            detail={"message": str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )
    # Fetch the module from the database
    module_data = MODULES.find_one(db, module_id_obj)
    if not module_data:
        raise HTTPException(
            detail={"message": "Module not found"},
            status_code=status.HTTP_404_NOT_FOUND
        )
    module_data['id'] = str(module_data.pop("_id"))
    return module_data
