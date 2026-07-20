from fastapi import APIRouter
from pydantic import BaseModel
from main import travel_advisor

router = APIRouter(tags=["ask"])

class AskRequest(BaseModel):
    question: str

@router.post("/ask")
async def ask(payload: AskRequest):
    return travel_advisor.ask(question=payload.question)

@router.get("/context/records")
async def get_context_records():
    return travel_advisor.get_answers_history()

@router.delete("/context/clear")
async def clear_history():
    return travel_advisor.clear()