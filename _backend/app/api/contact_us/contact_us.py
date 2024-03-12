from fastapi import APIRouter, Depends, HTTPException, status
from pymongo import MongoClient

from app.db.mongodb import get_database
from app.api.auth.auth_utils import validate_email
from app.api.contact_us.module import ContactUsRequest

contact_us = APIRouter()
@contact_us.post("/", status_code=status.HTTP_200_OK)
async def post_contact_us(
        items: ContactUsRequest,
        db: MongoClient = Depends(get_database)
    ):
    is_valid_email = validate_email(items.email)
    if not is_valid_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email is invalid format")
    
    pass