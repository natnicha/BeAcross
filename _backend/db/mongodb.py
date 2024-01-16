from pymongo import MongoClient

class Database:
    client: MongoClient = None

db = Database()

async def get_database() -> MongoClient:
    return db.client
