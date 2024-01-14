import motor.motor_asyncio
from .mongodb import db

DATABASE_URL = 'put mongo db connection string here'

async def connect_to_mongo():
    db.client = motor.motor_asyncio.AsyncIOMotorClient(DATABASE_URL)
 
async def close_mongo_connection():
    db.client.close()

def check_mongo_connection():
    try:
        result = db.client.admin.command({'ping': 1})
        print(result)
    except:
        print("error")
