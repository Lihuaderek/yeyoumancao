const fs = require('fs');
let content = fs.readFileSync('src/components/GarmentDetailModal.tsx', 'utf8');

const fixBlock = `  const mainImage = currentColor.image || (typeof currentFabricName === 'object' && currentFabricName !== null ? currentFabricName.image : null) || garment.image;`;
content = content.replace('// 映射面料类型', fixBlock + '\n  // 映射面料类型');
content = content.replace(/src=\{garment\.image\}/g, 'src={mainImage}');

fs.writeFileSync('src/components/GarmentDetailModal.tsx', content, 'utf8');
