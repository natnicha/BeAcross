from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Request, status
from mongomock import MongoClient

import app.crud.module_recommend as MODULE_RECOMMEND
from app.crud.module_recommend import ModuleRecommendModel
from app.db.mongodb import get_database
from app.api.module.model import RecommendRequestModel


module = APIRouter()

@module.post("/recommend", status_code=status.HTTP_201_CREATED)
async def recommend(
        request: Request,
        item: RecommendRequestModel = None,
        db: MongoClient = Depends(get_database),
    ):
    if item == None:
        raise HTTPException(
            detail={"message": "no request body provided"},
            status_code=status.HTTP_400_BAD_REQUEST
        )

    module_recommend = ModuleRecommendModel(
        module_id=ObjectId(item.module_id),
        user_id=ObjectId(request.state.user_id)
    )

    rows = MODULE_RECOMMEND.get_module_recommend(db, module_recommend)
    if len(list(rows)) > 0:
        raise HTTPException(
            detail={"message": "this action is performed"},
            status_code=status.HTTP_409_CONFLICT
        )

    try:
        MODULE_RECOMMEND.insert_one(db, module_recommend)
    except Exception as e:
        raise HTTPException(
            detail={"message": e},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    return 