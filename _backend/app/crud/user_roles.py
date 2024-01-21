import datetime
from typing import Optional
from pydantic import BaseModel, Field
from pymongo import MongoClient

from app.config.config_utils import env_config

class BaseModel(BaseModel):
    class Config:
        arbitrary_types_allowed = True

class UserRolesModel(BaseModel):
    name: str = Field(...)
    created_at: Optional[datetime.datetime] = Field(default=datetime.datetime.utcnow())


def get_user_roles(conn: MongoClient):
    return conn[env_config.DB_NAME].get_collection("user_roles").find()
