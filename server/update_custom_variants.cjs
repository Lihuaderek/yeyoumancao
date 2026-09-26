const fs = require('fs');
let code = fs.readFileSync('src/pages/CustomPage.tsx', 'utf8');

code = code.replace(
  /const displayImage = currentColor\?\.image \|\| currentFabric\?\.image \|\| currentPattern\?\.image \|\| currentStyle\.image;/,
  `let displayImage = currentColor?.image || currentFabric?.image || currentPattern?.image || currentStyle.image;
  if (currentStyle.merchantVariants && currentStyle.merchantVariants.length > 0) {
    const variant = currentStyle.merchantVariants.find((v: any) => 
      (v.colorId === currentColor.id || v.colorId === currentColor.name || (!v.colorId && !(currentStyle.merchantColors && currentStyle.merchantColors.length > 0))) &&
      (v.fabricId === currentFabric.id || v.fabricId === currentFabric.name || (!v.fabricId && !(currentStyle.merchantFabrics && currentStyle.merchantFabrics.length > 0)))
    );
    if (variant && variant.image) {
      displayImage = variant.image;
    }
  }`
);

fs.writeFileSync('src/pages/CustomPage.tsx', code, 'utf8');
