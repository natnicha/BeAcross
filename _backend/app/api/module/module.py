from fastapi import APIRouter, Depends, status
from mongomock import MongoClient

import app.crud.module_recommend as MODULE_RECOMMEND
from app.crud.module_recommend import ModuleRecommendModel
from app.db.mongodb import get_database
from app.api.module.model import RecommendRequestModel


module = APIRouter()

@module.post("/recommend", status_code=status.HTTP_200_OK)
async def register(
        item: RecommendRequestModel = None,
        db: MongoClient = Depends(get_database),
    ):
    module_recommend = ModuleRecommendModel(
        module_id=item.module_id
    )
    MODULE_RECOMMEND.insert_one(db, module_recommend)
    return 