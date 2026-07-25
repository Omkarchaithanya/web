import { apiFetch } from './api.js';

function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

const initIndex = () => {

    // --- 1. SCROLL REVEAL ---
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, observerOptions);
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.fade-up').forEach(el => {
                    setTimeout(() => el.classList.add('visible'), 100);
                });
            }
        });
    }, { threshold: 0.2 });
    document.querySelectorAll('.snap-section, .snap-section-scroll').forEach(s => sectionObserver.observe(s));

    // --- 2. HERO VIDEO ---
    const heroVideo = document.getElementById('hero-video');
    const heroText = document.getElementById('hero-text');
    const heroClickPrompt = document.getElementById('hero-click-prompt');
    const promptInner = document.getElementById('prompt-inner');
    const heroScrollHint = document.querySelector('.hero-scroll-hint');
    const heroTypingText = document.getElementById('hero-typing-text');
    const heroTypingCursor = document.getElementById('hero-typing-cursor');
    let heroVideoStarted = false;

    if (heroVideo) {
        heroVideo.loop = false;
        heroVideo.playsInline = true;
        heroVideo.setAttribute('playsinline', '');
        heroVideo.addEventListener('ended', () => { heroVideo.pause(); });
    }

    function revealHeroText() {
        if (!heroText) return;
        heroText.style.opacity = '1';
        heroText.style.transform = 'translateY(0)';
        if (heroScrollHint) heroScrollHint.classList.add('visible');
        const h1 = heroText.querySelector('h1');
        if (h1) {
            h1.style.opacity = '1';
            h1.style.transform = 'translateY(0)';
        }

        const subtitle = heroText.querySelector('p');
        const buttons = heroText.querySelector('div');

        setTimeout(() => {
            if (!subtitle) return;
            subtitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            subtitle.style.opacity = '1';
            subtitle.style.transform = 'translateY(0)';
        }, 350);

        setTimeout(() => {
            if (!buttons) return;
            buttons.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            buttons.style.opacity = '1';
            buttons.style.transform = 'translateY(0)';
        }, 650);
    }

    window.startHeroVideo = function () {
        if (!heroVideo || heroVideoStarted) return;
        heroVideoStarted = true;

        // Fade out & remove the typing prompt
        if (promptInner) {
            promptInner.style.opacity = '0';
            promptInner.style.transform = 'scale(0.9)';
        }
        setTimeout(() => {
            if (heroClickPrompt) heroClickPrompt.style.display = 'none';
        }, 500);

        const playVideo = () => {
            const playPromise = heroVideo.play();
            if (playPromise && typeof playPromise.then === 'function') {
                playPromise.catch(() => {
                    // Browsers block unmuted autoplay — fall back to muted so it still starts
                    heroVideo.muted = true;
                    heroVideo.play().catch(() => { });
                });
            }
        };

        // Prefer sound; muted fallback if autoplay policy blocks it
        heroVideo.muted = false;
        heroVideo.volume = 1;
        playVideo();
        heroVideo.addEventListener('ended', revealHeroText, { once: true });
    };

    if (heroTypingText) {
        const text = heroTypingText.dataset.text || '';
        let index = 0;
        heroTypingText.textContent = '';
        const typeNextLetter = () => {
            heroTypingText.textContent = text.slice(0, index);
            index += 1;
            if (index <= text.length) {
                setTimeout(typeNextLetter, 75);
            } else {
                if (heroTypingCursor) {
                    heroTypingCursor.style.animation = 'heroCursorBlink 0.8s steps(2, start) infinite';
                }
                // After typing finishes, autoplay the hero video
                setTimeout(() => {
                    if (typeof window.startHeroVideo === 'function') {
                        window.startHeroVideo();
                    }
                }, 600);
            }
        };
        setTimeout(typeNextLetter, 350);
    }

    // --- 3. AIR CRISIS SLIDER ---
    const crisisSlider = document.getElementById('crisis-slider');
    const pollutedLayer = document.getElementById('polluted-layer');
    const pollutedImg = document.getElementById('polluted-img');
    const sliderDivider = document.getElementById('slider-divider');
    const crisisSection = document.getElementById('air-crisis');

    if (crisisSlider && pollutedLayer && sliderDivider && crisisSection) {
        let crisisDragging = false;
        let crisisAutoPlayed = false;
        let crisisSplitPercent = 100;

        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function syncPollutedImgWidth() {
            if (pollutedImg) pollutedImg.style.width = `${crisisSlider.clientWidth}px`;
        }

        function setCrisisSplit(percent) {
            crisisSplitPercent = Math.max(0, Math.min(100, percent));
            pollutedLayer.style.width = `${crisisSplitPercent}%`;
            sliderDivider.style.left = `${crisisSplitPercent}%`;
        }

        function setCrisisSplitFromClientX(clientX) {
            const rect = crisisSlider.getBoundingClientRect();
            const percent = ((clientX - rect.left) / rect.width) * 100;
            setCrisisSplit(percent);
        }

        function animateCrisisSplit(from, to, duration) {
            return new Promise(resolve => {
                let start = null;
                function frame(timestamp) {
                    if (!start) start = timestamp;
                    const progress = Math.min((timestamp - start) / duration, 1);
                    setCrisisSplit(from + (to - from) * easeInOutCubic(progress));
                    if (progress < 1) requestAnimationFrame(frame);
                    else resolve();
                }
                requestAnimationFrame(frame);
            });
        }

        function wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function playCrisisSequence() {
            setCrisisSplit(100);
            await wait(700);
            await animateCrisisSplit(100, 0, 2200);
            await wait(900);
            await animateCrisisSplit(0, 50, 1600);
        }

        syncPollutedImgWidth();
        window.addEventListener('resize', syncPollutedImgWidth);
        setCrisisSplit(100);

        crisisSlider.addEventListener('pointerdown', event => {
            crisisDragging = true;
            crisisSlider.setPointerCapture(event.pointerId);
            setCrisisSplitFromClientX(event.clientX);
        });

        crisisSlider.addEventListener('pointermove', event => {
            if (!crisisDragging) return;
            setCrisisSplitFromClientX(event.clientX);
        });

        crisisSlider.addEventListener('pointerup', event => {
            crisisDragging = false;
            if (crisisSlider.hasPointerCapture(event.pointerId)) {
                crisisSlider.releasePointerCapture(event.pointerId);
            }
        });

        crisisSlider.addEventListener('pointercancel', () => {
            crisisDragging = false;
        });

        document.addEventListener('mouseup', () => {
            crisisDragging = false;
        });

        const crisisSnapObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (crisisAutoPlayed) return;
                    crisisAutoPlayed = true;
                    playCrisisSequence();
                } else {
                    crisisDragging = false;
                }
            });
        }, { threshold: 0.55 });
        crisisSnapObserver.observe(crisisSection);
    }

    // --- 4. DASHBOARD ---
    (async function () {
        function roiCard(d) {
            const barW = Math.round((1 - d.after / d.before) * 100);
            return `<div style="background:#1a2332; border:1px solid #ffffff15; border-radius:10px; padding:10px;">
                <div style="font-family:monospace; font-size:10px; font-weight:700; color:#e5e7eb; letter-spacing:0.1em; margin-bottom:6px;">${d.zone}</div>
                <div style="display:flex; justify-content:space-between; font-family:monospace; font-size:10px; color:#9ca3af; margin-bottom:2px;">
                    <span>Before</span><span style="color:#f97316; font-weight:700;">AQI ${d.before}</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-family:monospace; font-size:10px; color:#9ca3af; margin-bottom:6px;">
                    <span>After</span><span style="color:#4a9e3f; font-weight:700;">AQI ${d.after}</span>
                </div>
                <div style="font-family:monospace; font-size:11px; font-weight:700; color:#4a9e3f; margin-bottom:4px;">${d.pct}% pollution reduction</div>
                <div style="height:3px; background:#1f2937; border-radius:2px; margin-bottom:2px;">
                    <div style="height:3px; width:${barW}%; background:linear-gradient(to right,#ef4444,#4a9e3f); border-radius:2px;"></div>
                </div>
            </div>`;
        }

        function zoneCard(z, boxNum) {
            return `<div class="zone-card-dynamic" data-zone-name="${escapeHTML(z.name)}" data-box-num="${boxNum}" data-base-color="${escapeHTML(z.color)}" style="background:#1a2332; border:1px solid ${escapeHTML(z.color)}33; border-radius:8px; padding:8px; cursor:pointer;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                    <span style="font-family:monospace; font-size:9px; color:#9ca3af;">${escapeHTML(z.name)}</span>
                    <span style="width:7px; height:7px; border-radius:50%; background:${escapeHTML(z.color)}; display:inline-block;"></span>
                </div>
                <div style="font-family:monospace; font-size:18px; font-weight:700; color:${escapeHTML(z.color)}; line-height:1;">${escapeHTML(z.aqi)}</div>
                <div style="font-family:monospace; font-size:8px; color:${escapeHTML(z.color)}; opacity:0.7; margin-top:2px; text-transform:uppercase; letter-spacing:0.05em;">${escapeHTML(z.label)}</div>
            </div>`;
        }

        function renderDashboard(roiId, zoneId, boxNum, roiData, zoneData) {
            const roiEl = document.getElementById(roiId);
            const zoneEl = document.getElementById(zoneId);
            if (roiEl) roiEl.innerHTML = roiData.map(roiCard).join('');
            if (zoneEl) zoneEl.innerHTML = zoneData.map(z => zoneCard(z, boxNum)).join('');
        }

        try {
            const zonesRes = await apiFetch('/zones');
            const zones = zonesRes.data || zonesRes;
            
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
                
                let color = '#4a9e3f'; // good
                if(aqi > 50) color = '#eab308'; // moderate
                if(aqi > 100) color = '#f97316'; // unhealthy for some
                if(aqi > 150) color = '#ef4444'; // unhealthy
                if(aqi > 200) color = '#a855f7'; // hazardous
                
                return {
                    name: z.name,
                    aqi: aqi,
                    label: label,
                    color: color
                };
            });

            renderDashboard('roi-grid', 'zone-grid', 1, roiData, zoneData);
            renderDashboard('roi-grid-2', 'zone-grid-2', 2, roiData, zoneData);

            // Add event delegation for zone cards
            document.querySelectorAll('.zone-card-dynamic').forEach(el => {
                el.addEventListener('mouseover', function() {
                    this.style.borderColor = this.dataset.baseColor + '99';
                });
                el.addEventListener('mouseout', function() {
                    this.style.borderColor = this.dataset.baseColor + '33';
                });
                el.addEventListener('click', function() {
                    if (typeof window.openZoneModal === 'function') {
                        window.openZoneModal(this.dataset.zoneName, this.dataset.boxNum);
                    }
                });
            });

        } catch (e) {
            console.error("Failed to load dashboard data", e);
        }
    })();

    // --- 5. NAVBAR LOGO COLOR (Removed to prevent conflict with index.html setTheme logic) ---

    // --- 6. PRODUCT INTRO CINEMATIC REVEAL (ends on URBAN Tree → auto-scroll) ---
    const productSection = document.getElementById('product-intro');

    if (productSection) {
        let introPlayed = false;
        let introAutoScrolled = false;

        function scrollToWhatIsUrbanTree() {
            if (introAutoScrolled) return;
            const nextSection = document.getElementById('what-is-urbantree');
            if (!nextSection) return;
            introAutoScrolled = true;

            const snap = document.getElementById('snap-container');
            if (snap) {
                const top = nextSection.offsetTop;
                snap.scrollTo({ top, behavior: 'smooth' });
            } else {
                nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        function showStaticBrand(introBrandReveal, overlay) {
            if (overlay) {
                overlay.style.display = 'none';
                overlay.style.opacity = '0';
            }
            if (introBrandReveal) {
                introBrandReveal.style.display = 'flex';
                introBrandReveal.style.opacity = '1';
                introBrandReveal.classList.add('active');
            }
        }

        const productObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const overlay = document.getElementById('cinema-overlay');
                const wordEl = document.getElementById('cinema-word');
                const introBrandReveal = document.getElementById('intro-brand-reveal');
                const assemblyStage = document.getElementById('device-assembly-stage');
                const contentBlock = document.getElementById('product-content');
                const productImgWrap = document.getElementById('product-img-wrap');

                // Keep device / feature showcase hidden — sequence stops at URBAN Tree
                if (assemblyStage) {
                    assemblyStage.style.display = 'none';
                    assemblyStage.classList.remove('active', 'settled', 'showcase', 'fade-out');
                }
                if (contentBlock) contentBlock.style.opacity = '0';
                if (productImgWrap) {
                    productImgWrap.style.opacity = '0';
                    productImgWrap.style.transform = 'translateY(18px)';
                }

                if (entry.isIntersecting) {
                    // Already played once: keep brand visible, do not restart or re-scroll
                    if (introPlayed) {
                        showStaticBrand(introBrandReveal, overlay);
                        return;
                    }
                    introPlayed = true;

                    const words = ['Introducing', 'The', "World's", 'First', 'Outdoor', 'Bio Air Purifier'];
                    if (overlay) {
                        overlay.style.display = 'flex';
                        overlay.style.zIndex = '20';
                        overlay.style.opacity = '1';
                        overlay.style.transition = 'none';
                    }
                    if (introBrandReveal) {
                        introBrandReveal.classList.remove('active');
                        introBrandReveal.style.display = 'none';
                        introBrandReveal.style.opacity = '';
                    }

                    let i = 0;

                    function playIntroBrandReveal() {
                        if (!introBrandReveal) {
                            scrollToWhatIsUrbanTree();
                            return;
                        }
                        introBrandReveal.classList.remove('active');
                        introBrandReveal.style.display = 'flex';
                        introBrandReveal.style.opacity = '1';
                        void introBrandReveal.offsetWidth;
                        introBrandReveal.classList.add('active');
                        // Brand settles (~1.45s), hold briefly, then scroll to What is UrbanTree
                        setTimeout(scrollToWhatIsUrbanTree, 2800);
                    }

                    function showNextWord() {
                        if (!wordEl || !overlay) return;
                        if (i >= words.length) {
                            overlay.style.transition = 'opacity 0.7s ease';
                            overlay.style.opacity = '0';
                            setTimeout(() => {
                                overlay.style.display = 'none';
                                playIntroBrandReveal();
                            }, 700);
                            return;
                        }
                        wordEl.style.transition = 'none';
                        wordEl.style.opacity = '0';
                        wordEl.style.transform = 'scale(0.86) translateY(24px)';
                        wordEl.textContent = words[i];
                        setTimeout(() => {
                            wordEl.style.transition = 'opacity 0.5s ease, transform 0.65s cubic-bezier(0.2,0.8,0.2,1)';
                            wordEl.style.opacity = '1';
                            wordEl.style.transform = 'scale(1) translateY(0)';
                        }, 60);
                        i += 1;
                        setTimeout(showNextWord, 1400);
                    }
                    showNextWord();

                } else if (!introPlayed) {
                    if (overlay) {
                        overlay.style.display = 'none';
                        overlay.style.opacity = '0';
                    }
                    if (introBrandReveal) {
                        introBrandReveal.classList.remove('active');
                        introBrandReveal.style.display = 'none';
                        introBrandReveal.style.opacity = '';
                    }
                    productSection.querySelectorAll('.cinema-reveal').forEach(el => {
                        el.style.opacity = '0';
                        el.style.transform = 'translateY(30px)';
                    });
                    const brandName = document.getElementById('urbantree-name');
                    if (brandName) {
                        brandName.style.opacity = '0';
                        brandName.style.transform = 'scale(0.7)';
                    }
                }
            });
        }, { threshold: 0.5 });
        productObserver.observe(productSection);
    }

};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIndex);
} else {
    initIndex();
}

// ═══ ZONE MODAL — global scope ═══

const zoneDetails = {
    'Indiranagar': { id: 'AWD-001', lat: '12.97°N', lng: '77.64°E', solar: 92, pm1: 18, pm25: 32, pm10: 51, co2: 540, voc: 0.7, temp: 26, humidity: 61, aqi: 44, airIntake: 380, purEff: 74, coverage: 250, fanSpeed: '65%', hepa: 82, carbon: 91, prefilter: 78, uvLight: true, ionizer: true, moss: true, cyclone: true, power: 'Solar', lastSync: '1 min ago', firmware: 'v3.1.4' },
    'MG Road': { id: 'AWD-002', lat: '12.97°N', lng: '77.61°E', solar: 78, pm1: 29, pm25: 51, pm10: 88, co2: 720, voc: 1.2, temp: 28, humidity: 54, aqi: 94, airIntake: 440, purEff: 58, coverage: 200, fanSpeed: '75%', hepa: 55, carbon: 68, prefilter: 49, uvLight: true, ionizer: false, moss: false, cyclone: true, power: 'Grid', lastSync: '3 min ago', firmware: 'v3.1.3' },
    'Silk Board': { id: 'AWD-003', lat: '12.91°N', lng: '77.62°E', solar: 65, pm1: 41, pm25: 79, pm10: 118, co2: 890, voc: 1.8, temp: 29, humidity: 58, aqi: 142, airIntake: 500, purEff: 44, coverage: 180, fanSpeed: '90%', hepa: 31, carbon: 47, prefilter: 28, uvLight: true, ionizer: true, moss: false, cyclone: true, power: 'Solar', lastSync: '5 min ago', firmware: 'v3.1.4' },
    'BTM Layout': { id: 'AWD-004', lat: '12.91°N', lng: '77.61°E', solar: 70, pm1: 38, pm25: 72, pm10: 109, co2: 810, voc: 1.5, temp: 28, humidity: 60, aqi: 179, airIntake: 480, purEff: 49, coverage: 190, fanSpeed: '85%', hepa: 22, carbon: 55, prefilter: 33, uvLight: false, ionizer: true, moss: true, cyclone: true, power: 'Solar', lastSync: '2 min ago', firmware: 'v3.1.2' },
    'Whitefield': { id: 'AWD-005', lat: '12.97°N', lng: '77.75°E', solar: 88, pm1: 21, pm25: 36, pm10: 58, co2: 580, voc: 0.8, temp: 27, humidity: 59, aqi: 59, airIntake: 390, purEff: 71, coverage: 240, fanSpeed: '60%', hepa: 76, carbon: 83, prefilter: 70, uvLight: true, ionizer: true, moss: true, cyclone: true, power: 'Solar', lastSync: '1 min ago', firmware: 'v3.1.4' },
    'Koramangala': { id: 'AWD-006', lat: '13.02°N', lng: '77.51°E', solar: 87, pm1: 22, pm25: 38, pm10: 60, co2: 610, voc: 0.9, temp: 27, humidity: 56, aqi: 95, airIntake: 420, purEff: 61, coverage: 250, fanSpeed: '80%', hepa: 18, carbon: 72, prefilter: 34, uvLight: true, ionizer: true, moss: false, cyclone: true, power: 'Solar', lastSync: '2 min ago', firmware: 'v3.1.4' },
    'Marathahalli': { id: 'AWD-007', lat: '12.96°N', lng: '77.70°E', solar: 74, pm1: 35, pm25: 65, pm10: 98, co2: 760, voc: 1.4, temp: 29, humidity: 55, aqi: 132, airIntake: 460, purEff: 52, coverage: 200, fanSpeed: '82%', hepa: 40, carbon: 60, prefilter: 45, uvLight: true, ionizer: false, moss: false, cyclone: true, power: 'Grid', lastSync: '4 min ago', firmware: 'v3.1.3' },
    'Jayanagar': { id: 'AWD-008', lat: '12.93°N', lng: '77.58°E', solar: 91, pm1: 19, pm25: 33, pm10: 52, co2: 550, voc: 0.7, temp: 26, humidity: 62, aqi: 58, airIntake: 370, purEff: 76, coverage: 260, fanSpeed: '62%', hepa: 85, carbon: 90, prefilter: 80, uvLight: true, ionizer: true, moss: true, cyclone: true, power: 'Solar', lastSync: '1 min ago', firmware: 'v3.1.4' },
    'Peenya Indl.': { id: 'AWD-009', lat: '13.03°N', lng: '77.52°E', solar: 55, pm1: 68, pm25: 142, pm10: 198, co2: 1240, voc: 3.1, temp: 31, humidity: 49, aqi: 252, airIntake: 560, purEff: 28, coverage: 150, fanSpeed: '100%', hepa: 9, carbon: 22, prefilter: 11, uvLight: true, ionizer: true, moss: false, cyclone: true, power: 'Grid', lastSync: '6 min ago', firmware: 'v3.0.9' },
    'Yeshwanthpur': { id: 'AWD-010', lat: '13.02°N', lng: '77.55°E', solar: 68, pm1: 44, pm25: 88, pm10: 130, co2: 950, voc: 2.0, temp: 30, humidity: 52, aqi: 156, airIntake: 510, purEff: 41, coverage: 170, fanSpeed: '92%', hepa: 28, carbon: 43, prefilter: 25, uvLight: false, ionizer: true, moss: false, cyclone: true, power: 'Solar', lastSync: '3 min ago', firmware: 'v3.1.1' },
    'HSR Layout': { id: 'AWD-011', lat: '12.91°N', lng: '77.64°E', solar: 80, pm1: 27, pm25: 48, pm10: 79, co2: 680, voc: 1.1, temp: 27, humidity: 58, aqi: 97, airIntake: 430, purEff: 60, coverage: 220, fanSpeed: '72%', hepa: 52, carbon: 65, prefilter: 48, uvLight: true, ionizer: false, moss: true, cyclone: true, power: 'Solar', lastSync: '2 min ago', firmware: 'v3.1.4' },
    'Sarjapur': { id: 'AWD-012', lat: '12.86°N', lng: '77.68°E', solar: 93, pm1: 17, pm25: 30, pm10: 48, co2: 510, voc: 0.6, temp: 26, humidity: 64, aqi: 45, airIntake: 360, purEff: 78, coverage: 270, fanSpeed: '58%', hepa: 88, carbon: 94, prefilter: 82, uvLight: true, ionizer: true, moss: true, cyclone: true, power: 'Solar', lastSync: '1 min ago', firmware: 'v3.1.4' },
};

function getBarColor(val) {
    if (val >= 70) return '#4a9e3f';
    if (val >= 40) return '#eab308';
    return '#ef4444';
}

window.openZoneModal = function openZoneModal(name, boxNum) {
    const d = zoneDetails[name];
    if (!d) return;
    const aqiColor = d.aqi <= 50 ? '#4a9e3f' : d.aqi <= 100 ? '#eab308' : d.aqi <= 150 ? '#f97316' : d.aqi <= 200 ? '#ef4444' : '#a855f7';
    const aqiLabel = d.aqi <= 50 ? 'Good' : d.aqi <= 100 ? 'Moderate' : d.aqi <= 150 ? 'Unhealthy for Some' : d.aqi <= 200 ? 'Unhealthy' : 'Hazardous';
    const tog = (on) => `<span style="display:inline-block;width:36px;height:20px;border-radius:10px;background:${on ? '#4a9e3f' : '#374151'};position:relative;vertical-align:middle;"><span style="position:absolute;top:3px;${on ? 'right:3px' : 'left:3px'};width:14px;height:14px;border-radius:50%;background:white;"></span></span>`;
    const bar = (val) => `<div style="flex:1;height:4px;background:#1f2937;border-radius:2px;"><div style="width:${val}%;height:4px;background:${getBarColor(val)};border-radius:2px;"></div></div>`;

    document.getElementById('zone-modal-body-' + boxNum).innerHTML = `
        <div style="font-size:22px;font-weight:700;color:white;margin-bottom:2px;">${d.id}</div>
        <div style="font-size:11px;color:#9ca3af;margin-bottom:10px;">${name} · ${d.lat} ${d.lng}</div>
        <div style="display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap;">
            <span style="background:#4a9e3f33;color:#4a9e3f;border:1px solid #4a9e3f55;padding:3px 10px;border-radius:20px;font-size:11px;">Online</span>
            <span style="background:#ca8a0433;color:#eab308;border:1px solid #eab30855;padding:3px 10px;border-radius:20px;font-size:11px;">Solar ${d.solar}%</span>
            <span style="background:${aqiColor}22;color:${aqiColor};border:1px solid ${aqiColor}55;padding:3px 10px;border-radius:20px;font-size:11px;">AQI ${d.aqi} · ${aqiLabel}</span>
        </div>
        <div style="font-size:10px;font-weight:700;color:#6b7280;letter-spacing:0.1em;margin-bottom:10px;">SENSOR READINGS — REAL TIME</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;margin-bottom:16px;">
            ${[['PM1', d.pm1, 'ug/m3'], ['PM2.5', d.pm25, 'ug/m3'], ['PM10', d.pm10, 'ug/m3'], ['CO2', d.co2, 'ppm'],
        ['VOC', d.voc, 'mg/m3'], ['TEMP', d.temp, '°C'], ['HUMIDITY', d.humidity, '% RH'], ['AQI SCORE', d.aqi, 'overall index'],
        ['AIR INTAKE', d.airIntake, 'm3/hr'], ['PURIF. EFF.', d.purEff + '%', 'efficiency'], ['COVERAGE', d.coverage, 'meters'], ['FAN SPEED', d.fanSpeed, 'current']
        ].map(([label, val, unit]) => `
                <div style="background:#161f2e;border:1px solid #ffffff15;border-radius:8px;padding:10px;">
                    <div style="font-size:9px;color:#6b7280;margin-bottom:4px;">${label}</div>
                    <div style="font-size:18px;font-weight:700;color:#f97316;">${val}</div>
                    <div style="font-size:9px;color:#4b5563;">${unit}</div>
                </div>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
            <div>
                <div style="font-size:10px;font-weight:700;color:#6b7280;letter-spacing:0.1em;margin-bottom:10px;">SYSTEM STATUS</div>
                ${[['HEPA Filter', d.hepa], ['Carbon Filter', d.carbon], ['Pre-filter', d.prefilter]].map(([label, val]) => `
                    <div style="margin-bottom:8px;">
                        <div style="display:flex;justify-content:space-between;font-size:11px;color:#9ca3af;margin-bottom:3px;">
                            <span>${label}</span><span style="color:${getBarColor(val)};font-weight:700;">${val}%</span>
                        </div>
                        <div style="display:flex;align-items:center;">${bar(val)}</div>
                    </div>`).join('')}
                ${[['UV Light', d.uvLight], ['Ionizer', d.ionizer], ['Moss Chamber', d.moss], ['Cyclone Sep.', d.cyclone]].map(([label, on]) => `
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:11px;color:#9ca3af;">
                        <span>${label}</span>${tog(on)}
                    </div>`).join('')}
            </div>
            <div>
                <div style="font-size:10px;font-weight:700;color:#6b7280;letter-spacing:0.1em;margin-bottom:10px;">POWER & INFO</div>
                ${[['Power Source', d.power, '#eab308'], ['Solar Level', d.solar + '%', '#eab308'], ['Last Sync', d.lastSync, 'white'], ['Firmware', d.firmware, 'white'], ['GPS', `${d.lat}, ${d.lng}`, 'white']].map(([label, val, color]) => `
                    <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:8px;">
                        <span style="color:#6b7280;">${label}</span><span style="color:${color};font-weight:700;">${val}</span>
                    </div>`).join('')}
            </div>
        </div>
    `;
    document.getElementById('zone-modal-' + boxNum).style.display = 'flex';
}

function closeZoneModal(boxNum) {
    document.getElementById('zone-modal-' + boxNum).style.display = 'none';
}

document.addEventListener('click', function (e) {
    [1, 2].forEach(n => {
        const modal = document.getElementById('zone-modal-' + n);
        if (modal && e.target === modal) closeZoneModal(n);
    });
});

// ═══ TECHNOLOGY SECTION — Scroll-driven step highlighter + particle canvas ═══
(function initTechSection() {

    // ── Particle canvas ──
    const canvas = document.getElementById('tech-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        function spawnParticle() {
            return {
                x: Math.random() * canvas.width,
                y: canvas.height + 10,
                r: Math.random() * 2.5 + 0.5,
                speed: Math.random() * 0.6 + 0.2,
                drift: (Math.random() - 0.5) * 0.4,
                opacity: Math.random() * 0.5 + 0.2,
                color: Math.random() > 0.5 ? '#4a9e3f' : '#4a9e3f'
            };
        }

        for (let i = 0; i < 60; i++) {
            const p = spawnParticle();
            p.y = Math.random() * canvas.height;
            particles.push(p);
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                p.y -= p.speed;
                p.x += p.drift;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.fill();
                if (p.y < -10) particles[i] = spawnParticle();
            });
            ctx.globalAlpha = 1;
            requestAnimationFrame(animateParticles);
        }

        // Only run when section is visible
        const techSection = document.getElementById('technology');
        if (techSection) {
            const canvasObserver = new IntersectionObserver(entries => {
                entries.forEach(e => {
                    if (e.isIntersecting) animateParticles();
                });
            }, { threshold: 0.1 });
            canvasObserver.observe(techSection);
        }
    }

    const dotsContainer = document.getElementById('tech-progress-dots');
    const stepsCol = document.getElementById('tech-steps-col');
    const stepCards = document.querySelectorAll('.tech-step-card');
    const stepLabel = document.getElementById('tech-step-label');
    const stepCounter = document.getElementById('tech-step-counter');

    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 1; i <= 9; i++) {
            const dot = document.createElement('div');
            dot.className = 'tech-dot' + (i === 1 ? ' active' : '');
            dot.id = 'tech-dot-' + i;
            dotsContainer.appendChild(dot);
        }
    }

    if (stepsCol && stepCards.length) {
        const techSteps = Array.from(stepCards).map(card => {
            const title = card.querySelector('h3')?.textContent?.trim() || card.dataset.label || '';
            const copy = card.querySelector('p')?.innerHTML?.trim() || '';
            return {
                step: Number(card.dataset.step),
                label: card.dataset.label || title,
                title,
                copy
            };
        });

        stepsCol.removeAttribute('style');
        stepsCol.className = 'tech-tabs-shell';
        stepsCol.innerHTML = `
            <div class="tech-tabs-grid" role="tablist" aria-label="UrbanTree purification stages">
                ${techSteps.map(item => `
                    <button class="tech-step-tab" type="button" role="tab" data-tech-step="${item.step}" aria-selected="${item.step === 1 ? 'true' : 'false'}">
                        <span class="tech-tab-num">${String(item.step).padStart(2, '0')}</span>
                        <span>${item.title}</span>
                    </button>
                `).join('')}
            </div>
            <div class="tech-detail-panel" id="tech-detail-panel">
                <div class="tech-detail-kicker" id="tech-detail-kicker"></div>
                <h3 class="tech-detail-title" id="tech-detail-title"></h3>
                <p class="tech-detail-copy" id="tech-detail-copy"></p>
                <div class="tech-detail-badges">
                    <span class="tech-detail-badge">Hybrid purification</span>
                    <span class="tech-detail-badge">Outdoor ready</span>
                    <span class="tech-detail-badge">Bio-mechanical system</span>
                </div>
            </div>
        `;

        const tabs = stepsCol.querySelectorAll('.tech-step-tab');
        const detailPanel = document.getElementById('tech-detail-panel');
        const detailKicker = document.getElementById('tech-detail-kicker');
        const detailTitle = document.getElementById('tech-detail-title');
        const detailCopy = document.getElementById('tech-detail-copy');

        function setTechStep(step) {
            const active = techSteps.find(item => item.step === step) || techSteps[0];
            tabs.forEach(tab => {
                const isActive = Number(tab.dataset.techStep) === active.step;
                tab.classList.toggle('active', isActive);
                tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            if (stepLabel) stepLabel.textContent = active.label;
            if (stepCounter) stepCounter.textContent = `${active.step} / ${techSteps.length}`;
            if (detailKicker) detailKicker.textContent = `Stage ${String(active.step).padStart(2, '0')} / ${techSteps.length}`;
            if (detailTitle) detailTitle.textContent = active.title;
            if (detailCopy) detailCopy.innerHTML = active.copy;

            for (let i = 1; i <= techSteps.length; i++) {
                const dot = document.getElementById('tech-dot-' + i);
                if (!dot) continue;
                dot.className = 'tech-dot';
                if (i < active.step) dot.classList.add('done');
                else if (i === active.step) dot.classList.add('active');
            }

            if (detailPanel) {
                detailPanel.classList.remove('panel-swap');
                void detailPanel.offsetWidth;
                detailPanel.classList.add('panel-swap');
            }
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => setTechStep(Number(tab.dataset.techStep)));
        });

        setTechStep(1);
    }

})();
