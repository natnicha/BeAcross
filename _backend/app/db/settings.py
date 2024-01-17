from mongomock import MongoClient

class Settings():
    user_roles: dict = None

settings = Settings()


async def get_settings() -> MongoClient:
    return settings
