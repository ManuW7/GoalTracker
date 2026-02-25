from pydantic import BaseModel
from datetime import datetime

class Goal(BaseModel):
    id: int
    name: str
    description: str
    color: str
    date_set: datetime
    user_id: int

class Action(BaseModel):
  id: int
  name: str
  goal_id: int
  description: str
  date: datetime
  user_id: int