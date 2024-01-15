from typing import Optional
from bson import ObjectId
from pydantic import BaseModel, Field

class BaseModel(BaseModel):
    class Config:
        arbitrary_types_allowed = True

class UsersModel(BaseModel):
    id: Optional[ObjectId] = Field(..., alias="_id")
    email: str = Field(...)
    password: bytes = Field(...)
    first_name: str = Field(...)
    last_name: str = Field(...)
    registration_number: int = Field(...)
    course_of_study: str = Field(...)
    semester: int = Field(default=1)
