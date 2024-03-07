from bson import ObjectId
from fastapi import status
from fastapi.testclient import TestClient
import mongomock
from app.db.settings import Settings

from app.config.config_utils import load_env
from app.api.auth.auth import get_database
from main import app

client = TestClient(app)

test_db_client = mongomock.MongoClient()

async def get_db_test_client():
    return test_db_client

app.dependency_overrides[get_database] = get_db_test_client

def init_setting():
    Settings.user_roles = {
        "student": ObjectId("65a8040bfbc5863974a6d4e2"), 
        "uni-admin": ObjectId("65a80418fbc5863974a6d4e3"), 
        "sys-admin": ObjectId("65a8041efbc5863974a6d4e4"), 
    }

def test_register_invalid_email_format(benchmark):
    response = benchmark(client.post,
        url="/api/v1/auth/register",
        headers={"Content-Type":"application/json"},
        json={"email":"abc"}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() ==  {"detail": {"message": "The email doesn't conform by email format, please input in format of example@university.de"}}


def test_register_email_is_not_across_partner(benchmark):
    load_env()
    response = benchmark(client.post,
        url="/api/v1/auth/register",
        headers={"Content-Type":"application/json"},
        json={"email":"example@atu-chemnitz.de"}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() ==  {"detail": {"message": "The email's domain isn't under Across, please input another email which is under Across"}}


def test_register_user_is_taken(mocker, benchmark):
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
    response = benchmark(client.post,
        url="/api/v1/auth/register",
        headers={"Content-Type":"application/json"},
        json={"email":"example.x@tu-chemnitz.de"}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() ==  {"detail": {"message": "The email is already taken, please check again"}}


def test_register_success_user_with_last_name(mocker, benchmark):
    email_domains_object = [{
        "_id" : ObjectId("65a440ad4e731f4ba4ec9c9b"),
        "university_id" : ObjectId("65a43ec94e731f4ba4ec9c11"),
        "domain" : "tu-chemnitz.de"
    }]

    mocker.patch('app.crud.email_domains.get_email_domain', return_value=email_domains_object)
    mocker.patch('app.crud.users.get_user', return_value={})
    load_env()
    init_setting()
    response = benchmark(client.post,
        url="/api/v1/auth/register",
        headers={"Content-Type":"application/json"},
        json={"email":"example.xxxxxxxx@tu-chemnitz.de"}
    )
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["data"]["email"] == "example.xxxxxxxx@tu-chemnitz.de"
    assert response.json()["data"]["first_name"] == "example"
    assert response.json()["data"]["last_name"] == "xxxxxxxx"


def test_register_success_user_without_last_name(mocker, benchmark):
    email_domains_object = [{
        "_id" : ObjectId("65a440ad4e731f4ba4ec9c9b"),
        "university_id" : ObjectId("65a43ec94e731f4ba4ec9c11"),
        "domain" : "tu-chemnitz.de"
    }]

    mocker.patch('app.crud.email_domains.get_email_domain', return_value=email_domains_object)
    mocker.patch('app.crud.users.get_user', return_value={})
    load_env()
    init_setting()
    response = benchmark(client.post,
        url="/api/v1/auth/register",
        headers={"Content-Type":"application/json"},
        json={"email":"example@tu-chemnitz.de"}
    )
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["data"]["email"] == "example@tu-chemnitz.de"
    assert response.json()["data"]["first_name"] == "example"
    assert response.json()["data"]["last_name"] == ""



def test_login_unauthenticated(mocker, benchmark):
    users_object = [{
        "_id" : ObjectId("65a54de25eb0e12eb0a93e3a"),
        "email" : "example.x@tu-chemnitz.de",
        "password" : b'848b8b89c2666cb85dc2969fdb9f99c3bcea099131e562d6e7aad5aba33ec337:09d92dd4cb1c4f11b88c7ab36ac66867',
        "first_name" : "example",
        "last_name" : "x",
        "registration_number" : None,
        "course_of_study" : None,
        "semester" : int(1)
    }]
    mocker.patch('app.crud.users.get_user', return_value=users_object)

    load_env()
    init_setting()
    response = benchmark(client.post,
        url="/api/v1/auth/login",
        headers={"Content-Type":"application/json"},
        json={"email":"example.x@tu-chemnitz.de", "password": "B(E0xJ[-"}
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_login_success(mocker, benchmark):
    users_object = [{
        "_id" : ObjectId("65a54de25eb0e12eb0a93e3a"),
        "email" : "example.x@tu-chemnitz.de",
        "password" : b'848b8b89c2666cb85dc2969fdb9f99c3bcea099131e562d6e7aad5aba33ec337:09d92dd4cb1c4f11b88c7ab36ac66866',
        "first_name" : "example",
        "last_name" : "x",
        "registration_number" : None,
        "course_of_study" : None,
        "semester" : int(1),
        "user_roles_id" : ObjectId("65a8040bfbc5863974a6d4e2"),
        "created_at" : "2024-02-27T09:39:56.844+0000",
        "updated_at" : "2024-02-27T09:39:56.844+0000"
    }]
    mocker.patch('app.crud.users.get_user', return_value=users_object)

    domain_object = [{
        "_id" : ObjectId("65a43ec94e731f4ba4ec9c11"),
        "university_id" : ObjectId("65a440ad4e731f4ba4ec9c9a"),
        "domain" : "tu-chemnitz.de"
    }]
    mocker.patch('app.crud.email_domains.get_email_domain', return_value=domain_object)
    
    university_object = {
        "_id" : ObjectId("65a440ad4e731f4ba4ec9c9a"),
        "name" : "Technische Universitat Chemnitz",
        "country" : "Germany"
    }
    mocker.patch('app.crud.universities.find_one', return_value=university_object)

    load_env()
    init_setting()
    response = benchmark(client.post,
        url="/api/v1/auth/login",
        headers={"Content-Type":"application/json"},
        json={"email":"example.x@tu-chemnitz.de", "password": "B(E0xJ[-"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["data"]["jwt"] != ""
