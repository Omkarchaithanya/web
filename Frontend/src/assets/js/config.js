/**
 * Single source of frontend configuration.
 * Values come from Vite env (Frontend/.env) — do not hardcode URLs/credentials elsewhere.
 */
function read(key, fallback = '') {
    const value = import.meta.env?.[key];
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

export const config = Object.freeze({
    apiBaseUrl: read('VITE_API_BASE_URL', '/api/v1'),
    wsUrl: read('VITE_WS_URL', ''),
    siteUrl: read('VITE_SITE_URL', ''),
    contactEmail: read('VITE_CONTACT_EMAIL', ''),
    privacyEmail: read('VITE_PRIVACY_EMAIL', ''),
    social: Object.freeze({
        twitter: read('VITE_SOCIAL_TWITTER', ''),
        github: read('VITE_SOCIAL_GITHUB', ''),
        linkedin: read('VITE_SOCIAL_LINKEDIN', ''),
        instagram: read('VITE_SOCIAL_INSTAGRAM', ''),
        youtube: read('VITE_SOCIAL_YOUTUBE', ''),
    }),
    routes: Object.freeze({
        enquiry: '/enquiry',
        newsletter: '/newsletter',
        authLogin: '/auth/login',
        authRefresh: '/auth/refresh',
        loginPage: '/pages/login.html',
        monitoringPage: 'monitoring.html',
    }),
    demoAccounts: Object.freeze({
        super: {
            email: read('VITE_DEMO_SUPER_EMAIL', ''),
            password: read('VITE_DEMO_SUPER_PASSWORD', ''),
        },
        govt: {
            email: read('VITE_DEMO_GOVT_EMAIL', ''),
            password: read('VITE_DEMO_GOVT_PASSWORD', ''),
        },
        tech: {
            email: read('VITE_DEMO_TECH_EMAIL', ''),
            password: read('VITE_DEMO_TECH_PASSWORD', ''),
        },
    }),
});

export default config;
