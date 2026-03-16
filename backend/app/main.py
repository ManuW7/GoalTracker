from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.db.session import get_db
from app.services.errors import AppError
from app.routers import goals, actions, auth

app = FastAPI()
app.include_router(goals.router)
app.include_router(actions.router)
app.include_router(auth.router)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,                 # конкретные источники
    allow_credentials=True,                # разрешаем cookies / auth
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "X-Requested-With",
    ],
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

@app.get("/db-check")
def db_check(db: Session = Depends(get_db)):
    value = db.execute(text("SELECT 1")).scalar_one()
    return {"select_1": value}