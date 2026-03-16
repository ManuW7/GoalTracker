from pydantic import BaseModel, Field
from datetime import datetime

class GoalCreate(BaseModel):
   name: str
   description: str | None
   color: str = Field(pattern=r"^#[0-9A-Fa-f]{6}$")

   date_set: datetime # time of creation of goal
   deadline: datetime | None = None

   everyday: bool = False # need for check is it everyday goal or not
   target_count: int | None = None # need for check how many days user should do action to complete goal

class GoalResponse(GoalCreate):
   id: int
   current_count: int | None = None # need for check how many days user have done action to complete goal
   streak: int | None = None # need for check how many days in a row user have done action to complete goal (for everyday goals)
   is_failed: bool | None = None # need for check is goal failed or not, only for everyday goals

class GoalUpdate(GoalCreate):
   pass

class ActionCreate(BaseModel):
   name: str
   description: str | None = None
   date: datetime
   goal_id: int

class ActionResponse(ActionCreate):
   id: int

class ActionUpdate(ActionCreate):
   pass

class CreateUser(BaseModel):
   username: str = Field(min_length=3, max_length=255)
   password: str = Field(min_length=8, max_length=255)

class LoginUser(BaseModel):
   username: str = Field(min_length=3, max_length=255)
   password: str = Field(min_length=8, max_length=255)

class Token(BaseModel):
   access_token: str
   token_type: str = "bearer"
