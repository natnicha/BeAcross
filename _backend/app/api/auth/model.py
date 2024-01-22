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

class RegisterResponseModel(BaseModel):
    message: str
    data: UsersModel


class LoginRequestModel(BaseModel):
    email: str
    password: str

class LoginResponseDataModel(BaseModel):
    jwt: str = None
    user: UsersModel = None

class LoginResponseModel(BaseModel):
    data: LoginResponseDataModel
