const fs = require('fs');
let code = fs.readFileSync('server/index.js', 'utf8');

code = code.replace(/const server = \nif \(process\.env\.VERCEL\) \{[\s\S]*?server\.setTimeout\(35000\);/g, 
`let server;
if (process.env.VERCEL) {
  // export default app;
} else {
  server = app.listen(PORT, () => {
    console.log(\`Server is running on http://localhost:\${PORT}\`);
  });
  server.setTimeout(35000);
}
export default app;`);

fs.writeFileSync('server/index.js', code, 'utf8');
