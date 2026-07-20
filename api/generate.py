from fastapi import APIRouter
from pydantic import BaseModel
from main import travel_advisor

router = APIRouter(prefix="/generate", tags=["generate"])

class ItineraryMapRequest(BaseModel):
    trip_itinerary: str

@router.post("/itinerary")
def get_itinerary_image(payload: ItineraryMapRequest):
    return travel_advisor.generate_itinerary_image(itinerary=payload.trip_itinerary)

@router.get("/images")
def get_itinerary_image(country_name: str, city_name: str):
    return travel_advisor.get_photographs(trip_location={"country": country_name, "city": city_name })