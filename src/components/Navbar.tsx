import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Menu, X, Sparkles, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { BRAND_CONFIG } from '../config';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { totalCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: '首页' },
    { to: '/shop', label: '礼服商城' },
    { to: '/try-on', label: 'AI虚拟试穿', highlight: true },
    { to: '/custom', label: '定制工坊' },
    { to: '/designers', label: '匠人手艺' },
    { to: '/contact', label: '预约咨询' },
    { to: '/about', label: '关于我们' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-rice-light/95 backdrop-blur-sm border-b border-gold/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <img 
              src="/logo.svg" 
              alt={BRAND_CONFIG.name} 
              className="h-10 w-10 sm:h-12 sm:w-12 transition-transform duration-500 group-hover:rotate-12" 
            />
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold text-ink tracking-widest">
                {BRAND_CONFIG.name}
              </span>
              <span className="text-[10px] sm:text-xs text-gold-dark font-serif tracking-widest uppercase">
                {BRAND_CONFIG.slogan}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `font-serif text-sm tracking-widest transition-colors relative py-1 ${
                    isActive ? 'text-vermilion font-bold' : 'text-ink hover:text-vermilion'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-1">
                      {link.highlight && <Sparkles className="w-3.5 h-3.5 text-gold" />}
                      {link.label}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-vermilion rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Section: Cart & Auth */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Cart Icon */}
            <Link 
              to="/cart" 
              className="relative p-2 rounded-full text-ink hover:text-vermilion hover:bg-gold/15 transition-colors"
              title="购物车"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-vermilion text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                  {totalCount}
                </span>
              )}
            </Link>

            
            {/* Merchant Center */}
            <div className="flex items-center pl-3 border-l border-gold/40 mr-2">
              <Link
                to={localStorage.getItem('yeyou_mancao_current_merchant') ? '/merchant/dashboard' : '/merchant/login'}
                className="text-xs font-serif text-vermilion hover:text-ink transition-colors flex items-center gap-1 font-bold"
              >
                <Store className="w-3.5 h-3.5" />
                {(() => {
    try {
      const m = localStorage.getItem('yeyou_mancao_current_merchant');
      return m && m !== 'undefined' ? JSON.parse(m).name + ' 后台' : '商家中心';
    } catch(e) {
      return '商家中心';
    }
  })()}
              </Link>
            </div>

            {/* Auth State */}
            {currentUser ? (
              <div className="flex items-center gap-3 pl-3 border-l border-gold/40">
                <Link 
                  to="/orders" 
                  className="flex items-center gap-1.5 text-xs font-serif text-ink hover:text-vermilion transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-gold" />
                  <span className="font-semibold max-w-[100px] truncate">{currentUser.name || currentUser.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-ink-muted hover:text-vermilion transition-colors"
                  title="退出登录"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-3 border-l border-gold/40">
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-xs font-serif font-bold text-ink border border-ink rounded hover:bg-ink hover:text-white transition-colors"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-xs font-serif font-bold bg-vermilion text-white border border-vermilion rounded hover:bg-vermilion-light transition-colors shadow-sm"
                >
                  注册
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link 
              to="/cart" 
              className="relative p-2 text-ink hover:text-vermilion transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-vermilion text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {totalCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ink hover:text-vermilion focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-rice-light border-b border-gold/30 shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-3 rounded-md font-serif text-sm tracking-widest ${
                    isActive ? 'bg-vermilion/10 text-vermilion font-bold' : 'text-ink hover:bg-gold/10'
                  }`
                }
              >
                <span className="flex items-center gap-2">
                  {link.highlight && <Sparkles className="w-4 h-4 text-gold" />}
                  {link.label}
                </span>
              </NavLink>
            ))}

            <div className="pt-4 mt-4 border-t border-gold/20">
              {currentUser ? (
                <div className="flex items-center justify-between px-3">
                  <Link 
                    to="/orders" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-serif text-ink"
                  >
                    <User className="w-4 h-4 text-gold" />
                    <span>{currentUser.name || currentUser.username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-serif text-vermilion flex items-center gap-1"
                  >
                    <LogOut className="w-4 h-4" />
                    退出
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 px-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-sm font-serif font-bold text-ink border border-ink rounded hover:bg-ink hover:text-white transition-colors"
                  >
                    登录
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-sm font-serif font-bold bg-vermilion text-white rounded hover:bg-vermilion-light transition-colors"
                  >
                    注册
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
