import datetime
from bson import ObjectId
from pydantic import BaseModel

class BaseModel(BaseModel):
    class Config:
        arbitrary_types_allowed = True
        populate_by_name = True
        json_encoders = {ObjectId: str}

class SemesterResponseItem(BaseModel):
    id: str
    name: str
    created_at: datetime

class SemesterResponseData(BaseModel):
    total_items: int = 0
    items: list = []
