from fastapi import HTTPException, status
import datetime
import re
import secrets
import string
import uuid
import hashlib
import jwt
from mongomock import MongoClient

from app.api.auth.model import LoginRequestModel
from app.config.config_utils import env_config
import app.crud.users as USERS

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

def generatePassword():
    special_character = r"""!#$%&'()*+,-./:;<=>?@[\]^_`{|}~"""
    password_length = 8
    alphabet = string.ascii_letters + string.digits + special_character
    while True:
        password = ''.join(secrets.choice(alphabet) for i in range(password_length))
        if (sum(c.islower() for c in password) >=1
                and sum(c.isupper() for c in password) >=1
                and sum(c.isdigit() for c in password) >=1):
            break
    return password

# Basic hashing function for a text using random unique salt.
def hashText(text):
    salt = uuid.uuid4().hex
    return hashlib.sha256(salt.encode() + text.encode()).hexdigest() + ':' + salt
    
# Check for the text in the hashed text
def matchHashedText(hashedText, providedText):
    _hashedText, salt = hashedText.split(':')
    return _hashedText == hashlib.sha256(salt.encode() + providedText.encode()).hexdigest()

def authenicate(db: MongoClient, login_request_model: LoginRequestModel):
    users = USERS.get_user(db, login_request_model.email)
    password = bytes.decode(users[0]["password"], 'utf-8')
    isMatch = matchHashedText(password, login_request_model.password)
    if not isMatch:
        raise HTTPException(
            detail={"message": "Incorrect email or password"},
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    return users[0]

def generateJwt(user_id: string):
    now = datetime.datetime.utcnow()
    exp = now + datetime.timedelta(minutes=int(env_config.JWT_DURATION_MINUTE))
    return jwt.encode({
            "id":  str(user_id),
            "iat": now,
            "exp": exp
        }, 
        'secret', 
        algorithm='HS256'
    )
