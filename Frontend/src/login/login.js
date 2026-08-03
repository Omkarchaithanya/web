import { apiFetch, setAccessToken } from '../shared/js/api.js';
import { config } from '../shared/js/config.js';

document.addEventListener('DOMContentLoaded', () => {
    let selectedRole = 'super';

    const roleMeta = {
        super: { account: config.demoAccounts.super },
        govt: { account: config.demoAccounts.govt },
        tech: { account: config.demoAccounts.tech },
    };

    function applyRole(role) {
        const meta = roleMeta[role] || roleMeta.super;
        selectedRole = role;

        document.querySelectorAll('.role-tab').forEach(tab => {
            const isActive = tab.dataset.role === role;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        const emailInput = document.getElementById('email');
        const passInput = document.getElementById('password');
        if (!emailInput || !passInput) return;

        const account = meta.account;
        if (account?.email) emailInput.value = account.email;
        if (account?.password) passInput.value = account.password;

        emailInput.placeholder =
            role === 'govt' ? 'govt.admin@example.com' :
            role === 'tech' ? 'technician@example.com' :
            'super.admin@example.com';
    }

    document.querySelectorAll('.role-tab').forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            applyRole(tab.dataset.role || 'super');
        });
    });

    applyRole(selectedRole);

    const toggleIcon = document.getElementById('toggle-password-icon');
    if (toggleIcon) {
        toggleIcon.addEventListener('click', () => {
            const pw = document.getElementById('password');
            const icon = document.getElementById('eye-icon');
            if (!pw || !icon) return;
            if (pw.type === 'password') {
                pw.type = 'text';
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>';
            } else {
                pw.type = 'password';
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>';
            }
        });
    }

    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Enter') handleLogin();
    });

    async function handleLogin() {
        const btn = document.getElementById('login-btn');
        const text = document.getElementById('btn-text');
        const email = document.getElementById('email')?.value?.trim();
        const password = document.getElementById('password')?.value;

        if (!btn || !text) return;

        if (!email || !password) {
            btn.style.background = '#ef4444';
            text.textContent = '⚠ Fill in all fields';
            setTimeout(() => {
                btn.style.background = '#10b981';
                text.textContent = 'Sign In to Dashboard →';
            }, 2000);
            return;
        }

        btn.style.background = '#059669';
        btn.disabled = true;
        text.textContent = 'Authenticating...';

        try {
            const data = await apiFetch(config.routes.authLogin, {
                method: 'POST',
                body: { email, password }
            });

            if (data && data.accessToken) {
                setAccessToken(data.accessToken);
                if (data.user) {
                    sessionStorage.setItem('urbantree_user', JSON.stringify(data.user));
                }
                sessionStorage.setItem('urbantree_role', selectedRole);
                text.textContent = '✓ Redirecting...';
                setTimeout(() => {
                    window.location.href = config.routes.monitoringPage;
                }, 600);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            btn.style.background = '#ef4444';
            text.textContent = '⚠ ' + (error.message || 'Login failed');
            setTimeout(() => {
                btn.style.background = '#10b981';
                btn.disabled = false;
                text.textContent = 'Sign In to Dashboard →';
            }, 2000);
        }
    }

    // Decorative ticker (UI chrome only — not production telemetry)
    const zones = [
        { name: 'Jayanagar', aqi: 61, cls: 'mod' },
        { name: 'Marathahalli', aqi: 136, cls: 'usg' },
        { name: 'Yeshwanthpur', aqi: 163, cls: 'bad' },
        { name: 'HSR Layout', aqi: 101, cls: 'usg' },
        { name: 'Yelahanka', aqi: 48, cls: 'good' },
        { name: 'Indiranagar', aqi: 42, cls: 'good' },
        { name: 'MG Road', aqi: 87, cls: 'mod' },
        { name: 'Silk Board', aqi: 142, cls: 'usg' },
        { name: 'BTM Layout', aqi: 179, cls: 'bad' },
        { name: 'Whitefield', aqi: 59, cls: 'mod' },
        { name: 'Koramangala', aqi: 95, cls: 'mod' },
        { name: 'Peenya Indl.', aqi: 252, cls: 'haz' },
        { name: 'Sarjapur', aqi: 45, cls: 'good' }
    ];

    const labels = { good: '● GOOD', mod: '● MODERATE', usg: '● USG', bad: '● UNHEALTHY', haz: '● HAZARDOUS' };
    const track = document.getElementById('ticker-track');
    if (track) {
        [...zones, ...zones].forEach(z => {
            const el = document.createElement('span');
            el.className = `ticker-item ${z.cls}`;
            el.textContent = `${z.name} — ${z.aqi} ${labels[z.cls]}`;
            track.appendChild(el);
        });
    }

    const bgNumbers = document.getElementById('bg-numbers');
    if (bgNumbers) {
        for (let i = 0; i < 12; i++) {
            const col = document.createElement('div');
            col.className = 'bg-col';
            col.style.left = `${(i / 12) * 100}%`;
            col.style.animationDuration = `${18 + Math.random() * 20}s`;
            col.style.animationDelay = `-${Math.random() * 20}s`;
            let html = '';
            for (let j = 0; j < 40; j++) html += `<span>${Math.floor(Math.random() * 300)}</span>`;
            col.innerHTML = html + html;
            bgNumbers.appendChild(col);
        }
    }

    const container = document.getElementById('chips-container');
    if (container) {
        const chipTexts = [
            'PM2.5: 38µg/m³', 'AQI: 94', 'CO₂: 720ppm', 'VOC: 1.2mg/m³',
            'TEMP: 28°C', 'HUMIDITY: 54%', 'PM10: 88µg/m³', 'AQI: 42 GOOD',
            'HEPA: 91%', 'SOLAR: 87%', 'UPTIME: 99.2%', 'AWD-006 ONLINE',
            'COVERAGE: 250m', 'FAN: 80%', 'PM1: 22µg/m³', 'AQI: 252 HAZ',
        ];
        function spawnChip() {
            const chip = document.createElement('div');
            chip.className = 'data-chip';
            chip.textContent = chipTexts[Math.floor(Math.random() * chipTexts.length)];
            chip.style.left = `${Math.random() * 70}%`;
            chip.style.bottom = '44px';
            chip.style.animationDuration = `${5 + Math.random() * 6}s`;
            container.appendChild(chip);
            setTimeout(() => chip.remove(), 12000);
        }
        setInterval(spawnChip, 700);
        for (let i = 0; i < 8; i++) setTimeout(spawnChip, i * 300);
    }
});
