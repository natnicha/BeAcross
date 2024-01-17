from pymongo import MongoClient

from pymongo import MongoClient
from app.config.config_utils import env_config

def get_email_domain(conn: MongoClient, request_domain: str):
    return conn.get_database(env_config.DB_NAME).get_collection("email_domains").find({"domain" : request_domain})
