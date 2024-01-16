import os
from dotenv import load_dotenv

class EnvConfig:
    DB_CONNECTION_STRING = None
    DB_NAME = None
    
    JWT_DURATION_MINUTE = None
    JWT_SECRET = None

env_config = EnvConfig()

def load_env():
    load_dotenv()

    env_config.DB_CONNECTION_STRING = os.getenv('DB_CONNECTION_STRING')
    env_config.DB_NAME = os.getenv('DB_NAME')

    env_config.JWT_DURATION_MINUTE = os.getenv('JWT_DURATION_MINUTE')
    env_config.JWT_SECRET = os.getenv('JWT_SECRET')
