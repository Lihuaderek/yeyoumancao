const fs = require('fs');
let code = fs.readFileSync('server/merchant_api.js', 'utf8');

const target = `      image: imageUrl,
      description: description || name,
      tags: ['商家定制', '原创设计'],
      target: '全部', // Default logic
      createdAt: new Date().toISOString()
    };`;

const replacement = `      image: imageUrl,
      description: description || name,
      tags: ['商家定制', '原创设计'],
      target: '全部', // Default logic
      createdAt: new Date().toISOString(),
      merchantColors,
      merchantFabrics,
      merchantPatterns
    };`;

code = code.replace(target, replacement);

fs.writeFileSync('server/merchant_api.js', code, 'utf8');
