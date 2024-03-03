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

class ModuleCommentDataModel(BaseModel):
    id: str = None
    module_id: str
    message: str
    user_id: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
    
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

class ModuleUpdateModel(BaseModel):
    name: Optional[str] = None
    content: Optional[str] = None
    program: Optional[str] = None
    university: Optional[str] = None
    degree_program: Optional[str] = None
    module_code: Optional[str] = None
    ects: Optional[int] = None
    degree_level: Optional[str] = None
    url: Optional[str] = None
    type: Optional[str] = None

class ModuleSuggestedResponseModel(BaseModel):
    requested_module_id: str
    total_suggested_module_items: int
    suggested_module_items: list = []
