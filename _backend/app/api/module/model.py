from pydantic import BaseModel

from app.crud.module_comment import ModuleCommentModel

class RecommendRequestModel(BaseModel):
    module_id: str

class CountRecommendResponseModel(BaseModel):
    data: dict

class ModuleCommentRequestModel(BaseModel):
    module_id: str
    message: str

class ModuleCommentResponseModel(BaseModel):
    message: str
    data: ModuleCommentModel
