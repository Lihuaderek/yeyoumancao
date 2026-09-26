const fs = require('fs');
let content = fs.readFileSync('src/components/GarmentDetailModal.tsx', 'utf8');

// Replace garment.colors with garment.merchantColors || garment.colors
content = content.replace(/\(garment\.colors \|\| \[\]\)/g, '(garment.merchantColors || garment.colors || [])');
content = content.replace(/\(garment\.fabrics \|\| \[\]\)/g, '(garment.merchantFabrics || garment.fabrics || [])');

// And the initialization of currentColor / currentFabricName
content = content.replace(/garment\.colors\.length/g, '(garment.merchantColors || garment.colors || []).length');
content = content.replace(/garment\.colors\[/g, '(garment.merchantColors || garment.colors || [])[');

content = content.replace(/garment\.fabrics\.length/g, '(garment.merchantFabrics || garment.fabrics || []).length');
content = content.replace(/garment\.fabrics\[/g, '(garment.merchantFabrics || garment.fabrics || [])[');

fs.writeFileSync('src/components/GarmentDetailModal.tsx', content, 'utf8');
