import { apiFetch, getAccessToken } from './api.js';

// ── Dropdown toggle ──
function toggleDropdown(id) {
    document.querySelectorAll('.dropdown-menu').forEach(m => {
        if (m.id !== id) m.classList.remove('open');
    });
    const el = document.getElementById(id);
    if (el) el.classList.toggle('open');
}
document.addEventListener('click', e => {
    const toggleBtn = e.target.closest('[data-toggle]');
    if (toggleBtn) {
        toggleDropdown(toggleBtn.dataset.toggle);
    } else if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('open'));
    }

    const hrefBtn = e.target.closest('[data-href]');
    if (hrefBtn) {
        window.location.href = hrefBtn.dataset.href;
    }
});

// ── Helper ──
function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function getAqiColor(v) {
    return v<=50?'#22c55e':v<=100?'#eab308':v<=150?'#f97316':v<=200?'#ef4444':'#a855f7';
}

function renderROI(data) {
    const roiGrid = document.getElementById('roi-grid-mon');
    if (!roiGrid) return;
    roiGrid.innerHTML = '';
    data.forEach(d => {
        const barW = Math.round((1 - d.after/d.before)*100);
        roiGrid.innerHTML += `<div class="roi-card">
            <div style="font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;color:#374151;letter-spacing:0.1em;margin-bottom:6px;">${escapeHTML(d.zone)}</div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:#9ca3af;margin-bottom:2px;"><span>Before</span><span style="color:#f97316;font-weight:700;">AQI ${escapeHTML(d.before)}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:#9ca3af;margin-bottom:6px;"><span>After</span><span style="color:#10b981;font-weight:700;">AQI ${escapeHTML(d.after)}</span></div>
            <div style="font-size:12px;font-weight:700;color:#10b981;margin-bottom:4px;">${escapeHTML(d.pct)}% pollution reduction</div>
            <div style="height:3px;background:rgba(0,0,0,0.08);border-radius:2px;">
                <div style="height:3px;width:${barW}%;background:linear-gradient(to right,#ef4444,#10b981);border-radius:2px;"></div>
            </div>
        </div>`;
    });
}

function renderZones(data) {
    const zoneGrid = document.getElementById('zone-grid-mon');
    if (!zoneGrid) return;
    zoneGrid.innerHTML = '';
    data.forEach(z => {
        zoneGrid.innerHTML += `<div class="zone-card" style="border-left:3px solid ${escapeHTML(z.color)}22;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <span style="font-size:11px;font-weight:600;color:#374151;">${escapeHTML(z.name)}</span>
                <span style="width:7px;height:7px;border-radius:50%;background:${escapeHTML(z.color)};display:inline-block;"></span>
            </div>
            <div style="font-family:'Sora',sans-serif;font-size:1.4rem;font-weight:800;color:${escapeHTML(z.color)};line-height:1;">${escapeHTML(z.aqi)}</div>
            <div style="font-size:9px;color:${escapeHTML(z.color)};opacity:0.8;margin-top:2px;text-transform:uppercase;letter-spacing:0.05em;">${escapeHTML(z.label)}</div>
        </div>`;
    });
}

function renderDevices(data) {
    const tbody = document.getElementById('device-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    data.forEach(d => {
        const aqiColor = getAqiColor(d.aqi);
        const hepaVal = parseInt(d.hepa) || 0;
        const hepaColor = hepaVal >= 70 ? '#10b981' : (hepaVal >= 40 ? '#eab308' : '#ef4444');
        const isOffline = d.status === 'Offline' || d.status === 'Maintenance';
        
        tbody.innerHTML += `<tr>
            <td><span style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:#111827;">${escapeHTML(d.id)}</span></td>
            <td style="color:#374151;">${escapeHTML(d.loc)}</td>
            <td><span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;color:${isOffline?'#ef4444':'#10b981'};">
                <span style="width:6px;height:6px;border-radius:50%;background:${isOffline?'#ef4444':'#10b981'};display:inline-block;"></span>
                ${escapeHTML(d.status)}
            </span></td>
            <td><span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:${aqiColor};">${escapeHTML(d.aqi)}</span></td>
            <td style="font-family:'JetBrains Mono',monospace;color:${d.pm25?'#f97316':'#9ca3af'};">${escapeHTML(d.pm25??'--')}</td>
            <td style="font-family:'JetBrains Mono',monospace;color:#374151;">${escapeHTML(d.co2??'--')}</td>
            <td style="font-family:'JetBrains Mono',monospace;color:#374151;">${escapeHTML(d.temp??'--')}</td>
            <td><span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:${hepaColor};">${escapeHTML(d.hepa)}${d.hepa !== '--' ? '%' : ''}</span></td>
            <td><span style="font-family:'JetBrains Mono',monospace;font-size:10px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);color:#10b981;padding:2px 6px;border-radius:4px;">${escapeHTML(d.power)}</span></td>
            <td style="font-family:'JetBrains Mono',monospace;color:${d.uptime==='Offline'?'#ef4444':'#10b981'};font-weight:600;">${escapeHTML(d.uptime)}</td>
        </tr>`;
    });
}

async function loadData() {
    try {
        const [zonesRes, devicesRes] = await Promise.all([
            apiFetch('/zones'),
            apiFetch('/devices')
        ]);

        const zones = zonesRes.data || zonesRes;
        const devices = devicesRes.data || devicesRes;

        const roiData = (zones || []).map(z => ({
            zone: (z.name || '').toUpperCase(),
            before: z.beforeAqi || 0,
            after: z.afterAqi || 0,
            pct: z.beforeAqi ? Math.round(((z.beforeAqi - z.afterAqi) / z.beforeAqi) * 100) : 0
        }));

        const zoneData = (zones || []).map(z => {
            const aqi = z.afterAqi || 0;
            let label = 'GOOD';
            if(aqi > 50) label = 'MODERATE';
            if(aqi > 100) label = 'UNHEALTHY FOR SOME';
            if(aqi > 150) label = 'UNHEALTHY';
            if(aqi > 200) label = 'HAZARDOUS';
            
            return {
                name: z.name,
                aqi: aqi,
                label: label,
                color: getAqiColor(aqi)
            };
        });

        const deviceData = (devices || []).map(d => {
            const latestReading = d.sensorReadings && d.sensorReadings.length ? d.sensorReadings[0] : null;
            const latestFilter = d.filterStatus && d.filterStatus.length ? d.filterStatus[0] : null;
            
            return {
                id: d.id,
                loc: d.location || 'Unknown',
                status: d.status === 'ONLINE' ? 'Online' : (d.status === 'MAINTENANCE' ? 'Maintenance' : 'Offline'),
                aqi: latestReading ? latestReading.aqi : (d.zone ? d.zone.afterAqi : '--'),
                pm25: latestReading ? latestReading.pm25 : null,
                co2: latestReading ? latestReading.co2 : null,
                temp: latestReading && latestReading.temp ? `${latestReading.temp}°C` : null,
                hepa: latestFilter ? latestFilter.hepaPercent : '--',
                power: d.powerSource === 'SOLAR' ? `Solar ${d.solarPercent || '--'}%` : 'Grid',
                uptime: d.status === 'ONLINE' ? `${d.uptimePercent || 100}%` : 'Offline',
                critical: d.status !== 'ONLINE'
            };
        });

        renderROI(roiData);
        renderZones(zoneData);
        renderDevices(deviceData);
        
        connectWebSocket();
    } catch (e) {
        console.error('Error fetching dashboard data', e);
    }
}

let ws;
function connectWebSocket() {
    const token = getAccessToken();
    if (!token) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    let host = window.location.host;
    if (window.location.port === '3000' || window.location.port === '5173') {
        host = window.location.hostname + ':3001';
    }
    const wsUrl = `${protocol}//${host}/ws?token=${token}`;

    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log('Connected to real-time telemetry');
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log('Real-time message received:', data);
            // Example: trigger a re-render or update specific rows
            // For now we just log it as the telemetry consumption base
            if (data.event === 'alert' || data.event === 'telemetry') {
                // optionally call loadData() to refresh the full dashboard
                // loadData();
            }
        } catch (e) {
            console.error('Failed to parse WS message', e);
        }
    };

    ws.onclose = () => {
        console.log('Disconnected from real-time telemetry, retrying in 5s...');
        setTimeout(connectWebSocket, 5000);
    };
    
    ws.onerror = (err) => {
        console.error('WebSocket error', err);
        ws.close();
    };
}

document.addEventListener('DOMContentLoaded', loadData);