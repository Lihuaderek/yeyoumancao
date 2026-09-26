const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// The best place is before the Auth State (currentUser) in Desktop Navigation or Right Section.
// Let's add it in the right section before cart or auth.
// We will add a Merchant Auth State check.

const merchantMenu = `
            {/* Merchant Center */}
            <div className="flex items-center pl-3 border-l border-gold/40 mr-2">
              <Link
                to={localStorage.getItem('yeyou_mancao_current_merchant') ? '/merchant/dashboard' : '/merchant/login'}
                className="text-xs font-serif text-vermilion hover:text-ink transition-colors flex items-center gap-1 font-bold"
              >
                <Store className="w-3.5 h-3.5" />
                {localStorage.getItem('yeyou_mancao_current_merchant') ? JSON.parse(localStorage.getItem('yeyou_mancao_current_merchant')).name + ' 后台' : '商家中心'}
              </Link>
            </div>
`;

content = content.replace(/\{\/\* Auth State \*\/\}/, `${merchantMenu}\n            {/* Auth State */}`);

// Also need to import Store from lucide-react if not already
if (!content.includes('Store')) {
  content = content.replace(/ShoppingBag,\s*User,\s*LogOut,\s*Menu,\s*X,\s*Sparkles/, 'ShoppingBag, User, LogOut, Menu, X, Sparkles, Store');
}

// Ensure the localStorage component re-renders. Actually Navbar might not react to localStorage changes automatically.
// We will just let it be, or use a custom hook, but the user didn't ask for reactive navbar for merchants, just "未登录显示..., 已登录显示...".

fs.writeFileSync('src/components/Navbar.tsx', content, 'utf8');
