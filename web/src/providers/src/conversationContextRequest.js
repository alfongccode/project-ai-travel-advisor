const BASE_ENDPOINT = '/api/context'
const ENDPOINTS = {
    CLEAR_CONTEXT: BASE_ENDPOINT + '/clear',
    GET_CONTEXT_RECORDS: BASE_ENDPOINT + '/records'
};

function clearContext(question) {
    return fetch(ENDPOINTS.CLEAR_CONTEXT, {
        method: 'DELETE'
    });
}

function getContextRecords() {
    return fetch(ENDPOINTS.GET_CONTEXT_RECORDS)
        .then(response => response.json());
}

export default {
    clearContext,
    getContextRecords
}