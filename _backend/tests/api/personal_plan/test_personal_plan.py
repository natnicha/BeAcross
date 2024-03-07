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

def test_get_personal_plan_unauthorized():
    load_env()
    init_setting()
    response = client.get(
        url="/api/v1/personal-plan",
        headers={"Content-Type":"application/json"}
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_get_personal_plan_uni_admin_forbidden():
    load_env()
    init_setting()
    response = client.get(
        url="/api/v1/personal-plan",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {uni_admin_jwt}"}
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN

def test_get_personal_plan_sys_admin_forbidden():
    load_env()
    init_setting()
    response = client.get(
        url="/api/v1/personal-plan",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {sys_admin_jwt}"}
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN

def test_get_personal_plan_module_id_incorrect_format():
    load_env()
    init_setting()
    response = client.get(
        url="/api/v1/personal-plan?module_id=abc",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST

def test_get_personal_plan_student_success(mocker):
    load_env()
    init_setting()
    personal_plans = [{
        "_id" : ObjectId("65e3ed3477dc05db2ccce8ad"),
        "user_id" : ObjectId("65c277e1be7a7e961b48a549"),
        "semester_id" : ObjectId("65d7a7cc2b35547c027a9d5e"),
        "module_id" : ObjectId("65ac17b1d2815b505f3e3673"),
        "created_at" : 1516239022
    }]
    mocker.patch('app.crud.personal_plans.get_by_user_id_and_module_id', return_value=personal_plans)
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
        url="/api/v1/personal-plan",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"}
    )
    expected_response = {
        'total_items': 1, 
        'items': [
            {
                'module_id': '65ac17b1d2815b505f3e3673', 
                'personal_plan': [{
                    'personal_plan_id': None, 
                    'semester_id': '65d9aa1e2b35547c027a9de9', 
                    'semester_name': 'summer 2025', 
                    'is_added': False
                }, {
                    'personal_plan_id': '65e3ed3477dc05db2ccce8ad', 
                    'semester_id': '65d7a7cc2b35547c027a9d5e', 
                    'semester_name': 'winter 2024/25', 
                    'is_added': True
                }]
            }]
        }
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["data"] == expected_response











def test_post_personal_plan_guest_unauthorized():
    load_env()
    init_setting()
    response = client.post(
        url="/api/v1/personal-plan",
        headers={"Content-Type":"application/json"}
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_post_personal_plan_uni_admin_forbidden():
    load_env()
    init_setting()
    response = client.post(
        url="/api/v1/personal-plan",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {uni_admin_jwt}"}
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN

def test_post_personal_plan_sys_admin_forbidden():
    load_env()
    init_setting()
    response = client.post(
        url="/api/v1/personal-plan",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {sys_admin_jwt}"}
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN
