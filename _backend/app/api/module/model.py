import datetime
from bson import ObjectId
from pydantic import BaseModel
from typing import Optional

from app.crud.module_comment import ModuleCommentModel

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

class UploadModulesModel(BaseModel):
    name: str = None
    degree_program: str = None
    degree_level: str = None
    university: str = None
    module_code: str = None
    content: str = None   
    ects: int = None
    type: str = None

class UploadModulesResponseItemModel(BaseModel):
    module_id: str = None
    module_name: str = None
    degree_program: str = None
    degree_level: str = None
    university: str = None
    module_code: str = None
    content: str = None   
    ects: int = None
    type: str = None
    similar_modules: list = None
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
