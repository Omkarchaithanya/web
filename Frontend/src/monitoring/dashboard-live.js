// dashboard-live.js

class LiveChart {
    constructor(elementId, options) {
        this.fillPath = document.getElementById(elementId + '-fill') || document.getElementById(elementId);
        this.linePath = document.getElementById(elementId + '-line');
        
        this.options = Object.assign({
            width: 1000,
            height: 200,
            min: 0,
            max: 30,
            pointsCount: 60,
            volatility: 1,
            baseValue: 10,
            smoothness: 0.5 // For more natural fluid movement
        }, options);

        // Initialize data array
        this.data = Array.from({ length: this.options.pointsCount }, () => this.options.baseValue);
        this.currentValue = this.options.baseValue;
        
        // Random walk pre-fill
        for(let i=0; i<this.options.pointsCount; i++) {
            this.tick(true);
        }
    }

    generateNextPoint(prevValue) {
        let change = (Math.random() - 0.5) * this.options.volatility;
        let newValue = prevValue + change;
        
        // Soft bounds to keep it realistic
        if (newValue > this.options.max * 0.85) newValue -= Math.abs(change) * 1.5;
        if (newValue < this.options.min + (this.options.max * 0.15)) newValue += Math.abs(change) * 1.5;
        return newValue;
    }

    tick(silent = false) {
        this.data.shift();
        this.currentValue = this.generateNextPoint(this.currentValue);
        this.data.push(this.currentValue);
        if (!silent) this.render();
    }

    render() {
        if (!this.linePath) return;

        const w = this.options.width;
        // SVG viewbox height for main chart was updated to 180
        const h = this.linePath.id.includes('main') ? 180 : this.options.height;
        const min = this.options.min;
        const max = this.options.max;
        const range = max - min;
        
        const dx = w / (this.options.pointsCount - 1);
        
        // Calculate smooth path using cubic bezier curves
        let pathD = `M 0,${h - ((this.data[0] - min) / range) * h}`;
        
        for (let i = 0; i < this.data.length - 1; i++) {
            const x0 = i * dx;
            const y0 = h - ((this.data[i] - min) / range) * h;
            
            const x1 = (i + 1) * dx;
            const y1 = h - ((this.data[i + 1] - min) / range) * h;
            
            // simple smooth curve
            const cx = (x0 + x1) / 2;
            pathD += ` C ${cx},${y0} ${cx},${y1} ${x1},${y1}`;
        }
        
        this.linePath.setAttribute('d', pathD);
        
        if (this.fillPath) {
            const fillD = pathD + ` L ${w},${h} L 0,${h} Z`;
            this.fillPath.setAttribute('d', fillD);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Only run if the console is present
    if (!document.querySelector('.ut-console')) return;

    // Initialize Main Charts (smooth, slow update for "breathing" effect)
    const mainIntake = new LiveChart('ut-main-in', { width: 1000, height: 180, min: 0, max: 25, pointsCount: 80, baseValue: 15, volatility: 1.2 });
    const mainOutput = new LiveChart('ut-main-out', { width: 1000, height: 180, min: 0, max: 25, pointsCount: 80, baseValue: 3, volatility: 0.4 });

    const aqMainIntake = new LiveChart('ut-aq-main-in', { width: 1000, height: 180, min: 0, max: 25, pointsCount: 80, baseValue: 15, volatility: 1.2 });
    const aqMainOutput = new LiveChart('ut-aq-main-out', { width: 1000, height: 180, min: 0, max: 25, pointsCount: 80, baseValue: 3, volatility: 0.4 });

    // Initialize Sparklines (fast updating)
    const sparks = [
        new LiveChart('ut-spark-out-1', { width: 100, height: 30, min: 0, max: 50, pointsCount: 40, baseValue: 12, volatility: 3 }),
        new LiveChart('ut-spark-out-2', { width: 100, height: 30, min: 0, max: 50, pointsCount: 40, baseValue: 10, volatility: 2 }),
        new LiveChart('ut-spark-out-3', { width: 100, height: 30, min: 0, max: 50, pointsCount: 40, baseValue: 14, volatility: 4 }),
        new LiveChart('ut-spark-in-1', { width: 100, height: 30, min: 0, max: 150, pointsCount: 40, baseValue: 85, volatility: 6 }),
        new LiveChart('ut-spark-in-2', { width: 100, height: 30, min: 0, max: 150, pointsCount: 40, baseValue: 60, volatility: 4 }),
        new LiveChart('ut-spark-in-3', { width: 100, height: 30, min: 0, max: 150, pointsCount: 40, baseValue: 110, volatility: 7 })
    ];

    const aqSparks = [
        new LiveChart('ut-aq-spark-out-1', { width: 100, height: 30, min: 0, max: 50, pointsCount: 40, baseValue: 12, volatility: 3 }),
        new LiveChart('ut-aq-spark-out-2', { width: 100, height: 30, min: 0, max: 50, pointsCount: 40, baseValue: 10, volatility: 2 }),
        new LiveChart('ut-aq-spark-out-3', { width: 100, height: 30, min: 0, max: 50, pointsCount: 40, baseValue: 14, volatility: 4 }),
        new LiveChart('ut-aq-spark-in-1', { width: 100, height: 30, min: 0, max: 150, pointsCount: 40, baseValue: 85, volatility: 6 }),
        new LiveChart('ut-aq-spark-in-2', { width: 100, height: 30, min: 0, max: 150, pointsCount: 40, baseValue: 60, volatility: 4 }),
        new LiveChart('ut-aq-spark-in-3', { width: 100, height: 30, min: 0, max: 150, pointsCount: 40, baseValue: 110, volatility: 7 })
    ];

    const valOutAqi = document.getElementById('ut-val-out-aqi');
    const valOutPm25 = document.getElementById('ut-val-out-pm25');
    const valOutPm10 = document.getElementById('ut-val-out-pm10');
    
    const valInAqi = document.getElementById('ut-val-in-aqi');
    const valInPm25 = document.getElementById('ut-val-in-pm25');
    const valInPm10 = document.getElementById('ut-val-in-pm10');

    const aqValOutAqi = document.getElementById('ut-aq-val-out-aqi');
    const aqValOutPm25 = document.getElementById('ut-aq-val-out-pm25');
    const aqValOutPm10 = document.getElementById('ut-aq-val-out-pm10');
    
    const aqValInAqi = document.getElementById('ut-aq-val-in-aqi');
    const aqValInPm25 = document.getElementById('ut-aq-val-in-pm25');
    const aqValInPm10 = document.getElementById('ut-aq-val-in-pm10');

    let lastTime = 0;
    const updateInterval = 1000; // 1 second updates for realistic sensor feel

    function animate(time) {
        if (time - lastTime > updateInterval) {
            mainIntake.tick();
            mainOutput.tick();
            sparks.forEach(s => s.tick());

            aqMainIntake.tick();
            aqMainOutput.tick();
            aqSparks.forEach(s => s.tick());

            if (valOutAqi) valOutAqi.innerText = Math.round(sparks[0].currentValue);
            if (valOutPm25) valOutPm25.innerText = sparks[1].currentValue.toFixed(1);
            if (valOutPm10) valOutPm10.innerText = sparks[2].currentValue.toFixed(1);

            if (valInAqi) valInAqi.innerText = Math.round(sparks[3].currentValue);
            if (valInPm25) valInPm25.innerText = sparks[4].currentValue.toFixed(1);
            if (valInPm10) valInPm10.innerText = sparks[5].currentValue.toFixed(1);

            if (aqValOutAqi) aqValOutAqi.innerText = Math.round(aqSparks[0].currentValue);
            if (aqValOutPm25) aqValOutPm25.innerText = aqSparks[1].currentValue.toFixed(1);
            if (aqValOutPm10) aqValOutPm10.innerText = aqSparks[2].currentValue.toFixed(1);

            if (aqValInAqi) aqValInAqi.innerText = Math.round(aqSparks[3].currentValue);
            if (aqValInPm25) aqValInPm25.innerText = aqSparks[4].currentValue.toFixed(1);
            if (aqValInPm10) aqValInPm10.innerText = aqSparks[5].currentValue.toFixed(1);

            lastTime = time;
        }
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    // Live Clock
    const clockEl = document.getElementById('ut-live-clock');
    if (clockEl) {
        setInterval(() => {
            const now = new Date();
            clockEl.innerText = now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        }, 1000);
        // initial call
        clockEl.innerText = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
    
    // Generate X axis time labels
    const xAxisEl = document.getElementById('ut-x-axis');
    if (xAxisEl) {
        let html = '';
        let now = new Date();
        for (let i = 5; i >= 0; i--) {
            let t = new Date(now.getTime() - i * 5 * 60000);
            html += `<span>${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}</span>`;
        }
        xAxisEl.innerHTML = html;
    }
    
    // Theme Toggle
    const themeToggle = document.querySelector('.ut-theme-toggle');
    const consoleEl = document.querySelector('.ut-console');
    if (themeToggle && consoleEl) {
        themeToggle.addEventListener('click', () => {
            const isLight = consoleEl.classList.toggle('ut-theme-light');
            consoleEl.classList.toggle('dark', !isLight);
            const knob = themeToggle.querySelector('.ut-toggle-knob');
            if (knob) {
                if (isLight) {
                    knob.style.left = '18px';
                    knob.style.background = '#0f172a';
                    themeToggle.querySelector('.ut-toggle-switch').style.background = '#e2e8f0';
                } else {
                    knob.style.left = '3px';
                    knob.style.background = '#10b981';
                    themeToggle.querySelector('.ut-toggle-switch').style.background = '#111827';
                }
            }
        });
    }
    
    // Toggle switches interactivity for Device Controls
    const toggles = document.querySelectorAll('.ut-toggle-switch');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // Prevent interference with theme toggle if it's the theme one
            if(this.closest('.ut-theme-toggle')) return;
            
            this.classList.toggle('active');
            
            // update sibling text if exists
            const textSpan = this.nextElementSibling;
            if (textSpan && textSpan.tagName === 'SPAN') {
                if (this.classList.contains('active')) {
                    textSpan.textContent = 'ON';
                    textSpan.classList.remove('opacity-0');
                    textSpan.classList.add('text-[#10b981]');
                    textSpan.classList.remove('text-gray-500');
                } else {
                    textSpan.textContent = 'OFF';
                    textSpan.classList.remove('opacity-0');
                    textSpan.classList.remove('text-[#10b981]');
                    textSpan.classList.add('text-gray-500');
                }
            }
        });
    });

    // Chart interactive tooltip
    const svgEl = document.getElementById('ut-main-svg');
    const tooltipGroup = document.getElementById('ut-custom-tooltip');
    const ttLine = document.getElementById('ut-tt-line');
    const ttDotIn = document.getElementById('ut-tt-dot-in');
    const ttDotOut = document.getElementById('ut-tt-dot-out');
    const ttHtml = document.getElementById('ut-tt-html');
    const ttTimeIn = document.getElementById('ut-tt-time-in');
    const ttTimeOut = document.getElementById('ut-tt-time-out');
    const ttValIn = document.getElementById('ut-tt-val-in');
    const ttValOut = document.getElementById('ut-tt-val-out');

    if (svgEl && tooltipGroup && ttHtml) {
        svgEl.addEventListener('mousemove', (e) => {
            const rect = svgEl.getBoundingClientRect();
            let x = e.clientX - rect.left;
            
            // Map x to SVG coordinate system (0 to 1000)
            const svgX = (x / rect.width) * 1000;
            const boundedX = Math.max(0, Math.min(1000, svgX));
            
            // Find closest data points
            const pointIndex = Math.round((boundedX / 1000) * (mainIntake.options.pointsCount - 1));
            
            if (pointIndex >= 0 && pointIndex < mainIntake.data.length) {
                const h = 180;
                const inVal = mainIntake.data[pointIndex];
                const outVal = mainOutput.data[pointIndex];
                
                const inRange = mainIntake.options.max - mainIntake.options.min;
                const outRange = mainOutput.options.max - mainOutput.options.min;

                const yIn = h - ((inVal - mainIntake.options.min) / inRange) * h;
                const yOut = h - ((outVal - mainOutput.options.min) / outRange) * h;

                // Update SVG Tooltip line & dots
                ttLine.setAttribute('x1', boundedX);
                ttLine.setAttribute('x2', boundedX);
                ttDotIn.setAttribute('cx', boundedX);
                ttDotIn.setAttribute('cy', yIn);
                ttDotOut.setAttribute('cx', boundedX);
                ttDotOut.setAttribute('cy', yOut);

                tooltipGroup.style.opacity = '1';
                ttHtml.style.opacity = '1';
                ttHtml.style.transform = `translateX(${x}px)`;

                // Calculate a realistic time for the tooltip
                const now = new Date();
                const totalMinutes = 30; // 30 min view
                const minOffset = totalMinutes - ((pointIndex / mainIntake.options.pointsCount) * totalMinutes);
                const pointTime = new Date(now.getTime() - minOffset * 60000);
                const timeStr = `${pointTime.getHours().toString().padStart(2, '0')}:${pointTime.getMinutes().toString().padStart(2, '0')}`;

                if(ttTimeIn) ttTimeIn.innerText = timeStr;
                if(ttTimeOut) ttTimeOut.innerText = timeStr;
                if(ttValIn) ttValIn.innerText = Math.round(inVal);
                if(ttValOut) ttValOut.innerText = Math.round(outVal);
                
                // Adjust HTML overlay box positions relative to the HTML container
                const htmlRect = ttHtml.parentElement.getBoundingClientRect();
                const yInHtml = (yIn / 180) * htmlRect.height;
                const yOutHtml = (yOut / 180) * htmlRect.height;

                const inBox = document.getElementById('ut-tt-in-box');
                const outBox = document.getElementById('ut-tt-out-box');
                
                if(inBox) inBox.style.top = `${yInHtml}px`;
                if(outBox) outBox.style.top = `${yOutHtml}px`;
            }
        });

        svgEl.addEventListener('mouseleave', () => {
            tooltipGroup.style.opacity = '0';
            ttHtml.style.opacity = '0';
        });
    }
    
    // UT Console Navigation
    const navItems = document.querySelectorAll('.ut-nav-item');
    const views = document.querySelectorAll('.ut-view');
    
    // Check initial route on load
    const currentPath = window.location.pathname.replace(/^\//, '');
    let initialNav = Array.from(navItems).find(n => n.dataset.route === currentPath);
    if (!initialNav) initialNav = Array.from(navItems).find(n => n.classList.contains('active'));
    
    if (initialNav) {
        setTimeout(() => initialNav.click(), 50); // slight delay to ensure DOM is ready
    }
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = item.dataset.target || 'ut-view-dashboard';
            const route = item.dataset.route || '';
            
            // Hide all views, show target
            views.forEach(v => {
                v.classList.remove('active');
                v.classList.add('hidden');
            });
            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.classList.add('active');
                targetView.classList.remove('hidden');
            }
            
            // Toggle right panel visibility based on view
            if (targetId === 'ut-view-dashboard' || targetId === 'ut-view-air-quality') {
                consoleEl.classList.add('hide-right');
            } else {
                consoleEl.classList.remove('hide-right');
            }
            
            // Update nav active state
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            
            // Update URL to match mockup screenshots (without reloading page)
            if (route) {
                history.pushState(null, '', `/${route}`);
            } else {
                history.pushState(null, '', '/');
            }
        });
    });
});
