const fs = require('fs');
let code = fs.readFileSync('src/pages/TryOnPage.tsx', 'utf8');

code = code.replace(
  / *<div>\n *<label className="text-xs font-serif font-bold block mb-2">选择礼服<\/label>[\s\S]*?<\/div>\n *<\/div>/,
  ''
);

fs.writeFileSync('src/pages/TryOnPage.tsx', code, 'utf8');
