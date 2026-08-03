import imgSmartCities from '../../shared/images/app_smart_cities.jpg';
import imgTechParks from '../images/app_tech_parks_new.png';
import imgResidential from '../images/app_residential_new.png';
import imgIndustrial from '../images/app_industrial_new.png';
import imgSchools from '../images/app_schools_new.png';
import imgAirports from '../images/app_airports.jpg';
import imgCorporate from '../images/app_corporate.jpg';
import imgPublic from '../images/app_public_new.png';
import imgGovt from '../images/app_government_indian.png';

document.addEventListener('DOMContentLoaded', () => {
    const appsData = [
        {
            title: "Smart Cities",
            desc: "Designed for next-generation urban environments, the air purifier integrates with smart city infrastructure to create breathable Air Pocket across outdoor and semi-outdoor spaces.",
            svg_inner: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />`,
            image: imgSmartCities
        },
        {
            title: "Tech Parks",
            desc: "The system enhances workplace wellness by creating fresh environments across innovation hubs, IT campuses, and high-footfall outdoor areas.",
            svg_inner: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />`,
            image: imgTechParks
        },
        {
            title: "Residential Communities",
            desc: "The purifier creates fresh Air zones within residential communities, helping reduce exposure to dust, smoke, and harmful airborne pollutants.",
            svg_inner: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />`,
            image: imgResidential
        },
        {
            title: "Industrial Zones",
            desc: "Engineered to support pollution control in and around industrial environments where particulate matter and emissions are higher. The solution contributes to safer surroundings for workers and nearby communities through continuous purification and monitoring.",
            svg_inner: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />`,
            image: imgIndustrial
        },
        {
            title: "Schools & Universities",
            desc: "Creates healthier learning environments by reducing airborne pollutants around campuses, classrooms, and gathering spaces. Cleaner air supports student well-being, concentration, and overall campus sustainability initiatives.",
            svg_inner: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />`,
            image: imgSchools
        },
        {
            title: "Airports & Metro Stations",
            desc: "Built for high-density public transit environments, the system creates fresh Air zones that improve commuter comfort and public air quality.",
            svg_inner: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />`,
            image: imgAirports
        },
        {
            title: "Corporate Campuses",
            desc: "Enhances outdoor and semi-outdoor workplace environments by generating Air zones across walkways, seating areas, and shared spaces.",
            svg_inner: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />`,
            image: imgCorporate
        },
        {
            title: "Public & Private Infrastructure",
            desc: "Suitable for deployment across government buildings, commercial complexes, healthcare facilities, and civic infrastructure projects. Its modular architecture allows flexible integration into diverse environments requiring sustainable air quality solutions.",
            svg_inner: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />`,
            image: imgPublic
        },
        {
            title: "Government Office Spaces",
            desc: "Supports healthier workplaces by creating healthy air environments in administrative and public interaction spaces.",
            svg_inner: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />`,
            image: imgGovt
        }
    ];

    const accordionContainer = document.getElementById('app-accordion-container');
    let activeIndex = 0;
    const accordionItems = [];
    const preloaded = new Set();

    function preloadNeighbors(index) {
        [index - 1, index, index + 1].forEach((i) => {
            if (i < 0 || i >= appsData.length) return;
            const src = appsData[i].image;
            if (preloaded.has(src)) return;
            preloaded.add(src);
            const img = new Image();
            img.decoding = 'async';
            img.src = src;
        });
    }

    function initAccordion() {
        if (!accordionContainer) return;
        accordionContainer.innerHTML = '';

        appsData.forEach((app, index) => {
            const item = document.createElement('div');
            item.className = 'app-accordion-item relative overflow-hidden rounded-3xl cursor-pointer group flex-shrink-0 border';

            item.onclick = () => {
                if (activeIndex !== index) {
                    activeIndex = index;
                    preloadNeighbors(activeIndex);
                    updateAccordion();
                }
            };

            const lazy = index === 0 ? 'eager' : 'lazy';
            item.innerHTML = `
                <!-- Background Image -->
                <img src="${app.image}" loading="${lazy}" decoding="async" class="bg-img absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out origin-center" alt="${app.title}" />
                
                <!-- Overlay for Active State -->
                <div class="active-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300"></div>
                
                <!-- Overlay for Inactive State -->
                <div class="inactive-overlay absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:bg-black/10"></div>
                
                <!-- Inactive State Content -->
                <div class="inactive-content absolute inset-0 flex flex-row lg:flex-col items-center justify-center transition-opacity duration-300">
                    <!-- Title Mobile (Horizontal) -->
                    <div class="flex lg:hidden items-center justify-center w-full px-4">
                        <h3 class="font-serif font-bold text-white/90 text-sm tracking-widest uppercase group-hover:text-white transition-colors duration-300 drop-shadow-md text-center">
                            ${app.title}
                        </h3>
                    </div>
                    
                    <!-- Title Desktop (Vertical Strip) -->
                    <div class="hidden lg:flex flex-1 items-center justify-center overflow-hidden w-full py-6">
                        <h3 class="font-serif font-bold text-white/90 tracking-[0.2em] text-sm uppercase group-hover:text-white transition-colors duration-300 drop-shadow-md whitespace-nowrap" style="writing-mode: vertical-rl; transform: rotate(180deg);">
                            ${app.title}
                        </h3>
                    </div>
                </div>

                <!-- Active State Content -->
                <div class="active-content absolute inset-0 p-6 md:p-10 flex flex-col justify-end transition-opacity duration-300">
                    <!-- Header -->
                    <div class="active-header flex items-center gap-4 lg:gap-6 z-10 transform transition-transform duration-300 w-full">
                        <div class="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-brand-emerald text-white shadow-lg shadow-brand-emerald/20 flex items-center justify-center shrink-0">
                            <svg class="w-6 h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">${app.svg_inner}</svg>
                        </div>
                        <h3 class="font-serif font-bold text-2xl lg:text-4xl text-white drop-shadow-md truncate pr-4">
                            ${app.title}
                        </h3>
                    </div>
                    
                    <!-- Description -->
                    <div class="active-desc mt-4 lg:mt-6 z-10 w-full max-w-3xl transform transition-transform duration-300 delay-75">
                        <p class="text-gray-200 text-base lg:text-lg leading-relaxed line-clamp-3 lg:line-clamp-4">
                            ${app.desc}
                        </p>
                    </div>
                </div>
            `;

            accordionItems.push(item);
            accordionContainer.appendChild(item);
        });

        preloadNeighbors(0);
        updateAccordion();
    }

    function updateAccordion() {
        accordionItems.forEach((item, index) => {
            const isActive = index === activeIndex;

            // 1. Root Item — flex snaps instantly; content animates via opacity/transform
            const baseItemClass = 'app-accordion-item relative overflow-hidden rounded-3xl cursor-pointer group flex-shrink-0 border';
            item.className = `${baseItemClass} ${isActive ? 'is-active flex-grow shadow-2xl border-transparent h-[400px] lg:h-full lg:w-0' : 'is-inactive h-16 lg:h-full lg:w-20 border-black/10 hover:border-brand-emerald/50'}`;

            // 2. Background Image
            const bgImg = item.querySelector('.bg-img');
            const baseImgClass = 'bg-img absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out origin-center';
            bgImg.className = `${baseImgClass} ${isActive ? 'scale-100' : 'scale-110 opacity-80 group-hover:scale-105 group-hover:opacity-100'}`;

            // 3. Active Overlay
            const activeOverlay = item.querySelector('.active-overlay');
            const baseActiveOverlay = 'active-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300';
            activeOverlay.className = `${baseActiveOverlay} ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`;

            // 4. Inactive Overlay
            const inactiveOverlay = item.querySelector('.inactive-overlay');
            const baseInactiveOverlay = 'inactive-overlay absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:bg-black/10';
            inactiveOverlay.className = `${baseInactiveOverlay} ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`;

            // 5. Inactive Content
            const inactiveContent = item.querySelector('.inactive-content');
            const baseInactiveContent = 'inactive-content absolute inset-0 flex flex-row lg:flex-col items-center justify-center transition-opacity duration-300';
            inactiveContent.className = `${baseInactiveContent} ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`;

            // 6. Active Content
            const activeContent = item.querySelector('.active-content');
            const baseActiveContent = 'active-content absolute inset-0 p-6 md:p-10 flex flex-col justify-end transition-opacity duration-300';
            activeContent.className = `${baseActiveContent} ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`;

            // 7. Active Header
            const activeHeader = item.querySelector('.active-header');
            const baseActiveHeader = 'active-header flex items-center gap-4 lg:gap-6 z-10 transform transition-transform duration-300 w-full';
            activeHeader.className = `${baseActiveHeader} ${isActive ? 'translate-y-0' : 'translate-y-4'}`;

            // 8. Active Desc
            const activeDesc = item.querySelector('.active-desc');
            const baseActiveDesc = 'active-desc mt-4 lg:mt-6 z-10 w-full max-w-3xl transform transition-transform duration-300 delay-75';
            activeDesc.className = `${baseActiveDesc} ${isActive ? 'translate-y-0' : 'translate-y-4'}`;
        });
    }

    initAccordion();
});
