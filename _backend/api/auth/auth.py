from fastapi import APIRouter, Depends, status, HTTPException
from pymongo import MongoClient

from db.mongodb import get_database
from crud.users import UsersModel
import crud.email_domains as EMAIL_DOMAINS
import crud.users as USERS
from .auth_utils import *
from .model import RegisterRequestModel

auth = APIRouter()

@auth.post("/register", response_model=UsersModel, status_code=status.HTTP_201_CREATED)
async def register(
        item: RegisterRequestModel = None,
        db: MongoClient = Depends(get_database),
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
    password = generatePassword()
    print("Only temporary show password, will be deleted when email server is ready.")
    print("Generated password is:"+password)

    # encrypt password using salted hashing
    encrypted_password = hashText(password)
    
    # TODO: send email
    
    # if sent success, insert into db & return 200 - OK 
    return prepare_and_insert_user(db, full_name, item.email, encrypted_password)


def check_email_format(email):
    isCorrectEmailFormat = validate_email(email)
    # if not conform email format, return error
    if not isCorrectEmailFormat:
        raise HTTPException(
                detail={"message": "The email doesn't conform by email format, please input in format of example@university.de"},
                status_code=status.HTTP_400_BAD_REQUEST
            )

def check_across_partner(db: MongoClient, email: string):
    # extract domain from a request
    request_domain = extract_domain_from_email(email)
    # get across university domains
    email_domains = EMAIL_DOMAINS.get_email_domain(db, request_domain)
    
    # if no - not match with any uni, return error
    if len(list(email_domains)) == 0:
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

def prepare_and_insert_user(db: MongoClient, full_name: list, email: string, password: string):
    last_name = ''
    if len(full_name)>0:
        last_name = full_name[1]

    new_user = UsersModel(
        email = email,
        password = password,
        first_name = full_name[0],
        last_name = last_name,
    )

    try:
        db.get_database("admin").get_collection("users").insert_one(new_user.dict())
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return new_user
