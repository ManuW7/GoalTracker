from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import goals, actions

app = FastAPI()
app.include_router(goals.router)
app.include_router(actions.router)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # какие origin разрешены
    allow_credentials=True,         # разрешать cookies / auth
    allow_methods=["*"],            # разрешить все методы (GET, POST и т.д.)
    allow_headers=["*"],            # разрешить все заголовки
)