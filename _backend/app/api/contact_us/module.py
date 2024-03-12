from pydantic import BaseModel

class ContactUsRequest(BaseModel):
    name: str
    email: str
    message: str
