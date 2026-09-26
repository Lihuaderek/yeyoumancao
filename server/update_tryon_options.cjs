const fs = require('fs');
let code = fs.readFileSync('src/pages/TryOnPage.tsx', 'utf8');

code = code.replace(
  /\{COLOR_OPTIONS\.map\(c =>/g,
  `{(selectedGarment.merchantColors || COLOR_OPTIONS).map((c: any) =>`
);

code = code.replace(
  /\{FABRIC_OPTIONS\.map\(f =>/g,
  `{(selectedGarment.merchantFabrics || FABRIC_OPTIONS).map((f: any) =>`
);

fs.writeFileSync('src/pages/TryOnPage.tsx', code, 'utf8');
