const ENDPOINTS = {
    SEARCH_IMAGES: '/api/generate/images'
};

function getLocationImages(country, city) {
    const url = new URL(ENDPOINTS.SEARCH_IMAGES, window.location.origin);
    const query_params = {
        country: country,
        city: city
    };

    url.search = new URLSearchParams(query_params).toString();
    return fetch(url).then(response => response.json());
}

export default getLocationImages