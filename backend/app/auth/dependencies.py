from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.auth.jwt_handler import verify_token
from app.database.connection import SessionLocal
from app.database.models import User

security = HTTPBearer()


from sqlalchemy.orm import joinedload


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    user_id = payload.get("sub")

    db: Session = SessionLocal()

    user = (
        db.query(User)
        .options(joinedload(User.role))   # 🔥 eagerly load role
        .filter(User.id == user_id)
        .first()
    )

    db.close()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user