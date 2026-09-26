const fs = require('fs');
let code = fs.readFileSync('src/pages/TryOnPage.tsx', 'utf8');

code = code.replace(
  /const prepareGarmentCanvas = async \(\) => \{\n    const cObj = \(selectedGarment\.merchantColors \|\| COLOR_OPTIONS\)\.find\(\(c: any\) => c\.id === color\);\n    const garmentImg = await loadImage\(\(cObj as any\)\?\.image \|\| selectedGarment\.overlayImage \|\| selectedGarment\.image\);/,
  `const prepareGarmentCanvas = async () => {
    const cObj = (selectedGarment.merchantColors || COLOR_OPTIONS).find((c: any) => c.id === color);
    
    let targetImageSrc = (cObj as any)?.image || selectedGarment.overlayImage || selectedGarment.image;
    if (selectedGarment.merchantVariants && selectedGarment.merchantVariants.length > 0) {
      const variant = selectedGarment.merchantVariants.find((v: any) => 
        (v.colorId === color || (!v.colorId && (!selectedGarment.merchantColors || selectedGarment.merchantColors.length === 0))) &&
        (v.fabricId === fabric || (!v.fabricId && (!selectedGarment.merchantFabrics || selectedGarment.merchantFabrics.length === 0)))
      );
      if (variant && variant.image) {
        targetImageSrc = variant.image;
      }
    }
    
    const garmentImg = await loadImage(targetImageSrc);`
);

fs.writeFileSync('src/pages/TryOnPage.tsx', code, 'utf8');
