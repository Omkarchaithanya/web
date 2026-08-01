const fs = require('fs');
const path = require('path');

const techFile = path.join(__dirname, 'technology.html');
let content = fs.readFileSync(techFile, 'utf8');

const replacement = `
    <!-- ═══ HERO ═══ -->
    <style id="tech-hero-styles">
        /* ── FADE UP ── */
        .fade-up { opacity: 0; transform: translateY(36px); transition: opacity 0.9s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .fade-up.visible { opacity: 1; transform: translateY(0); }

        /* ── TECH HERO (mockup match) ── */
        #tech-hero {
            --ah-green: #7CFC4A;
            --ah-green-soft: #9de764;
            background: #050505;
            min-height: auto;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            overflow: hidden;
            padding: clamp(6.5rem, 10vh, 7.5rem) 0 clamp(1.75rem, 3vh, 2.25rem);
        }

        @media (min-width: 1024px) {
            #tech-hero { min-height: min(92vh, 850px); }
        }

        .ah-bg {
            position: absolute;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            background:
                radial-gradient(ellipse 55% 50% at 68% 42%, rgba(34, 197, 94, 0.16), transparent 62%),
                radial-gradient(ellipse 40% 35% at 12% 70%, rgba(16, 185, 129, 0.08), transparent 60%),
                radial-gradient(circle at 80% 85%, rgba(45, 212, 191, 0.06), transparent 45%),
                #050505;
        }

        .ah-bg::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image:
                linear-gradient(rgba(16, 185, 129, 0.035) 1px, transparent 1px),
                linear-gradient(90deg, rgba(16, 185, 129, 0.035) 1px, transparent 1px);
            background-size: 72px 72px;
            mask-image: radial-gradient(ellipse 70% 60% at 65% 45%, #000 20%, transparent 75%);
            -webkit-mask-image: radial-gradient(ellipse 70% 60% at 65% 45%, #000 20%, transparent 75%);
            opacity: 0.7;
        }

        .ah-shell {
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: var(--section-max, 90rem);
            margin-inline: auto;
            padding-inline: var(--site-gutter, clamp(1.25rem, 3.5vw, 4rem));
            box-sizing: border-box;
        }

        .ah-main {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
            align-items: center;
        }

        @media (min-width: 1024px) {
            .ah-main { grid-template-columns: 1fr 1fr; gap: 4rem; }
        }

        .ah-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.35rem 0.85rem;
            border-radius: 999px;
            border: 1px solid rgba(124, 252, 74, 0.2);
            background: rgba(10, 20, 15, 0.6);
            color: var(--ah-green);
            font-family: var(--font-sans, 'Inter', sans-serif);
            font-size: var(--text-eyebrow, 0.65rem);
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            margin-bottom: 1rem;
        }
        .ah-badge svg { width: 12px; height: 12px; flex-shrink: 0; color: var(--ah-green); }

        .ah-title {
            color: #ffffff;
            margin: 0 0 1rem;
            font-size: clamp(2.5rem, 4.5vw, 4rem);
            line-height: 1.05;
            font-weight: 700;
            letter-spacing: -0.02em;
        }
        .ah-title-accent {
            display: block;
            color: var(--ah-green);
        }

        .ah-lead {
            color: #9ca3af;
            max-width: 34rem;
            margin: 0 0 1.5rem;
            font-size: clamp(1rem, 1.1vw, 1.05rem);
            line-height: 1.6;
        }
        .ah-lead em { font-style: normal; color: var(--ah-green); font-weight: 600; }

        .ah-actions { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; }
        .ah-btn {
            display: inline-flex; align-items: center; gap: 0.6rem;
            padding: 0.8rem 1.5rem; border-radius: 999px; font-family: 'Sora', sans-serif;
            font-size: 0.85rem; font-weight: 700; text-decoration: none;
            transition: all 0.2s ease;
        }
        .ah-btn svg { width: 18px; height: 18px; flex-shrink: 0; }
        .ah-btn--primary {
            background: var(--ah-green); color: #000;
            box-shadow: 0 0 20px rgba(124, 252, 74, 0.3);
        }
        .ah-btn--primary:hover {
            background: #8cdb52; transform: translateY(-2px);
        }
        .ah-btn--ghost {
            background: rgba(0, 0, 0, 0.4); color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .ah-btn--ghost:hover {
            border-color: rgba(124, 252, 74, 0.5); 
            transform: translateY(-2px);
        }

        /* Stats bar */
        .ah-stats {
            margin-top: clamp(2rem, 5vh, 4rem);
            border-radius: 1rem;
            border: 1px solid rgba(124, 252, 74, 0.3);
            background: rgba(5, 10, 8, 0.8);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            padding: 1.5rem;
            position: relative;
            overflow: hidden;
        }
        .ah-stats-grid {
            display: grid; gap: 1.5rem; position: relative; z-index: 1;
            grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 768px) {
            .ah-stats-grid { grid-template-columns: repeat(4, 1fr); gap: 2rem; }
            .ah-stat:not(:last-child)::after {
                content: ''; position: absolute; right: -1rem; top: 10%; height: 80%;
                width: 1px; background: rgba(255,255,255,0.05);
            }
        }
        .ah-stat { display: flex; align-items: flex-start; gap: 1rem; position: relative; }
        .ah-stat-icon {
            width: 44px; height: 44px; border-radius: 50%;
            border: 1px solid rgba(124, 252, 74, 0.3);
            display: flex; align-items: center; justify-content: center; color: var(--ah-green);
            flex-shrink: 0;
        }
        .ah-stat-icon svg { width: 20px; height: 20px; }
        .ah-stat-value {
            font-family: var(--font-sans, 'Inter', sans-serif); font-weight: 800; font-size: 1.5rem;
            color: #ffffff; letter-spacing: -0.02em; line-height: 1; margin-bottom: 0.25rem;
        }
        .ah-stat-title { font-family: 'Inter', sans-serif; font-size: 0.75rem; font-weight: 700; color: #fff; margin-bottom: 0.25rem; }
        .ah-stat-desc { font-size: 0.7rem; color: #9ca3af; line-height: 1.5; }
        .ah-stat-desc span { color: var(--ah-green); font-weight: 600; }

        /* Floating Graphic Area */
        .ah-graphic {
            position: relative;
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
        }
        .ah-graphic img {
            width: 100%;
            height: auto;
            display: block;
            filter: drop-shadow(0 0 40px rgba(124, 252, 74, 0.2));
            transform: scale(1.15);
        }
        .tech-callout {
            position: absolute;
            background: rgba(5, 10, 8, 0.85);
            border: 1px solid rgba(124, 252, 74, 0.3);
            border-radius: 8px;
            padding: 0.6rem 0.8rem;
            display: flex;
            align-items: center;
            gap: 0.6rem;
            backdrop-filter: blur(10px);
            z-index: 10;
            white-space: nowrap;
        }
        .callout-icon { color: var(--ah-green); display: flex; align-items: center; justify-content: center; }
        .callout-icon svg { width: 18px; height: 18px; }
        .callout-text { display: flex; flex-direction: column; }
        .callout-label { font-size: 0.55rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; line-height: 1; margin-bottom: 0.2rem; }
        .callout-value { font-size: 0.85rem; font-weight: 700; color: #fff; line-height: 1; font-family: 'Inter', sans-serif; }
        .callout-value.green { color: var(--ah-green); }
        
        /* Connector lines - mimicking the exact image style */
        .tech-callout::after { content: ''; position: absolute; background: rgba(124, 252, 74, 0.5); z-index: -1; }
        .tech-callout::before { content: ''; position: absolute; width: 4px; height: 4px; background: var(--ah-green); border-radius: 50%; z-index: 11; }
        
        .callout-tl { top: 15%; left: -8%; }
        .callout-tl::after { width: 30px; height: 1px; right: -30px; top: 50%; } 
        .callout-tl::before { right: -32px; top: calc(50% - 1.5px); }
        
        .callout-tr { top: 8%; right: -8%; }
        .callout-tr::after { width: 30px; height: 1px; left: -30px; top: 50%; } 
        .callout-tr::before { left: -32px; top: calc(50% - 1.5px); }
        
        .callout-bl { bottom: 35%; left: -12%; }
        .callout-bl::after { width: 30px; height: 1px; right: -30px; top: 50%; } 
        .callout-bl::before { right: -32px; top: calc(50% - 1.5px); }
        
        .callout-br { bottom: 42%; right: -12%; }
        .callout-br::after { width: 30px; height: 1px; left: -30px; top: 50%; } 
        .callout-br::before { left: -32px; top: calc(50% - 1.5px); }

        @media (max-width: 1023px) {
            .tech-callout { transform: scale(0.8); }
            .callout-tl { left: -5%; }
            .callout-tr { right: -5%; }
            .callout-bl { left: -5%; bottom: 20%; }
            .callout-br { right: -5%; bottom: 25%; }
        }
    </style>

    <section id="tech-hero" data-navbar-theme="dark">
        <div class="ah-bg" aria-hidden="true"></div>

        <div class="ah-shell">
            <div class="ah-main">
                <div class="ah-copy hero-animate">
                    <div class="ah-badge">
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <circle cx="12" cy="12" r="8" />
                        </svg>
                        ABOUT URBANTREE
                    </div>

                    <h1 class="ah-title type-h1">
                        Engineering<br>
                        <span class="ah-title-accent">Cleaner Futures</span>
                        For Urban Living
                    </h1>

                    <p class="ah-lead type-lead">
                        UrbanTree is part of SunEx Technologies, focused on building 
                        <em>intelligent clean-air infrastructure</em> for healthier and future-ready cities.
                    </p>

                    <div class="ah-actions">
                        <a href="#our-story" class="ah-btn ah-btn--primary">
                            <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"/></svg>
                            Our Story
                        </a>
                        <a href="#founders" class="ah-btn ah-btn--ghost">
                            Meet the Founders
                            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>
                        </a>
                    </div>
                </div>

                <div class="ah-graphic hero-animate" style="animation-delay: 0.2s">
                    <img src="/assets/images/eco_city_dome.png" alt="Bio-Mechanical Dome">
                    
                    <div class="tech-callout callout-tl fade-up" style="animation-delay: 0.4s">
                        <div class="callout-icon">
                            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
                        </div>
                        <div class="callout-text">
                            <div class="callout-label">BIO FILTRATION</div>
                            <div class="callout-value green">ACTIVE</div>
                        </div>
                    </div>

                    <div class="tech-callout callout-bl fade-up" style="animation-delay: 0.5s">
                        <div class="callout-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h12a3 3 0 000-6H9M3 14h16a3 3 0 010 6h-6M3 18h6a3 3 0 000-6H5" /></svg>
                        </div>
                        <div class="callout-text">
                            <div class="callout-label">AIRFLOW SYNC</div>
                            <div class="callout-value green">OPTIMAL</div>
                        </div>
                    </div>

                    <div class="tech-callout callout-tr fade-up" style="animation-delay: 0.6s">
                        <div class="callout-text text-right">
                            <div class="callout-label">CLEAN AIR OUTPUT</div>
                            <div class="callout-value">99.97%</div>
                        </div>
                        <div class="callout-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3v18h18M7 15l4-4 4 4 6-6" /></svg>
                        </div>
                    </div>

                    <div class="tech-callout callout-br fade-up" style="animation-delay: 0.7s">
                        <div class="callout-icon">
                            <svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
                        </div>
                        <div class="callout-text">
                            <div class="callout-label">PARTICLE CAPTURE</div>
                            <div class="callout-value">0.3µm</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ah-stats hero-animate" style="animation-delay:0.28s">
                <div class="ah-stats-grid">
                    <div class="ah-stat">
                        <div class="ah-stat-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                        </div>
                        <div>
                            <div class="ah-stat-value">2.5+</div>
                            <div class="ah-stat-title">Years of R&amp;D</div>
                            <div class="ah-stat-desc">Researching the future<br>of clean air.</div>
                        </div>
                    </div>

                    <div class="ah-stat">
                        <div class="ah-stat-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>
                        </div>
                        <div>
                            <div class="ah-stat-value">9</div>
                            <div class="ah-stat-title">Purification Stages</div>
                            <div class="ah-stat-desc">Multi-layered defense<br>for pure air.</div>
                        </div>
                    </div>

                    <div class="ah-stat">
                        <div class="ah-stat-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <div>
                            <div class="ah-stat-value">99.97%</div>
                            <div class="ah-stat-title">Particle Capture</div>
                            <div class="ah-stat-desc">Captures ultra-fine particles<br>as small as <span>0.3µm</span>.</div>
                        </div>
                    </div>

                    <div class="ah-stat">
                        <div class="ah-stat-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        </div>
                        <div>
                            <div class="ah-stat-value">Hybrid</div>
                            <div class="ah-stat-title">Ultra Efficient</div>
                            <div class="ah-stat-desc">Solar + Grid power<br>for sustainable cities.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
`;

content = content.replace(/<!-- ═══ HERO ═══ -->[\s\S]*?<\/section>/, replacement);

fs.writeFileSync(techFile, content);
console.log("Updated technology.html to exact match.");
