from fastapi import APIRouter

user = APIRouter()

@user.get("/profile")
async def get_profile():
    return
