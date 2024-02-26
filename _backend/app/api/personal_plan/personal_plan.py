from copy import deepcopy
from typing import Annotated, Union
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from pymongo import MongoClient
import app.crud.modules as MODULES
import app.crud.semesters as SEMESTERS
from app.api.personal_plan.model import GetPersonalPlanResponseData, GetPersonalPlanResponseItem, GetPersonalPlanResponsePersonalPlan, PostPersonalPlanRequest, PostPersonalPlanResponse

from app.db.mongodb import get_database
import app.crud.personal_plans as PERSONAL_PLANS

personal_plan = APIRouter()
    
@personal_plan.get("/", status_code=status.HTTP_200_OK)
async def get_personal_plan(
        request: Request,
        module_id: Annotated[Union[str, None], Query()] = None,
        db: MongoClient = Depends(get_database)
    ):
    module_id_obj = None
    try:
        if module_id is not None:
            module_id_obj = ObjectId(module_id)
    except Exception as e:
        raise HTTPException(
            detail={"message": str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )
    personal_plan = list(PERSONAL_PLANS.get_by_user_id_and_module_id(db, ObjectId(request.state.user_id), module_id_obj))
    semesters = list(SEMESTERS.find_all(db))

    semester_detail_model = []
    for semester in semesters:
        semester_detail = GetPersonalPlanResponsePersonalPlan(
            semester_id=str(semester["_id"]),
            semester_name=semester["name"]
        )
        semester_detail_model.append(semester_detail)
    semester_detail_model = tuple(semester_detail_model)

    current_module_id = None
    data = GetPersonalPlanResponseData()
    for plan in personal_plan:
        if current_module_id != str(plan["module_id"]):
            model = list(deepcopy(semester_detail_model))
            data.items.append(GetPersonalPlanResponseItem(module_id=str(plan["module_id"]), personal_plan=model))
        for pp in data.items[-1].personal_plan:
            if pp.semester_id == str(plan["semester_id"]):
                pp.is_added = True
                break
        current_module_id = str(plan["module_id"])
    data.total_items = len(data.items)
    return {"data": data}


@personal_plan.post("/", status_code=status.HTTP_201_CREATED)
async def create_personal_plan(
        request: Request,
        items: PostPersonalPlanRequest,
        db: MongoClient = Depends(get_database)
    ):
    try:
        module_id_obj = ObjectId(items.module_id)
    except Exception as e:
        raise HTTPException(
            detail={"message": str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        semester_id_obj = ObjectId(items.semester_id)
    except Exception as e:
        raise HTTPException(
            detail={"message": str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    module_count = MODULES.count_by_id(db, module_id_obj)
    if module_count == 0:
        raise HTTPException(
            detail={"message": "the module ID is not found"},
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    semester_count = SEMESTERS.count_by_id(db, semester_id_obj)
    if semester_count == 0:
        raise HTTPException(
            detail={"message": "the semester ID is not found"},
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    semester_count = PERSONAL_PLANS.count_by_module_id_semester_id_user_id(db, user_id=ObjectId(request.state.user_id), semester_id=semester_id_obj, module_id=module_id_obj)
    if semester_count > 0:
        raise HTTPException(
            detail={"message": "duplication adding a module within a specific semester for this user"},
            status_code=status.HTTP_409_CONFLICT
        )
    
    inserted_personal_plan = PERSONAL_PLANS.insert_one(db, 
        persoanl_plan=PERSONAL_PLANS.PersonalPlanModel(
            user_id=ObjectId(request.state.user_id),
            semester_id=semester_id_obj,
            module_id=module_id_obj
    ))
    
    return PostPersonalPlanResponse(
        personal_plan_id=ObjectId(inserted_personal_plan.inserted_id),
        user_id=ObjectId(request.state.user_id),
        semester_id=semester_id_obj,
        module_id=module_id_obj
    )


@personal_plan.delete("/{personal_plan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_personal_plan(
        request: Request,
        personal_plan_id: str,
        db: MongoClient = Depends(get_database)
    ):
    try:
        personal_plan_id_obj = ObjectId(personal_plan_id)
    except Exception as e:
        raise HTTPException(
            detail={"message": str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    semester_count = PERSONAL_PLANS.count_by_id_user_id(db, id=personal_plan_id_obj, user_id=ObjectId(request.state.user_id))
    if semester_count == 0:
        raise HTTPException(
            detail={"message": "the module added into this user's personal plan for the specific semester is not found"},
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    PERSONAL_PLANS.delete_one_by_id(db, personal_plan_id_obj)
    return
