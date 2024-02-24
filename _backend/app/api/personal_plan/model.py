from pydantic import BaseModel


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