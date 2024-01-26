from bson import ObjectId
from pydantic import BaseModel, Field


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






# Required Model for READ operation of CRUD
class ModuleModel(BaseModel):
    id: ObjectId = Field(alias="_id")
    name: str
    content: str
    url: str
    university: str
    degree_program: str
    module_code: str
    ects: int
    year: str
    degree_level: str

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str  # Ensuring ObjectId is converted to string
        }
        schema_extra = {
            "example": {
                "name": "Planspiel",
                "content": "Project",
                "url": "https://www.tu-chemnitz.de/en/schools/programmes/2ZMA/2022/12345*/2024/",
                "university": "TU Chemnitz",
                "degree_program": "Master",
                "module_code": "12345*",
                "ects": 30,
                "year": "2. year",
                "degree_level": "Web Engineerin"
            }
        }