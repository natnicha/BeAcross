from bson import ObjectId
from pydantic import BaseModel

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
    module_code: str = None
    university: str = None
    ects: int = None
    type: str = None
    content: str = None   
