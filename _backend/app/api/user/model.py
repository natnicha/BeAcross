import datetime
from typing import Optional
from pydantic import BaseModel

class UserProfileResponseModel(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: Optional[str]
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
