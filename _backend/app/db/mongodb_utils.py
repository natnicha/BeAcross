import pymongo
import logging

from app.config.config_utils import env_config

from .mongodb import db

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

def check_mongo_connection():
    try:
        result = db.client.admin.command({'ping': 1})
        print(result)
    except:
        print("error")
