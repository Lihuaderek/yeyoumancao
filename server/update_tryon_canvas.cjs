const fs = require('fs');
let code = fs.readFileSync('src/pages/TryOnPage.tsx', 'utf8');

code = code.replace(
  /const prepareGarmentCanvas = async \(\) => \{\n    const garmentImg = await loadImage\(selectedGarment\.image\);\n    const gW = garmentImg\.naturalWidth;\n    const gH = garmentImg\.naturalHeight;[\s\S]*?const cObj = COLOR_OPTIONS\.find\(c => c\.id === color\);\n    if \(cObj\) \{/g,
  `const prepareGarmentCanvas = async () => {
    const cObj = (selectedGarment.merchantColors || COLOR_OPTIONS).find((c: any) => c.id === color);
    const garmentImg = await loadImage(cObj?.image || selectedGarment.overlayImage || selectedGarment.image);
    const gW = garmentImg.naturalWidth;
    const gH = garmentImg.naturalHeight;

    const gCanvas = document.createElement('canvas');
    gCanvas.width = gW;
    gCanvas.height = gH;
    const gCtx = gCanvas.getContext('2d')!;
    gCtx.drawImage(garmentImg, 0, 0, gW, gH);
    removeBackground(gCtx, gW, gH);
    
    const bounds = getGarmentBounds(gCtx, gW, gH);

    if (cObj && cObj.hex) {`
);

fs.writeFileSync('src/pages/TryOnPage.tsx', code, 'utf8');
