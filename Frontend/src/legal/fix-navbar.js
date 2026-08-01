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

files.forEach(file => {
    let content = fs.readFileSync(path.join(__dirname, file), 'utf8');
    
    // Replace old hardcoded navbar and mobile menu with partial
    content = content.replace(/<!-- ═══ NAVBAR ═══ -->[\s\S]*?<!-- ═══ HEADER ═══ -->/, 
`    {{> navbar }}
    <script type="module" src="/assets/js/navbar.js"></script>

    <!-- ═══ HEADER ═══ -->`);
    
    // Remove the mobile menu logic script at the bottom
    content = content.replace(/<script>\s*\/\/ Mobile Menu Logic[\s\S]*?<\/script>/, '');

    // Add data-navbar-theme="dark" to header and main so the dynamic navbar stays dark/glassy
    content = content.replace(/<header class="/g, '<header data-navbar-theme="dark" class="');
    content = content.replace(/<main class="/g, '<main data-navbar-theme="dark" class="');

    fs.writeFileSync(path.join(__dirname, file), content);
    console.log("Fixed navbar in", file);
});
