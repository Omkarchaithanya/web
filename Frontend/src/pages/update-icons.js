const fs = require('fs');
const path = require('path');

const techFile = path.join(__dirname, 'technology.html');
let content = fs.readFileSync(techFile, 'utf8');

// 1. Update image src
content = content.replace(/<img src="\/assets\/images\/city-bubble.png"/, '<img src="/assets/images/eco_city_dome.png"');

// 2. Update BIO FILTRATION icon
content = content.replace(/<div class="tech-callout callout-tl fade-up"[\s\S]*?<\/svg>\s*<\/div>/,
`<div class="tech-callout callout-tl fade-up" style="animation-delay: 0.4s">
                        <div class="callout-icon">
                            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 3.19 1.66 6.03 4.18 7.69C7.39 19.16 8.5 18 10 18c1.66 0 3 1.34 3 3 0 .42-.1.81-.25 1.17 3.32-.42 6.08-2.6 7.37-5.55.93-2.12.92-4.57.17-6.85L12 3z"/></svg>
                        </div>`);

// 3. Update AIRFLOW SYNC icon
content = content.replace(/<div class="tech-callout callout-bl fade-up"[\s\S]*?<\/svg>\s*<\/div>/,
`<div class="tech-callout callout-bl fade-up" style="animation-delay: 0.5s">
                        <div class="callout-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h12a3 3 0 000-6H9M3 14h16a3 3 0 010 6h-6M3 18h6a3 3 0 000-6H5" /></svg>
                        </div>`);

// 4. Update CLEAN AIR OUTPUT icon
content = content.replace(/<div class="callout-icon ml-2">\s*<svg[\s\S]*?<\/svg>\s*<\/div>/,
`<div class="callout-icon ml-2">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3v18h18M7 15l4-4 4 4 6-6" /></svg>
                        </div>`);

// 5. Update PARTICLE CAPTURE icon
content = content.replace(/<div class="callout-icon mr-2">\s*<svg[\s\S]*?<\/svg>\s*<\/div>/,
`<div class="callout-icon mr-2">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                <circle cx="12" cy="12" r="3.5"/><circle cx="12" cy="4" r="1.5"/><circle cx="12" cy="20" r="1.5"/><circle cx="4" cy="12" r="1.5"/><circle cx="20" cy="12" r="1.5"/><circle cx="6.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="17.5" r="1.5"/><circle cx="6.5" cy="17.5" r="1.5"/><circle cx="17.5" cy="6.5" r="1.5"/>
                            </svg>
                        </div>`);

// Add dots to the end of the lines
content = content.replace(/ \.callout-tl::after \{ width: 40px; height: 1px; right: -40px; top: 50%; \}/, ` .callout-tl::after { width: 40px; height: 1px; right: -40px; top: 50%; } .callout-tl::before { content:''; position:absolute; right:-43px; top:calc(50% - 2px); width:5px; height:5px; background:rgba(124, 252, 74, 1); border-radius:50%; z-index:11; }`);
content = content.replace(/ \.callout-tr::after \{ width: 40px; height: 1px; left: -40px; top: 50%; \}/, ` .callout-tr::after { width: 40px; height: 1px; left: -40px; top: 50%; } .callout-tr::before { content:''; position:absolute; left:-43px; top:calc(50% - 2px); width:5px; height:5px; background:rgba(124, 252, 74, 1); border-radius:50%; z-index:11; }`);
content = content.replace(/ \.callout-bl::after \{ width: 40px; height: 1px; right: -40px; top: 50%; \}/, ` .callout-bl::after { width: 40px; height: 1px; right: -40px; top: 50%; } .callout-bl::before { content:''; position:absolute; right:-43px; top:calc(50% - 2px); width:5px; height:5px; background:rgba(124, 252, 74, 1); border-radius:50%; z-index:11; }`);
content = content.replace(/ \.callout-br::after \{ width: 40px; height: 1px; left: -40px; top: 50%; \}/, ` .callout-br::after { width: 40px; height: 1px; left: -40px; top: 50%; } .callout-br::before { content:''; position:absolute; left:-43px; top:calc(50% - 2px); width:5px; height:5px; background:rgba(124, 252, 74, 1); border-radius:50%; z-index:11; }`);


fs.writeFileSync(techFile, content);
console.log("Updated technology.html with new image and icons.");
