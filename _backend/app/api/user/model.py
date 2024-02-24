import datetime
from typing import Optional
from pydantic import BaseModel

class UserProfileResponseModel(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: Optional[str]
    university: str
    registration_number: Optional[str]
    course_of_study: Optional[str]
    semester: Optional[int]
    user_role: str
    created_at: datetime.datetime
    updated_at: datetime.datetime

class UserProfileListResponseModel(BaseModel):
    total_results: int
    total_items: int
    items: list

class UserPutRequestModel(BaseModel):
    email: Optional[str]
    password: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]
    registration_number: Optional[str]
    course_of_study: Optional[str]
    semester: Optional[int]

class UserPutResponseModel(BaseModel):
    id: Optional[str]
    email: Optional[str] = None
    password: Optional[bytes] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    registration_number: Optional[str] = None
    course_of_study: Optional[str] = None
    semester: Optional[int] = None
    user_role: Optional[str] = None
    created_at: Optional[datetime.datetime] = None
    updated_at: Optional[datetime.datetime] = None
