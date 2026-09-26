const fs = require('fs');
let content = fs.readFileSync('src/components/GarmentDetailModal.tsx', 'utf8');
content = content.replace(/\{currentFabricName\}/g, "{typeof currentFabricName === 'object' && currentFabricName !== null ? currentFabricName.name : currentFabricName}");
content = content.replace(/\{fabric\}/g, "{typeof fabric === 'object' && fabric !== null ? fabric.name : fabric}");
// Also key={fabric} to key={typeof fabric === 'object' ? fabric.id : fabric}
content = content.replace(/key=\{fabric\}/g, "key={typeof fabric === 'object' ? fabric.name : fabric}");
fs.writeFileSync('src/components/GarmentDetailModal.tsx', content, 'utf8');
