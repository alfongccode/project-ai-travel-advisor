from fastapi import APIRouter
from pydantic import BaseModel
from main import travel_advisor

router = APIRouter(prefix="/search", tags=["search"])

class ImageRequest(BaseModel):
    country: str
    city: str
    limit: int | None = None

@router.get("/images")
def get_itinerary_image(payload: ImageRequest):
    return travel_advisor.get_photographs(trip_location={"country": payload.country, "city": payload.city}, limit=payload.limit)