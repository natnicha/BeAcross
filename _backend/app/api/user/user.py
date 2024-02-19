from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status, Request
from pymongo import MongoClient

import app.crud.email_domains as EMAIL_DOMAINS
import app.crud.users as USERS
import app.crud.universities as UNIVERSITIES
from app.db.mongodb import get_database
from app.api.auth.auth_utils import extract_domain_from_email, get_user_role, get_user_role_id, hash_text, is_aligned_by_defined_conditions
from app.api.user.model import UserProfileListResponseModel, UserProfileResponseModel, UserPutRequestModel, UserPutResponseModel

user = APIRouter()

@user.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
        user_id: str = None,
        db: MongoClient = Depends(get_database)):
    try:
        user_id_obj = ObjectId(user_id)
    except Exception as e:
        raise HTTPException(
            detail={"message": str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )
    check_exist_user_account(db, user_id_obj)
    delete_user_account(db, user_id_obj)
    return

def check_exist_user_account(db: MongoClient, user_id: ObjectId):
    row = USERS.get_user_by_id(db, user_id)
    if not row:
        raise HTTPException(
            detail={"message": "the user is not found"},
            status_code=status.HTTP_404_NOT_FOUND
        )

def delete_user_account(db: MongoClient, user_id: ObjectId):
    try:
        USERS.delete_one(db, user_id)
    except Exception as e:
        raise HTTPException(
            detail={"message": e},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@user.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
        request: Request,
        db: MongoClient = Depends(get_database)):
    try:
        user_id_obj = ObjectId(request.state.user_id)
    except Exception as e:
        raise HTTPException(
            detail={"message": str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )
    check_exist_user_account(db, user_id_obj)
    delete_user_account(db, user_id_obj)
    return

@user.put("/{user_id}", response_model=UserPutResponseModel, status_code=status.HTTP_200_OK)
async def update_user(
        user_id: str = None,
        item: UserPutRequestModel = None,
        db: MongoClient = Depends(get_database)):
    try:
        user_id_obj = ObjectId(user_id)
    except Exception as e:
        raise HTTPException(
            detail={"message": str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    is_new_password = check_password_contains_colon(item)
    if is_new_password:
        if not (len(item.password) >= 8 and len(item.password) <= 64) or not is_aligned_by_defined_conditions(item.password):
            raise HTTPException(
                detail={"message": str("password must contain 8-64 characters with at least 1 upper case letter[a-z], 1 lower case letter[A-Z], 1 numeric character [0-9], and 1 special character [!%&-.@^_]")},
                status_code=status.HTTP_400_BAD_REQUEST
            )
        item.password = hash_text(item.password)
        
    check_exist_user_account(db, user_id_obj)
    updated_user = update_user_account(db, user_id_obj, item)
    updated_user["id"] = str(updated_user.pop("_id"))
    updated_user["user_role"] = get_user_role(user_roles_id=updated_user.pop("user_roles_id"))
    return updated_user

def check_password_contains_colon(item: UserPutRequestModel):
    if item.password.__contains__(":"):
        return False
    return True

def update_user_account(db: MongoClient, user_id: ObjectId, item: UserPutRequestModel):
    try:
        item.password = str.encode(item.password)
        return USERS.update_one(db, user_id, item.__dict__)
    except Exception as e:
        raise HTTPException(
            detail={"message": e},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@user.put("/", response_model=UserPutResponseModel, status_code=status.HTTP_200_OK)
async def update_user(
        request: Request,
        item: UserPutRequestModel = None,
        db: MongoClient = Depends(get_database)):
    try:
        user_id_obj = ObjectId(request.state.user_id)
    except Exception as e:
        raise HTTPException(
            detail={"message": str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    is_new_password = check_password_contains_colon(item)
    if is_new_password:
        if not (len(item.password) >= 8 and len(item.password) <= 64) or not is_aligned_by_defined_conditions(item.password):
            raise HTTPException(
                detail={"message": str("password must contain 8-64 characters with at least 1 upper case letter[a-z], 1 lower case letter[A-Z], 1 numeric character [0-9], and 1 special character [!%&-.@^_]")},
                status_code=status.HTTP_400_BAD_REQUEST
            )
        item.password = hash_text(item.password)
        
    check_exist_user_account(db, user_id_obj)
    updated_user = update_user_account(db, user_id_obj, item)
    updated_user["id"] = str(updated_user.pop("_id"))
    updated_user["user_role"] = get_user_role(user_roles_id=updated_user.pop("user_roles_id"))
    return updated_user


@user.get("/profile", response_model= UserProfileResponseModel, status_code=status.HTTP_200_OK)
async def get_user_profile(
        request: Request,
        db: MongoClient = Depends(get_database)):
    user_id=ObjectId(request.state.user_id)
    user = USERS.get_user_by_id(db, user_id)
    return get_user_data(db, user)

def get_universities(db: MongoClient, email: str):
    request_domain = extract_domain_from_email(email)
    email_domains = EMAIL_DOMAINS.get_email_domain(db, request_domain)
    return list(email_domains)

def get_user_data(db: MongoClient, user: USERS.UsersModel) -> UserProfileResponseModel:
    university_id = get_universities(db, user["email"])[0]["university_id"]
    return UserProfileResponseModel(
        email=user["email"],
        password=user["password"],
        first_name=user["first_name"],
        last_name=user["last_name"],
        university=UNIVERSITIES.find_one(db, university_id)["name"],
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
