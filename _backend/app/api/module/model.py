import datetime
from bson import ObjectId
from pydantic import BaseModel
from typing import Optional

from app.crud.module_comment import ModuleCommentModel

class BaseModel(BaseModel):
    class Config:
        arbitrary_types_allowed = True
        populate_by_name = True
        json_encoders = {ObjectId: str}

class RecommendRequestModel(BaseModel):
    module_id: str

class CountRecommendResponseModel(BaseModel):
    data: dict

class ModuleCommentRequestModel(BaseModel):
    module_id: str
    message: str

class ModuleCommentDataModel(ModuleCommentModel):
    id: ObjectId = None
    
class ModuleCommentResponseModel(BaseModel):
    message: str
    data: ModuleCommentDataModel

class GetModuleCommentItemResponseModel(BaseModel):
    id: str
    message: str
    user: str
    created_at: datetime.datetime
    updated_at: datetime.datetime

class GetModuleCommentResponseModel(BaseModel):
    module_id: str
    total_items: int
    items: list = None

class ModuleResponseModel(BaseModel):
    id: str
    name: str
    content: str
    program: Optional[str] = None
    university: str
    degree_program: str
    module_code: str
    ects: int
    degree_level: str
    url: Optional[str] = None
    type: Optional[str] = None
