import datetime
from typing import Optional
from bson import ObjectId
from pydantic import BaseModel

from app.crud.users import UsersModel


class BaseModel(BaseModel):
    class Config:
        arbitrary_types_allowed = True
        populate_by_name = True
        json_encoders = {ObjectId: str}
        
        
class RegisterRequestModel(BaseModel):
    email: str

class RegisterDataResponse(BaseModel):
    id: str
    email: str
    password: bytes
    first_name: str
    last_name: str
    registration_number: int = None
    course_of_study: int = None
    semester: int = None
    user_roles_id: str
    created_at: datetime.datetime
    updated_at: datetime.datetime

class RegisterResponseModel(BaseModel):
    message: str
    data: RegisterDataResponse

class LoginRequestModel(BaseModel):
    email: str
    password: str


class LoginUserDataResponseModel(BaseModel):
    id: str
    email: str
    password: bytes
    first_name: str
    last_name: Optional[str] = None
    university: str = None
    registration_number: Optional[str] = None
    course_of_study: Optional[str] = None
    semester: Optional[int] = None
    user_role: str = None
    created_at: datetime.datetime
    updated_at: datetime.datetime


class LoginResponseDataModel(BaseModel):
    jwt: str = None
    user: LoginUserDataResponseModel = None

class LoginResponseModel(BaseModel):
    data: LoginResponseDataModel
