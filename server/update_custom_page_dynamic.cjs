const fs = require('fs');
let content = fs.readFileSync('src/pages/CustomPage.tsx', 'utf8');

// Replace CUSTOM_OPTIONS usages for current selections
const findBlock = `  const currentStyle = styles.find(s => s.id === selectedStyleId) || styles[0];
  const availableColors = currentStyle.merchantColors && currentStyle.merchantColors.length > 0 ? currentStyle.merchantColors : CUSTOM_OPTIONS.colors;
  const availableFabrics = currentStyle.merchantFabrics && currentStyle.merchantFabrics.length > 0 ? currentStyle.merchantFabrics : CUSTOM_OPTIONS.fabrics;
  const availablePatterns = currentStyle.merchantPatterns && currentStyle.merchantPatterns.length > 0 ? currentStyle.merchantPatterns : CUSTOM_OPTIONS.patterns;

  const currentColor = availableColors.find(c => c.id === selectedColorId) || availableColors[0];
  const currentFabric = availableFabrics.find(f => f.id === selectedFabricId) || availableFabrics[0];
  const currentPattern = availablePatterns.find(p => p.id === selectedPatternId) || availablePatterns[0];

  const estimatedPrice = currentStyle.basePrice + (currentColor.priceOffset || 0) + (currentFabric.priceOffset || 0) + (currentPattern.priceOffset || 0);
  
  const displayImage = currentColor?.image || currentFabric?.image || currentPattern?.image || currentStyle.image;
`;

content = content.replace(/const currentStyle = [\s\S]*?const estimatedPrice = [\s\S]*?;/, findBlock);

// Replace mapping loops
content = content.replace(/CUSTOM_OPTIONS\.colors/g, 'availableColors');
content = content.replace(/CUSTOM_OPTIONS\.fabrics/g, 'availableFabrics');
content = content.replace(/CUSTOM_OPTIONS\.patterns/g, 'availablePatterns');

// Wait! CUSTOM_OPTIONS.colors mapping renders the color dot: <div style={{ backgroundColor: color.hex }}
// If it's a merchant color, it might not have 'hex'. We can just use a default color dot or use the image as bg.
content = content.replace(/backgroundColor: color.hex/g, "backgroundColor: color.hex || '#E5E7EB', backgroundImage: color.image ? \`url(\${color.image})\` : 'none', backgroundSize: 'cover'");

// Update the main image src
content = content.replace(/<img\s+src=\{currentStyle\.image\}/, '<img src={displayImage}');

fs.writeFileSync('src/pages/CustomPage.tsx', content, 'utf8');
