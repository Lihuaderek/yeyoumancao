const fs = require('fs');
let code = fs.readFileSync('src/components/GarmentDetailModal.tsx', 'utf8');

code = code.replace(
  /const mainImage = \(currentColor as any\)\.image \|\| \(typeof currentFabricName === 'object' && currentFabricName !== null \? currentFabricName\.image : null\) \|\| garment\.image;/,
  `let mainImage = (currentColor as any).image || (typeof currentFabricName === 'object' && currentFabricName !== null ? currentFabricName.image : null) || garment.image;
  if (garment.merchantVariants && garment.merchantVariants.length > 0) {
    const variant = garment.merchantVariants.find((v: any) => 
      (v.colorId === (currentColor as any).id || v.colorId === (currentColor as any).name || (!v.colorId && !(garment.merchantColors && garment.merchantColors.length > 0))) &&
      (v.fabricId === (currentFabricName as any).id || v.fabricId === (currentFabricName as any).name || (!v.fabricId && !(garment.merchantFabrics && garment.merchantFabrics.length > 0)))
    );
    if (variant && variant.image) {
      mainImage = variant.image;
    }
  }`
);

fs.writeFileSync('src/components/GarmentDetailModal.tsx', code, 'utf8');
