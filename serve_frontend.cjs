const fs = require('fs');
let content = fs.readFileSync('server/index.js', 'utf8');

const staticCode = `
// 静态托管前端生产环境代码
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    const indexPath = path.join(__dirname, '../dist/index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Frontend build not found. Please run npm run build.');
    }
  }
});
`;

content = content.replace('// 启动服务', staticCode + '\n// 启动服务');
fs.writeFileSync('server/index.js', content, 'utf8');
