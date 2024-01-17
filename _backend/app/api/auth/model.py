from pydantic import BaseModel

from app.crud.users import UsersModel

class RegisterRequestModel(BaseModel):
    email: str

class RegisterResponseModel(BaseModel):
    data: UsersModel