from pydantic import BaseModel,Field
from uuid import UUID, uuid4
from typing import Optional, List
from enum import Enum

class Gender(str, Enum):
  male = "male"
  female = "female"

class Role(str, Enum):
  admin = "admin"
  student = "student"
  guest = "guest"

class User(BaseModel):
  id: Optional[UUID] = uuid4()
  first_name: str
  last_name: str
  uni_name: Optional[str] = Field(default="TU-Chemnitz")
  gender: Gender
  new_pass: Optional[str] = Field(default="Pass1234")
  roles: List[Role]