from fastapi import APIRouter
from auth.model import RegisterRequestModel

auth = APIRouter()

@auth.post("/register")
async def register(item: RegisterRequestModel):
    # get across university domains
    # check email format
    # if not conform email format, return error
    # check whether or not a given email is one of Across uni
    # if no - not match with any uni, return error
    # check existing
    # if yes - exists, return error
    # extract first_name & last_name 
    # sent email
    # if success, insert into db & return success
    return {"message": item}
