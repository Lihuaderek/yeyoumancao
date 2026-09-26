const fs = require('fs');
let content = fs.readFileSync('src/pages/CustomPage.tsx', 'utf8');

content = content.replace(/currentStyle\.merchantColors : availableColors/g, 'currentStyle.merchantColors : CUSTOM_OPTIONS.colors');
content = content.replace(/currentStyle\.merchantFabrics : availableFabrics/g, 'currentStyle.merchantFabrics : CUSTOM_OPTIONS.fabrics');
content = content.replace(/currentStyle\.merchantPatterns : availablePatterns/g, 'currentStyle.merchantPatterns : CUSTOM_OPTIONS.patterns');

fs.writeFileSync('src/pages/CustomPage.tsx', content, 'utf8');
