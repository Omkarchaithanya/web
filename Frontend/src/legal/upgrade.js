const fs = require('fs');
const path = require('path');

const files = [
    'privacy-policy.html',
    'terms.html',
    'cookie-policy.html',
    'disclaimer.html',
    'environmental-statement.html',
    'intellectual-property.html'
];

const newStyle = `    <link rel="stylesheet" href="/assets/css/tailwind.css">
    <style>
        html { scroll-behavior: smooth; }
        body { font-family: 'Inter', sans-serif; background: #050505; color: #94a3b8; }
        #navbar { transition: background 0.3s ease, backdrop-filter 0.3s ease; }
        .nav-enquiry-btn {
            color: #ffffff;
            border-color: rgba(16, 185, 129, 0.55);
            background-color: transparent;
        }
        .nav-enquiry-btn:hover {
            background-color: rgba(16, 185, 129, 0.12);
            color: #ffffff;
        }
        
        .legal-content h2, .legal-content h3 { font-family: 'Sora', sans-serif; font-weight: 700; color: #f8fafc; margin-top: 3.5rem; margin-bottom: 1.5rem; letter-spacing: -0.01em; }
        .legal-content h2 { font-size: 1.75rem; }
        .legal-content h3 { font-size: 1.5rem; }
        .legal-content p { color: #94a3b8; font-size: 1.05rem; line-height: 1.8; margin-bottom: 1.75rem; }
        .legal-content a { color: #4ade80; text-decoration: none; transition: color 0.2s; }
        .legal-content a:hover { color: #22c55e; text-decoration: underline; }
        .legal-content ul { list-style-type: none; padding-left: 0; margin-bottom: 2.5rem; color: #cbd5e1; }
        .legal-content ul li { position: relative; padding-left: 2rem; margin-bottom: 1rem; font-size: 1.05rem; line-height: 1.6; }
        .legal-content ul li::before { content: ''; position: absolute; left: 0.25rem; top: 0.75rem; width: 0.4rem; height: 0.4rem; background-color: #4ade80; border-radius: 50%; box-shadow: 0 0 10px rgba(74, 222, 128, 0.8); }
        .legal-content strong { color: #e2e8f0; font-weight: 600; }
    </style>`;

const getNewHeaderAndMain = (title, description, contentHtml, fileName) => {
    const getNavClass = (target) => {
        if (fileName === target) {
            return "px-5 py-4 rounded-xl font-semibold text-[15px] transition-all border-l-[3px] shadow-[inset_0_0_20px_rgba(34,197,94,0.15)] bg-[#22c55e]/10 text-[#4ade80] border-[#4ade80]";
        }
        return "px-5 py-4 rounded-xl font-medium text-[15px] transition-all border-l-[3px] text-gray-400 hover:bg-white/5 hover:text-white border-transparent hover:border-gray-600";
    };

    return `    <!-- ═══ HEADER ═══ -->
    <header class="pt-40 pb-20 bg-[#050505] relative overflow-hidden">
        <!-- Ultra-Premium glowing background -->
        <div class="absolute inset-0 pointer-events-none">
            <!-- Grid pattern -->
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDM5aDQwTTAgMHY0ME0zOSAwLjk5OTk5OXY0ME0wLjAwMDAwMSAwLjAwMDAwMWg0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-50"></div>
            
            <div class="absolute -left-[10%] top-0 bottom-0 w-[60%] bg-[url('/assets/images/about/original_tree_city.png')] bg-cover bg-left opacity-10 mix-blend-screen" style="mask-image: linear-gradient(to right, black, transparent);"></div>
            <!-- Glows -->
            <div class="absolute left-[-10%] top-[10%] w-[400px] h-[400px] bg-[#064e3b] rounded-full blur-[150px] opacity-60"></div>
            <div class="absolute right-0 top-[-20%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[150px]"></div>
            
            <div class="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-[#22c55e]/30 to-transparent"></div>
        </div>
        <div class="max-w-7xl mx-auto px-6 relative z-10">
            <div class="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 text-[#4ade80] text-[11px] font-bold tracking-[0.25em] uppercase mb-8 shadow-[0_0_20px_rgba(34,197,94,0.15)] backdrop-blur-md">
                <span class="w-2 h-2 rounded-full bg-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,1)] relative"><span class="absolute inset-0 rounded-full bg-[#4ade80] animate-ping opacity-50"></span></span> 
                Legal & Compliance Hub
            </div>
            <h1 class="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight" style="font-family:'Sora',sans-serif;">${title}</h1>
            <p class="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed font-light">
                ${description}
            </p>
        </div>
    </header>

    <!-- ═══ CONTENT ═══ -->
    <main class="py-24 relative z-10 bg-[#020202]">
        <div class="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12 lg:gap-20">
            
            <!-- Sidebar Navigation -->
            <aside class="lg:w-[340px] shrink-0 relative z-20">
                <div class="sticky top-32 bg-[#0b1210]/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <h4 class="text-[11px] font-extrabold tracking-[0.2em] text-[#4ade80] uppercase mb-8 flex items-center gap-3 border-b border-white/5 pb-6">
                        <svg class="w-5 h-5 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Documents Directory
                    </h4>
                    <nav class="flex flex-col gap-2">
                        <a href="privacy-policy.html" class="${getNavClass('privacy-policy.html')} group flex items-center justify-between">Privacy Policy <span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span></a>
                        <a href="terms.html" class="${getNavClass('terms.html')} group flex items-center justify-between">Terms of Service <span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span></a>
                        <a href="cookie-policy.html" class="${getNavClass('cookie-policy.html')} group flex items-center justify-between">Cookie Policy <span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span></a>
                        <a href="disclaimer.html" class="${getNavClass('disclaimer.html')} group flex items-center justify-between">Disclaimer <span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span></a>
                        <a href="environmental-statement.html" class="${getNavClass('environmental-statement.html')} group flex items-center justify-between">Environmental Statement <span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span></a>
                        <a href="intellectual-property.html" class="${getNavClass('intellectual-property.html')} group flex items-center justify-between">Intellectual Property <span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span></a>
                    </nav>
                </div>
            </aside>

            <!-- Policy Content -->
            <div class="lg:flex-1 relative">
                <!-- Decorative element behind content -->
                <div class="absolute -top-20 -right-20 w-96 h-96 bg-[#22c55e]/5 rounded-full blur-[100px] pointer-events-none"></div>
                
                <div class="relative bg-[#0a0c0e]/80 backdrop-blur-2xl rounded-3xl p-8 md:p-16 border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
                    <div class="border-b border-white/10 pb-10 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h2 class="text-3xl md:text-4xl font-extrabold text-white mb-6" style="font-family:'Sora',sans-serif;">Introduction</h2>
                            <p class="text-gray-400 leading-[1.9] text-[1.15rem] max-w-2xl font-light">
                                ${description}
                            </p>
                        </div>
                        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-300 text-sm font-medium whitespace-nowrap">
                            <svg class="w-4 h-4 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            Effective: Aug 2026
                        </div>
                    </div>
                    
                    <div class="legal-content">
                        ${contentHtml}

                        <!-- Premium Contact Box -->
                        <div class="mt-20 p-10 md:p-12 bg-gradient-to-br from-[#0b1210] to-[#070b09] border border-[#22c55e]/20 rounded-3xl relative overflow-hidden shadow-[inset_0_0_40px_rgba(34,197,94,0.05)] group hover:border-[#4ade80]/40 transition-colors duration-500">
                            <!-- Background pattern -->
                            <div class="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiM0YWRlODAiLz48L3N2Zz4=')]"></div>
                            <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-[#4ade80]/10 rounded-full blur-[50px] group-hover:bg-[#4ade80]/20 transition-colors duration-500"></div>
                            
                            <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                                <div>
                                    <h3 class="text-2xl font-bold text-white mb-2" style="font-family:'Sora',sans-serif; margin-top:0;">Need Clarification?</h3>
                                    <p class="text-gray-400 mb-0 font-light text-lg">Our compliance team is ready to assist with any legal or privacy concerns.</p>
                                </div>
                                <a href="mailto:legal@urbantree.com" class="shrink-0 inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#4ade80] !text-black hover:!text-black !no-underline font-bold rounded-2xl hover:bg-[#22c55e] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(74,222,128,0.4)]">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    legal@urbantree.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>`;
};

const titles = {
    'privacy-policy.html': 'Privacy Policy',
    'terms.html': 'Terms of Service',
    'cookie-policy.html': 'Cookie Policy',
    'disclaimer.html': 'Disclaimer',
    'environmental-statement.html': 'Environmental Statement',
    'intellectual-property.html': 'Intellectual Property Notice'
};

const descriptions = {
    'privacy-policy.html': "Learn about how UrbanTree collects, uses, and protects your personal data when you interact with our platform and services.",
    'terms.html': "Review the terms and conditions governing your use of the UrbanTree website and services.",
    'cookie-policy.html': "Learn how UrbanTree uses cookies and similar technologies to improve your experience.",
    'disclaimer.html': "Read our legal disclaimer regarding the use of our website and services.",
    'environmental-statement.html': "Discover UrbanTree's commitment to environmental sustainability and clean air infrastructure.",
    'intellectual-property.html': "Information regarding the intellectual property rights of UrbanTree and SunEx Technologies."
};

files.forEach(file => {
    let content = fs.readFileSync(path.join(__dirname, file), 'utf8');
    
    // Replace styles
    content = content.replace(/<link rel="stylesheet" href="\/assets\/css\/tailwind.css">[\s\S]*?<\/style>/, newStyle);
    
    // For privacy-policy, the regex needs to match the previously generated new structure or the old one.
    // Let's use a robust match for the inner content.
    // Previously we had <div class="legal-content"> ... </div>
    // Or <div class="legal-section"> ... </div>
    
    let innerHtml = '';
    const matchLegalContent = content.match(/<div class="legal-content">([\s\S]*?)<div class="mt-14/);
    if (matchLegalContent) {
        innerHtml = matchLegalContent[1].trim();
    } else {
        const matchLegalSection = content.match(/<div class="legal-section">[\s\S]*?<h2[^>]*>.*?<\/h2>([\s\S]*?)<\/div>\s*<\/div><\/main>/);
        if (matchLegalSection) {
            innerHtml = matchLegalSection[1].trim();
        }
    }
    
    if (innerHtml) {
        let newHeaderMain = getNewHeaderAndMain(titles[file], descriptions[file], innerHtml, file);
        // Replace old header and main
        content = content.replace(/<!-- ═══ HEADER ═══ -->[\s\S]*?<\/main>/, newHeaderMain);
        
        fs.writeFileSync(path.join(__dirname, file), content);
        console.log("Updated", file);
    } else {
        console.log("Could not find content in", file);
    }
});
