from fastapi import APIRouter, Depends
from pymongo import MongoClient
import re

from db.mongodb import get_database
from api.auth.model import RegisterRequestModel

auth = APIRouter()

@auth.post("/register")
async def register(
        item: RegisterRequestModel = None,
        db: MongoClient = Depends(get_database)
    ):

    # check email format
    isCorrectEmailFormat = validate_email(item.email)
    # if not conform email format, return error
    if not isCorrectEmailFormat:
        return {"message": "The email doesn't conform by email format, please input in format of example@university.de"}

    # get across university domains
    # check whether or not a given email is one of Across uni
    # if no - not match with any uni, return error
    
    # check existing
    # if yes - exists, return error
    # extract first_name & last_name 
    # generate password
    # send email
    # encrypt password using salted hashing
    # if sent success, insert into db & return 200 - OK 
    return {"message": item}


def validate_email(email):
    pattern = '''^[\w\.-]+@[\w\.-]+\.\w+$'''
    if re.match(pattern, email):
        return True
    else:
        return False
