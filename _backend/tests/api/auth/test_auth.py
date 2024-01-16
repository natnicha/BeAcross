from bson import ObjectId
from fastapi import status
from fastapi.testclient import TestClient
import mongomock

from app.config.config_utils import load_env
from app.api.auth.auth import get_database
from main import app

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
    response = client.post(
        url="/api/v1/auth/register",
        headers={"Content-Type":"application/json"},
        json={"email":"example@atu-chemnitz.de"}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() ==  {"detail": {"message": "The email's domain isn't under Across, please input another email which is under Across"}}


def test_register_user_is_taken(mocker):
    email_domains_object = [{
        "_id" : ObjectId("65a440ad4e731f4ba4ec9c9b"),
        "university_id" : ObjectId("65a43ec94e731f4ba4ec9c11"),
        "domain" : "tu-chemnitz.de"
    }]
    
    users_object = {
        "_id" : ObjectId("65a54de25eb0e12eb0a93e3a"),
        "email" : "example.x@tu-chemnitz.de",
        "password" : bytes(str("ODY2NjU4YjYwN2RkZGVkNDk3MGFlZjliOGM1YzBiOWNkMDAwYWUwZDgwMWFiZjcwYzFlMDVjNDZmMmFhOGVlZToyYmViYjRjN2E3NmI0NmRkYTc4ZjU0NzgyMDNkZDgxYw==").encode("utf-8")),
        "first_name" : "example",
        "last_name" : "x",
        "registration_number" : None,
        "course_of_study" : None,
        "semester" : int(1)
    }

    mocker.patch('app.crud.email_domains.get_email_domain', return_value=email_domains_object)
    mocker.patch('app.crud.users.get_user', return_value=users_object)
    load_env()
    response = client.post(
        url="/api/v1/auth/register",
        headers={"Content-Type":"application/json"},
        json={"email":"example.x@tu-chemnitz.de"}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() ==  {"detail": {"message": "The email is already taken, please check again"}}


def test_register_success_user_without_last_name(mocker):
    email_domains_object = [{
        "_id" : ObjectId("65a440ad4e731f4ba4ec9c9b"),
        "university_id" : ObjectId("65a43ec94e731f4ba4ec9c11"),
        "domain" : "tu-chemnitz.de"
    }]

    mocker.patch('app.crud.email_domains.get_email_domain', return_value=email_domains_object)
    load_env()
    response = client.post(
        url="/api/v1/auth/register",
        headers={"Content-Type":"application/json"},
        json={"email":"example.x@tu-chemnitz.de"}
    )
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["data"]["email"] == "example.x@tu-chemnitz.de"
    assert response.json()["data"]["first_name"] == "example"
    assert response.json()["data"]["last_name"] == "x"

