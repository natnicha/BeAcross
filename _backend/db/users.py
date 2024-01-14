from typing import Optional
from bson import ObjectId
from pydantic import BaseModel, EmailStr, Field

class UsersModel(BaseModel):
    id: Optional[ObjectId] = Field(..., alias="_id")
    email: EmailStr = Field(...)
    password: bytes = Field(...)
    first_name: str = Field(...)
    last_name: str = Field(...)
    registration_number: str = Field(...)
    course_of_study: str = Field(...)
    semester: str = Field(...)
