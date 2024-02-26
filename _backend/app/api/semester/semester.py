from fastapi import APIRouter, status

semester = APIRouter()

@semester.get("/", status_code=status.HTTP_200_OK)
async def get_semester():
    return