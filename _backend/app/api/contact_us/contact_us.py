from fastapi import APIRouter, Depends, Request, status
from pymongo import MongoClient

from app.db.mongodb import get_database

contact_us = APIRouter()
@contact_us.post("/", status_code=status.HTTP_200_OK)
async def post_contact_us(
        db: MongoClient = Depends(get_database)
    ):
    pass