const fs = require('fs');
let code = fs.readFileSync('src/pages/TryOnPage.tsx', 'utf8');
code = code.replace(/const garmentImg = await loadImage\(cObj\?\.image \|\|/g, 'const garmentImg = await loadImage((cObj as any)?.image ||');
fs.writeFileSync('src/pages/TryOnPage.tsx', code, 'utf8');
