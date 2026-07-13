// ── Dropdown toggle ──
function toggleDropdown(id) {
    document.querySelectorAll('.dropdown-menu').forEach(m => {
        if (m.id !== id) m.classList.remove('open');
    });
    document.getElementById(id).classList.toggle('open');
}
document.addEventListener('click', e => {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('open'));
    }
});

// ── Data ──
const roiData = [
    { zone:'INDIRANAGAR', before:198, after:42, pct:-79 },
    { zone:'PEENYA INDUSTRIAL', before:362, after:247, pct:-32 },
    { zone:'SILK BOARD', before:224, after:142, pct:-37 },
    { zone:'WHITEFIELD', before:189, after:56, pct:-70 },
    { zone:'BTM LAYOUT', before:268, after:178, pct:-34 },
    { zone:'KORAMANGALA', before:176, after:95, pct:-46 },
];

const zoneData = [
    { name:'Indiranagar', aqi:44, label:'GOOD', color:'#22c55e' },
    { name:'MG Road', aqi:94, label:'MODERATE', color:'#eab308' },
    { name:'Silk Board', aqi:142, label:'UNHEALTHY FOR SOME', color:'#f97316' },
    { name:'BTM Layout', aqi:179, label:'UNHEALTHY', color:'#ef4444' },
    { name:'Whitefield', aqi:59, label:'GOOD', color:'#22c55e' },
    { name:'Koramangala', aqi:97, label:'MODERATE', color:'#eab308' },
    { name:'Marathahalli', aqi:132, label:'UNHEALTHY FOR SOME', color:'#f97316' },
    { name:'Jayanagar', aqi:58, label:'GOOD', color:'#22c55e' },
    { name:'Peenya Indl.', aqi:252, label:'HAZARDOUS', color:'#a855f7' },
    { name:'Yeshwanthpur', aqi:156, label:'UNHEALTHY', color:'#ef4444' },
    { name:'HSR Layout', aqi:97, label:'MODERATE', color:'#eab308' },
    { name:'Sarjapur', aqi:45, label:'GOOD', color:'#22c55e' },
];

const deviceData = [
    { id:'AWD-009', loc:'Peenya Industrial', status:'Online', aqi:246, pm25:110, co2:1238, temp:'31°C', hepa:18, power:'Solar 87%', uptime:'99.1%', critical:true },
    { id:'AWD-004', loc:'BTM Layout', status:'Online', aqi:174, pm25:86, co2:954, temp:'33°C', hepa:52, power:'Bat 23%', uptime:'97.4%', critical:false },
    { id:'AWD-010', loc:'Yeshwanthpur', status:'Online', aqi:160, pm25:81, co2:885, temp:'30°C', hepa:45, power:'Solar 72%', uptime:'98.8%', critical:false },
    { id:'AWD-003', loc:'Silk Board', status:'Online', aqi:141, pm25:67, co2:830, temp:'32°C', hepa:68, power:'Solar 91%', uptime:'99.6%', critical:false },
    { id:'AWD-002', loc:'MG Road', status:'Offline', aqi:87, pm25:null, co2:null, temp:null, hepa:65, power:'Solar --', uptime:'Offline', critical:true },
    { id:'AWD-001', loc:'Indiranagar', status:'Online', aqi:42, pm25:11, co2:380, temp:'26°C', hepa:96, power:'Solar 94%', uptime:'100%', critical:false },
    { id:'AWD-005', loc:'Whitefield', status:'Online', aqi:59, pm25:21, co2:580, temp:'27°C', hepa:76, power:'Solar 88%', uptime:'99.9%', critical:false },
    { id:'AWD-006', loc:'Koramangala', status:'Online', aqi:95, pm25:38, co2:610, temp:'27°C', hepa:18, power:'Solar 87%', uptime:'98.5%', critical:false },
    { id:'AWD-007', loc:'Marathahalli', status:'Online', aqi:132, pm25:65, co2:760, temp:'29°C', hepa:40, power:'Grid', uptime:'97.2%', critical:false },
    { id:'AWD-008', loc:'Jayanagar', status:'Online', aqi:58, pm25:19, co2:550, temp:'26°C', hepa:85, power:'Solar 91%', uptime:'100%', critical:false },
    { id:'AWD-011', loc:'HSR Layout', status:'Online', aqi:97, pm25:27, co2:680, temp:'27°C', hepa:52, power:'Solar 80%', uptime:'98.1%', critical:false },
    { id:'AWD-012', loc:'Sarjapur', status:'Online', aqi:45, pm25:17, co2:510, temp:'26°C', hepa:88, power:'Solar 93%', uptime:'100%', critical:false },
];

// ── Helper ──
function getAqiColor(v) {
    return v<=50?'#22c55e':v<=100?'#eab308':v<=150?'#f97316':v<=200?'#ef4444':'#a855f7';
}

// ── Render ROI ──
const roiGrid = document.getElementById('roi-grid-mon');
roiData.forEach(d => {
    const barW = Math.round((1 - d.after/d.before)*100);
    roiGrid.innerHTML += `<div class="roi-card">
        <div style="font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;color:#374151;letter-spacing:0.1em;margin-bottom:6px;">${d.zone}</div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:#9ca3af;margin-bottom:2px;"><span>Before</span><span style="color:#f97316;font-weight:700;">AQI ${d.before}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:#9ca3af;margin-bottom:6px;"><span>After</span><span style="color:#10b981;font-weight:700;">AQI ${d.after}</span></div>
        <div style="font-size:12px;font-weight:700;color:#10b981;margin-bottom:4px;">${d.pct}% pollution reduction</div>
        <div style="height:3px;background:rgba(0,0,0,0.08);border-radius:2px;">
            <div style="height:3px;width:${barW}%;background:linear-gradient(to right,#ef4444,#10b981);border-radius:2px;"></div>
        </div>
    </div>`;
});

// ── Render Zones ──
const zoneGrid = document.getElementById('zone-grid-mon');
zoneData.forEach(z => {
    zoneGrid.innerHTML += `<div class="zone-card" style="border-left:3px solid ${z.color}22;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <span style="font-size:11px;font-weight:600;color:#374151;">${z.name}</span>
            <span style="width:7px;height:7px;border-radius:50%;background:${z.color};display:inline-block;"></span>
        </div>
        <div style="font-family:'Sora',sans-serif;font-size:1.4rem;font-weight:800;color:${z.color};line-height:1;">${z.aqi}</div>
        <div style="font-size:9px;color:${z.color};opacity:0.8;margin-top:2px;text-transform:uppercase;letter-spacing:0.05em;">${z.label}</div>
    </div>`;
});

// ── Render Device Table ──
const tbody = document.getElementById('device-table-body');
deviceData.forEach(d => {
    const aqiColor = getAqiColor(d.aqi);
    const hepaColor = d.hepa>=70?'#10b981':d.hepa>=40?'#eab308':'#ef4444';
    const isOffline = d.status === 'Offline';
    tbody.innerHTML += `<tr>
        <td><span style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:#111827;">${d.id}</span></td>
        <td style="color:#374151;">${d.loc}</td>
        <td><span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;color:${isOffline?'#ef4444':'#10b981'};">
            <span style="width:6px;height:6px;border-radius:50%;background:${isOffline?'#ef4444':'#10b981'};display:inline-block;"></span>
            ${d.status}
        </span></td>
        <td><span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:${aqiColor};">${d.aqi}</span></td>
        <td style="font-family:'JetBrains Mono',monospace;color:${d.pm25?'#f97316':'#9ca3af'};">${d.pm25??'--'}</td>
        <td style="font-family:'JetBrains Mono',monospace;color:#374151;">${d.co2??'--'}</td>
        <td style="font-family:'JetBrains Mono',monospace;color:#374151;">${d.temp??'--'}</td>
        <td><span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:${hepaColor};">${d.hepa}%</span></td>
        <td><span style="font-family:'JetBrains Mono',monospace;font-size:10px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);color:#10b981;padding:2px 6px;border-radius:4px;">${d.power}</span></td>
        <td style="font-family:'JetBrains Mono',monospace;color:${d.uptime==='Offline'?'#ef4444':'#10b981'};font-weight:600;">${d.uptime}</td>
    </tr>`;
});