const fs = require('fs');
let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

const replacement = `export const CUSTOM_OPTIONS = {
  styles: [
    { id: 'style-1', name: '明制立领衫', basePrice: 12800, gender: 'women' },
    { id: 'style-2', name: '宋代大袖衫', basePrice: 16800, gender: 'women' },
    { id: 'style-3', name: '明制圆领袍', basePrice: 11800, gender: 'men' }
  ],
  patterns: [
    { id: 'pattern-1', name: '龙凤呈祥', desc: '金龙腾云，彩凤展翅', priceOffset: 3600 },
    { id: 'pattern-2', name: '江崖海水', desc: '下摆九重海水江崖', priceOffset: 2400 }
  ],`;

content = content.replace('export const CUSTOM_OPTIONS = {', replacement);
fs.writeFileSync('src/data/mockData.ts', content, 'utf8');
