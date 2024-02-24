from bson import ObjectId
from pymongo import MongoClient
from app.config.config_utils import env_config

def find_all(conn: MongoClient):
    return conn[env_config.DB_NAME].get_collection("semester").find().sort({"_id": 1})
