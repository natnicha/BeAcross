import pymongo
import logging

from app.config.config_utils import env_config
from .mongodb import db


#CRUD read
from bson import ObjectId
from ..api.module.model import ModuleModel  
from .mongodb import get_database


async def connect_to_mongo():
    try:
        db.client = pymongo.MongoClient(env_config.DB_CONNECTION_STRING)
    except:
        logging.error("connect database failed")
    
async def close_mongo_connection():
    try:
        db.client.close()
    except:
        logging.error("disconnect database failed")

async def check_mongo_connection():
    try:
        result = db.client.admin.command({'ping': 1})
        logging.error(result)
    except Exception as e:
        logging.error(e)









#CRUD read
async def get_module_by_id(module_id: str) -> ModuleModel:
    db = await get_database()
    collection = db["admin"]["modules"]
    module = await collection.find_one({"_id": ObjectId(module_id)})
    return module