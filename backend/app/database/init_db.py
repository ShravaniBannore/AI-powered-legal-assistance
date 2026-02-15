from sqlalchemy.orm import Session
from .connection import engine, SessionLocal
from .models import Base, Role


def init_db():
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()

    default_roles = ["Student", "Employee", "Tenant", "General"]

    for role_name in default_roles:
        existing_role = db.query(Role).filter(Role.name == role_name).first()
        if not existing_role:
            new_role = Role(name=role_name)
            db.add(new_role)

    db.commit()
    db.close()