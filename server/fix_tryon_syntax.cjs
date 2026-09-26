const fs = require('fs');
let code = fs.readFileSync('src/pages/TryOnPage.tsx', 'utf8');

code = code.replace(
  /\n                \}\)\}\n              <\/div>\n            <\/div>/g,
  ''
);

fs.writeFileSync('src/pages/TryOnPage.tsx', code, 'utf8');
