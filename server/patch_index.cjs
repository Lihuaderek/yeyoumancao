const fs = require('fs');
let code = fs.readFileSync('server/index.js', 'utf8');

if (!code.includes('module.exports = app;')) {
  code = code.replace(/app\.listen\(PORT, \(\) => \{[\s\S]*?\}\);/g, `
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(\`Server is running on http://localhost:\${PORT}\`);
  });
}
  `);
  fs.writeFileSync('server/index.js', code, 'utf8');
}
