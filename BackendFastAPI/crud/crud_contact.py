"""
CRUD operations para ContactMessage
"""

from typing import List, Optional
from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.contact import ContactMessage
from schemas.contact import ContactMessageCreate, ContactMessageUpdate

class CRUDContactMessage(CRUDBase[ContactMessage, ContactMessageCreate, ContactMessageUpdate]):
    def get_by_status(self, db: Session, *, status: str) -> List[ContactMessage]:
        return db.query(ContactMessage).filter(ContactMessage.status == status).all()

    def get_pending(self, db: Session) -> List[ContactMessage]:
        return db.query(ContactMessage).filter(
            ContactMessage.status.in_(["new", "in_progress"])
        ).order_by(ContactMessage.created_at.desc()).all()

    def get_recent(self, db: Session, *, limit: int = 10) -> List[ContactMessage]:
        return db.query(ContactMessage).order_by(
            ContactMessage.created_at.desc()
        ).limit(limit).all()

contact_message = CRUDContactMessage(ContactMessage)
