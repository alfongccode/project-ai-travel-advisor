from fastapi import APIRouter
from main import travel_advisor

router = APIRouter(prefix='/context', tags=["context"])

@router.get("/context/records")
async def get_context_records():
    return travel_advisor.get_answers_history()

@router.delete("/context/clear")
async def clear_history():
    return travel_advisor.clear()