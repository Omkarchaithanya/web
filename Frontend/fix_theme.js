const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const startIndex = content.indexOf('<div class="ut-console');
const endIndex = content.indexOf('</section>', startIndex);

if (startIndex === -1 || endIndex === -1) {
    console.log("Could not find bounds");
    process.exit(1);
}

const pre = content.substring(0, startIndex);
let target = content.substring(startIndex, endIndex);
const post = content.substring(endIndex);

// Strip existing dark: classes to avoid duplicates if rerun
target = target.replace(/dark:[^\s"']+/g, '');

const replacements = [
    { from: /\bbg-white\b/g, to: 'bg-white dark:bg-[#111827]' },
    { from: /\bbg-slate-50\b/g, to: 'bg-slate-50 dark:bg-[#0d1117]' },
    { from: /\bbg-slate-100\b/g, to: 'bg-slate-100 dark:bg-[#070a0e]' },
    { from: /\bbg-slate-50\/50\b/g, to: 'bg-slate-50/50 dark:bg-[#0d1117]/50' },
    { from: /\bborder-slate-200\b/g, to: 'border-slate-200 dark:border-white/10' },
    { from: /\bborder-slate-100\b/g, to: 'border-slate-100 dark:border-white/5' },
    { from: /\bborder-slate-300\b/g, to: 'border-slate-300 dark:border-white/20' },
    { from: /\btext-slate-800\b/g, to: 'text-slate-800 dark:text-white' },
    { from: /\btext-slate-500\b/g, to: 'text-slate-500 dark:text-gray-400' },
    { from: /\btext-slate-600\b/g, to: 'text-slate-600 dark:text-gray-300' },
    { from: /\bbg-emerald-50\/50\b/g, to: 'bg-emerald-50/50 dark:bg-[#10b981]/5' },
    { from: /\btext-emerald-700\b/g, to: 'text-emerald-700 dark:text-[#10b981]' },
    { from: /\bhover:bg-slate-50\b/g, to: 'hover:bg-slate-50 dark:hover:bg-white/5' },
    { from: /\bhover:bg-slate-100\b/g, to: 'hover:bg-slate-100 dark:hover:bg-white/10' },
    { from: /\bhover:border-slate-300\b/g, to: 'hover:border-slate-300 dark:hover:border-white/20' },
    { from: /\bfrom-slate-50\b/g, to: 'from-slate-50 dark:from-[#0d1117]' },
    { from: /\bto-white\b/g, to: 'to-white dark:to-[#111827]' },
    { from: /\bshadow-sm\b/g, to: 'shadow-sm dark:shadow-none' },
    { from: /\bstyle="background-color: #f8fafc;"\b/g, to: 'style="background-color: transparent;"' },
    { from: /\b!bg-white\b/g, to: '!bg-white dark:!bg-[#111827]' },
    { from: /\b!border-slate-200\b/g, to: '!border-slate-200 dark:!border-white/10' },
    { from: /\b!text-slate-800\b/g, to: '!text-slate-800 dark:!text-white' },
    { from: /\b!text-slate-500\b/g, to: '!text-slate-500 dark:!text-gray-400' },
    { from: /\b!shadow-sm\b/g, to: '!shadow-sm dark:!shadow-none' },
];

for (const rep of replacements) {
    target = target.replace(rep.from, rep.to);
}

// Clean up duplicate spaces inside classes
target = target.replace(/class="([^"]+)"/g, (match, p1) => {
    return 'class="' + p1.replace(/\s+/g, ' ').trim() + '"';
});

fs.writeFileSync(filePath, pre + target + post, 'utf8');
console.log("Done updating index.html");
