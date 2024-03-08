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










def test_post_module_guest_unauthorized():
    load_env()
    init_setting()
    response = client.post(
        url=f'/api/v1/module',
        headers={"Content-Type":"application/xml"}
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_post_module_student_forbidden():
    load_env()
    init_setting()
    response = client.post(
        url=f'/api/v1/module',
        headers={"Content-Type":"application/xml", "Authorization": f"Bearer {student_jwt}"}
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN

def test_post_module_unsupport_media_type():
    load_env()
    init_setting()
    response = client.post(
        url=f'/api/v1/module',
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {uni_admin_jwt}"},
        json={}
    )
    assert response.status_code == status.HTTP_415_UNSUPPORTED_MEDIA_TYPE

def test_post_module_unprocessable_entity():
    load_env()
    init_setting()
    response = client.post(
        url=f'/api/v1/module',
        headers={"Content-Type":"application/xml", "Authorization": f"Bearer {uni_admin_jwt}"},
        data='''<?xml version="1.0" encoding="UTF-8"?>
<dat>
    <module>
        <module_name>Artificial Intelligence for Data Analysis</module_name>
        <degree_program>Engineering and Management</degree_program>
        <degree_level>Master</degree_level>
        <university>Technische Universitat Chemnitz</university>
        <module_code>2GI018n</module_code>
        <content>AI-assisted data analysis is a process of discovering patterns and models, described by rules or other human- understandable representation formalisms. The most important step in this process is data mining, performed by using methods, techniques and tools for automated constructions of patterns and models from data. The course objectives are to (a) introduce the basics of data mining, (b) outline the process of knowledge discovery in databases and the CRISP-DM methodology, (c) present the methodology for result evaluation, (d) present selected data mining methods and techniques by cases relevant for engineering and management, and (e) empower the students with the skills for practical use of selected data mining tools. The students will master the basics of data preprocessing, data mining and knowledge discovery and will be capable of using selected data mining tools and results evaluation methods in practice. Basic knowledge of mathematics, computer science and informatics is requested. Knowledge and understanding: Mastering of selected Artificial Intelligence methods and techniques for data analysis, the capability of data preprocessing, practical use of selected data mining techniques, and capability of using and interpreting the methods for result evaluation. D. Mladenić, N. Lavrač, M. Bohanec, S. Moyle (eds.) Data Mining and Decision Support: Integration and Collaboration. Kluwer 2003. ISBN 1-4020-7388-7 Catalogue E-version J.H. Witten, E. Frank, M.A. Hall: Data Mining: Practical Machine Learning Tools and Techniques (Third Edition), Morgan Kaufmann, 2011. ISBN 978-0-12-374856-0 Katalog E-version M. Berthold (ed.), Bisociative Knowledge Discovery, Springer, 2012. ISBN 978-3-642-31829-0 Katalog E-version J. Fuernkranz, D. Gamberger, N. Lavrač: Foundations of Rule Learning. Springer, 2012. ISBN 978-3-540-75196-0 Catalogue E-version Selected chapters from the following books: Competence evaluation: • By written exam we evaluate the basic knowledge of artificial intelligence for data analysis and the knowledge discovery process following the CRISP-DM methodology • By seminar or project work and its oral defense we evaluate practical competencies of using the selected data analysis tools and methods for results evaluation 50/50 Prof. Dr. Nada Lavrač, full professor in the field of Computer Science Principal education and research areas: Knowledge technologies, Artificial Intelligence, machine learning, data mining and text mining, relational data mining and inductive logic programming, combining data mining and decision support, computational creativity, text mining, knowledge management, marketing, and virtual enterprises, applications of machine learning and data mining techniques in biomedicine, healthcare, life sciences, marketing and media analysis Professional career: From 1978 employed at Institute “Jožef Stefan”; founder and in 2014-2020 Head of Department of Knowledge Technologies; since 2002 research councilor IJS; since 2007 full professor at University of Nova Gorica and International Postgraduate School Jožef Stefan; 1996-1998 vice-president of ECCAI (European Coordination Committee for AI); member of Slovenian AI Society SLAIS, 2022-2024 ELLIS Board member. Publications and achievements: author of numerous scientific papers, author of four scientific monographs, editor of numerous books and proceedings, author of two outstanding scientific achievements (2011 and 2012), coordinator of two EU projects, Slovenian principal investigator of over ten EU projects worth over 4 Mio EUR. Awards: 2022 Zois award for outstanding research achievements in machine learning, 2020 ELLIS Fellow in machine learning, 2013 Zois recognition award for important scientific contributions to intelligent data analysis, 2007 ECCAI/EURAI Fellow Award for pioneering research and advances in the field of Artificial Intelligence in Europe, 1998 Ambassador of Science of the Republic of Slovenia for outstanding research and contribution to international recognition of Slovenian science, 1986 National award for research excellence (Boris Kidrič Fund Award) for research in knowledge synthesis and qualitative modeling (system KARDIO for ECG diagnosis of cardiac arrhythmias, later published as monograph Kardio: A Study in Deep and Qualitative Knowledge for Expert Systems, MIT Press, 1989, coauthor). Prof. Dr. Aneta Trajanov (former Trajanov), Associate professor in the field of computer science and informatics at the University of Nova Gorica and a director of the Masters programme Management and Engineering, is an expert in the area of artificial intelligence. She completed her PhD on machine learning in 2010 at the Jozef Stefan International Postgraduate School. From 2005 until 2022 she was a researcher at the Department of Knowledge Technologies at the Jozef Stefan Institute. She completed her post-doc at the Ruđer Boškovič Institute, Zagreb, Croatia in 2015/2016. Her main research interests are machine learning and knowledge discovery from environmental data, decision support, inductive logic programming and equation discovery. She has worked on many European, as well as national, projects in the area of agroecology, where she applied different machine learning methods for analyzing (agro)ecological data. Since November 2022 she works as a Director of Artificial Intelligence in the company MarineXchange, which develops software for the cruise industry. Selected bibliography • Lavrač N., Džeroski, S.: Inductive Logic Programming: Techniques and Applications. Ellis Horwood, 1994. • Lavrač N., Kavšek, B., Flach P. A., Todorovski, L.: Subgroup discovery with CN2-SD. Journal of Machine Learning Research, 5 (2004), 153-188. • Železny F., Lavrač N.: Propositionalization-based relational subgroup discovery with RSD. Machine Learning 62 :1-2 (2006), 33-63. • Fuernkranz J., Gamberger D., Lavrač N.: Foundations of Rule Learning. Springer 2012. • Lavrač N., Podpečan V., Robnik-Šikonja M. Representation Learning: Propositionalization and Embeddings. Springer 2021. • Sandén, Taru, Wawra, Anna, Berthold, Helene, Miloczki, Julia, Schweinzer, Agnes, Gschmeidler, Brigitte, Spiegel, Heide, Debeljak, Marko, Trajanov, Aneta. TeaTime4Schools : using data mining techniques to model litter decomposition in austrian urban school soils. Frontiers in ecology and evolution. 2021, vol. 9, str. 703794-1-703794-9, ilustr. ISSN 2296-701X. DOI: 10.3389/fevo.2021.703794. [COBISS.SI-ID 68232707] • Iannetta, Pietro, Debeljak, Marko, Trajanov, Aneta, et al. A multifunctional solution for wicked problems : value-chain wide facilitation of legumes cultivated at bioregional scales is necessary to address the climate-biodiversity-nutrition nexus. Frontiers in sustainable food systems. 2021, vol. 5, str. 692137-1-692137-8. ISSN 2571-581X. DOI: 10.3389/fsufs.2021.692137. [COBISS.SI-ID 72049155] • Wall, David P., Delgado, Antonio, O'sullivan, Lilian, Creamer, Rachel, Trajanov, Aneta, Kuzmanovski, Vladimir, Henricksen, Christian B., Debeljak, Marko. A decision support model for assessing the water regulation and purification potential of agricultural soils across Europe. Frontiers in sustainable food systems. 2020, vol. 4, str. 115-1-115-11. ISSN 2571-581X. DOI: 10.3389/fsufs.2020.00115. [COBISS.SI-ID 21854979] • Sandén, Taru, Trajanov, Aneta, Spiegel, Heide, Kuzmanovski, Vladimir, Saby, Nicolas, Picaud, Calypso, Henriksen, Christian B. H., Debeljak, Marko. Development of an agricultural primary productivity decision support model : a case study in France. Frontiers in environmental science. 2019, vol. 7, str. 58-1-58-13. ISSN 2296-665X. DOI: 10.3389/fenvs.2019.00058. [COBISS.SI-ID 32342311], • Leeuwen, Jeroen P. Van, Debeljak, Marko, Kuzmanovski, Vladimir, Trajanov, Aneta, et al. Modeling of soil functions for assessing soil quality : soil biodiversity and habitat provisioning. Frontiers in environmental science. 2019, vol. 7, str. 113-1-113-13. ISSN 2296-665X. DOI: 10.3389/fenvs.2019.00113. [COBISS.SI-ID 32581927]</content>
        <ects>6</ects>
        <module_type>elective</module_type>
    </module>
</data>'''
    )
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY










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

def test_get_suggested_module_guest_success(mocker):
    load_env()
    init_setting()
    module_id = '65ac17b1d2815b505f3e352d'
    mocker.patch('app.crud.modules.count_by_id', return_value=1)

    suggested_modules = ["65ac1847d2815b505f3e3b96", "65ac1847d2815b505f3e3b95"]
    mocker.patch('app.owl.modules.find_suggested_modules', return_value=suggested_modules)
    
    modules = [{
        "_id" : ObjectId("65ac1847d2815b505f3e3b95"),
        "name" : "Pragmatics II",
        "content" : "• Students are acquinted with major topics in the domain of pragmatics which fall outside the scope of Pragmatics I. • The course focuses on current research in Pragmatics and stimulates original student work in the field. Formal foundations of linguistic theory; Pragmatics I This course is intended as a continuation of Pragmatics I which serves as an introduction to the field. In more formal detail, students are acquinted with current trends in topics like implicature, presupposition, experimental pragmatics, context dependence, speech acts. Students acquire in-depth amalyses of language phenomena from the pragmatic and semantic-pragmatic domain within the following topics: presupposition; context dependence and contextual veriables; acquiring pragmatics rules and processing pragmatic inferences; speech acts. Horn, L. in G. Ward (eds.) 2004. The handbook of pragmatics. Blackwell. Kadmon, Nirit. 2001. Formal Pragmatics: Semantics, Pragmatics, Presupposition, and Focus. Oxford: Blackwell Publishers. Levinson, S. 2000. Presumptive meanings: The theory of generalized conversational implicature. Cambridge, MA: MIT Press. Novek, I. in D. Sperber (eds). 2006. Experimental pragmatics. Palgrave Macmillan. Sauerland, U. in K. Yatsushiro (eds.). 2009. Semantics and Pragmatics. Palgrave Macmillan. Članki iz relevantnih znanstvenih revij, ki obravnavajo pragmatično področje. • attendance and active class participation; • two homework assignments; • final written exam. Associate professor of Linguistics at the University of Nova Gorica. STEPANOV, Arthur, STATEVA, Penka. When QR disobeys superiority. Linguistic inquiry, ISSN 0024-3892, 2009, vol. 40, no. 1, str. 176-185. [COBISS.SI-ID 1130491] STEPANOV, Arthur, STATEVA, Penka. Successive cyclicity as residual wh-scope marking. Lingua, ISSN 0024-3841. [Print ed.], dec. 2006, vol. 116, no. 12, str. 2107-2153. STATEVA, Penka. On the status of parasitic gaps in Bulgarian. Journal of Slavic linguistics, ISSN 1068-2090, 2005, vol. 13, no. 1, str. 137-155. [COBISS.SI-ID 1154811] STATEVA, Penka. Possessive clitics and the structure of nominal expressions. Lingua, ISSN 0024-3841. [Print ed.], Aug. 2002, vol. 112, no. 8, str. 647-690, doi: 10.1016/S0024-3841(01)00066-3. [COBISS.SI-ID 1150203]",
        "url" : "https://www.ung.si/en/schools/school-of-humanities/programmes/2SI2/2022/2SL2042/2023/",
        "university" : "University of Nova Gorica",
        "degree_program" : "SL studies - Linguistics",
        "module_code" : "2SL2042",
        "ects" : 3,
        "year" : "2. year",
        "degree_level" : "Master"
    },{
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
    mocker.patch('app.crud.modules.find_many_by_id_list', return_value=modules)
    mocker.patch('app.crud.module_recommend.count_module_recommend', return_value=58)
    response = client.get(
        url=f'/api/v1/module/{module_id}/suggested',
        headers={"Content-Type":"application/json"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["data"]["requested_module_id"]  == module_id
    assert response.json()["data"]["total_suggested_module_items"]  == len(suggested_modules)
    assert response.json()["data"]["suggested_module_items"][0]["module_name"]  == modules[0]["module_name"]
    assert response.json()["data"]["suggested_module_items"][0]["content"] == modules[0]["content"]
    assert response.json()["data"]["suggested_module_items"][0]["university"]  == modules[0]["university"]
    assert response.json()["data"]["suggested_module_items"][0]["no_of_recommend"]  == 58
    assert response.json()["data"]["suggested_module_items"][0]["no_of_suggested_modules"]  == len(suggested_modules)
    assert response.json()["data"]["suggested_module_items"][0]["is_recommended"]  == False

def test_get_suggested_module_uni_admin_success(mocker):
    load_env()
    init_setting()
    module_id = '65ac17b1d2815b505f3e352d'
    mocker.patch('app.crud.modules.count_by_id', return_value=1)

    suggested_modules = ["65ac1847d2815b505f3e3b96", "65ac1847d2815b505f3e3b95"]
    mocker.patch('app.owl.modules.find_suggested_modules', return_value=suggested_modules)
    
    modules = [{
        "_id" : ObjectId("65ac1847d2815b505f3e3b95"),
        "name" : "Pragmatics II",
        "content" : "• Students are acquinted with major topics in the domain of pragmatics which fall outside the scope of Pragmatics I. • The course focuses on current research in Pragmatics and stimulates original student work in the field. Formal foundations of linguistic theory; Pragmatics I This course is intended as a continuation of Pragmatics I which serves as an introduction to the field. In more formal detail, students are acquinted with current trends in topics like implicature, presupposition, experimental pragmatics, context dependence, speech acts. Students acquire in-depth amalyses of language phenomena from the pragmatic and semantic-pragmatic domain within the following topics: presupposition; context dependence and contextual veriables; acquiring pragmatics rules and processing pragmatic inferences; speech acts. Horn, L. in G. Ward (eds.) 2004. The handbook of pragmatics. Blackwell. Kadmon, Nirit. 2001. Formal Pragmatics: Semantics, Pragmatics, Presupposition, and Focus. Oxford: Blackwell Publishers. Levinson, S. 2000. Presumptive meanings: The theory of generalized conversational implicature. Cambridge, MA: MIT Press. Novek, I. in D. Sperber (eds). 2006. Experimental pragmatics. Palgrave Macmillan. Sauerland, U. in K. Yatsushiro (eds.). 2009. Semantics and Pragmatics. Palgrave Macmillan. Članki iz relevantnih znanstvenih revij, ki obravnavajo pragmatično področje. • attendance and active class participation; • two homework assignments; • final written exam. Associate professor of Linguistics at the University of Nova Gorica. STEPANOV, Arthur, STATEVA, Penka. When QR disobeys superiority. Linguistic inquiry, ISSN 0024-3892, 2009, vol. 40, no. 1, str. 176-185. [COBISS.SI-ID 1130491] STEPANOV, Arthur, STATEVA, Penka. Successive cyclicity as residual wh-scope marking. Lingua, ISSN 0024-3841. [Print ed.], dec. 2006, vol. 116, no. 12, str. 2107-2153. STATEVA, Penka. On the status of parasitic gaps in Bulgarian. Journal of Slavic linguistics, ISSN 1068-2090, 2005, vol. 13, no. 1, str. 137-155. [COBISS.SI-ID 1154811] STATEVA, Penka. Possessive clitics and the structure of nominal expressions. Lingua, ISSN 0024-3841. [Print ed.], Aug. 2002, vol. 112, no. 8, str. 647-690, doi: 10.1016/S0024-3841(01)00066-3. [COBISS.SI-ID 1150203]",
        "url" : "https://www.ung.si/en/schools/school-of-humanities/programmes/2SI2/2022/2SL2042/2023/",
        "university" : "University of Nova Gorica",
        "degree_program" : "SL studies - Linguistics",
        "module_code" : "2SL2042",
        "ects" : 3,
        "year" : "2. year",
        "degree_level" : "Master"
    },{
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
    mocker.patch('app.crud.modules.find_many_by_id_list', return_value=modules)
    mocker.patch('app.crud.module_recommend.count_module_recommend', return_value=58)
    response = client.get(
        url=f'/api/v1/module/{module_id}/suggested',
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {uni_admin_jwt}"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["data"]["requested_module_id"]  == module_id
    assert response.json()["data"]["total_suggested_module_items"]  == len(suggested_modules)
    assert response.json()["data"]["suggested_module_items"][0]["module_name"]  == modules[0]["module_name"]
    assert response.json()["data"]["suggested_module_items"][0]["content"] == modules[0]["content"]
    assert response.json()["data"]["suggested_module_items"][0]["university"]  == modules[0]["university"]
    assert response.json()["data"]["suggested_module_items"][0]["no_of_recommend"]  == 58
    assert response.json()["data"]["suggested_module_items"][0]["no_of_suggested_modules"]  == len(suggested_modules)
    assert response.json()["data"]["suggested_module_items"][0]["is_recommended"]  == False

def test_get_suggested_module_sys_admin_success(mocker):
    load_env()
    init_setting()
    module_id = '65ac17b1d2815b505f3e352d'
    mocker.patch('app.crud.modules.count_by_id', return_value=1)

    suggested_modules = ["65ac1847d2815b505f3e3b96", "65ac1847d2815b505f3e3b95"]
    mocker.patch('app.owl.modules.find_suggested_modules', return_value=suggested_modules)
    
    modules = [{
        "_id" : ObjectId("65ac1847d2815b505f3e3b95"),
        "name" : "Pragmatics II",
        "content" : "• Students are acquinted with major topics in the domain of pragmatics which fall outside the scope of Pragmatics I. • The course focuses on current research in Pragmatics and stimulates original student work in the field. Formal foundations of linguistic theory; Pragmatics I This course is intended as a continuation of Pragmatics I which serves as an introduction to the field. In more formal detail, students are acquinted with current trends in topics like implicature, presupposition, experimental pragmatics, context dependence, speech acts. Students acquire in-depth amalyses of language phenomena from the pragmatic and semantic-pragmatic domain within the following topics: presupposition; context dependence and contextual veriables; acquiring pragmatics rules and processing pragmatic inferences; speech acts. Horn, L. in G. Ward (eds.) 2004. The handbook of pragmatics. Blackwell. Kadmon, Nirit. 2001. Formal Pragmatics: Semantics, Pragmatics, Presupposition, and Focus. Oxford: Blackwell Publishers. Levinson, S. 2000. Presumptive meanings: The theory of generalized conversational implicature. Cambridge, MA: MIT Press. Novek, I. in D. Sperber (eds). 2006. Experimental pragmatics. Palgrave Macmillan. Sauerland, U. in K. Yatsushiro (eds.). 2009. Semantics and Pragmatics. Palgrave Macmillan. Članki iz relevantnih znanstvenih revij, ki obravnavajo pragmatično področje. • attendance and active class participation; • two homework assignments; • final written exam. Associate professor of Linguistics at the University of Nova Gorica. STEPANOV, Arthur, STATEVA, Penka. When QR disobeys superiority. Linguistic inquiry, ISSN 0024-3892, 2009, vol. 40, no. 1, str. 176-185. [COBISS.SI-ID 1130491] STEPANOV, Arthur, STATEVA, Penka. Successive cyclicity as residual wh-scope marking. Lingua, ISSN 0024-3841. [Print ed.], dec. 2006, vol. 116, no. 12, str. 2107-2153. STATEVA, Penka. On the status of parasitic gaps in Bulgarian. Journal of Slavic linguistics, ISSN 1068-2090, 2005, vol. 13, no. 1, str. 137-155. [COBISS.SI-ID 1154811] STATEVA, Penka. Possessive clitics and the structure of nominal expressions. Lingua, ISSN 0024-3841. [Print ed.], Aug. 2002, vol. 112, no. 8, str. 647-690, doi: 10.1016/S0024-3841(01)00066-3. [COBISS.SI-ID 1150203]",
        "url" : "https://www.ung.si/en/schools/school-of-humanities/programmes/2SI2/2022/2SL2042/2023/",
        "university" : "University of Nova Gorica",
        "degree_program" : "SL studies - Linguistics",
        "module_code" : "2SL2042",
        "ects" : 3,
        "year" : "2. year",
        "degree_level" : "Master"
    },{
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
    mocker.patch('app.crud.modules.find_many_by_id_list', return_value=modules)
    mocker.patch('app.crud.module_recommend.count_module_recommend', return_value=58)
    response = client.get(
        url=f'/api/v1/module/{module_id}/suggested',
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {sys_admin_jwt}"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["data"]["requested_module_id"]  == module_id
    assert response.json()["data"]["total_suggested_module_items"]  == len(suggested_modules)
    assert response.json()["data"]["suggested_module_items"][0]["module_name"]  == modules[0]["module_name"]
    assert response.json()["data"]["suggested_module_items"][0]["content"] == modules[0]["content"]
    assert response.json()["data"]["suggested_module_items"][0]["university"]  == modules[0]["university"]
    assert response.json()["data"]["suggested_module_items"][0]["no_of_recommend"]  == 58
    assert response.json()["data"]["suggested_module_items"][0]["no_of_suggested_modules"]  == len(suggested_modules)
    assert response.json()["data"]["suggested_module_items"][0]["is_recommended"]  == False

def test_get_suggested_module_student_success_with_recommend(mocker):
    load_env()
    init_setting()
    module_id = '65ac17b1d2815b505f3e352d'
    mocker.patch('app.crud.modules.count_by_id', return_value=1)

    suggested_modules = ["65ac1847d2815b505f3e3b96", "65ac1847d2815b505f3e3b95"]
    mocker.patch('app.owl.modules.find_suggested_modules', return_value=suggested_modules)
    
    modules = [{
        "_id" : ObjectId("65ac1847d2815b505f3e3b96"),
        "name" : "Pragmatics II",
        "content" : "• Students are acquinted with major topics in the domain of pragmatics which fall outside the scope of Pragmatics I. • The course focuses on current research in Pragmatics and stimulates original student work in the field. Formal foundations of linguistic theory; Pragmatics I This course is intended as a continuation of Pragmatics I which serves as an introduction to the field. In more formal detail, students are acquinted with current trends in topics like implicature, presupposition, experimental pragmatics, context dependence, speech acts. Students acquire in-depth amalyses of language phenomena from the pragmatic and semantic-pragmatic domain within the following topics: presupposition; context dependence and contextual veriables; acquiring pragmatics rules and processing pragmatic inferences; speech acts. Horn, L. in G. Ward (eds.) 2004. The handbook of pragmatics. Blackwell. Kadmon, Nirit. 2001. Formal Pragmatics: Semantics, Pragmatics, Presupposition, and Focus. Oxford: Blackwell Publishers. Levinson, S. 2000. Presumptive meanings: The theory of generalized conversational implicature. Cambridge, MA: MIT Press. Novek, I. in D. Sperber (eds). 2006. Experimental pragmatics. Palgrave Macmillan. Sauerland, U. in K. Yatsushiro (eds.). 2009. Semantics and Pragmatics. Palgrave Macmillan. Članki iz relevantnih znanstvenih revij, ki obravnavajo pragmatično področje. • attendance and active class participation; • two homework assignments; • final written exam. Associate professor of Linguistics at the University of Nova Gorica. STEPANOV, Arthur, STATEVA, Penka. When QR disobeys superiority. Linguistic inquiry, ISSN 0024-3892, 2009, vol. 40, no. 1, str. 176-185. [COBISS.SI-ID 1130491] STEPANOV, Arthur, STATEVA, Penka. Successive cyclicity as residual wh-scope marking. Lingua, ISSN 0024-3841. [Print ed.], dec. 2006, vol. 116, no. 12, str. 2107-2153. STATEVA, Penka. On the status of parasitic gaps in Bulgarian. Journal of Slavic linguistics, ISSN 1068-2090, 2005, vol. 13, no. 1, str. 137-155. [COBISS.SI-ID 1154811] STATEVA, Penka. Possessive clitics and the structure of nominal expressions. Lingua, ISSN 0024-3841. [Print ed.], Aug. 2002, vol. 112, no. 8, str. 647-690, doi: 10.1016/S0024-3841(01)00066-3. [COBISS.SI-ID 1150203]",
        "url" : "https://www.ung.si/en/schools/school-of-humanities/programmes/2SI2/2022/2SL2042/2023/",
        "university" : "University of Nova Gorica",
        "degree_program" : "SL studies - Linguistics",
        "module_code" : "2SL2042",
        "ects" : 3,
        "year" : "2. year",
        "degree_level" : "Master"
    },{
        "_id" : ObjectId("65ac1847d2815b505f3e3b95"),
        "name" : "Parallel programming",
        "content" : "Content:The content of the lecture includes: Architecture and connection networks of parallel systems; Performance, runtime analysis and scalability of parallel programs; Message passing programming and implementation of typical communication patterns; Programming and synchronization techniques for shared address space with multi-threading; Coordination of parallel programs. In the exercises, programming models and techniques are practically applied to various applications. Aim:Knowledge of the architecture and network structures of parallel platforms; Knowledge of basic programming techniques for shared and distributed address spaces and their application to various applications",
        "program" : "Applied Computer Science",
        "university" : "Technische Universitat Chemnitz",
        "degree_program" : "Applied Computer Science",
        "module_code" : "561070",
        "ects" : 5,
        "degree_level" : "Master"
    }]
    mocker.patch('app.crud.modules.find_many_by_id_list', return_value=modules)
    mocker.patch('app.crud.module_recommend.count_module_recommend', return_value=58)
    
    module_recommends = [{
        "_id" : ObjectId("65b69045a7465e50f5ef6c87"),
        "module_id" : ObjectId("65ac1847d2815b505f3e3b95"),
        "user_id" : ObjectId("65e4d22ba21d308eca0c531d"),
        "created_at" : 1516239022
    },{
        "_id" : ObjectId("65b69045a7465e50f5ef6c88"),
        "module_id" : ObjectId("65ac1847d2815b505f3e3b96"),
        "user_id" : ObjectId("65e4d22ba21d308eca0c531d"),
        "created_at" : 1516239022
    }]
    mocker.patch('app.crud.module_recommend.get_user_recommend', return_value=module_recommends)
    response = client.get(
        url=f'/api/v1/module/{module_id}/suggested',
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["data"]["requested_module_id"]  == module_id
    assert response.json()["data"]["total_suggested_module_items"]  == len(suggested_modules)
    assert response.json()["data"]["suggested_module_items"][0]["module_name"]  == modules[0]["module_name"]
    assert response.json()["data"]["suggested_module_items"][0]["content"] == modules[0]["content"]
    assert response.json()["data"]["suggested_module_items"][0]["university"]  == modules[0]["university"]
    assert response.json()["data"]["suggested_module_items"][0]["no_of_recommend"]  == 58
    assert response.json()["data"]["suggested_module_items"][0]["no_of_suggested_modules"]  == len(suggested_modules)
    assert response.json()["data"]["suggested_module_items"][0]["is_recommended"]  == True

def test_get_suggested_module_student_success_without_recommend(mocker):
    load_env()
    init_setting()
    module_id = '65ac17b1d2815b505f3e352d'
    mocker.patch('app.crud.modules.count_by_id', return_value=1)

    suggested_modules = ["65ac1847d2815b505f3e3b96", "65ac1847d2815b505f3e3b95"]
    mocker.patch('app.owl.modules.find_suggested_modules', return_value=suggested_modules)
    
    modules = [{
        "_id" : ObjectId("65ac1847d2815b505f3e3b96"),
        "name" : "Pragmatics II",
        "content" : "• Students are acquinted with major topics in the domain of pragmatics which fall outside the scope of Pragmatics I. • The course focuses on current research in Pragmatics and stimulates original student work in the field. Formal foundations of linguistic theory; Pragmatics I This course is intended as a continuation of Pragmatics I which serves as an introduction to the field. In more formal detail, students are acquinted with current trends in topics like implicature, presupposition, experimental pragmatics, context dependence, speech acts. Students acquire in-depth amalyses of language phenomena from the pragmatic and semantic-pragmatic domain within the following topics: presupposition; context dependence and contextual veriables; acquiring pragmatics rules and processing pragmatic inferences; speech acts. Horn, L. in G. Ward (eds.) 2004. The handbook of pragmatics. Blackwell. Kadmon, Nirit. 2001. Formal Pragmatics: Semantics, Pragmatics, Presupposition, and Focus. Oxford: Blackwell Publishers. Levinson, S. 2000. Presumptive meanings: The theory of generalized conversational implicature. Cambridge, MA: MIT Press. Novek, I. in D. Sperber (eds). 2006. Experimental pragmatics. Palgrave Macmillan. Sauerland, U. in K. Yatsushiro (eds.). 2009. Semantics and Pragmatics. Palgrave Macmillan. Članki iz relevantnih znanstvenih revij, ki obravnavajo pragmatično področje. • attendance and active class participation; • two homework assignments; • final written exam. Associate professor of Linguistics at the University of Nova Gorica. STEPANOV, Arthur, STATEVA, Penka. When QR disobeys superiority. Linguistic inquiry, ISSN 0024-3892, 2009, vol. 40, no. 1, str. 176-185. [COBISS.SI-ID 1130491] STEPANOV, Arthur, STATEVA, Penka. Successive cyclicity as residual wh-scope marking. Lingua, ISSN 0024-3841. [Print ed.], dec. 2006, vol. 116, no. 12, str. 2107-2153. STATEVA, Penka. On the status of parasitic gaps in Bulgarian. Journal of Slavic linguistics, ISSN 1068-2090, 2005, vol. 13, no. 1, str. 137-155. [COBISS.SI-ID 1154811] STATEVA, Penka. Possessive clitics and the structure of nominal expressions. Lingua, ISSN 0024-3841. [Print ed.], Aug. 2002, vol. 112, no. 8, str. 647-690, doi: 10.1016/S0024-3841(01)00066-3. [COBISS.SI-ID 1150203]",
        "url" : "https://www.ung.si/en/schools/school-of-humanities/programmes/2SI2/2022/2SL2042/2023/",
        "university" : "University of Nova Gorica",
        "degree_program" : "SL studies - Linguistics",
        "module_code" : "2SL2042",
        "ects" : 3,
        "year" : "2. year",
        "degree_level" : "Master"
    },{
        "_id" : ObjectId("65ac1847d2815b505f3e3b95"),
        "name" : "Parallel programming",
        "content" : "Content:The content of the lecture includes: Architecture and connection networks of parallel systems; Performance, runtime analysis and scalability of parallel programs; Message passing programming and implementation of typical communication patterns; Programming and synchronization techniques for shared address space with multi-threading; Coordination of parallel programs. In the exercises, programming models and techniques are practically applied to various applications. Aim:Knowledge of the architecture and network structures of parallel platforms; Knowledge of basic programming techniques for shared and distributed address spaces and their application to various applications",
        "program" : "Applied Computer Science",
        "university" : "Technische Universitat Chemnitz",
        "degree_program" : "Applied Computer Science",
        "module_code" : "561070",
        "ects" : 5,
        "degree_level" : "Master"
    }]
    mocker.patch('app.crud.modules.find_many_by_id_list', return_value=modules)
    mocker.patch('app.crud.module_recommend.count_module_recommend', return_value=58)
    mocker.patch('app.crud.module_recommend.get_user_recommend', return_value=[])
    response = client.get(
        url=f'/api/v1/module/{module_id}/suggested',
        headers={"Content-Type":"application/json", "Authorization": f"Bearer {student_jwt}"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["data"]["requested_module_id"]  == module_id
    assert response.json()["data"]["total_suggested_module_items"]  == len(suggested_modules)
    assert response.json()["data"]["suggested_module_items"][0]["module_name"]  == modules[0]["module_name"]
    assert response.json()["data"]["suggested_module_items"][0]["content"] == modules[0]["content"]
    assert response.json()["data"]["suggested_module_items"][0]["university"]  == modules[0]["university"]
    assert response.json()["data"]["suggested_module_items"][0]["no_of_recommend"]  == 58
    assert response.json()["data"]["suggested_module_items"][0]["no_of_suggested_modules"]  == len(suggested_modules)
    assert response.json()["data"]["suggested_module_items"][0]["is_recommended"]  == False
