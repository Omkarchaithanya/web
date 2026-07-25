let accessToken = null;

const BASE_URL = import.meta.env?.VITE_API_BASE_URL || '/api/v1';

export function setAccessToken(token) {
    accessToken = token;
}

export function getAccessToken() {
    return accessToken;
}

export async function apiFetch(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = new Headers(options.headers || {});
    
    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }
    
    // Default to JSON for payloads if not explicitly set
    if (options.body && typeof options.body !== 'string' && !(options.body instanceof FormData)) {
        options.body = JSON.stringify(options.body);
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }
    }

    let response = await fetch(url, { ...options, headers });

    // Handle 401 Unauthorized by attempting a token refresh
    if (response.status === 401 && endpoint !== '/auth/refresh') {
        try {
            // The backend uses an httpOnly cookie for the refresh token
            const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (refreshRes.ok) {
                const data = await refreshRes.json();
                accessToken = data.accessToken;
                
                // Retry original request with new token
                headers.set('Authorization', `Bearer ${accessToken}`);
                response = await fetch(url, { ...options, headers });
            } else {
                // Refresh failed, redirect to login
                accessToken = null;
                window.location.href = '/pages/login.html';
                throw new Error('Session expired. Please log in again.');
            }
        } catch (err) {
            accessToken = null;
            window.location.href = '/pages/login.html';
            throw err;
        }
    }

    if (!response.ok) {
        let errorMsg = 'An error occurred';
        try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorData.error || errorMsg;
        } catch (e) {
            // fallback
        }
        throw new Error(errorMsg);
    }

    // Attempt to parse JSON response, fallback to text/blob if needed
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    return response.text();
}
