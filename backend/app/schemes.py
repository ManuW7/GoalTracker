from pydantic import BaseModel
from datetime import date

class Goal(BaseModel):
    id: int
    name: str
    description: str
    color: str
    date_set: date
    user_id: int

class Action(BaseModel):
  id: int
  name: str
  goal_id: int
  description: str
  date: date
  user_id: int