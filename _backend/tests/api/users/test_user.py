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
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"}
    )
    assert response.status_code == status.HTTP_200_OK
