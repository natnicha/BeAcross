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
    
    personal_plan = PERSONAL_PLANS.PersonalPlanModel(
        user_id=ObjectId(request.state.user_id),
        semester_id=semester_id_obj,
        module_id=module_id_obj
    )
    inserted_personal_plan = PERSONAL_PLANS.insert_one(db, personal_plan)
    
    return PostPersonalPlanResponse(
        personal_plan_id=ObjectId(inserted_personal_plan.inserted_id),
        user_id=ObjectId(request.state.user_id),
        semester_id=semester_id_obj,
        module_id=module_id_obj
    )
