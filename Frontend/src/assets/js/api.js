import { config } from './config.js';

let accessToken = null;

const BASE_URL = config.apiBaseUrl;

export function setAccessToken(token) {
    accessToken = token;
}

export function getAccessToken() {
    return accessToken;
}

function buildRequest(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = new Headers(options.headers || {});
    const nextOptions = { ...options };

    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    if (nextOptions.body && typeof nextOptions.body !== 'string' && !(nextOptions.body instanceof FormData)) {
        nextOptions.body = JSON.stringify(nextOptions.body);
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }
    }

    return { url, headers, options: nextOptions };
}

async function parseResponse(response) {
    if (!response.ok) {
        let errorMsg = 'An error occurred';
        try {
            const errorData = await response.json();
            errorMsg = errorData?.error?.message || errorData.message || errorData.error || errorMsg;
        } catch (e) {
            // fallback
        }
        throw new Error(errorMsg);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        const json = await response.json();
        // Unwrap standard API envelope { success, data }
        if (json && typeof json === 'object' && 'data' in json && ('success' in json || 'error' in json)) {
            return json.data;
        }
        return json;
    }
    return response.text();
}

/** Public endpoints — never redirects to login. */
export async function publicFetch(endpoint, options = {}) {
    const { url, headers, options: nextOptions } = buildRequest(endpoint, options);
    headers.delete('Authorization');
    const response = await fetch(url, { ...nextOptions, headers });
    return parseResponse(response);
}

export async function submitEnquiry(payload) {
    return publicFetch(config.routes.enquiry, { method: 'POST', body: payload });
}

export async function subscribeNewsletter(email, source = 'website') {
    return publicFetch(config.routes.newsletter, {
        method: 'POST',
        body: { email, source },
    });
}

export async function apiFetch(endpoint, options = {}) {
    const { url, headers, options: nextOptions } = buildRequest(endpoint, options);

    let response = await fetch(url, { ...nextOptions, headers });

    if (response.status === 401 && endpoint !== config.routes.authRefresh) {
        try {
            const refreshRes = await fetch(`${BASE_URL}${config.routes.authRefresh}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (refreshRes.ok) {
                const data = await refreshRes.json();
                accessToken = data.accessToken;
                headers.set('Authorization', `Bearer ${accessToken}`);
                response = await fetch(url, { ...nextOptions, headers });
            } else {
                accessToken = null;
                window.location.href = config.routes.loginPage;
                throw new Error('Session expired. Please log in again.');
            }
        } catch (err) {
            accessToken = null;
            window.location.href = config.routes.loginPage;
            throw err;
        }
    }

    return parseResponse(response);
}
