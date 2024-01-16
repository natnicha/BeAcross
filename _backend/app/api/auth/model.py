from pydantic import BaseModel

from app.crud.users import UsersModel

class RegisterRequestModel(BaseModel):
    email: str

class RegisterResponseModel(BaseModel):
    data: UsersModel


class LoginRequestModel(BaseModel):
    email: str
    password: str

class LoginResponseModel(BaseModel):
    data: dict
