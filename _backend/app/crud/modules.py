import datetime
import decimal
from typing import Optional
from mongomock import MongoClient
from pydantic import BaseModel, Field
from app.config.config_utils import env_config

class BaseModel(BaseModel):
    class Config:
        arbitrary_types_allowed = True

class UserLogsModel(BaseModel):
    name: str = Field(...)
    program: str = Field(...)
    degree_level: str = Field(...)
    university: str = Field(...)
    ect_credits: decimal = Field(...)
    semester: decimal = Field(...)
    content: str = Field(...)
    created_at: Optional[datetime.datetime] = Field(default=datetime.datetime.utcnow())
    updated_at: Optional[datetime.datetime] = Field(default=datetime.datetime.utcnow())

def find(conn: MongoClient, term: str, limit: int, offset: int, sortby: str, orderby: str):
    is_asc = 1
    if orderby.lower() == 'desc':
        is_asc = -1

    return conn[env_config.DB_NAME].get_collection("modules").find({
        "name": term
    }).sort({
        sortby : int(is_asc)
    }).skip(offset).limit(limit)
