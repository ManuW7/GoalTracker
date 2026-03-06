import os

DATABASE_URL = os.getenv("DATABASE_URL")
ENV = os.getenv("ENV", "dev")