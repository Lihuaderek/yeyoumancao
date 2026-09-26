/**
 * 野有蔓草 · 应用主根组件
 * 配置 12 大核心页面路由、全局认证上下文与购物车订单上下文
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { RequireAuth } from './components/RequireAuth';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { TryOnPage } from './pages/TryOnPage';
import { CustomPage } from './pages/CustomPage';
import { DesignersPage } from './pages/DesignersPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { MerchantRegisterPage } from './pages/MerchantRegisterPage';
import { MerchantLoginPage } from './pages/MerchantLoginPage';
import { MerchantDashboard } from './pages/MerchantDashboard';
import { MerchantProductForm } from './pages/MerchantProductForm';


// 路由切换时自动回滚至顶部
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-rice-light text-ink">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* 12 大核心路�?*/}
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/try-on" element={<RequireAuth><TryOnPage /></RequireAuth>} />
                <Route path="/custom" element={<RequireAuth><CustomPage /></RequireAuth>} />
                <Route path="/designers" element={<RequireAuth><DesignersPage /></RequireAuth>} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<RequireAuth><ContactPage /></RequireAuth>} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/cart" element={<RequireAuth><CartPage /></RequireAuth>} />
                <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
                <Route path="/orders" element={<RequireAuth><OrdersPage /></RequireAuth>} />
                <Route path="/merchant/register" element={<MerchantRegisterPage />} />
                <Route path="/merchant/login" element={<MerchantLoginPage />} />
                <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
                <Route path="/merchant/products/new" element={<MerchantProductForm />} />
                <Route path="/merchant/products/edit/:id" element={<MerchantProductForm />} />

                {/* 兜底路由重定向至首页 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
