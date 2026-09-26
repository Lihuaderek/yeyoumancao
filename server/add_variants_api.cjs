const fs = require('fs');
let code = fs.readFileSync('server/merchant_api.js', 'utf8');

// For POST
code = code.replace(
  /const \{ merchantId, name, category, price, imageUrl, description, merchantColors, merchantFabrics, merchantPatterns \} = req\.body;/,
  'const { merchantId, name, category, price, imageUrl, description, merchantColors, merchantFabrics, merchantPatterns, merchantVariants } = req.body;'
);
code = code.replace(
  /        merchantColors,\n        merchantFabrics,\n        merchantPatterns\n      \};/g,
  `        merchantColors,
        merchantFabrics,
        merchantPatterns,
        merchantVariants
      };`
);

// For PUT
code = code.replace(
  /const \{ name, category, price, imageUrl, description, merchantColors, merchantFabrics, merchantPatterns \} = req\.body;/,
  'const { name, category, price, imageUrl, description, merchantColors, merchantFabrics, merchantPatterns, merchantVariants } = req.body;'
);
code = code.replace(
  /merchantPatterns: merchantPatterns !== undefined \? merchantPatterns : products\[idx\]\.merchantPatterns\n      \};/,
  `merchantPatterns: merchantPatterns !== undefined ? merchantPatterns : products[idx].merchantPatterns,
        merchantVariants: merchantVariants !== undefined ? merchantVariants : products[idx].merchantVariants
      };`
);

fs.writeFileSync('server/merchant_api.js', code, 'utf8');
