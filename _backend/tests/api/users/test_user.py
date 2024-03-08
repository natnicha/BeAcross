from bson import ObjectId
from fastapi.testclient import TestClient
from fastapi import status

from app.db.settings import Settings
from app.config.config_utils import load_env
from main import app

client = TestClient(app)

student_jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjVlOGM3OTA0YThjM2MyMmJmODM5NTY5Iiwicm9sZSI6InN0dWRlbnQiLCJ1bml2ZXJzaXR5IjoiVGVjaG5pc2NoZSBVbml2ZXJzaXRhdCBDaGVtbml0eiIsImlhdCI6MTcwOTc1NjM4MSwiZXhwIjoyMDI1MTE2MzgxfQ.c7UeyBYA3jZj7ne6HejwA8wU3XMw75k7N3co3k0aL3E"
uni_admin_jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjVlNGQyMmJhMjFkMzA4ZWNhMGM1MzFkIiwicm9sZSI6InVuaS1hZG1pbiIsInVuaXZlcnNpdHkiOiJUZWNobmlzY2hlIFVuaXZlcnNpdGF0IENoZW1uaXR6IiwiaWF0IjoxNzA5ODA1MDYzLCJleHAiOjIwMjUxNjUwNjN9.NTlNeqRgG1bDuEJEZoutHPACf8PQcnq_RHMKLNze-vo"
sys_admin_jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjVlOThlMzZjOTRmNjU3ODNjM2JhZDRjIiwicm9sZSI6InN5cy1hZG1pbiIsInVuaXZlcnNpdHkiOiJUZWNobmlzY2hlIFVuaXZlcnNpdGF0IENoZW1uaXR6IiwiaWF0IjoxNzA5ODA1MTcwLCJleHAiOjIwMjUxNjUxNzB9.Dh1m07NfibQ9m3m7d_geowNpDwwkqtrJCaVqlW6vzjk"

def init_setting():
    Settings.user_roles = {
        "student": ObjectId("65a8040bfbc5863974a6d4e2"), 
        "uni-admin": ObjectId("65a80418fbc5863974a6d4e3"), 
        "sys-admin": ObjectId("65a8041efbc5863974a6d4e4"), 
    }

def test_get_user_profile_guest_unauthorized():
    load_env()
    init_setting()
    response = client.get(
        url="/api/v1/user/profile",
        headers={"Content-Type":"application/json"}
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_get_user_profile_student(mocker):
    load_env()
    init_setting()
    user = {
        "_id" : ObjectId("65e8c7904a8c3c22bf839569"),
        "email" : "example.x@s2022.tu-chemnitz.de",
        "password" : b"ZmY1ZTlkMTFhNzU2MzkzYjkyNTZmNDUyNzg1YTNmZGI5ZTM0N2JkMjNkMDQxYjE1NjA3NGJlY2QwZmIyMjAyNjpjZjFhNGRjN2QzYzI0Y2QyOWYwZGUxYjMyMmJjNjdhZA==",
        "first_name" : "example",
        "last_name" : "x",
        "registration_number" : None,
        "course_of_study" : None,
        "semester" : 1,
        "user_roles_id" : ObjectId("65a8040bfbc5863974a6d4e2"),
        "created_at" : 1516239022,
        "updated_at" : 1516239022
    }
    mocker.patch('app.crud.users.get_user_by_id', return_value=user)

    email_domains = [{
        "_id" : ObjectId("65a440ad4e731f4ba4ec9c9b"),
        "university_id" : ObjectId("65a43ec94e731f4ba4ec9c11"),
        "domain" : "tu-chemnitz.de"
    }]
    mocker.patch('app.crud.email_domains.get_email_domain', return_value=email_domains)

    university = {
        "_id" : ObjectId("65a43ec94e731f4ba4ec9c11"),
        "country" : "Germany",
        "name" : "Technische Universitat Chemnitz"
    }
    mocker.patch('app.crud.universities.find_one', return_value=university)
    response = client.get(
        url="/api/v1/user/profile",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"}
    )
    expected_response = {
        'email' : 'example.x@s2022.tu-chemnitz.de',
        'password': 'ZmY1ZTlkMTFhNzU2MzkzYjkyNTZmNDUyNzg1YTNmZGI5ZTM0N2JkMjNkMDQxYjE1NjA3NGJlY2QwZmIyMjAyNjpjZjFhNGRjN2QzYzI0Y2QyOWYwZGUxYjMyMmJjNjdhZA==',
        "first_name" : "example",
        "last_name" : "x",
        'university': 'Technische Universitat Chemnitz', 
        'registration_number': None, 
        'course_of_study': None, 
        'semester': 1, 
        'user_role': 'student', 
        'created_at': '2018-01-18T01:30:22Z', 
        'updated_at': '2018-01-18T01:30:22Z'
    }
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == expected_response

def test_get_user_profile_uni_admin(mocker):
    load_env()
    init_setting()
    user = {
        "_id" : ObjectId("65e4d22ba21d308eca0c531d"),
        "email" : "natnicha.rodtong@s2022.tu-chemnitz.de",
        "password" : b'MDNjMTNjNjJlOGRlNjk1NzM3OWUzNjJlMTdjMzQ4NThlZDQ0ZmNkOTk0MmVkNGM1MGNmNjc1MzAzNjI0OTI3OToxNGNlM2Q3ZjU1MzI0ZjZkOTQ5MjhkOTNiZTUyNGFhYQ==',
        "first_name" : "natnicha",
        "last_name" : "rodtong",
        "registration_number" : None,
        "course_of_study" : None,
        "semester" : 1,
        "user_roles_id" : ObjectId("65a80418fbc5863974a6d4e3"),
        "created_at" : 1516239022,
        "updated_at" : 1516239022
    }
    mocker.patch('app.crud.users.get_user_by_id', return_value=user)

    email_domains = [{
        "_id" : ObjectId("65a440ad4e731f4ba4ec9c9b"),
        "university_id" : ObjectId("65a43ec94e731f4ba4ec9c11"),
        "domain" : "tu-chemnitz.de"
    }]
    mocker.patch('app.crud.email_domains.get_email_domain', return_value=email_domains)

    university = {
        "_id" : ObjectId("65a43ec94e731f4ba4ec9c11"),
        "country" : "Germany",
        "name" : "Technische Universitat Chemnitz"
    }
    mocker.patch('app.crud.universities.find_one', return_value=university)
    response = client.get(
        url="/api/v1/user/profile",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {uni_admin_jwt}"}
    )
    expected_response = {
        'email': 'natnicha.rodtong@s2022.tu-chemnitz.de', 
        'password': 'MDNjMTNjNjJlOGRlNjk1NzM3OWUzNjJlMTdjMzQ4NThlZDQ0ZmNkOTk0MmVkNGM1MGNmNjc1MzAzNjI0OTI3OToxNGNlM2Q3ZjU1MzI0ZjZkOTQ5MjhkOTNiZTUyNGFhYQ==', 
        'first_name': 'natnicha', 
        'last_name': 'rodtong', 
        'university': 'Technische Universitat Chemnitz', 
        'registration_number': None, 
        'course_of_study': None, 
        'semester': 1, 
        'user_role': 'uni-admin', 
        'created_at': '2018-01-18T01:30:22Z', 
        'updated_at': '2018-01-18T01:30:22Z'
    }
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == expected_response

def test_get_user_profile_sys_admin(mocker):
    load_env()
    init_setting()
    user = {
        "_id" : ObjectId("65e98e36c94f65783c3bad4c"),
        "email" : "example.c@s2022.tu-chemnitz.de",
        "password" : b"YzQ5YzE3MjNiMmM1MTczM2VhZTk2MGRhYjhiMzVlNTFkYjUyYjNkNzVlYmFhZjlhMGQ3M2E0YmFjZjBmMDQyNToxYWU2NWY3NGEzNzU0Njc4OGJiYTUxZjMxYTNlM2I0OA==",
        "first_name" : "example",
        "last_name" : "c",
        "registration_number" : None,
        "course_of_study" : None,
        "semester" : 1,
        "user_roles_id" : ObjectId("65a8041efbc5863974a6d4e4"),
        "created_at" : 1516239022,
        "updated_at" : 1516239022
    }
    mocker.patch('app.crud.users.get_user_by_id', return_value=user)

    email_domains = [{
        "_id" : ObjectId("65a440ad4e731f4ba4ec9c9b"),
        "university_id" : ObjectId("65a43ec94e731f4ba4ec9c11"),
        "domain" : "tu-chemnitz.de"
    }]
    mocker.patch('app.crud.email_domains.get_email_domain', return_value=email_domains)

    university = {
        "_id" : ObjectId("65a43ec94e731f4ba4ec9c11"),
        "country" : "Germany",
        "name" : "Technische Universitat Chemnitz"
    }
    mocker.patch('app.crud.universities.find_one', return_value=university)
    response = client.get(
        url="/api/v1/user/profile",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {sys_admin_jwt}"}
    )
    expected_response = {
        "email" : "example.c@s2022.tu-chemnitz.de",
        "password" : "YzQ5YzE3MjNiMmM1MTczM2VhZTk2MGRhYjhiMzVlNTFkYjUyYjNkNzVlYmFhZjlhMGQ3M2E0YmFjZjBmMDQyNToxYWU2NWY3NGEzNzU0Njc4OGJiYTUxZjMxYTNlM2I0OA==",
        "first_name" : "example",
        "last_name" : "c",
        'university': 'Technische Universitat Chemnitz', 
        'registration_number': None, 
        'course_of_study': None, 
        'semester': 1, 
        'user_role': 'sys-admin', 
        'created_at': '2018-01-18T01:30:22Z', 
        'updated_at': '2018-01-18T01:30:22Z'
    }
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == expected_response
