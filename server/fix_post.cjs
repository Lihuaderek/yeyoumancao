const fs = require('fs');
let code = fs.readFileSync('server/merchant_api.js', 'utf8');

code = code.replace(
  /createdAt: new Date\(\)\.toISOString\(\)\n      \};/g,
  `createdAt: new Date().toISOString(),
        merchantColors,
        merchantFabrics,
        merchantPatterns
      };`
);

fs.writeFileSync('server/merchant_api.js', code, 'utf8');
