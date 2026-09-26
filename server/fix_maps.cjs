const fs = require('fs');

let shop = fs.readFileSync('src/pages/ShopPage.tsx', 'utf8');
shop = shop.replace(/garment\.tags\.slice/g, '(garment.tags || []).slice');
fs.writeFileSync('src/pages/ShopPage.tsx', shop, 'utf8');

let modal = fs.readFileSync('src/components/GarmentDetailModal.tsx', 'utf8');
modal = modal.replace(/garment\.colors\.map/g, '(garment.colors || []).map');
modal = modal.replace(/garment\.fabrics\.map/g, '(garment.fabrics || []).map');
fs.writeFileSync('src/components/GarmentDetailModal.tsx', modal, 'utf8');
