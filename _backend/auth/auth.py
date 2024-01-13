
from fastapi import Header, APIRouter
auth = APIRouter()

@auth.post("/register")
async def register():
    return {"message": "This is a register route"}
