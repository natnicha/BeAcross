import datetime
from typing import Optional
from pydantic import Field
from bson import ObjectId
from pymongo import MongoClient
from pydantic import BaseModel
from app.config.config_utils import env_config

class BaseModel(BaseModel):
    class Config:
        arbitrary_types_allowed = True
        populate_by_name = True
        json_encoders = {ObjectId: str}

class PersonalPlanModel(BaseModel):
    user_id: ObjectId = Field(...)
    semester_id: ObjectId = Field(...)
    module_id: ObjectId = Field(...)
    created_at: Optional[datetime.datetime] = Field(default=datetime.datetime.utcnow())

def get_by_user_id_and_module_id(conn: MongoClient, user_id: ObjectId, module_id: ObjectId = None):
    condition = {"user_id":user_id}
    if module_id is not None:
        condition["module_id"] = module_id
    return conn[env_config.DB_NAME].get_collection("personal_plans").find(condition).sort({"module_id": 1, "semester_id": 1})

def count_by_module_id_semester_id_user_id(conn: MongoClient, user_id: ObjectId, semester_id: ObjectId, module_id: ObjectId):
    return conn[env_config.DB_NAME].get_collection("personal_plans").count_documents({
        "user_id": user_id, 
        "module_id": module_id,
        "semester_id": semester_id
        })

def count_by_id_user_id(conn: MongoClient, id: ObjectId, user_id: ObjectId):
    return conn[env_config.DB_NAME].get_collection("personal_plans").count_documents({"_id": id, "user_id": user_id})

def delete_one_by_id(conn: MongoClient, id: ObjectId):
    return conn[env_config.DB_NAME].get_collection("personal_plans").delete_one({"_id": id})

def insert_one(conn: MongoClient, persoanl_plan: PersonalPlanModel):
    return conn[env_config.DB_NAME].get_collection("personal_plans").insert_one(persoanl_plan.dict())
