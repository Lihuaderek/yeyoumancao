/**
 * 野有蔓草 · 购物车页面
 * 显示已选礼服、数量、单价、总价，可修改数量与删除
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BRAND_CONFIG } from '../config';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();

  const handleCheckout = () => {
    if (!currentUser) {
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-gold/15 flex items-center justify-center text-gold">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-ink">
          您的定制购物车空空如也
        </h2>
        <p className="text-xs text-ink-muted max-w-md mx-auto">
          未挑选任何心仪的婚嫁礼服。您可以前往礼服商城选购，或进入 3D 虚拟试穿工坊进行试穿体验。
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <Link
            to="/shop"
            className="px-6 py-2.5 rounded bg-vermilion text-white font-serif text-xs hover:bg-vermilion-light transition-colors"
          >
            前往商城挑选
          </Link>
          <Link
            to="/try-on"
            className="px-6 py-2.5 rounded border border-gold text-gold-dark hover:bg-gold/15 font-serif text-xs transition-colors"
          >
            AR 虚拟试穿
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 顶部标题区 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gold/30 gap-2">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            定制礼服选购单 ({cart.length})
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            {currentUser ? `当前会员：${currentUser.username}` : '建议登录后结算以保存专属订单档案'}
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-ink-muted hover:text-vermilion transition-colors self-start sm:self-auto"
        >
          清空全部
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 左侧：商品列表 (8列) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(item => (
            <div
              key={item.id}
              className="bg-rice p-4 sm:p-5 rounded-lg border border-gold/30 flex flex-col sm:flex-row items-center gap-4 shadow-xs"
            >
              {/* 缩略图 */}
              <div className="w-20 h-24 rounded bg-ink shrink-0 overflow-hidden border border-gold/30">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 规格信息 */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-serif text-base font-bold text-ink mb-1">
                  {item.title}
                </h3>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-ink-muted mb-2">
                  <span className="px-2 py-0.5 rounded bg-rice-light border border-gold/20">
                    尺码：{item.size}码
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rice-light border border-gold/20">
                    吉色：{item.colorName}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rice-light border border-gold/20">
                    面料：{item.fabricName}
                  </span>
                </div>
                <div className="font-serif text-base font-bold text-vermilion">
                  ¥{item.price.toLocaleString()}
                </div>
              </div>

              {/* 数量调节与操作 */}
              <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-4 shrink-0 w-full sm:w-auto">
                <div className="flex items-center border border-gold/40 rounded bg-white overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1.5 hover:bg-gold/15 text-ink-muted hover:text-ink transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-ink">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1.5 hover:bg-gold/15 text-ink-muted hover:text-ink transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-xs text-ink-muted hover:text-vermilion flex items-center gap-1 transition-colors"
                  title="移除商品"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>移除</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 右侧：总计与结算 (4列) */}
        <div className="lg:col-span-4 bg-rice-light p-6 rounded-lg border-2 border-gold shadow-md space-y-4">
          <h3 className="font-serif text-lg font-bold text-ink pb-3 border-b border-gold/30">
            定制费用结清
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-ink-muted">
              <span>礼服工艺小计：</span>
              <span className="text-ink font-semibold">¥{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-ink-muted">
              <span>顺丰特快保价保送：</span>
              <span className="text-ink font-semibold">尊享免运费</span>
            </div>
            <div className="flex justify-between text-ink-muted">
              <span>红木封缄礼盒：</span>
              <span className="text-ink font-semibold">赠予一对</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gold/30">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm font-bold text-ink">应付定制总值：</span>
              <span className="font-serif text-2xl font-bold text-vermilion">
                ¥{totalPrice.toLocaleString()}
              </span>
            </div>
            <p className="text-[10px] text-vermilion leading-tight flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3 h-3 shrink-0" />
              <span>{BRAND_CONFIG.pricingDisclaimer}</span>
            </p>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full py-3 rounded bg-vermilion hover:bg-vermilion-light text-white font-serif tracking-wider shadow-md text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>前往结算</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
