const ENDPOINTS = {
    GENERATE_ITINERARY_MAP: '/api/generate/itinerary'
};

function generateItineraryMap(tripItinerary) {
    return fetch(ENDPOINTS.GENERATE_ITINERARY_MAP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trip_itinerary: tripItinerary }),
    }).then(response => response.json());
}

export default generateItineraryMap