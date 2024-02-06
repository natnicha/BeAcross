from bson import ObjectId
from fastapi import APIRouter, Depends, status, Request
from pymongo import MongoClient

import app.crud.users as USERS
from app.db.mongodb import get_database
from app.api.auth.auth_utils import get_user_role
from app.api.user.model import UserProfileResponseModel

user = APIRouter()

@user.get("/profile", response_model= UserProfileResponseModel, status_code=status.HTTP_200_OK)
async def get_profile(
        request: Request,
        db: MongoClient = Depends(get_database)):
    user_id=ObjectId(request.state.user_id)
    user = USERS.get_user_by_id(db, user_id)
    return get_user_data(user)


def get_user_data(user: USERS.UsersModel) -> UserProfileResponseModel:
    return UserProfileResponseModel(
        email=user["email"],
        password=user["password"],
        first_name=user["first_name"],
        last_name=user["last_name"],
        registration_number=user["registration_number"],
        course_of_study=user["course_of_study"],
        semester=user["semester"],
        user_role=get_user_role(user_roles_id=user["user_roles_id"]),
        created_at=user["created_at"],
        updated_at=user["updated_at"],
    )

@user.get("/profile/list", status_code=status.HTTP_200_OK)
async def get_profile(
        request: Request,
        db: MongoClient = Depends(get_database)):
    return 
