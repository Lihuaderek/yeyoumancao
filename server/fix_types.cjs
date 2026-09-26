const fs = require('fs');
let content = fs.readFileSync('src/types/index.ts', 'utf8');

const merchantTypes = `
export interface MerchantOption {
  id: string;
  name: string;
  priceOffset: number;
  image?: string;
  hex?: string;
  desc?: string;
}
`;

content = merchantTypes + content;
content = content.replace('export interface Garment {', 'export interface Garment {\n  merchantColors?: MerchantOption[];\n  merchantFabrics?: MerchantOption[];\n  merchantPatterns?: MerchantOption[];');

fs.writeFileSync('src/types/index.ts', content, 'utf8');
