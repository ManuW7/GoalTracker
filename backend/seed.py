from app.db.session import SessionLocal
from app.models.user import User

def seed():
    db = SessionLocal()
    try:
        user = db.get(User, 100)

        if user is None:
            user = User(
                id=100,
            )
            db.add(user)
            db.commit()
            print("User 100 created")
        else:
            print("User 100 already exists")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed()