const fs = require('fs');
let content = fs.readFileSync('src/components/GarmentDetailModal.tsx', 'utf8');

content = content.replace(/currentColor\.value/g, '(currentColor as any).value || currentColor.name');
content = content.replace(/fabric: currentFabricName,/g, "fabric: typeof currentFabricName === 'object' && currentFabricName !== null ? (currentFabricName as any).name : currentFabricName,");
content = content.replace(/currentColor\.image/g, '(currentColor as any).image');
content = content.replace(/currentColor\.hex/g, '(currentColor as any).hex');

fs.writeFileSync('src/components/GarmentDetailModal.tsx', content, 'utf8');
