"""
CRUD operations para PageContent
"""

from typing import Optional
from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.page_content import PageContent
from schemas.page_content import PageContentCreate, PageContentUpdate

class CRUDPageContent(CRUDBase[PageContent, PageContentCreate, PageContentUpdate]):
    def get_by_page_key(self, db: Session, *, page_key: str) -> Optional[PageContent]:
        return db.query(PageContent).filter(PageContent.page_key == page_key).first()

    def get_active_by_page_key(self, db: Session, *, page_key: str) -> Optional[PageContent]:
        return db.query(PageContent).filter(
            PageContent.page_key == page_key,
            PageContent.is_active == True
        ).first()

    def get_all_active(self, db: Session):
        return db.query(PageContent).filter(PageContent.is_active == True).all()

page_content = CRUDPageContent(PageContent)
