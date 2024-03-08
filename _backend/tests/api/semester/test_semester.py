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

def test_get_semester_guest(mocker):
    load_env()
    init_setting()
    semesters = [{
        "_id" : ObjectId("65d9aa1e2b35547c027a9de9"),
        "name" : "summer 2025",
        "created_at" : 1516239022
    },
    {
        "_id" : ObjectId("65d7a7cc2b35547c027a9d5e"),
        "name" : "winter 2024/25",
        "created_at" : 1516239022
    }]
    mocker.patch('app.crud.semesters.find_all', return_value=semesters)
    response = client.get(
        url="/api/v1/semester",
        headers={"Content-Type":"application/json"}
    )
    expected_response = [{
        "id" : "65d9aa1e2b35547c027a9de9",
        "name" : "summer 2025",
        "created_at" : "2018-01-18T01:30:22Z"
    },
    {
        "id" : "65d7a7cc2b35547c027a9d5e",
        "name" : "winter 2024/25",
        "created_at" : "2018-01-18T01:30:22Z"
    }]
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["data"]["items"] == expected_response
