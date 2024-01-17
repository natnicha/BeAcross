from pydantic import BaseModel

class RegisterRequestModel(BaseModel):
    email: str