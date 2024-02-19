from dataclasses import Field
import datetime
from typing import Optional
from bson import ObjectId
from pymongo import MongoClient
from pydantic import BaseModel, Field

from app.config.config_utils import env_config

class BaseModel(BaseModel):
    class Config:
        arbitrary_types_allowed = True
        populate_by_name = True
        json_encoders = {ObjectId: str}
        
class ModuleCommentModel(BaseModel):
    module_id: ObjectId = Field(...)
    message: str = Field(...)
    user_id: ObjectId = Field(...)
    created_at: Optional[datetime.datetime] = Field(default=datetime.datetime.utcnow())
    updated_at: Optional[datetime.datetime] = Field(default=datetime.datetime.utcnow())


def find(db: MongoClient, module_comment_id: ObjectId, user_id: ObjectId):
    return db[env_config.DB_NAME].get_collection("module_comments").find({
        "_id": module_comment_id, 
        "user_id": user_id
    })


def find_by_module_id(db: MongoClient, module_id: ObjectId):
    return db[env_config.DB_NAME].get_collection("module_comments").find({
        "module_id": module_id, 
    })

def delete_one(conn: MongoClient, module_comment_id: ObjectId, user_id: ObjectId):
    return conn[env_config.DB_NAME].get_collection("module_comments").delete_one({
        "_id": module_comment_id,
        "user_id": user_id
    })


def insert_one(db: MongoClient, module_comment: ModuleCommentModel):
    return db[env_config.DB_NAME].get_collection("module_comments").insert_one(module_comment.dict())
