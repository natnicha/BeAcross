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

def test_post_no_request_body():
    load_env()
    init_setting()
    response = client.post(
        url="/api/v1/module/recommend",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json()["message"] == "no request body provided"

def test_post_module_recommend_no_authorization():
    load_env()
    init_setting()
    response = client.post(
        url="/api/v1/module/recommend",
        headers={"Content-Type":"application/json"},
        json={}
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_post_module_recommend_uni_admin_forbidden():
    load_env()
    init_setting()
    response = client.post(
        url="/api/v1/module/recommend",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {uni_admin_jwt}"},
        json={}
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN

def test_post_module_recommend_sys_admin_forbidden():
    load_env()
    init_setting()
    response = client.post(
        url="/api/v1/module/recommend",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {sys_admin_jwt}"},
        json={}
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN

def test_post_module_recommend_module_id_incorrect_format():
    load_env()
    init_setting()
    response = client.post(
        url="/api/v1/module/recommend",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"},
        json={"module_id":"abcd"}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST

def test_post_module_recommend_already_performed_recommend(mocker):
    load_env()
    init_setting()
    mocker.patch('app.crud.module_recommend.get_module_recommend', return_value={'_id': ObjectId('65e8c8168c36c28a62742e5d'), 'module_id': ObjectId('65ac17b1d2815b505f3e352d'), 'user_id': ObjectId('65e8c7904a8c3c22bf839569')})
    response = client.post(
        url="/api/v1/module/recommend",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"},
        json={"module_id":"65ac17b1d2815b505f3e352d"}
    )
    assert response.status_code == status.HTTP_409_CONFLICT

# def test_post_module_recommend_success(mocker):
#     load_env()
#     init_setting()
#     mocker.patch('app.crud.module_recommend.get_module_recommend', return_value=[])
#     response = client.post(
#         url="/api/v1/module/recommend",
#         headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"},
#         json={"module_id":"65ac17b1d2815b505f3e352d"}
#     )
#     assert response.status_code == status.HTTP_201_CREATED










def test_delete_module_recommend_no_authorization():
    load_env()
    init_setting()
    response = client.delete(
        url="/api/v1/module/65ac17b1d2815b505f3e352d/recommend",
        headers={"Content-Type":"application/json"}
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
