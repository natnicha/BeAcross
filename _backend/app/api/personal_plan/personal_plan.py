from fastapi import APIRouter, status

personal_plan = APIRouter()

@personal_plan.get("/", status_code=status.HTTP_200_OK)
async def get_personal_plan():
    return