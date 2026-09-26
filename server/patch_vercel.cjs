const fs = require('fs');
let code = fs.readFileSync('server/merchant_api.js', 'utf8');

code = code.replace(/const UPLOADS_DIR = path\.join\(__dirname, 'uploads'\);/g, "const UPLOADS_DIR = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, 'uploads');");
code = code.replace(/const DATA_DIR = path\.join\(__dirname, 'data'\);/g, "const DATA_DIR = process.env.VERCEL ? '/tmp/data' : path.join(__dirname, 'data');");

fs.writeFileSync('server/merchant_api.js', code, 'utf8');
