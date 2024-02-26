from bson import ObjectId
from pydantic import BaseModel

class BaseModel(BaseModel):
    class Config:
        arbitrary_types_allowed = True
        populate_by_name = True
        json_encoders = {ObjectId: str}
        
class GetPersonalPlanResponsePersonalPlan(BaseModel):
    semester_id: str
    semester_name: str
    is_added: bool = False

class GetPersonalPlanResponseItem(BaseModel):
    module_id: str = ""
    personal_plan: list = []

class GetPersonalPlanResponseData(BaseModel):
    total_items: int = 0
    items: list = []

class PostPersonalPlanRequest(BaseModel):
    module_id: str
    semester_id: str

class PostPersonalPlanResponse(BaseModel):
    personal_plan_id: ObjectId
    module_id: ObjectId
    semester_id: ObjectId
