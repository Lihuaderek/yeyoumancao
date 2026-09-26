const fs = require('fs');
let content = fs.readFileSync('src/pages/ShopPage.tsx', 'utf8');

content = content.replace(/\{\s*id:\s*'all'[\s\S]*?\}\s*\]\.map/g, `{ id: 'all', label: '全部礼服' },
              { id: '明制婚服', label: '明制婚服' },
              { id: '唐宋制婚服', label: '唐宋制婚服' },
              { id: '秀禾服', label: '秀禾服' },
              { id: '龙凤褂', label: '龙凤褂' },
              { id: '旗袍', label: '旗袍' },
            ].map`);

// Also change garment.categoryName to garment.category
content = content.replace(/garment\.categoryName/g, 'garment.category');

fs.writeFileSync('src/pages/ShopPage.tsx', content, 'utf8');
