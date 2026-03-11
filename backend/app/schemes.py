from pydantic import BaseModel, Field
from datetime import datetime

class Goal(BaseModel):
    id: int
    name: str
    description: str
    color: str = Field(pattern=r"^#[0-9A-Fa-f]{6}$")
    date_set: datetime
    user_id: int

class Action(BaseModel):
  id: int
  name: str
  goal_id: int
  description: str
  date: datetime
  user_id: int

class CreateUser(BaseModel):
   username: str
   password: str

class LoginUser(BaseModel):
   username: str
   password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"