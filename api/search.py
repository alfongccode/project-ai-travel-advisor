from fastapi import APIRouter
from pydantic import BaseModel
from main import travel_advisor

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/images")
def get_itinerary_image(country: str, city: str):
    return travel_advisor.get_photographs(trip_location={"country": country, "city": city})