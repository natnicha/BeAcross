import datetime
from typing import Optional
from bson import ObjectId
from pydantic import BaseModel, Field
from pymongo import MongoClient

from app.config.config_utils import env_config

class BaseModel(BaseModel):
    class Config:
        arbitrary_types_allowed = True

class ModuleRecommendModel(BaseModel):
    module_id: ObjectId = Field(...)
    user_id: ObjectId = Field(...)
    created_at: Optional[datetime.datetime] = Field(default=datetime.datetime.utcnow())

def get_module_recommend(conn: MongoClient, module_recommend: ModuleRecommendModel):
    return conn[env_config.DB_NAME].get_collection("module_recommend").find({
        "module_id": module_recommend.module_id,
        "user_id": module_recommend.user_id
    })

def count_module_recommend(conn: MongoClient, module_id: ObjectId):
    return conn[env_config.DB_NAME].get_collection("module_recommend").count_documents({
        "module_id": module_id,
    })

def insert_one(conn: MongoClient, module_recommend: ModuleRecommendModel):
    return conn[env_config.DB_NAME].get_collection("module_recommend").insert_one(module_recommend.dict())
