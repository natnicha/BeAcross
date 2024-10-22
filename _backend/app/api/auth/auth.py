import logging
from bson import ObjectId
from fastapi import APIRouter, Depends, status, HTTPException, Request
from pymongo import MongoClient

from app.db.mongodb import get_database
from app.db.settings import Settings, get_settings
from app.crud.users import UsersModel
import app.crud.email_domains as EMAIL_DOMAINS
import app.crud.users as USERS
import app.crud.user_logs as USER_LOGS
import app.crud.universities as UNIVERSITIES
from app.email_service.email_sender import *


from .auth_utils import *
from .model import LoginRequestModel, LoginResponseDataModel, LoginResponseModel, LoginUserDataResponseModel, RegisterDataResponse, RegisterRequestModel, RegisterResponseModel, PasswordResetRequestModel

auth = APIRouter()

@auth.post("/register", response_model=RegisterResponseModel, status_code=status.HTTP_201_CREATED)
async def register(
        item: RegisterRequestModel = None,
        db: MongoClient = Depends(get_database),
        settings: Settings = Depends(get_settings),
    ):

    # check email format
    check_email_format(item.email)

    # check whether or not a given email is one of Across uni
    check_across_partner(db, item.email)

    # check existing
    check_user_existing(db, item.email)

    # extract first_name & last_name 
    full_name = extractFullNameFromEmail(item.email, '.')
    
    # generate password
    password = generate_password()
    logging.info("Only temporary show password, will be deleted when email server is ready.")
    logging.info(f"Generated password {password}")

    # encrypt password using salted hashing
    encrypted_password = hash_text(password)
    
    # send email
    try:
        await send_registration_email(user_email=item.email, password=password, user_name=full_name[0])
    except Exception as e:
        raise HTTPException(
            detail={"message": str(e)},
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    # if sent success, insert into db & return 200 - OK 
    new_user = prepare_and_insert_user(db, full_name, item.email, encrypted_password, settings.user_roles["student"])
    return RegisterResponseModel(
        message = "Successful registered",
        data = new_user
    )


def check_email_format(email):
    isCorrectEmailFormat = validate_email(email)
    # if not conform email format, return error
    if not isCorrectEmailFormat:
        raise HTTPException(
                detail={"message": "The email doesn't conform by email format, please input in format of example@university.de"},
                status_code=status.HTTP_400_BAD_REQUEST
            )

def get_universities(db: MongoClient, email: string):
    request_domain = extract_domain_from_email(email)
    email_domains = EMAIL_DOMAINS.get_email_domain(db, request_domain)
    return list(email_domains)

def check_across_partner(db: MongoClient, email: string):
    email_domains = get_universities(db, email)
    # if no - not match with any uni, return error
    if len(email_domains) == 0:
        raise HTTPException( 
            detail={"message": "The email's domain isn't under Across, please input another email which is under Across"},
            status_code=status.HTTP_400_BAD_REQUEST
        )

def check_user_existing(db: MongoClient, email: string):
    users = USERS.get_user(db, email)
    # if yes - exists, return error
    if len(list(users)) > 0:
        raise HTTPException( 
            detail={"message": "The email is already taken, please check again"},
            status_code=status.HTTP_400_BAD_REQUEST
        )

def prepare_and_insert_user(db: MongoClient, full_name: list, email: str, password: str, user_roles_id: ObjectId):
    last_name = ''
    if len(full_name)>1:
        last_name = full_name[1]

    new_user = UsersModel(
        email = email,
        password = password,
        first_name = full_name[0],
        last_name = last_name,
        user_roles_id=user_roles_id
    )

    try:
        inserted_user = USERS.insert_one(db, new_user)
    except Exception as e:
        raise HTTPException(
            detail={"message": e},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    return RegisterDataResponse (
        id = str(inserted_user.inserted_id),
        email = email,
        password = password,
        first_name = full_name[0],
        last_name = last_name,
        user_roles_id = str(user_roles_id),
        created_at = new_user.created_at,
        updated_at = new_user.updated_at,
    )


@auth.post("/login", response_model=LoginResponseModel, status_code=status.HTTP_200_OK)
async def login(
        request: Request,
        item: LoginRequestModel = None,
        db: MongoClient = Depends(get_database),
    ):
    user = authenicate(db, item)
    insert_user_logs(db, user["_id"], 
                     host=request.headers.get('host'), 
                     user_agent=request.headers.get('user-agent'))
    user_data_response = get_user_data(db, user)
    jwt = generate_jwt(user["_id"], get_user_role(user_roles_id=user["user_roles_id"]),user_data_response.university)
    LoginResponseData = LoginResponseDataModel(
        jwt=jwt,
        user=user_data_response
    )
    return LoginResponseModel(data=LoginResponseData)

def insert_user_logs(db: MongoClient, user_id: string, host: str, user_agent: str):
    user_log = USER_LOGS.UserLogsModel(
        user_id=user_id,
        type="login",
        host=host,
        user_agent=user_agent,
    )

    try:
        user_log = USER_LOGS.insert_one(db, user_log)
    except Exception as e:
        raise HTTPException(
            detail={"message": e},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    return 

def get_user_data(db: MongoClient, user: UsersModel) -> LoginUserDataResponseModel:
    role = get_user_role(user_roles_id=user["user_roles_id"])
    university = None
    if role == 'uni-admin':
        university_id = get_universities(db, user["email"])[0]["university_id"]
        university = UNIVERSITIES.find_one(db, university_id)["name"]
    return LoginUserDataResponseModel(
        id = str(user["_id"]),
        email = user["email"],
        password = user["password"],
        first_name = user["first_name"],
        last_name = user["last_name"],
        university = university,
        registration_number = user["registration_number"],
        course_of_study = user["course_of_study"],
        semester = user["semester"],
        user_role = role,
        created_at = user["created_at"],
        updated_at = user["updated_at"],
    )

@auth.post("/forgot-password")
async def forgot_password(emailaddr: PasswordResetRequestModel, db: MongoClient = Depends(get_database)):
    # Verify the user exists
    user_cursor = USERS.get_user(db, emailaddr.email)
    user_detail = next(user_cursor, None) 
    if not user_detail:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    new_password = generate_password()  
    encrypted_password = hash_text(new_password)
    encrypted_password = str.encode(encrypted_password)

    try:
        update_result = USERS.update_one(db, user_detail["_id"], {"password": encrypted_password})
        if update_result:
            # if the new password is updated, Send a confirmation email
            await send_newpass_email(user_email=emailaddr.email, password=new_password, user_name=user_detail["first_name"])
    except Exception as e:
        logging.error(f"Failed to update password or send confirmation: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update password.")

    return {"message": "If your account with that email was found, we've sent you an email with the new password."}
