const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const regex = /\{localStorage\.getItem\('yeyou_mancao_current_merchant'\) \? JSON\.parse\(localStorage\.getItem\('yeyou_mancao_current_merchant'\)\(\)\)\.name \+ ' 后台' : '商家中心'\}/;
// Actually, let's just do a simpler replace.
content = content.replace(/\{localStorage\.getItem\('yeyou_mancao_current_merchant'\) \? JSON\.parse\([\s\S]*?'商家中心'\}/g, 
  `{(() => {
    try {
      const m = localStorage.getItem('yeyou_mancao_current_merchant');
      return m && m !== 'undefined' ? JSON.parse(m).name + ' 后台' : '商家中心';
    } catch(e) {
      return '商家中心';
    }
  })()}`);

fs.writeFileSync('src/components/Navbar.tsx', content, 'utf8');
