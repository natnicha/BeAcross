from bson import ObjectId
from pymongo import MongoClient
from app.config.config_utils import env_config

def find_all(conn: MongoClient, limit: int = 20, offset: int = 0, sortby: str = "_id", orderby: str = "asc"):
    is_asc = 1
    if orderby.lower() == 'desc':
        is_asc = -1
    return conn[env_config.DB_NAME].get_collection("semesters").find().limit(limit).skip(offset).sort({sortby: is_asc})

def count_by_id(conn: MongoClient, id: ObjectId):
    return conn[env_config.DB_NAME].get_collection("semesters").count_documents({"_id": id})
