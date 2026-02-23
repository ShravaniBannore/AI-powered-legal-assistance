from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.database.models import User, Role
from app.database.connection import SessionLocal

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def register_user(name: str, email: str, password: str, role_name: str):
    db: Session = SessionLocal()

    role = db.query(Role).filter(Role.name == role_name).first()
    if not role:
        db.close()
        return None, "Invalid role"

    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        db.close()
        return None, "Email already registered"

    new_user = User(
        name=name,
        email=email,
        hashed_password=hash_password(password),
        role_id=role.id
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    db.close()

    return new_user, None


def authenticate_user(email: str, password: str):
    db: Session = SessionLocal()

    user = db.query(User).filter(User.email == email).first()
    if not user:
        db.close()
        return None

    if not verify_password(password, user.hashed_password):
        db.close()
        return None

    # Access role before closing session
    user_role = user.role.name

    db.close()
    return user