const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
    // Fix missing ! in dark modifiers
    { from: /!bg-white dark:bg-\[#111827\]/g, to: '!bg-white dark:!bg-[#111827]' },
    { from: /!border-slate-200 dark:border-white\/10/g, to: '!border-slate-200 dark:!border-white/10' },
    { from: /!text-slate-800 dark:text-white/g, to: '!text-slate-800 dark:!text-white' },
    { from: /!text-slate-500 dark:text-gray-400/g, to: '!text-slate-500 dark:!text-gray-400' },
    { from: /!shadow-sm dark:shadow-none/g, to: '!shadow-sm dark:!shadow-none' },
    
    // Add missing bg-emerald-50 and bg-red-50
    { from: /\bbg-emerald-50\b(?! dark:)/g, to: 'bg-emerald-50 dark:bg-[#10b981]/5' },
    { from: /\bbg-red-50\b(?! dark:)/g, to: 'bg-red-50 dark:bg-[#ef4444]/5' },
    { from: /\bbg-red-50\/50\b(?! dark:)/g, to: 'bg-red-50/50 dark:bg-[#ef4444]/5' },
    { from: /\bbg-emerald-50\/50\b(?! dark:)/g, to: 'bg-emerald-50/50 dark:bg-[#10b981]/5' },

    // Fix missing ! for those that might have it
    { from: /!bg-emerald-50 dark:bg-\[#10b981\]\/5/g, to: '!bg-emerald-50 dark:!bg-[#10b981]/5' },
    { from: /!bg-red-50 dark:bg-\[#ef4444\]\/5/g, to: '!bg-red-50 dark:!bg-[#ef4444]/5' },

    // Air Quality tab Intake PM2.5 has bg-slate-50 or something? Wait, they are bg-red-50 and bg-emerald-50.
];

let target = content;
for (const rep of replacements) {
    target = target.replace(rep.from, rep.to);
}

fs.writeFileSync(filePath, target, 'utf8');
console.log("Done fixing important modifiers and missed backgrounds.");
