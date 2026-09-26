const fs = require('fs');
let content = fs.readFileSync('src/components/GarmentDetailModal.tsx', 'utf8');

const fix = `  const currentColor = (garment.colors && garment.colors.length > 0) ? (garment.colors[selectedColorIndex] || garment.colors[0]) : { name: '默认', hex: '#ffffff', value: 'default' };
  const currentFabricName = (garment.fabrics && garment.fabrics.length > 0) ? (garment.fabrics[selectedFabricIndex] || garment.fabrics[0]) : '默认面料';`;

content = content.replace(/const currentColor = garment\.colors\[selectedColorIndex\] \|\| garment\.colors\[0\];/, fix);
content = content.replace(/const currentFabricName = garment\.fabrics\[selectedFabricIndex\] \|\| garment\.fabrics\[0\];/, '');

fs.writeFileSync('src/components/GarmentDetailModal.tsx', content, 'utf8');
