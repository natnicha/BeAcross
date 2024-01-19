import logging
from app.crud.user_roles import get_user_roles
from .mongodb import db
from .settings import settings

async def load_settings():
    rows = get_user_roles(db.client)
    if rows:
        user_roles = dict()
        for row in rows:
            user_roles[row["name"]] = row["_id"]
        settings.user_roles = user_roles
        return 
    logging.error("can't load settings from DB")
    raise 
