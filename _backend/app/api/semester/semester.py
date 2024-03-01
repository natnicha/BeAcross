from fastapi import APIRouter, Depends, Query, status
from pymongo import MongoClient
from app.api.semester.model import SemesterResponseData, SemesterResponseItem

from app.db.mongodb import get_database
import app.crud.semesters as SEMESTERS

semester = APIRouter()

@semester.get("/", status_code=status.HTTP_200_OK)
async def get_semester( 
        limit: int = Query(20, gt=0),
        offset: int = Query(0, gt=0),
        sortby: str = Query('id', pattern='^id$|^name$|^created_at$'),
        orderby: str = Query('asc', pattern='^asc$|^desc$'),
        db: MongoClient = Depends(get_database)
    ):
    sortby_column = sortby
    if sortby == 'id':
        sortby_column = "_id"
    items = list(SEMESTERS.find_all(db, limit, offset, sortby_column, orderby))
    response_data = SemesterResponseData(total_items=len(items))
    for item in items:
        response_data.items.append(
            SemesterResponseItem(
                id=str(item["_id"]),
                name=item["name"],
                created_at=item["created_at"]
            )
        )
    return {
        "data": response_data
    }
