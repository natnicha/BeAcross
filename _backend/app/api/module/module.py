from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Request, status
from mongomock import MongoClient

import app.crud.module_recommend as MODULE_RECOMMEND
from app.crud.module_recommend import ModuleRecommendModel
from app.db.mongodb import get_database
from app.api.module.model import CountRecommendResponseModel, RecommendRequestModel


module = APIRouter()

@module.post("/recommend", status_code=status.HTTP_201_CREATED)
async def recommend(
        request: Request,
        item: RecommendRequestModel = None,
        db: MongoClient = Depends(get_database),
    ):
    try:
        module_recommend = ModuleRecommendModel(
            module_id=ObjectId(item.module_id),
            user_id=ObjectId(request.state.user_id)
        )
    except Exception as e:
        raise HTTPException(
            detail={"message": str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )

    check_conflict(db, module_recommend)
    insert_module_recommend(db, module_recommend)
    return 

def check_conflict(db: MongoClient, module_recommend: ModuleRecommendModel):
    rows = MODULE_RECOMMEND.get_module_recommend(db, module_recommend)
    if len(list(rows)) > 0:
        raise HTTPException(
            detail={"message": "this action is performed"},
            status_code=status.HTTP_409_CONFLICT
        )

def insert_module_recommend(db: MongoClient, module_recommend: ModuleRecommendModel):
    try:
        MODULE_RECOMMEND.insert_one(db, module_recommend)
    except Exception as e:
        raise HTTPException(
            detail={"message": e},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@module.get("/{module_id}/recommend", response_model=CountRecommendResponseModel)
async def no_of_recommend(
        module_id: str = None,
        db: MongoClient = Depends(get_database),
    ):
    module_id_obj = None
    try:
        module_id_obj = ObjectId(module_id)
    except Exception as e:
        raise HTTPException(
            detail={"message": str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )

    count = get_no_of_recommend_module(db, module_id_obj)
    return CountRecommendResponseModel(
        data={
            "module_id": module_id,
            "no_of_recommend": str(count)
        }
    )

def get_no_of_recommend_module(db: MongoClient, module_id: ObjectId):
    count = 0
    try:
        count = MODULE_RECOMMEND.count_module_recommend(db, module_id)
    except Exception as e:
        raise HTTPException(
            detail={"message": e},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    return count


@module.delete("/unrecommend", status_code=status.HTTP_200_OK)
async def recommend(
        request: Request,
        item: RecommendRequestModel = None,
        db: MongoClient = Depends(get_database),
    ):
    return 
