from fastapi import status
from fastapi.testclient import TestClient
import mongomock
from main import app
from config.config_utils import EnvConfig, load_env, env_config
from api.auth.auth import get_database

client = TestClient(app)

test_db_client = mongomock.MongoClient()

async def get_db_test_client():
    return test_db_client

app.dependency_overrides[get_database] = get_db_test_client



def test_register_invalid_email_format():
    response = client.post(
        url="/api/v1/auth/register",
        headers={"Content-Type":"application/json"},
        json={"email":"abc"}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() ==  {"detail": {"message": "The email doesn't conform by email format, please input in format of example@university.de"}}


def test_register_email_is_not_across_partner():
    load_env()
    print(env_config.DB_NAME)
    response = client.post(
        url="/api/v1/auth/register",
        headers={"Content-Type":"application/json"},
        json={"email":"example@atu-chemnitz.de"}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() ==  {"detail": {"message": "The email's domain isn't under Across, please input another email which is under Across"}}
