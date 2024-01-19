from pydantic import BaseModel

class RecommendRequestModel(BaseModel):
    module_id: str
