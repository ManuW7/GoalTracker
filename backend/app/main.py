from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.services.errors import AppError
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

@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "field": exc.field,
            }
        },
    )