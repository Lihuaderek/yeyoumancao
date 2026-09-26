const fs = require('fs');
let code = fs.readFileSync('server/merchant_api.js', 'utf8');

code = code.replace(
  /tags: \['商家定制', '原创设计'\],\n        target: '全部', \/\/ Default logic\n        createdAt: new Date\(\)\.toISOString\(\)\n      \};/g,
  `tags: ['商家定制', '原创设计'],
        target: '全部', // Default logic
        createdAt: new Date().toISOString(),
        merchantColors,
        merchantFabrics,
        merchantPatterns
      };`
);

fs.writeFileSync('server/merchant_api.js', code, 'utf8');
