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

    # extract domain from a request
    request_domain = extract_domain_from_email(item.email)
    # get across university domains
    email_domains_collection = db.get_database("admin").get_collection("email_domains").find({"domain" : request_domain})
    
    # check whether or not a given email is one of Across uni
    # if no - not match with any uni, return error
    if len(list(email_domains_collection)) == 0:
        return {"message": "The email's domain isn't under Across, please input another email which is under Across"}

    # check existing
    users_collection = db.get_database("admin").get_collection("users").find({"email" : item.email})
    # if yes - exists, return error
    if len(list(users_collection)) > 0:
        return {"message": "The email is already taken, please check again"}

    # extract first_name & last_name 
    full_name = extractFullNameFromEmail(item.email, '.')
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

def extract_domain_from_email(email):
    return email.split("@",1)[1]

def extractFullNameFromEmail(email, delimiter):
    full_name = email.split("@",1)[0]
    return full_name.split(delimiter,1)
