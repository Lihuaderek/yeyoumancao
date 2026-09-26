const fs = require('fs');
let content = fs.readFileSync('src/pages/CustomPage.tsx', 'utf8');

content = content.replace(/useState\(\\'\\'\);/g, 'useState("");');
fs.writeFileSync('src/pages/CustomPage.tsx', content, 'utf8');
