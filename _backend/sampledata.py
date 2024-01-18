from pydantic import BaseModel
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
  id: Optional[str] = uuid4()
  first_name: str
  last_name: str
  #uni_name: Optional[str]
  gender: Gender
  #new_pass: Optional[int]
  roles: List[Role]