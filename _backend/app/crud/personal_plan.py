from bson import ObjectId
from pymongo import MongoClient
from app.config.config_utils import env_config

def get_personal_plan_by_user_id_and_module_id(conn: MongoClient, user_id: ObjectId, module_id: ObjectId):
    return conn[env_config.DB_NAME].get_collection("semester").aggregate([
    {
        "$lookup":{
                "from": "personal_plan",
                "localField": "_id",
                "foreignField": "semester_id",
                "pipeline": [{ 
                    "$match":{"$and": [{"user_id":user_id}, {"module_id":module_id}]}
                    }
                ],
                "as": "joined"
            }
    }])
