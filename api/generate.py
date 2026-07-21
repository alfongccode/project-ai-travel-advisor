from fastapi import APIRouter
from pydantic import BaseModel
from main import travel_advisor

router = APIRouter(prefix="/generate", tags=["generate"])

class ItineraryMapRequest(BaseModel):
    trip_itinerary: str

@router.post("/itinerary")
def get_itinerary_image(payload: ItineraryMapRequest):
    return travel_advisor.generate_itinerary_image(itinerary=payload.trip_itinerary)
