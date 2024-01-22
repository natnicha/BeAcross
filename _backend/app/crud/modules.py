import datetime
import decimal
import re
from typing import Optional
from bson import ObjectId
from mongomock import MongoClient
from pydantic import BaseModel, Field
from bson.objectid import ObjectId as BsonObjectId
from app.config.config_utils import env_config

class BaseModel(BaseModel):
    class Config:
        arbitrary_types_allowed = True
        populate_by_name = True
        json_encoders = {ObjectId: str}

class ModulesModel(BaseModel):
    name: str = Field(...)
    degree_program: str = Field(...)
    level: str = Field(...)
    code: str = Field(...)
    university: str = Field(...)
    ect_credits: int = Field(...)
    year_of_study: str = Field(...)
    content: str = Field(...)   
    created_at: Optional[datetime.datetime] = Field(default=datetime.datetime.utcnow())
    updated_at: Optional[datetime.datetime] = Field(default=datetime.datetime.utcnow())

def find(conn: MongoClient, term: str, limit: int, offset: int, sortby: str, orderby: str):
    is_asc = 1
    if orderby.lower() == 'desc':
        is_asc = -1

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
