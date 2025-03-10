import datetime
import re
from typing import Optional
from bson.objectid import ObjectId
from pymongo import MongoClient
from pydantic import BaseModel, Field
from bson import ObjectId
from app.config.config_utils import env_config

class BaseModel(BaseModel):
    class Config:
        arbitrary_types_allowed = True
        populate_by_name = True
        json_encoders = {ObjectId: str}

class ModulesModel(BaseModel):
    name: str = Field(...)
    degree_program: str = Field(...)
    degree_level: str = Field(...)
    content: str = Field(...)   
    university: str = Field(...)
    module_code: str = Field(...)
    ects: int = Field(...)
    year: str = Field(...)
    type: str = Field(...)
    created_at: Optional[datetime.datetime] = Field(default=datetime.datetime.utcnow())
    updated_at: Optional[datetime.datetime] = Field(default=datetime.datetime.utcnow())

def find(conn: MongoClient, term: str, 
         level: list[str], ects: list[int], university: list[str], type: list[str], 
         limit: int, offset: int, sortby: str, orderby: str):
    is_asc = 1
    if orderby.lower() == 'desc':
        is_asc = -1
    condition = convert_conditions_to_query(term, level, ects, university, type)
    return conn[env_config.DB_NAME].get_collection("modules").find(condition).sort({
        sortby : int(is_asc)
    }).skip(offset).limit(limit)

def find_many_by_id_list(conn: MongoClient, ids: list):
    return conn[env_config.DB_NAME].get_collection("modules").find({"_id": {"$in":ids}})

def count(conn: MongoClient, term: str,
          level: list[str], ects: list[int], university: list[str], type: list[str]):
    condition = convert_conditions_to_query(term, level, ects, university, type)
    return conn[env_config.DB_NAME].get_collection("modules").count_documents(condition)

def count_by_id(conn: MongoClient, id: ObjectId):
    return conn[env_config.DB_NAME].get_collection("modules").count_documents({"_id":id})

def convert_str_to_like(term: str):
    return re.compile('.*'+term+'.*', re.IGNORECASE)

def convert_list_to_like_list(conditon: list):
    query = []
    for cond in conditon:
        query.append(convert_str_to_like(cond))
    return query

def condition_list_to_query(target_column_name: str, condition_list: list):
    query = []
    for cond in condition_list:
        query.append({target_column_name: cond})
    
    return { "$or": query }

def convert_conditions_to_query(term: str, level: list[str], ects: list[int], university: list[str], type: list[str]):
    condition = {}
    like_term = convert_str_to_like(term=term)

    if level or ects or university or type:
        condition['$and'] = [{"name": like_term}]
        
        if level: #like
            level_like_cond = convert_list_to_like_list(level)
            level_cond = condition_list_to_query('degree_level', level_like_cond)
            condition['$and'].append(level_cond)

        if ects: #=
            ects_cond = condition_list_to_query('ects', ects)
            condition['$and'].append(ects_cond)

        if university: #=
            university_cond = condition_list_to_query('university', university)
            condition['$and'].append(university_cond)

        if type: #like
            type_like_cond = convert_list_to_like_list(type)
            type_cond = condition_list_to_query('type', type_like_cond)
            condition['$and'].append(type_cond)

    else:
        condition["name"] = like_term
    
    return condition

def advanced_find(conn: MongoClient, conditions: list, limit: int, offset: int, sortby: str, orderby: str):
    is_asc = 1
    if orderby.lower() == 'desc':
        is_asc = -1
    condition = convert_advanced_conditions_to_query(conditions)
    return conn[env_config.DB_NAME].get_collection("modules").find(condition).sort({
        sortby : int(is_asc)
    }).skip(offset).limit(limit)

def advanced_count(conn: MongoClient, conditions: list):
    condition = convert_advanced_conditions_to_query(conditions)
    return conn[env_config.DB_NAME].get_collection("modules").count_documents(condition)

def convert_advanced_conditions_to_query(conditions: list):
    COLUMN_NAME = 0
    VALUE = 1
    OPERATOR = 2

    query = None
    previous_operator = ""
    for condition in conditions:
        if query is not None: # from the 2nd condition onwards
            if previous_operator != "":
                if previous_operator != "not":
                    query = { "$"+previous_operator: [query, create_like_term_dictionary(condition[COLUMN_NAME], condition[VALUE])] }
                else:
                    query = { "$and": [query, {condition[COLUMN_NAME]:  create_like_term_dictionary("$not", condition[VALUE])}] }
            else:
                return query
        
        if query is None:  # only for the 1st condition
            query = create_like_term_dictionary(condition[COLUMN_NAME], condition[VALUE])
        previous_operator = condition[OPERATOR].lower()
    return query

def create_like_term_dictionary(key: str, value: str, convert_to_like_term: bool = True):
    if convert_to_like_term:
        return {key: convert_str_to_like(value)}
    return {key: value}

def find_one(conn: MongoClient, module_id: ObjectId):
    collection = conn[env_config.DB_NAME].get_collection("modules")
    return collection.find_one({'_id': module_id})

# delCRUD
def delete_one(conn: MongoClient, module_id: ObjectId):
    collection = conn[env_config.DB_NAME].get_collection("modules")
    return collection.delete_one({'_id': module_id})


def update_one(conn: MongoClient, module_id: ObjectId, update_data: dict):
    collection = conn[env_config.DB_NAME].get_collection("modules")
    result = collection.update_one({'_id': module_id}, {'$set': update_data})
    return result


def insert_many(conn: MongoClient, modules_model: ModulesModel):
    return conn[env_config.DB_NAME].get_collection("modules").insert_many([i.dict() for i in modules_model])
