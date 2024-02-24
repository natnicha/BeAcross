from bson import ObjectId
from pymongo import MongoClient

from app.config.config_utils import env_config

def find_one(conn: MongoClient, id: ObjectId):
    return conn[env_config.DB_NAME].get_collection("universities").find_one({"_id": id})
