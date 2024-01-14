import pymongo
from .mongodb import db
from config.config_utils import env_config

async def connect_to_mongo():
    db.client = pymongo.MongoClient(env_config.DB_CONNECTION_STRING)
    
async def close_mongo_connection():
    db.client.close()

def check_mongo_connection():
    try:
        result = db.client.admin.command({'ping': 1})
        print(result)
    except:
        print("error")
