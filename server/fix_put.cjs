const fs = require('fs');
let code = fs.readFileSync('server/merchant_api.js', 'utf8');

// For PUT /products/:id
code = code.replace(
  /products\[idx\] = \{[\s\S]*?description:.*?,\n      \};/g,
  `products[idx] = {
        ...products[idx],
        name: name || products[idx].name,
        category: category || products[idx].category,
        price: price ? Number(price) : products[idx].price,
        originalPrice: price ? Math.floor(Number(price) * 1.5) : products[idx].originalPrice,
        image: imageUrl || products[idx].image,
        description: description !== undefined ? description : products[idx].description,
        merchantColors: merchantColors !== undefined ? merchantColors : products[idx].merchantColors,
        merchantFabrics: merchantFabrics !== undefined ? merchantFabrics : products[idx].merchantFabrics,
        merchantPatterns: merchantPatterns !== undefined ? merchantPatterns : products[idx].merchantPatterns
      };`
);

fs.writeFileSync('server/merchant_api.js', code, 'utf8');
