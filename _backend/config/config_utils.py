import os
from dotenv import load_dotenv

class EnvConfig:
    DB_CONNECTION_STRING = None

env_config = EnvConfig()

def load_env():
    load_dotenv()

    env_config.DB_CONNECTION_STRING = os.getenv('DB_CONNECTION_STRING')
