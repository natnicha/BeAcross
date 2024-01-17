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

def insert_one(conn: MongoClient, module_recommend: ModuleRecommendModel):
    return conn[env_config.DB_NAME].get_collection("module_recommend").insert_one(module_recommend.dict())
