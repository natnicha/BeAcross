from bson import ObjectId
from fastapi import APIRouter, Depends, Query, status, Request
from pymongo import MongoClient

import app.crud.users as USERS
from app.db.mongodb import get_database
from app.api.auth.auth_utils import get_user_role, get_user_role_id
from app.api.user.model import UserProfileListResponseModel, UserProfileResponseModel

user = APIRouter()

@user.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user():
    return

@user.get("/profile", response_model= UserProfileResponseModel, status_code=status.HTTP_200_OK)
async def get_user_profile(
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

@user.get("/profile/list", response_model=UserProfileListResponseModel, status_code=status.HTTP_200_OK)
async def get_user_profile_list(
        user_role: str = Query('student', pattern='^student$|^uni-admin$|^sys-admin$'),
        limit: int = Query(20, gt=0),
        offset: int = Query(0, gt=0),
        sortby: str = Query('first_name', pattern='^first_name$|^user_role$'),
        orderby: str = Query('asc', pattern='^asc$|^desc$'),
        db: MongoClient = Depends(get_database)):
    if sortby == "user_role":
        sortby = "user_roles_id"
    users = USERS.get_users(db, get_user_role_id(user_role), limit, offset, sortby, orderby)
    for user in users:
        user["id"] = str(user.pop("_id"))
        user["user_role"] = get_user_role(ObjectId(user.pop("user_roles_id")))
    return UserProfileListResponseModel(
        total_results=USERS.count(db, get_user_role_id(user_role)),
        total_items=len(users),
        items=users,
    )
