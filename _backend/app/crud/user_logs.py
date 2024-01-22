import datetime
from typing import Optional
from bson import ObjectId
from pydantic import BaseModel, Field
from pymongo import MongoClient

from app.config.config_utils import env_config

class BaseModel(BaseModel):
    class Config:
        arbitrary_types_allowed = True
        populate_by_name = True
        json_encoders = {ObjectId: str}

class UserLogsModel(BaseModel):
    user_id: ObjectId = Field(...)
    type: str = Field(...)
    host: str = Field(...)
    user_agent: str = Field(...)
    created_at: Optional[datetime.datetime] = Field(default=datetime.datetime.utcnow())

def insert_one(conn: MongoClient, user_log: UserLogsModel):
    return conn[env_config.DB_NAME].get_collection("user_logs").insert_one(user_log.dict())
