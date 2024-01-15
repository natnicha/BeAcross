from typing import Optional
from pydantic import BaseModel, Field

class BaseModel(BaseModel):
    class Config:
        arbitrary_types_allowed = True

class UsersModel(BaseModel):
    email: str = Field(...)
    password: bytes = Field(...)
    first_name: str = Field(...)
    last_name: str = Field(...)
    registration_number: Optional[int] = Field(default=None)
    course_of_study: Optional[str] = Field(default=None)
    semester: Optional[int] = Field(default=1)
