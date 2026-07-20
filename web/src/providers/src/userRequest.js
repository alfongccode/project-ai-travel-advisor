const ENDPOINTS = {
    PROMPT_USER_REQUEST: '/api/ask'
};

function promptUserRequest(question) {
    return fetch(ENDPOINTS.PROMPT_USER_REQUEST, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question }),
    }).then(response => response.json());
}

export default promptUserRequest