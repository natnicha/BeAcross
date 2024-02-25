import logging
import os
from dotenv import load_dotenv

class EnvConfig:
    DB_CONNECTION_STRING = None
    DB_NAME = None
    
    JWT_DURATION_MINUTE = None
    JWT_SECRET = None

    EMAIL_SENDER= None
    EMAIL_PASSWORD= None

env_config = EnvConfig()

def load_env():
    load_dotenv()

    env_config.DB_CONNECTION_STRING = os.getenv('DB_CONNECTION_STRING')
    env_config.DB_NAME = os.getenv('DB_NAME')

    env_config.JWT_DURATION_MINUTE = os.getenv('JWT_DURATION_MINUTE')
    env_config.JWT_SECRET = os.getenv('JWT_SECRET')

    env_config.EMAIL_SENDER = os.getenv('EMAIL_SENDER')
    env_config.EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')

def setup_logging():
    logging.basicConfig(format='%(asctime)s %(levelname)s: %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p', level=logging.DEBUG)
