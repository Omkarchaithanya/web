const fs = require('fs');
const path = require('path');

const techFile = path.join(__dirname, 'technology.html');
let techContent = fs.readFileSync(techFile, 'utf8');

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
            --ah-teal: #2dd4bf;
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
            padding: 0.4rem 0.85rem;
            border-radius: 999px;
            border: 1px solid rgba(124, 252, 74, 0.35);
            background: rgba(124, 252, 74, 0.08);
            color: var(--ah-green);
            font-family: var(--font-sans, 'Inter', sans-serif);
            font-size: var(--text-eyebrow, 0.7rem);
            font-weight: 700;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            margin-bottom: 1rem;
            box-shadow: 0 0 24px rgba(124, 252, 74, 0.12);
        }
        .ah-badge svg { width: 14px; height: 14px; flex-shrink: 0; }

        .ah-title {
            color: #ffffff;
            margin: 0 0 0.85rem;
            font-size: clamp(2.1rem, 4.2vw, 3.25rem);
            line-height: 1.1;
        }
        .ah-title-accent {
            display: block;
            background: linear-gradient(105deg, #7CFC4A 0%, #4ade80 42%, #2dd4bf 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            color: #7CFC4A;
            filter: drop-shadow(0 0 18px rgba(124, 252, 74, 0.25));
        }

        .ah-rule {
            width: 3.25rem;
            height: 2px;
            border-radius: 2px;
            background: linear-gradient(90deg, #7CFC4A, #2dd4bf);
            margin-bottom: 1.25rem;
            box-shadow: 0 0 12px rgba(124, 252, 74, 0.55);
        }

        .ah-lead {
            color: #9ca3af;
            max-width: 32rem;
            margin: 0 0 1.35rem;
            font-size: clamp(1rem, 1.15vw, 1.1rem);
            line-height: 1.65;
        }
        .ah-lead em { font-style: normal; color: #7CFC4A; font-weight: 600; }

        .ah-actions { display: flex; flex-wrap: wrap; gap: 0.9rem; align-items: center; }
        .ah-btn {
            display: inline-flex; align-items: center; gap: 0.55rem;
            padding: 0.75rem 1.35rem; border-radius: 999px; font-family: 'Sora', sans-serif;
            font-size: 0.8rem; font-weight: 700; text-decoration: none;
            transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease;
        }
        .ah-btn svg { width: 16px; height: 16px; flex-shrink: 0; }
        .ah-btn--primary {
            background: var(--ah-green-soft); color: #041105;
            box-shadow: 0 0 28px rgba(157, 231, 100, 0.35);
        }
        .ah-btn--primary:hover {
            background: #8cdb52; transform: translateY(-1px);
            box-shadow: 0 0 36px rgba(157, 231, 100, 0.5);
        }
        .ah-btn--ghost {
            background: rgba(0, 0, 0, 0.35); color: #ffffff;
            border: 1px solid rgba(124, 252, 74, 0.45);
        }
        .ah-btn--ghost:hover {
            border-color: rgba(124, 252, 74, 0.8); background: rgba(124, 252, 74, 0.06);
            transform: translateY(-1px);
        }
        .ah-btn--ghost svg { color: var(--ah-green); }

        /* Stats bar */
        .ah-stats {
            margin-top: clamp(2rem, 5vh, 4rem);
            border-radius: 1.1rem;
            border: 1px solid rgba(124, 252, 74, 0.22);
            background: rgba(7, 19, 15, 0.72);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            padding: 1rem 1.1rem;
            box-shadow: 0 0 40px rgba(16, 185, 129, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.04);
            position: relative;
            overflow: hidden;
        }
        .ah-stats::before {
            content: ''; position: absolute; inset: 0;
            background: linear-gradient(90deg, rgba(124, 252, 74, 0.06), transparent 30%, transparent 70%, rgba(45, 212, 191, 0.05));
            pointer-events: none;
        }
        .ah-stats-grid {
            display: grid; gap: 1rem; position: relative; z-index: 1;
            grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 768px) {
            .ah-stats-grid { grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
            .ah-stat:not(:last-child)::after {
                content: ''; position: absolute; right: -0.75rem; top: 15%; height: 70%;
                width: 1px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent);
            }
        }
        .ah-stat { display: flex; align-items: flex-start; gap: 0.85rem; padding: 0.5rem; position: relative; }
        .ah-stat-icon {
            width: 32px; height: 32px; border-radius: 50%;
            background: rgba(124, 252, 74, 0.1); border: 1px solid rgba(124, 252, 74, 0.2);
            display: flex; align-items: center; justify-content: center; color: var(--ah-green);
            flex-shrink: 0; margin-top: 0.15rem;
        }
        .ah-stat-icon svg { width: 16px; height: 16px; }
        .ah-stat-value {
            font-family: var(--font-sans, 'Inter', sans-serif); font-weight: 800; font-size: 1.25rem;
            color: #ffffff; letter-spacing: -0.02em; line-height: 1; margin-bottom: 0.25rem;
        }
        .ah-stat-title { font-family: 'Sora', sans-serif; font-size: 0.8rem; font-weight: 600; color: var(--ah-green-soft); margin-bottom: 0.25rem; }
        .ah-stat-desc { font-size: 0.75rem; color: #9ca3af; line-height: 1.4; }
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
            object-fit: contain;
            filter: drop-shadow(0 0 30px rgba(124, 252, 74, 0.3));
        }
        .tech-callout {
            position: absolute;
            background: rgba(7, 19, 15, 0.85);
            border: 1px solid rgba(124, 252, 74, 0.4);
            border-radius: 8px;
            padding: 0.5rem 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            backdrop-filter: blur(8px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            z-index: 10;
            white-space: nowrap;
        }
        .tech-callout::after {
            content: '';
            position: absolute;
            background: rgba(124, 252, 74, 0.6);
            z-index: -1;
        }
        .callout-icon { color: var(--ah-green); display: flex; align-items: center; justify-content: center; }
        .callout-icon svg { width: 16px; height: 16px; }
        .callout-label { font-size: 0.55rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; line-height: 1; margin-bottom: 0.15rem; }
        .callout-value { font-size: 0.8rem; font-weight: 700; color: #fff; line-height: 1; font-family: 'Sora', sans-serif;}
        
        .callout-tl { top: 15%; left: -5%; }
        .callout-tl::after { width: 40px; height: 1px; right: -40px; top: 50%; }
        .callout-tr { top: 10%; right: -5%; }
        .callout-tr::after { width: 40px; height: 1px; left: -40px; top: 50%; }
        .callout-bl { bottom: 35%; left: -10%; }
        .callout-bl::after { width: 40px; height: 1px; right: -40px; top: 50%; }
        .callout-br { bottom: 40%; right: -10%; }
        .callout-br::after { width: 40px; height: 1px; left: -40px; top: 50%; }

        @media (max-width: 1023px) {
            .tech-callout { transform: scale(0.85); }
            .callout-tl { left: 0; }
            .callout-tr { right: 0; }
            .callout-bl { left: 0; bottom: 10%; }
            .callout-br { right: 0; bottom: 15%; }
        }
    </style>

    <section id="tech-hero" data-navbar-theme="dark">
        <div class="ah-bg" aria-hidden="true"></div>

        <div class="ah-shell">
            <div class="ah-main">
                <div class="ah-copy hero-animate">
                    <div class="ah-badge">
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 3c-4.97 0-9 4.03-9 9 0 3.19 1.66 6.03 4.18 7.69C7.39 19.16 8.5 18 10 18c1.66 0 3 1.34 3 3 0 .42-.1.81-.25 1.17 3.32-.42 6.08-2.6 7.37-5.55.93-2.12.92-4.57.17-6.85L12 3z"/>
                        </svg>
                        Technology
                    </div>

                    <h1 class="ah-title type-h1">
                        Powered By
                        <span class="ah-title-accent">Bio-Mechanical</span>
                        Air Intelligence
                    </h1>

                    <div class="ah-rule" aria-hidden="true"></div>

                    <p class="ah-lead type-lead">
                        A next-generation purification ecosystem combining advanced engineering, 
                        <em>intelligent airflow systems</em>, and biological purification to create breathable Air Pocket environments.
                    </p>

                    <div class="ah-actions">
                        <a href="#architecture" class="ah-btn ah-btn--primary">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"/>
                            </svg>
                            Explore System
                        </a>
                        <a href="#components" class="ah-btn ah-btn--ghost">
                            View Components
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>
                            </svg>
                        </a>
                    </div>
                </div>

                <div class="ah-graphic hero-animate" style="animation-delay: 0.2s">
                    <img src="/assets/images/city-bubble.png" alt="Bio-Mechanical Dome">
                    
                    <div class="tech-callout callout-tl fade-up" style="animation-delay: 0.4s">
                        <div class="callout-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                        </div>
                        <div>
                            <div class="callout-label">BIO FILTRATION</div>
                            <div class="callout-value text-green-400">ACTIVE</div>
                        </div>
                    </div>

                    <div class="tech-callout callout-bl fade-up" style="animation-delay: 0.5s">
                        <div class="callout-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <div>
                            <div class="callout-label">AIRFLOW SYNC</div>
                            <div class="callout-value text-green-400">OPTIMAL</div>
                        </div>
                    </div>

                    <div class="tech-callout callout-tr fade-up" style="animation-delay: 0.6s">
                        <div>
                            <div class="callout-label">CLEAN AIR OUTPUT</div>
                            <div class="callout-value text-white">99.97%</div>
                        </div>
                        <div class="callout-icon ml-2">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12"/></svg>
                        </div>
                    </div>

                    <div class="tech-callout callout-br fade-up" style="animation-delay: 0.7s">
                        <div class="callout-icon mr-2">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="3"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.07 4.93l-1.41 1.41M4.93 19.07l1.41-1.41M2 12h2M20 12h2M12 2v2M12 20v2M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41"/></svg>
                        </div>
                        <div>
                            <div class="callout-label">PARTICLE CAPTURE</div>
                            <div class="callout-value text-green-400">0.3µm</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ah-stats hero-animate" style="animation-delay:0.28s">
                <div class="ah-stats-grid">
                    <div class="ah-stat">
                        <div class="ah-stat-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7" aria-hidden="true">
                                <rect x="4" y="4" width="7" height="7" rx="1.5"/>
                                <rect x="13" y="4" width="7" height="7" rx="1.5"/>
                                <rect x="4" y="13" width="7" height="7" rx="1.5"/>
                                <rect x="13" y="13" width="7" height="7" rx="1.5"/>
                            </svg>
                        </div>
                        <div>
                            <div class="ah-stat-value">9</div>
                            <div class="ah-stat-title">Purification Stages</div>
                            <div class="ah-stat-desc">Multi-layered defense<br>for pure air.</div>
                        </div>
                    </div>

                    <div class="ah-stat">
                        <div class="ah-stat-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7" aria-hidden="true">
                                <circle cx="8" cy="10" r="2"/>
                                <circle cx="15" cy="7" r="1.5"/>
                                <circle cx="16" cy="14" r="2.2"/>
                                <circle cx="10" cy="16" r="1.4"/>
                            </svg>
                        </div>
                        <div>
                            <div class="ah-stat-value">99.97%</div>
                            <div class="ah-stat-title">Particle Capture</div>
                            <div class="ah-stat-desc">Captures ultra-fine particles<br>as small as <span>0.3µm</span>.</div>
                        </div>
                    </div>

                    <div class="ah-stat">
                        <div class="ah-stat-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7" aria-hidden="true">
                                <circle cx="12" cy="12" r="9"/>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3"/>
                            </svg>
                        </div>
                        <div>
                            <div class="ah-stat-value">0.3µ</div>
                            <div class="ah-stat-title">Min Particle Size</div>
                            <div class="ah-stat-desc">Filtration precision<br>down to the micro-level.</div>
                        </div>
                    </div>

                    <div class="ah-stat">
                        <div class="ah-stat-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
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

techContent = techContent.replace(/<!-- ═══ HERO ═══ -->[\s\S]*?<\/section>/, replacement);

fs.writeFileSync(techFile, techContent);
console.log("Updated tech hero.");
