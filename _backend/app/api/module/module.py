from fastapi import APIRouter, Depends, status
from mongomock import MongoClient

from app.db.mongodb import get_database
from app.api.module.model import RecommendRequestModel


module = APIRouter()

@module.post("/recommend", status_code=status.HTTP_200_OK)
async def register(
        item: RecommendRequestModel = None,
        db: MongoClient = Depends(get_database),
    ):
    return 