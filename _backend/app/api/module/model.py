from pydantic import BaseModel

class RecommendRequestModel(BaseModel):
    module: str