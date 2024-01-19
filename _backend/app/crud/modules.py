import datetime
import decimal
<<<<<<< HEAD
<<<<<<< HEAD
import re
from typing import Optional
from bson import ObjectId
from mongomock import MongoClient
from pydantic import BaseModel, Field
from bson.objectid import ObjectId as BsonObjectId
=======
=======
import re
>>>>>>> e4009e9 (feat: add logic in /module/search)
from typing import Optional
from bson import ObjectId
from fastapi import HTTPException
from mongomock import MongoClient
from pydantic import BaseModel, Field
>>>>>>> 6fa551a (feat: add find logic into /module/search)
from app.config.config_utils import env_config

class BaseModel(BaseModel):
    class Config:
        arbitrary_types_allowed = True
<<<<<<< HEAD
<<<<<<< HEAD
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}

class ModulesModel(BaseModel):
    name: str = Field(...)
    degree_program: str = Field(...)
    level: str = Field(...)
    code: str = Field(...)
    university: str = Field(...)
    ect_credits: decimal = Field(...)
    year_of_study: decimal = Field(...)
=======
=======
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}
>>>>>>> e4009e9 (feat: add logic in /module/search)

class UserLogsModel(BaseModel):
    name: str = Field(...)
    program: str = Field(...)
    degree_level: str = Field(...)
    university: str = Field(...)
    ect_credits: decimal = Field(...)
    semester: decimal = Field(...)
>>>>>>> 6fa551a (feat: add find logic into /module/search)
    content: str = Field(...)
    created_at: Optional[datetime.datetime] = Field(default=datetime.datetime.utcnow())
    updated_at: Optional[datetime.datetime] = Field(default=datetime.datetime.utcnow())

def find(conn: MongoClient, term: str, limit: int, offset: int, sortby: str, orderby: str):
    is_asc = 1
    if orderby.lower() == 'desc':
        is_asc = -1

<<<<<<< HEAD
<<<<<<< HEAD
    like_term = convert_to_like(term=term)
    return conn[env_config.DB_NAME].get_collection("modules").find({
        "name": like_term
    }).sort({
        sortby : int(is_asc)
    }).skip(offset).limit(limit)

def count(conn: MongoClient, term: str):
    like_term = convert_to_like(term=term)
    return conn[env_config.DB_NAME].get_collection("modules").count_documents({
        "name": like_term
    })

def convert_to_like(term: str):
    return re.compile('.*'+term+'.*', re.IGNORECASE)
=======
=======
    rgx = re.compile('.*'+term+'.*', re.IGNORECASE)
>>>>>>> e4009e9 (feat: add logic in /module/search)
    return conn[env_config.DB_NAME].get_collection("modules").find({
        "name": rgx
    }, {'_id': 0}).sort({
        sortby : int(is_asc)
    }).skip(offset).limit(limit)
<<<<<<< HEAD
>>>>>>> 6fa551a (feat: add find logic into /module/search)
=======

    # if rows is None:
    #     raise HTTPException(status_code=404, detail='Student not found.')
    # student: Student = Student(**data)
    # return student

def count(conn: MongoClient, term: str):
    rgx = re.compile('.*'+term+'.*', re.IGNORECASE)
    return conn[env_config.DB_NAME].get_collection("modules").count_documents({
        "name": rgx
    })
>>>>>>> e4009e9 (feat: add logic in /module/search)
