const fs = require('fs');
let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

content = content.replace('export const CUSTOMIZATION_OPTIONS', 'export const CUSTOM_OPTIONS');

const stories = `
export const CULTURAL_STORIES = [
  {
    id: 'story-1',
    title: '龙凤呈祥',
    description: '中国传统纹样的巅峰之作',
    image: '/images/garment_women_2.jpg'
  },
  {
    id: 'story-2',
    title: '苏绣非遗',
    description: '针尖上的华夏色彩',
    image: '/images/garment_men_3.jpg'
  },
  {
    id: 'story-3',
    title: '明制大婚',
    description: '复原《大明会典》的端庄仪态',
    image: '/images/garment_men_1.jpg'
  }
];
`;

content += stories;
fs.writeFileSync('src/data/mockData.ts', content, 'utf8');
