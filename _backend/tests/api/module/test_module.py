from bson import ObjectId
from fastapi.testclient import TestClient
from fastapi import status
from pydantic import BaseModel

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

def test_post_module_recommend_success(mocker):
    load_env()
    init_setting()
    mocker.patch('app.crud.module_recommend.get_module_recommend', return_value={})
    mocker.patch('app.crud.module_recommend.insert_one', return_value={})
    response = client.post(
        url="/api/v1/module/recommend",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"},
        json={"module_id":"65ac17b1d2815b505f3e352d"}
    )
    assert response.status_code == status.HTTP_201_CREATED










def test_delete_module_recommend_no_authorization():
    load_env()
    init_setting()
    response = client.delete(
        url="/api/v1/module/65ac17b1d2815b505f3e352d/recommend",
        headers={"Content-Type":"application/json"}
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_delete_module_recommend_uni_admin_forbidden():
    load_env()
    init_setting()
    response = client.delete(
        url="/api/v1/module/65ac17b1d2815b505f3e352d/recommend",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {uni_admin_jwt}"}
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN

def test_delete_module_recommend_sys_admin_forbidden():
    load_env()
    init_setting()
    response = client.delete(
        url="/api/v1/module/65ac17b1d2815b505f3e352d/recommend",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {sys_admin_jwt}"}
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN

def test_delete_module_recommend_module_id_incorrect_format():
    load_env()
    init_setting()
    response = client.delete(
        url="/api/v1/module/abc/recommend",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST

def test_delete_module_recommend_not_found(mocker):
    load_env()
    init_setting()
    mocker.patch('app.crud.module_recommend.get_module_recommend', return_value={})
    response = client.delete(
        url="/api/v1/module/65ac17b1d2815b505f3e352d/recommend",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"}
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_delete_module_recommend_not_found(mocker):
    load_env()
    init_setting()
    mocker.patch('app.crud.module_recommend.get_module_recommend', return_value=[])
    response = client.delete(
        url="/api/v1/module/65ac17b1d2815b505f3e352d/recommend",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"}
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND










def test_get_module_comment_guest(mocker):
    load_env()
    init_setting()
    module_comment = [{
        "_id" : ObjectId("65d3ce2a23c0d86ac9be7ae0"),
        "module_id" : ObjectId("65ac17b1d2815b505f3e352d"),
        "message" : "this course is awesome!",
        "user_id" : ObjectId("65e4d22ba21d308eca0c531d"),
        "created_at" : 1516239022,
        "updated_at" : 1516239022
    }]
    user = {
        "_id" : ObjectId("65e4d22ba21d308eca0c531d"),
        "email" : "natnicha.rodtong@s2022.tu-chemnitz.de",
        "password" : b'MDNjMTNjNjJlOGRlNjk1NzM3OWUzNjJlMTdjMzQ4NThlZDQ0ZmNkOTk0MmVkNGM1MGNmNjc1MzAzNjI0OTI3OToxNGNlM2Q3ZjU1MzI0ZjZkOTQ5MjhkOTNiZTUyNGFhYQ==',
        "first_name" : "natnicha",
        "last_name" : "rodtong",
        "registration_number" : None,
        "course_of_study" : None,
        "semester" : 1,
        "user_roles_id" : ObjectId("65a80418fbc5863974a6d4e3")
    }
    mocker.patch('app.crud.module_comment.find_by_module_id', return_value=module_comment)
    mocker.patch('app.crud.users.get_user_by_id', return_value=user)
    module_id = "65ac17b1d2815b505f3e352d"
    response = client.get(
        url=f"/api/v1/module/{module_id}/comment",
        headers={"Content-Type":"application/json"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["module_id"] == module_id
    assert response.json()["total_items"] == len(module_comment)
    assert response.json()["items"][0]["id"] == str(module_comment[0]["_id"])
    assert response.json()["items"][0]["message"] == module_comment[0]["message"]
    assert response.json()["items"][0]["user"] == "na***a"

def test_get_module_comment_student(mocker):
    load_env()
    init_setting()
    module_comment = [{
        "_id" : ObjectId("65d3ce2a23c0d86ac9be7ae0"),
        "module_id" : ObjectId("65ac17b1d2815b505f3e352d"),
        "message" : "this course is awesome!",
        "user_id" : ObjectId("65e4d22ba21d308eca0c531d"),
        "created_at" : 1516239022,
        "updated_at" : 1516239022
    }]
    user = {
        "_id" : ObjectId("65e4d22ba21d308eca0c531d"),
        "email" : "natnicha.rodtong@s2022.tu-chemnitz.de",
        "password" : b'MDNjMTNjNjJlOGRlNjk1NzM3OWUzNjJlMTdjMzQ4NThlZDQ0ZmNkOTk0MmVkNGM1MGNmNjc1MzAzNjI0OTI3OToxNGNlM2Q3ZjU1MzI0ZjZkOTQ5MjhkOTNiZTUyNGFhYQ==',
        "first_name" : "natnicha",
        "last_name" : "rodtong",
        "registration_number" : None,
        "course_of_study" : None,
        "semester" : 1,
        "user_roles_id" : ObjectId("65a80418fbc5863974a6d4e3")
    }
    mocker.patch('app.crud.module_comment.find_by_module_id', return_value=module_comment)
    mocker.patch('app.crud.users.get_user_by_id', return_value=user)
    module_id = "65ac17b1d2815b505f3e352d"
    response = client.get(
        url=f"/api/v1/module/{module_id}/comment",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"},
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["module_id"] == module_id
    assert response.json()["total_items"] == len(module_comment)
    assert response.json()["items"][0]["id"] == str(module_comment[0]["_id"])
    assert response.json()["items"][0]["message"] == module_comment[0]["message"]
    assert response.json()["items"][0]["user"] == "na***a"

def test_get_module_comment_uni_admin(mocker):
    load_env()
    init_setting()
    module_comment = [{
        "_id" : ObjectId("65d3ce2a23c0d86ac9be7ae0"),
        "module_id" : ObjectId("65ac17b1d2815b505f3e352d"),
        "message" : "this course is awesome!",
        "user_id" : ObjectId("65e4d22ba21d308eca0c531d"),
        "created_at" : 1516239022,
        "updated_at" : 1516239022
    }]
    user = {
        "_id" : ObjectId("65e4d22ba21d308eca0c531d"),
        "email" : "natnicha.rodtong@s2022.tu-chemnitz.de",
        "password" : b'MDNjMTNjNjJlOGRlNjk1NzM3OWUzNjJlMTdjMzQ4NThlZDQ0ZmNkOTk0MmVkNGM1MGNmNjc1MzAzNjI0OTI3OToxNGNlM2Q3ZjU1MzI0ZjZkOTQ5MjhkOTNiZTUyNGFhYQ==',
        "first_name" : "natnicha",
        "last_name" : "rodtong",
        "registration_number" : None,
        "course_of_study" : None,
        "semester" : 1,
        "user_roles_id" : ObjectId("65a80418fbc5863974a6d4e3")
    }
    mocker.patch('app.crud.module_comment.find_by_module_id', return_value=module_comment)
    mocker.patch('app.crud.users.get_user_by_id', return_value=user)
    module_id = "65ac17b1d2815b505f3e352d"
    response = client.get(
        url=f"/api/v1/module/{module_id}/comment",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {uni_admin_jwt}"},
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["module_id"] == module_id
    assert response.json()["total_items"] == len(module_comment)
    assert response.json()["items"][0]["id"] == str(module_comment[0]["_id"])
    assert response.json()["items"][0]["message"] == module_comment[0]["message"]
    assert response.json()["items"][0]["user"] == "na***a"

def test_get_module_comment_sys_admin(mocker):
    load_env()
    init_setting()
    module_comment = [{
        "_id" : ObjectId("65d3ce2a23c0d86ac9be7ae0"),
        "module_id" : ObjectId("65ac17b1d2815b505f3e352d"),
        "message" : "this course is awesome!",
        "user_id" : ObjectId("65e4d22ba21d308eca0c531d"),
        "created_at" : 1516239022,
        "updated_at" : 1516239022
    }]
    user = {
        "_id" : ObjectId("65e4d22ba21d308eca0c531d"),
        "email" : "natnicha.rodtong@s2022.tu-chemnitz.de",
        "password" : b'MDNjMTNjNjJlOGRlNjk1NzM3OWUzNjJlMTdjMzQ4NThlZDQ0ZmNkOTk0MmVkNGM1MGNmNjc1MzAzNjI0OTI3OToxNGNlM2Q3ZjU1MzI0ZjZkOTQ5MjhkOTNiZTUyNGFhYQ==',
        "first_name" : "natnicha",
        "last_name" : "rodtong",
        "registration_number" : None,
        "course_of_study" : None,
        "semester" : 1,
        "user_roles_id" : ObjectId("65a80418fbc5863974a6d4e3")
    }
    mocker.patch('app.crud.module_comment.find_by_module_id', return_value=module_comment)
    mocker.patch('app.crud.users.get_user_by_id', return_value=user)
    module_id = "65ac17b1d2815b505f3e352d"
    response = client.get(
        url=f"/api/v1/module/{module_id}/comment",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {sys_admin_jwt}"},
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["module_id"] == module_id
    assert response.json()["total_items"] == len(module_comment)
    assert response.json()["items"][0]["id"] == str(module_comment[0]["_id"])
    assert response.json()["items"][0]["message"] == module_comment[0]["message"]
    assert response.json()["items"][0]["user"] == "na***a"










def test_post_module_comment_guest_unauthorized():
    load_env()
    init_setting()
    response = client.post(
        url=f"/api/v1/module/comment",
        headers={"Content-Type":"application/json"},
        json={}
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_post_module_comment_uni_admin_forbidden():
    load_env()
    init_setting()
    response = client.post(
        url=f"/api/v1/module/comment",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {uni_admin_jwt}"},
        json={}
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN

def test_post_module_comment_sys_admin_forbidden():
    load_env()
    init_setting()
    response = client.post(
        url=f"/api/v1/module/comment",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {sys_admin_jwt}"},
        json={}
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN

def test_post_module_comment_module_id_incorrect_format():
    load_env()
    init_setting()
    response = client.post(
        url="/api/v1/module/recommend",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"},
        json={
            "module_id": "abc",
            "message": "this course is awesome"
        }
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST

def test_post_module_comment_success(mocker):
    load_env()
    init_setting()
    class InsertedCursor(BaseModel):
        inserted_id: int
    mocker.patch('app.api.module.module.insert_module_comment', return_value=InsertedCursor(inserted_id=1))
    response = client.post(
        url="/api/v1/module/comment",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"},
        json={
            "module_id": "65ac17b1d2815b505f3e352d",
            "message": "this course is awesome"
        }
    )
    assert response.status_code == status.HTTP_201_CREATED











def test_delete_module_comment_guest_unauthorized():
    load_env()
    init_setting()
    module_id = "65ac17b1d2815b505f3e352d"
    response = client.delete(
        url=f"/api/v1/module/comment/{module_id}",
        headers={"Content-Type":"application/json"}
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_delete_module_comment_uni_admin_forbidden():
    load_env()
    init_setting()
    module_id = "65ac17b1d2815b505f3e352d"
    response = client.delete(
        url=f"/api/v1/module/comment/{module_id}",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {uni_admin_jwt}"},
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN

def test_delete_module_comment_sys_admin_forbidden():
    load_env()
    init_setting()
    module_id = "65ac17b1d2815b505f3e352d"
    response = client.delete(
        url=f"/api/v1/module/comment/{module_id}",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {sys_admin_jwt}"},
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN

def test_delete_module_comment_module_id_incorrect_format():
    load_env()
    init_setting()
    module_id = "abc"
    response = client.delete(
        url=f"/api/v1/module/comment/{module_id}",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST

def test_delete_module_comment_not_found(mocker):
    load_env()
    init_setting()
    mocker.patch('app.crud.module_comment.find', return_value={})
    module_id = "65ac17b1d2815b505f3e352d"
    response = client.delete(
        url=f"/api/v1/module/comment/{module_id}",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"},
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_delete_module_comment_success(mocker):
    load_env()
    init_setting()
    module_comment = [{
        "_id" : ObjectId("65d3ce2a23c0d86ac9be7ae0"),
        "module_id" : ObjectId("65ac17b1d2815b505f3e352d"),
        "message" : "this course is awesome!",
        "user_id" : ObjectId("65e4d22ba21d308eca0c531d"),
        "created_at" : 1516239022,
        "updated_at" : 1516239022
    }]
    mocker.patch('app.crud.module_comment.find', return_value=module_comment)
    mocker.patch('app.crud.module_comment.delete_one', return_value={})
    module_id = "65ac17b1d2815b505f3e352d"
    response = client.delete(
        url=f"/api/v1/module/comment/{module_id}",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"},
    )
    assert response.status_code == status.HTTP_200_OK










def test_search_module_not_found(mocker):
    load_env()
    init_setting()
    mocker.patch('app.crud.modules.count', return_value=0)
    response = client.get(
        url=f"/api/v1/module/search?term=data",
        headers={"Content-Type":"application/json"}
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_search_module_guest_success(mocker):
    load_env()
    init_setting()
    mocker.patch('app.crud.modules.count', return_value=1)
    modules = [{
        "_id" : ObjectId("65ac17b1d2815b505f3e3557"),
        "name" : "Parallel programming",
        "content" : "Content:The content of the lecture includes: Architecture and connection networks of parallel systems; Performance, runtime analysis and scalability of parallel programs; Message passing programming and implementation of typical communication patterns; Programming and synchronization techniques for shared address space with multi-threading; Coordination of parallel programs. In the exercises, programming models and techniques are practically applied to various applications. Aim:Knowledge of the architecture and network structures of parallel platforms; Knowledge of basic programming techniques for shared and distributed address spaces and their application to various applications",
        "program" : "Applied Computer Science",
        "university" : "Technische Universitat Chemnitz",
        "degree_program" : "Applied Computer Science",
        "module_code" : "561070",
        "ects" : 5,
        "degree_level" : "Master"
    }]

    mocker.patch('app.crud.modules.find', return_value=modules)
    mocker.patch('app.crud.module_recommend.count_module_recommend', return_value=58)

    suggested_modules = ["65ac1847d2815b505f3e3b96", "65ac1847d2815b505f3e3b95"]
    mocker.patch('app.owl.modules.find_suggested_modules', return_value=suggested_modules)

    response = client.get(
        url=f"/api/v1/module/search?term=programming",
        headers={"Content-Type":"application/json"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["data"]["total_results"]  == len(modules)
    assert response.json()["data"]["total_items"]  == len(modules)
    assert response.json()["data"]["items"][0]["module_name"]  == modules[0]["module_name"]
    assert response.json()["data"]["items"][0]["content"] == modules[0]["content"]
    assert response.json()["data"]["items"][0]["program"]  == modules[0]["program"]
    assert response.json()["data"]["items"][0]["university"]  == modules[0]["university"]
    assert response.json()["data"]["items"][0]["no_of_recommend"]  == 58
    assert response.json()["data"]["items"][0]["no_of_suggested_modules"]  == len(suggested_modules)
    assert response.json()["data"]["items"][0]["is_recommended"]  == False

def test_search_module_uni_admin_success(mocker):
    load_env()
    init_setting()
    mocker.patch('app.crud.modules.count', return_value=1)
    modules = [{
        "_id" : ObjectId("65ac17b1d2815b505f3e3557"),
        "name" : "Parallel programming",
        "content" : "Content:The content of the lecture includes: Architecture and connection networks of parallel systems; Performance, runtime analysis and scalability of parallel programs; Message passing programming and implementation of typical communication patterns; Programming and synchronization techniques for shared address space with multi-threading; Coordination of parallel programs. In the exercises, programming models and techniques are practically applied to various applications. Aim:Knowledge of the architecture and network structures of parallel platforms; Knowledge of basic programming techniques for shared and distributed address spaces and their application to various applications",
        "program" : "Applied Computer Science",
        "university" : "Technische Universitat Chemnitz",
        "degree_program" : "Applied Computer Science",
        "module_code" : "561070",
        "ects" : 5,
        "degree_level" : "Master"
    }]

    mocker.patch('app.crud.modules.find', return_value=modules)
    mocker.patch('app.crud.module_recommend.count_module_recommend', return_value=58)

    suggested_modules = ["65ac1847d2815b505f3e3b96", "65ac1847d2815b505f3e3b95"]
    mocker.patch('app.owl.modules.find_suggested_modules', return_value=suggested_modules)

    response = client.get(
        url=f"/api/v1/module/search?term=programming",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {uni_admin_jwt}"},
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["data"]["total_results"]  == len(modules)
    assert response.json()["data"]["total_items"]  == len(modules)
    assert response.json()["data"]["items"][0]["module_name"]  == modules[0]["module_name"]
    assert response.json()["data"]["items"][0]["content"] == modules[0]["content"]
    assert response.json()["data"]["items"][0]["program"]  == modules[0]["program"]
    assert response.json()["data"]["items"][0]["university"]  == modules[0]["university"]
    assert response.json()["data"]["items"][0]["no_of_recommend"]  == 58
    assert response.json()["data"]["items"][0]["no_of_suggested_modules"]  == len(suggested_modules)
    assert response.json()["data"]["items"][0]["is_recommended"]  == False

def test_search_module_sys_admin_success(mocker):
    load_env()
    init_setting()
    mocker.patch('app.crud.modules.count', return_value=1)
    modules = [{
        "_id" : ObjectId("65ac17b1d2815b505f3e3557"),
        "name" : "Parallel programming",
        "content" : "Content:The content of the lecture includes: Architecture and connection networks of parallel systems; Performance, runtime analysis and scalability of parallel programs; Message passing programming and implementation of typical communication patterns; Programming and synchronization techniques for shared address space with multi-threading; Coordination of parallel programs. In the exercises, programming models and techniques are practically applied to various applications. Aim:Knowledge of the architecture and network structures of parallel platforms; Knowledge of basic programming techniques for shared and distributed address spaces and their application to various applications",
        "program" : "Applied Computer Science",
        "university" : "Technische Universitat Chemnitz",
        "degree_program" : "Applied Computer Science",
        "module_code" : "561070",
        "ects" : 5,
        "degree_level" : "Master"
    }]

    mocker.patch('app.crud.modules.find', return_value=modules)
    mocker.patch('app.crud.module_recommend.count_module_recommend', return_value=58)

    suggested_modules = ["65ac1847d2815b505f3e3b96", "65ac1847d2815b505f3e3b95"]
    mocker.patch('app.owl.modules.find_suggested_modules', return_value=suggested_modules)

    response = client.get(
        url=f"/api/v1/module/search?term=programming",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {sys_admin_jwt}"},
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["data"]["total_results"]  == len(modules)
    assert response.json()["data"]["total_items"]  == len(modules)
    assert response.json()["data"]["items"][0]["module_name"]  == modules[0]["module_name"]
    assert response.json()["data"]["items"][0]["content"] == modules[0]["content"]
    assert response.json()["data"]["items"][0]["program"]  == modules[0]["program"]
    assert response.json()["data"]["items"][0]["university"]  == modules[0]["university"]
    assert response.json()["data"]["items"][0]["no_of_recommend"]  == 58
    assert response.json()["data"]["items"][0]["no_of_suggested_modules"]  == len(suggested_modules)
    assert response.json()["data"]["items"][0]["is_recommended"]  == False

def test_search_module_student_success_with_recommend(mocker):
    load_env()
    init_setting()
    mocker.patch('app.crud.modules.count', return_value=1)
    modules = [{
        "_id" : ObjectId("65ac17b1d2815b505f3e3557"),
        "name" : "Parallel programming",
        "content" : "Content:The content of the lecture includes: Architecture and connection networks of parallel systems; Performance, runtime analysis and scalability of parallel programs; Message passing programming and implementation of typical communication patterns; Programming and synchronization techniques for shared address space with multi-threading; Coordination of parallel programs. In the exercises, programming models and techniques are practically applied to various applications. Aim:Knowledge of the architecture and network structures of parallel platforms; Knowledge of basic programming techniques for shared and distributed address spaces and their application to various applications",
        "program" : "Applied Computer Science",
        "university" : "Technische Universitat Chemnitz",
        "degree_program" : "Applied Computer Science",
        "module_code" : "561070",
        "ects" : 5,
        "degree_level" : "Master"
    }]

    mocker.patch('app.crud.modules.find', return_value=modules)
    mocker.patch('app.crud.module_recommend.count_module_recommend', return_value=58)

    module_recommends = [{
        "_id" : ObjectId("65b69045a7465e50f5ef6c87"),
        "module_id" : ObjectId("65ac17b1d2815b505f3e35df"),
        "user_id" : ObjectId("65e4d22ba21d308eca0c531d"),
        "created_at" : 1516239022
    },{
        "_id" : ObjectId("65b69045a7465e50f5ef6c88"),
        "module_id" : ObjectId("65ac17b1d2815b505f3e3557"),
        "user_id" : ObjectId("65e4d22ba21d308eca0c531d"),
        "created_at" : 1516239022
    }]
    mocker.patch('app.crud.module_recommend.get_user_recommend', return_value=module_recommends)

    suggested_modules = ["65ac1847d2815b505f3e3b96", "65ac1847d2815b505f3e3b95"]
    mocker.patch('app.owl.modules.find_suggested_modules', return_value=suggested_modules)

    response = client.get(
        url=f"/api/v1/module/search?term=programming",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"},
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["data"]["total_results"]  == len(modules)
    assert response.json()["data"]["total_items"]  == len(modules)
    assert response.json()["data"]["items"][0]["module_name"]  == modules[0]["module_name"]
    assert response.json()["data"]["items"][0]["content"] == modules[0]["content"]
    assert response.json()["data"]["items"][0]["program"]  == modules[0]["program"]
    assert response.json()["data"]["items"][0]["university"]  == modules[0]["university"]
    assert response.json()["data"]["items"][0]["no_of_recommend"]  == 58
    assert response.json()["data"]["items"][0]["no_of_suggested_modules"]  == len(suggested_modules)
    assert response.json()["data"]["items"][0]["is_recommended"]  == True

def test_search_module_student_success_without_recommend(mocker):
    load_env()
    init_setting()
    mocker.patch('app.crud.modules.count', return_value=1)
    modules = [{
        "_id" : ObjectId("65ac17b1d2815b505f3e3557"),
        "name" : "Parallel programming",
        "content" : "Content:The content of the lecture includes: Architecture and connection networks of parallel systems; Performance, runtime analysis and scalability of parallel programs; Message passing programming and implementation of typical communication patterns; Programming and synchronization techniques for shared address space with multi-threading; Coordination of parallel programs. In the exercises, programming models and techniques are practically applied to various applications. Aim:Knowledge of the architecture and network structures of parallel platforms; Knowledge of basic programming techniques for shared and distributed address spaces and their application to various applications",
        "program" : "Applied Computer Science",
        "university" : "Technische Universitat Chemnitz",
        "degree_program" : "Applied Computer Science",
        "module_code" : "561070",
        "ects" : 5,
        "degree_level" : "Master"
    }]

    mocker.patch('app.crud.modules.find', return_value=modules)
    mocker.patch('app.crud.module_recommend.count_module_recommend', return_value=58)
    mocker.patch('app.crud.module_recommend.get_user_recommend', return_value=[])

    suggested_modules = ["65ac1847d2815b505f3e3b96", "65ac1847d2815b505f3e3b95"]
    mocker.patch('app.owl.modules.find_suggested_modules', return_value=suggested_modules)

    response = client.get(
        url=f"/api/v1/module/search?term=programming",
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"},
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["data"]["total_results"]  == len(modules)
    assert response.json()["data"]["total_items"]  == len(modules)
    assert response.json()["data"]["items"][0]["module_name"]  == modules[0]["module_name"]
    assert response.json()["data"]["items"][0]["content"] == modules[0]["content"]
    assert response.json()["data"]["items"][0]["program"]  == modules[0]["program"]
    assert response.json()["data"]["items"][0]["university"]  == modules[0]["university"]
    assert response.json()["data"]["items"][0]["no_of_recommend"]  == 58
    assert response.json()["data"]["items"][0]["no_of_suggested_modules"]  == len(suggested_modules)
    assert response.json()["data"]["items"][0]["is_recommended"]  == False










def test_search_advanced_module_not_found(mocker):
    load_env()
    init_setting()
    mocker.patch('app.crud.modules.advanced_count', return_value=0)
    response = client.get(
        url=f'/api/v1/module/search/advanced?term=("university":Chemnitz)',
        headers={"Content-Type":"application/json"}
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_search_advanced_guest_success(mocker):
    load_env()
    init_setting()
    mocker.patch('app.crud.modules.advanced_count', return_value=1)
    modules = [{
        "_id" : ObjectId("65ac17b1d2815b505f3e3557"),
        "name" : "Parallel programming",
        "content" : "Content:The content of the lecture includes: Architecture and connection networks of parallel systems; Performance, runtime analysis and scalability of parallel programs; Message passing programming and implementation of typical communication patterns; Programming and synchronization techniques for shared address space with multi-threading; Coordination of parallel programs. In the exercises, programming models and techniques are practically applied to various applications. Aim:Knowledge of the architecture and network structures of parallel platforms; Knowledge of basic programming techniques for shared and distributed address spaces and their application to various applications",
        "program" : "Applied Computer Science",
        "university" : "Technische Universitat Chemnitz",
        "degree_program" : "Applied Computer Science",
        "module_code" : "561070",
        "ects" : 5,
        "degree_level" : "Master"
    }]
    mocker.patch('app.crud.modules.advanced_find', return_value=modules)
    mocker.patch('app.crud.module_recommend.count_module_recommend', return_value=58)

    suggested_modules = ["65ac1847d2815b505f3e3b96", "65ac1847d2815b505f3e3b95"]
    mocker.patch('app.owl.modules.find_suggested_modules', return_value=suggested_modules)
    response = client.get(
        url=f'/api/v1/module/search/advanced?term=("university":Chemnitz)',
        headers={"Content-Type":"application/json"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["data"]["total_results"]  == len(modules)
    assert response.json()["data"]["total_items"]  == len(modules)
    assert response.json()["data"]["items"][0]["module_name"]  == modules[0]["module_name"]
    assert response.json()["data"]["items"][0]["content"] == modules[0]["content"]
    assert response.json()["data"]["items"][0]["program"]  == modules[0]["program"]
    assert response.json()["data"]["items"][0]["university"]  == modules[0]["university"]
    assert response.json()["data"]["items"][0]["no_of_recommend"]  == 58
    assert response.json()["data"]["items"][0]["no_of_suggested_modules"]  == len(suggested_modules)
    assert response.json()["data"]["items"][0]["is_recommended"]  == False

def test_search_advanced_uni_admin_success(mocker):
    load_env()
    init_setting()
    mocker.patch('app.crud.modules.advanced_count', return_value=1)
    modules = [{
        "_id" : ObjectId("65ac17b1d2815b505f3e3557"),
        "name" : "Parallel programming",
        "content" : "Content:The content of the lecture includes: Architecture and connection networks of parallel systems; Performance, runtime analysis and scalability of parallel programs; Message passing programming and implementation of typical communication patterns; Programming and synchronization techniques for shared address space with multi-threading; Coordination of parallel programs. In the exercises, programming models and techniques are practically applied to various applications. Aim:Knowledge of the architecture and network structures of parallel platforms; Knowledge of basic programming techniques for shared and distributed address spaces and their application to various applications",
        "program" : "Applied Computer Science",
        "university" : "Technische Universitat Chemnitz",
        "degree_program" : "Applied Computer Science",
        "module_code" : "561070",
        "ects" : 5,
        "degree_level" : "Master"
    }]
    mocker.patch('app.crud.modules.advanced_find', return_value=modules)
    mocker.patch('app.crud.module_recommend.count_module_recommend', return_value=58)

    suggested_modules = ["65ac1847d2815b505f3e3b96", "65ac1847d2815b505f3e3b95"]
    mocker.patch('app.owl.modules.find_suggested_modules', return_value=suggested_modules)
    response = client.get(
        url=f'/api/v1/module/search/advanced?term=("university":Chemnitz)',
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {uni_admin_jwt}"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["data"]["total_results"]  == len(modules)
    assert response.json()["data"]["total_items"]  == len(modules)
    assert response.json()["data"]["items"][0]["module_name"]  == modules[0]["module_name"]
    assert response.json()["data"]["items"][0]["content"] == modules[0]["content"]
    assert response.json()["data"]["items"][0]["program"]  == modules[0]["program"]
    assert response.json()["data"]["items"][0]["university"]  == modules[0]["university"]
    assert response.json()["data"]["items"][0]["no_of_recommend"]  == 58
    assert response.json()["data"]["items"][0]["no_of_suggested_modules"]  == len(suggested_modules)
    assert response.json()["data"]["items"][0]["is_recommended"]  == False

def test_search_advanced_sys_admin_success(mocker):
    load_env()
    init_setting()
    mocker.patch('app.crud.modules.advanced_count', return_value=1)
    modules = [{
        "_id" : ObjectId("65ac17b1d2815b505f3e3557"),
        "name" : "Parallel programming",
        "content" : "Content:The content of the lecture includes: Architecture and connection networks of parallel systems; Performance, runtime analysis and scalability of parallel programs; Message passing programming and implementation of typical communication patterns; Programming and synchronization techniques for shared address space with multi-threading; Coordination of parallel programs. In the exercises, programming models and techniques are practically applied to various applications. Aim:Knowledge of the architecture and network structures of parallel platforms; Knowledge of basic programming techniques for shared and distributed address spaces and their application to various applications",
        "program" : "Applied Computer Science",
        "university" : "Technische Universitat Chemnitz",
        "degree_program" : "Applied Computer Science",
        "module_code" : "561070",
        "ects" : 5,
        "degree_level" : "Master"
    }]
    mocker.patch('app.crud.modules.advanced_find', return_value=modules)
    mocker.patch('app.crud.module_recommend.count_module_recommend', return_value=58)

    suggested_modules = ["65ac1847d2815b505f3e3b96", "65ac1847d2815b505f3e3b95"]
    mocker.patch('app.owl.modules.find_suggested_modules', return_value=suggested_modules)
    response = client.get(
        url=f'/api/v1/module/search/advanced?term=("university":Chemnitz)',
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {sys_admin_jwt}"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["data"]["total_results"]  == len(modules)
    assert response.json()["data"]["total_items"]  == len(modules)
    assert response.json()["data"]["items"][0]["module_name"]  == modules[0]["module_name"]
    assert response.json()["data"]["items"][0]["content"] == modules[0]["content"]
    assert response.json()["data"]["items"][0]["program"]  == modules[0]["program"]
    assert response.json()["data"]["items"][0]["university"]  == modules[0]["university"]
    assert response.json()["data"]["items"][0]["no_of_recommend"]  == 58
    assert response.json()["data"]["items"][0]["no_of_suggested_modules"]  == len(suggested_modules)
    assert response.json()["data"]["items"][0]["is_recommended"]  == False

def test_search_advanced_student_success_with_recommend(mocker):
    load_env()
    init_setting()
    mocker.patch('app.crud.modules.advanced_count', return_value=1)
    modules = [{
        "_id" : ObjectId("65ac17b1d2815b505f3e3557"),
        "name" : "Parallel programming",
        "content" : "Content:The content of the lecture includes: Architecture and connection networks of parallel systems; Performance, runtime analysis and scalability of parallel programs; Message passing programming and implementation of typical communication patterns; Programming and synchronization techniques for shared address space with multi-threading; Coordination of parallel programs. In the exercises, programming models and techniques are practically applied to various applications. Aim:Knowledge of the architecture and network structures of parallel platforms; Knowledge of basic programming techniques for shared and distributed address spaces and their application to various applications",
        "program" : "Applied Computer Science",
        "university" : "Technische Universitat Chemnitz",
        "degree_program" : "Applied Computer Science",
        "module_code" : "561070",
        "ects" : 5,
        "degree_level" : "Master"
    }]
    mocker.patch('app.crud.modules.advanced_find', return_value=modules)
    mocker.patch('app.crud.module_recommend.count_module_recommend', return_value=58)

    module_recommends = [{
        "_id" : ObjectId("65b69045a7465e50f5ef6c87"),
        "module_id" : ObjectId("65ac17b1d2815b505f3e35df"),
        "user_id" : ObjectId("65e4d22ba21d308eca0c531d"),
        "created_at" : 1516239022
    },{
        "_id" : ObjectId("65b69045a7465e50f5ef6c88"),
        "module_id" : ObjectId("65ac17b1d2815b505f3e3557"),
        "user_id" : ObjectId("65e4d22ba21d308eca0c531d"),
        "created_at" : 1516239022
    }]
    mocker.patch('app.crud.module_recommend.get_user_recommend', return_value=module_recommends)

    suggested_modules = ["65ac1847d2815b505f3e3b96", "65ac1847d2815b505f3e3b95"]
    mocker.patch('app.owl.modules.find_suggested_modules', return_value=suggested_modules)
    response = client.get(
        url=f'/api/v1/module/search/advanced?term=("university":Chemnitz)',
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["data"]["total_results"]  == len(modules)
    assert response.json()["data"]["total_items"]  == len(modules)
    assert response.json()["data"]["items"][0]["module_name"]  == modules[0]["module_name"]
    assert response.json()["data"]["items"][0]["content"] == modules[0]["content"]
    assert response.json()["data"]["items"][0]["program"]  == modules[0]["program"]
    assert response.json()["data"]["items"][0]["university"]  == modules[0]["university"]
    assert response.json()["data"]["items"][0]["no_of_recommend"]  == 58
    assert response.json()["data"]["items"][0]["no_of_suggested_modules"]  == len(suggested_modules)
    assert response.json()["data"]["items"][0]["is_recommended"]  == True

def test_search_advanced_student_success_without_recommend(mocker):
    load_env()
    init_setting()
    mocker.patch('app.crud.modules.advanced_count', return_value=1)
    modules = [{
        "_id" : ObjectId("65ac17b1d2815b505f3e3557"),
        "name" : "Parallel programming",
        "content" : "Content:The content of the lecture includes: Architecture and connection networks of parallel systems; Performance, runtime analysis and scalability of parallel programs; Message passing programming and implementation of typical communication patterns; Programming and synchronization techniques for shared address space with multi-threading; Coordination of parallel programs. In the exercises, programming models and techniques are practically applied to various applications. Aim:Knowledge of the architecture and network structures of parallel platforms; Knowledge of basic programming techniques for shared and distributed address spaces and their application to various applications",
        "program" : "Applied Computer Science",
        "university" : "Technische Universitat Chemnitz",
        "degree_program" : "Applied Computer Science",
        "module_code" : "561070",
        "ects" : 5,
        "degree_level" : "Master"
    }]
    mocker.patch('app.crud.modules.advanced_find', return_value=modules)
    mocker.patch('app.crud.module_recommend.count_module_recommend', return_value=58)
    mocker.patch('app.crud.module_recommend.get_user_recommend', return_value=[])

    suggested_modules = ["65ac1847d2815b505f3e3b96", "65ac1847d2815b505f3e3b95"]
    mocker.patch('app.owl.modules.find_suggested_modules', return_value=suggested_modules)
    response = client.get(
        url=f'/api/v1/module/search/advanced?term=("university":Chemnitz)',
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["data"]["total_results"]  == len(modules)
    assert response.json()["data"]["total_items"]  == len(modules)
    assert response.json()["data"]["items"][0]["module_name"]  == modules[0]["module_name"]
    assert response.json()["data"]["items"][0]["content"] == modules[0]["content"]
    assert response.json()["data"]["items"][0]["program"]  == modules[0]["program"]
    assert response.json()["data"]["items"][0]["university"]  == modules[0]["university"]
    assert response.json()["data"]["items"][0]["no_of_recommend"]  == 58
    assert response.json()["data"]["items"][0]["no_of_suggested_modules"]  == len(suggested_modules)
    assert response.json()["data"]["items"][0]["is_recommended"]  == False










def test_get_module_module_id_incorrect_format():
    load_env()
    init_setting()
    module_id = 'abc'
    response = client.get(
        url=f'/api/v1/module/{module_id}',
        headers={"Content-Type":"application/json"}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST

def test_get_module_guest_success(mocker):
    load_env()
    init_setting()
    modules = {
        "_id" : ObjectId("65ac17b1d2815b505f3e352d"),
        "name" : "Parallel programming",
        "content" : "Content:The content of the lecture includes: Architecture and connection networks of parallel systems; Performance, runtime analysis and scalability of parallel programs; Message passing programming and implementation of typical communication patterns; Programming and synchronization techniques for shared address space with multi-threading; Coordination of parallel programs. In the exercises, programming models and techniques are practically applied to various applications. Aim:Knowledge of the architecture and network structures of parallel platforms; Knowledge of basic programming techniques for shared and distributed address spaces and their application to various applications",
        "program" : "Applied Computer Science",
        "university" : "Technische Universitat Chemnitz",
        "degree_program" : "Applied Computer Science",
        "module_code" : "561070",
        "ects" : 5,
        "degree_level" : "Master"
    }
    mocker.patch('app.crud.modules.find_one', return_value=modules)
    mocker.patch('app.crud.module_recommend.count_module_recommend', return_value=58)
    suggested_modules = ["65ac1847d2815b505f3e3b96", "65ac1847d2815b505f3e3b95"]
    mocker.patch('app.owl.modules.find_suggested_modules', return_value=suggested_modules)
    module_id = '65ac17b1d2815b505f3e352d'
    response = client.get(
        url=f'/api/v1/module/{module_id}',
        headers={"Content-Type":"application/json"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["data"][0]["module_name"]  == modules["module_name"]
    assert response.json()["data"][0]["content"] == modules["content"]
    assert response.json()["data"][0]["program"]  == modules["program"]
    assert response.json()["data"][0]["university"]  == modules["university"]
    assert response.json()["data"][0]["no_of_recommend"]  == 58
    assert response.json()["data"][0]["no_of_suggested_modules"]  == len(suggested_modules)
    assert response.json()["data"][0]["is_recommended"]  == False

def test_get_module_student_with_recommend(mocker):
    load_env()
    init_setting()
    modules = {
        "_id" : ObjectId("65ac17b1d2815b505f3e352d"),
        "name" : "Parallel programming",
        "content" : "Content:The content of the lecture includes: Architecture and connection networks of parallel systems; Performance, runtime analysis and scalability of parallel programs; Message passing programming and implementation of typical communication patterns; Programming and synchronization techniques for shared address space with multi-threading; Coordination of parallel programs. In the exercises, programming models and techniques are practically applied to various applications. Aim:Knowledge of the architecture and network structures of parallel platforms; Knowledge of basic programming techniques for shared and distributed address spaces and their application to various applications",
        "program" : "Applied Computer Science",
        "university" : "Technische Universitat Chemnitz",
        "degree_program" : "Applied Computer Science",
        "module_code" : "561070",
        "ects" : 5,
        "degree_level" : "Master"
    }
    mocker.patch('app.crud.modules.find_one', return_value=modules)
    mocker.patch('app.crud.module_recommend.count_module_recommend', return_value=58)
    module_recommends = [{
        "_id" : ObjectId("65b69045a7465e50f5ef6c87"),
        "module_id" : ObjectId("65ac17b1d2815b505f3e35df"),
        "user_id" : ObjectId("65e4d22ba21d308eca0c531d"),
        "created_at" : 1516239022
    },{
        "_id" : ObjectId("65b69045a7465e50f5ef6c88"),
        "module_id" : ObjectId("65ac17b1d2815b505f3e352d"),
        "user_id" : ObjectId("65e4d22ba21d308eca0c531d"),
        "created_at" : 1516239022
    }]
    mocker.patch('app.crud.module_recommend.get_user_recommend', return_value=module_recommends)
    suggested_modules = ["65ac1847d2815b505f3e3b96", "65ac1847d2815b505f3e3b95"]
    mocker.patch('app.owl.modules.find_suggested_modules', return_value=suggested_modules)
    module_id = '65ac17b1d2815b505f3e352d'
    response = client.get(
        url=f'/api/v1/module/{module_id}',
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["data"][0]["module_name"]  == modules["module_name"]
    assert response.json()["data"][0]["content"] == modules["content"]
    assert response.json()["data"][0]["program"]  == modules["program"]
    assert response.json()["data"][0]["university"]  == modules["university"]
    assert response.json()["data"][0]["no_of_recommend"]  == 58
    assert response.json()["data"][0]["no_of_suggested_modules"]  == len(suggested_modules)
    assert response.json()["data"][0]["is_recommended"]  == True

def test_get_module_student_without_recommend(mocker):
    load_env()
    init_setting()
    modules = {
        "_id" : ObjectId("65ac17b1d2815b505f3e352d"),
        "name" : "Parallel programming",
        "content" : "Content:The content of the lecture includes: Architecture and connection networks of parallel systems; Performance, runtime analysis and scalability of parallel programs; Message passing programming and implementation of typical communication patterns; Programming and synchronization techniques for shared address space with multi-threading; Coordination of parallel programs. In the exercises, programming models and techniques are practically applied to various applications. Aim:Knowledge of the architecture and network structures of parallel platforms; Knowledge of basic programming techniques for shared and distributed address spaces and their application to various applications",
        "program" : "Applied Computer Science",
        "university" : "Technische Universitat Chemnitz",
        "degree_program" : "Applied Computer Science",
        "module_code" : "561070",
        "ects" : 5,
        "degree_level" : "Master"
    }
    mocker.patch('app.crud.modules.find_one', return_value=modules)
    mocker.patch('app.crud.module_recommend.count_module_recommend', return_value=58)
    mocker.patch('app.crud.module_recommend.get_user_recommend', return_value=[])
    suggested_modules = ["65ac1847d2815b505f3e3b96", "65ac1847d2815b505f3e3b95"]
    mocker.patch('app.owl.modules.find_suggested_modules', return_value=suggested_modules)
    module_id = '65ac17b1d2815b505f3e352d'
    response = client.get(
        url=f'/api/v1/module/{module_id}',
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["data"][0]["module_name"]  == modules["module_name"]
    assert response.json()["data"][0]["content"] == modules["content"]
    assert response.json()["data"][0]["program"]  == modules["program"]
    assert response.json()["data"][0]["university"]  == modules["university"]
    assert response.json()["data"][0]["no_of_recommend"]  == 58
    assert response.json()["data"][0]["no_of_suggested_modules"]  == len(suggested_modules)
    assert response.json()["data"][0]["is_recommended"]  == False










def test_get_suggested_module_module_id_incorrect_format():
    load_env()
    init_setting()
    module_id = 'abc'
    response = client.get(
        url=f'/api/v1/module/{module_id}/suggested',
        headers={"Content-Type":"application/json"}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST

def test_get_suggested_module_module_not_found(mocker):
    load_env()
    init_setting()
    module_id = '65ac17b1d2815b505f3e352d'
    mocker.patch('app.crud.modules.count_by_id', return_value=0)
    response = client.get(
        url=f'/api/v1/module/{module_id}/suggested',
        headers={"Content-Type":"application/json"}
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_get_suggested_module_no_suggested_module_found(mocker):
    load_env()
    init_setting()
    module_id = '65ac17b1d2815b505f3e352d'
    mocker.patch('app.crud.modules.count_by_id', return_value=1)
    mocker.patch('app.owl.modules.find_suggested_modules', return_value=[])
    response = client.get(
        url=f'/api/v1/module/{module_id}/suggested',
        headers={"Content-Type":"application/json"}
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND
