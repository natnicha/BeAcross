from bson import ObjectId
from fastapi import HTTPException, Request, status
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
from app.db.settings import settings

def validate_email(email):
    pattern = '''^[\w\.-]+@[\w\.-]+\.\w+$'''
    if re.match(pattern, email):
        return True
    else:
        return False

def extract_domain_from_email(email) -> str:
    domain = str(email.split("@",1)[1])
    # end with main domain ex. @tu-chemnitz.de
    if domain.find(".") == 1:
        return domain
    # have sub domain ex. @ss.tu-chemnitz.de, @ss.yy.tu-chemnitz.de or,  @ss.yy.zz.tu-chemnitz.de 
    else:
        position = find_second_last(domain, ".")
        return domain[position+1:]

def find_second_last(text, pattern):
    return text.rfind(pattern, 0, text.rfind(pattern))

def extractFullNameFromEmail(email, delimiter):
    full_name = email.split("@",1)[0]
    return full_name.split(delimiter,1)

def generate_password():
    special_character = r"""!%&-.@^_"""
    password_length = 8
    alphabet = string.ascii_letters + string.digits + special_character
    while True:
        password = ''.join(secrets.choice(alphabet) for i in range(password_length))
        if is_aligned_by_defined_conditions(password):
            break
    return password

# password must contain at least 1 upper case letter[a-z], 1 lower case letter[A-Z], 1 numeric character [0-9], and 1 special character [!%&-.@^_]
def is_aligned_by_defined_conditions(password: str):
    special_character = r"""[!%&-.@^_]"""
    matches = re.search(special_character, password)
    if matches is None:
        return False
    if (sum(c.islower() for c in password) >=1
        and sum(c.isupper() for c in password) >=1
        and sum(c.isdigit() for c in password) >=1):
        return True
    return False

# Basic hashing function for a text using random unique salt.
def hash_text(text):
    salt = uuid.uuid4().hex
    return hashlib.sha256(salt.encode() + text.encode()).hexdigest() + ':' + salt
    
# Check for the text in the hashed text
def match_hashed_text(hashedText, providedText):
    _hashedText, salt = hashedText.split(':')
    return _hashedText == hashlib.sha256(salt.encode() + providedText.encode()).hexdigest()

def authenicate(db: MongoClient, login_request_model: LoginRequestModel):
    users = list(USERS.get_user(db, login_request_model.email))
    if len(users) == 0:
        raise HTTPException(
            detail={"message": "Incorrect email or password"},
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    
    password = bytes.decode(users[0]["password"], 'utf-8')
    isMatch = match_hashed_text(password, login_request_model.password)
    if not isMatch:
        raise HTTPException(
            detail={"message": "Incorrect email or password"},
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    return users[0]

def generate_jwt(user_id: str, user_roles_id: str, university: str):
    now = datetime.datetime.utcnow()
    exp = now + datetime.timedelta(minutes=int(env_config.JWT_DURATION_MINUTE))
    return jwt.encode({
            "user_id":  str(user_id),
            "role": user_roles_id,
            "university": university,
            "iat": now,
            "exp": exp
        }, 
        env_config.JWT_SECRET, 
        algorithm='HS256'
    )

def get_user_role(user_roles_id: ObjectId):
    for role, id in settings.user_roles.items():
        if user_roles_id == id:
            return role
    return ''

def get_user_role_id(user_role: str) -> ObjectId:
    for role, id in settings.user_roles.items():
        if user_role == role:
            return ObjectId(id)
    return None

def validate_jwt_token(token: str):
    try:
        jwt.decode(token, env_config.JWT_SECRET, algorithms="HS256")
    except Exception as e:
        raise e

def get_payload_from_auth(token: str):
    try:
        return jwt.decode(token, env_config.JWT_SECRET, algorithms="HS256")
    except:
        return ""
    
def is_valid_jwt_token(request: Request):
    auth = request.headers.get('Authorization')
    splited_auth = (auth or ' ').split("Bearer ")
    if len(splited_auth)!=2:
        return False
    
    try:
        validate_jwt_token(splited_auth[1])
    except:
        return False
    
    return True

def set_user_info_from_jwt(request: Request):
    auth = request.headers.get('Authorization')
    if auth == None or auth == "":
        return
    splited_auth = (auth or ' ').split("Bearer ")
    if len(splited_auth)!=2:
        return
    try:
        validate_jwt_token(splited_auth[1])
        encoded = get_payload_from_auth(splited_auth[1])
        request.state.role = encoded["role"]
        request.state.user_id = encoded["user_id"]
        request.state.university = encoded["university"]
        return
    except:
        return
    
    
def has_permission(request: Request):
    api = request.url.path
    method = request.method
    if api.__contains__("/recommend"):
        if request.state.role != "student":
            return False
    if api.__contains__("/module/comment"):
        if request.state.role != "student":
            return False
    if api.__contains__("/api/v1/module") and method in ['POST', 'PUT', 'DELETE']:
        if not (request.state.role == "uni-admin" or request.state.role == "sys-admin"):
            return False
    if api.__contains__("/user/profile/list"):
        if not (request.state.role == "uni-admin" or request.state.role == "sys-admin"):
            return False
    if api.__contains__("/user/") and (not api.endswith("/user/")) and method == "DELETE": #/api/v1/user/{user-id}
        if not (request.state.role == "uni-admin" or request.state.role == "sys-admin"):
            return False
    if api.endswith("/user/") and method == "DELETE": #/api/v1/user/
        return True
    if api.__contains__("/user/") and (not api.endswith("/user/")) and method == "PUT": #/api/v1/user/{user-id}
        if not (request.state.role == "uni-admin" or request.state.role == "sys-admin"):
            return False
    if api.endswith("/user/") and method == "PUT": #/api/v1/user/
        return True
    if api.__contains__("/personal-plan"):
        if not (request.state.role == "student"):
            return False
    return True
