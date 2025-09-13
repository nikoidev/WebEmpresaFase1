"""
CRUD Operations - Operaciones de base de datos
"""

from .crud_user import user
from .crud_page_content import page_content
from .crud_contact import contact_message
from .crud_plans import service_plan

# For a new basic set of CRUD operations you could just do

# from .base import CRUDBase
# from app.models.item import Item
# from app.schemas.item import ItemCreate, ItemUpdate

# item = CRUDBase[Item, ItemCreate, ItemUpdate](Item)