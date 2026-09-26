const fs = require('fs');
let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

content = content.replace(/styles: \[\s*\{ id: 'style-1'[\s\S]*?\],\s*/g, '');
content = content.replace(/patterns: \[\s*\{ id: 'pattern-1'[\s\S]*?\],\s*/g, '');

const replacement = `export const CUSTOM_OPTIONS = {
  styles: [
    { id: 'style-1', name: '明制立领衫', basePrice: 12800, gender: 'women', image: '/images/garment_women_1.jpg', desc: '经典明制款式', category: '明制婚服' },
    { id: 'style-2', name: '宋代大袖衫', basePrice: 16800, gender: 'women', image: '/images/garment_women_2.jpg', desc: '经典宋制款式', category: '唐宋制婚服' },
    { id: 'style-3', name: '明制圆领袍', basePrice: 11800, gender: 'men', image: '/images/garment_men_1.jpg', desc: '男士明制经典', category: '明制婚服' }
  ],
  patterns: [
    { id: 'pattern-1', name: '龙凤呈祥', desc: '金龙腾云，彩凤展翅', priceOffset: 3600 },
    { id: 'pattern-2', name: '江崖海水', desc: '下摆九重海水江崖', priceOffset: 2400 }
  ],
`;
content = content.replace('export const CUSTOM_OPTIONS = {', replacement);

const stories = `export const CULTURAL_STORIES = [
  {
    id: 'story-1',
    title: '龙凤呈祥',
    subtitle: '传世经典',
    description: '中国传统纹样的巅峰之作',
    content: '龙凤呈祥图案源于...',
    tag: '工艺',
    image: '/images/garment_women_2.jpg'
  },
  {
    id: 'story-2',
    title: '苏绣非遗',
    subtitle: '指尖艺术',
    description: '针尖上的华夏色彩',
    content: '苏绣作为中国四大名绣之一...',
    tag: '非遗',
    image: '/images/garment_men_3.jpg'
  },
  {
    id: 'story-3',
    title: '明制大婚',
    subtitle: '仪态万方',
    description: '复原《大明会典》的端庄仪态',
    content: '明代婚服最高礼制...',
    tag: '历史',
    image: '/images/garment_men_1.jpg'
  }
];`;

content = content.replace(/export const CULTURAL_STORIES = \[[\s\S]*?\];/g, stories);

fs.writeFileSync('src/data/mockData.ts', content, 'utf8');
