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

class UsersModel(BaseModel):
    email: str = Field(...)
    password: bytes = Field(...)
    first_name: str = Field(...)
    last_name: str = Field(...)
    registration_number: Optional[int] = Field(default=None)
    course_of_study: Optional[str] = Field(default=None)
    semester: Optional[int] = Field(default=1)
    user_roles_id: ObjectId = Field()
    created_at: Optional[datetime.datetime] = Field(default=datetime.datetime.utcnow())
    updated_at: Optional[datetime.datetime] = Field(default=datetime.datetime.utcnow())

def get_user(conn: MongoClient, email: str):
    return conn[env_config.DB_NAME].get_collection("users").find({"email" : email})

def get_user_by_id(conn: MongoClient, id: ObjectId):
    return conn[env_config.DB_NAME].get_collection("users").find_one({"_id" : id})

def insert_one(conn: MongoClient, user: UsersModel):
    return conn[env_config.DB_NAME].get_collection("users").insert_one(user.dict())
