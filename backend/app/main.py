from fastapi import FastAPI
from app.routers import goals, actions

app = FastAPI()
app.include_router(goals.router)
app.include_router(actions.router)