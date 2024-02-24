from bson import ObjectId
from pymongo import MongoClient
from app.config.config_utils import env_config

def get_by_user_id_and_module_id(conn: MongoClient, user_id: ObjectId, module_id: ObjectId = None):
    condition = {"user_id":user_id}
    if module_id is not None:
        condition["module_id"] = module_id
    return conn[env_config.DB_NAME].get_collection("personal_plan").find(condition).sort({"module_id": 1, "semester_id": 1})
