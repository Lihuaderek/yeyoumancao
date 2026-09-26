const fs = require('fs');
let code = fs.readFileSync('src/pages/TryOnPage.tsx', 'utf8');

const stray1 = `
                ))}
              </div>
            </div>`;

code = code.replace(stray1, '');

fs.writeFileSync('src/pages/TryOnPage.tsx', code, 'utf8');
