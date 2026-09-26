const fs = require('fs');
let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

const replacement = `export const CUSTOM_OPTIONS = {
  styles: [
    { id: 'style-1', name: '明制立领衫', basePrice: 12800, gender: 'women', image: '/images/garment_women_1.jpg', desc: '经典明制款式', category: '明制婚服' },
    { id: 'style-2', name: '宋代大袖衫', basePrice: 16800, gender: 'women', image: '/images/garment_women_2.jpg', desc: '经典宋制款式', category: '唐宋制婚服' },
    { id: 'style-3', name: '明制圆领袍', basePrice: 11800, gender: 'men', image: '/images/garment_men_1.jpg', desc: '男士明制经典', category: '明制婚服' }
  ],
  patterns: [
    { id: 'pattern-1', name: '龙凤呈祥', desc: '金龙腾云，彩凤展翅', priceOffset: 3600 },
    { id: 'pattern-2', name: '江崖海水', desc: '下摆九重海水江崖', priceOffset: 2400 }
  ],`;

// We previously inserted styles and patterns, so we need to replace them properly.
// Let's just find the whole CUSTOM_OPTIONS and replace everything inside it up to colors
content = content.replace(/export const CUSTOM_OPTIONS = \{[\s\S]*?colors: \[/, replacement + '\n    colors: [');

// Also remove the "styles" error from mockData.ts(18,7) - that means I accidentally injected `styles` into Garment?
// Wait, `src/data/mockData.ts(18,7): Object literal may only specify known properties, and 'styles' does not exist in type 'Garment'.`
// Oh, maybe I replaced `colors: [` inside `GARMENTS` as well!
// Because my previous script was `.replace('colors: [', ...)` without `/export const/`!
// I need to fix `GARMENTS[0]`!
content = content.replace(/styles: \[\s*\{ id: 'style-1'[\s\S]*?\],/, '');
content = content.replace(/patterns: \[\s*\{ id: 'pattern-1'[\s\S]*?\],/, '');

// Then inject properly AT THE START OF CUSTOM_OPTIONS
content = content.replace('export const CUSTOM_OPTIONS = {', replacement);
// Wait, to avoid double injection, I will restore `mockData.ts` from scratch or use regex carefully.
fs.writeFileSync('src/data/mockData.ts', content, 'utf8');
