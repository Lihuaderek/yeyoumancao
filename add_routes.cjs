const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Imports
const imports = `import { MerchantRegisterPage } from './pages/MerchantRegisterPage';
import { MerchantLoginPage } from './pages/MerchantLoginPage';
import { MerchantDashboard } from './pages/MerchantDashboard';
import { MerchantProductForm } from './pages/MerchantProductForm';
`;
content = content.replace(/import \{ OrdersPage \} from '\.\/pages\/OrdersPage';/, `import { OrdersPage } from './pages/OrdersPage';\n${imports}`);

// Routes
const routes = `<Route path="/merchant/register" element={<MerchantRegisterPage />} />
                <Route path="/merchant/login" element={<MerchantLoginPage />} />
                <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
                <Route path="/merchant/products/new" element={<MerchantProductForm />} />
                <Route path="/merchant/products/edit/:id" element={<MerchantProductForm />} />`;

content = content.replace(/<Route path="\/orders" element=\{<RequireAuth><OrdersPage \/><\/RequireAuth>\} \/>/, `<Route path="/orders" element={<RequireAuth><OrdersPage /></RequireAuth>} />\n                ${routes}`);

fs.writeFileSync('src/App.tsx', content, 'utf8');
