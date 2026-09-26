/**
 * 野有蔓草 · 订单结算页面
 * 填写收件人、联系电话、配送地址，点击提交订单
 * 提交后生成 YYMC 格式模拟订单号，保存至 localStorage，清空购物车，弹出下单二维码模态框
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, User, Phone, MapPin, FileText } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { OrderSuccessModal } from '../components/OrderSuccessModal';
import { Order } from '../types';
import { BRAND_CONFIG } from '../config';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cart, totalPrice, createOrder } = useCart();

  // 如果未登录，重定向到登录页
  useEffect(() => {
    if (!currentUser) {
      navigate('/login?redirect=/checkout');
    }
  }, [currentUser, navigate]);

  const [formData, setFormData] = useState({
    name: currentUser?.name || currentUser?.username || '',
    phone: '',
    address: '',
    notes: ''
  });

  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert('请完整填写收货人姓名、手机号码与送达地址');
      return;
    }

    if (cart.length === 0) {
      alert('购物车内暂无可结算商品');
      navigate('/shop');
      return;
    }

    // 调用创建订单方法 (生成 YYMC + 时间戳订单号并存入 localStorage，清空购物车)
    const newOrder = createOrder({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      notes: formData.notes
    });

    if (newOrder) {
      setCreatedOrder(newOrder);
      setIsSuccessModalOpen(true);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 顶部标题区 */}
      <div className="text-center max-w-xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-ink mb-2">
          大婚吉服定制结算
        </h1>
        <p className="text-xs text-ink-muted">
          请核验您的定制规格与专人收件地址，工坊将依礼制排单开造
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* 左侧：收货地址与配送表单 (7列) */}
        <div className="md:col-span-7 bg-rice p-6 rounded-lg border border-gold/40 shadow-xs">
          <h3 className="font-serif text-lg font-bold text-ink mb-4 pb-2 border-b border-gold/30">
            填写收货人与交付地址
          </h3>

          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div>
              <label className="block text-xs font-serif text-ink mb-1">
                收货人姓名 *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="如：陆先生 / 林女士"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-2.5 pl-8 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
                />
                <User className="w-4 h-4 text-ink-muted absolute left-2.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif text-ink mb-1">
                联系手机号码 *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="用于顺丰特快保价专员送达前致电"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs p-2.5 pl-8 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
                />
                <Phone className="w-4 h-4 text-ink-muted absolute left-2.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif text-ink mb-1">
                详细收货地址 *
              </label>
              <div className="relative">
                <textarea
                  rows={2}
                  required
                  placeholder="省、市、区、街道门牌号及楼层"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full text-xs p-2.5 pl-8 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
                />
                <MapPin className="w-4 h-4 text-ink-muted absolute left-2.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif text-ink mb-1">
                大婚吉期 / 包装附言 (选填)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="例如：大婚吉日2026年10月，定制贺词红锦卡"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-xs p-2.5 pl-8 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
                />
                <FileText className="w-4 h-4 text-ink-muted absolute left-2.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded bg-vermilion hover:bg-vermilion-light text-white font-serif tracking-widest text-sm shadow-lg transition-colors mt-2"
            >
              提交订单并生成支付码
            </button>
          </form>
        </div>

        {/* 右侧：订单明细小计 (5列) */}
        <div className="md:col-span-5 bg-rice-light p-6 rounded-lg border-2 border-gold shadow-md space-y-4">
          <h3 className="font-serif text-base font-bold text-ink pb-2 border-b border-gold/30">
            结算商品清单 ({cart.length})
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 text-xs border-b border-gold/15 pb-2">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-14 object-cover rounded bg-ink border border-gold/20"
                />
                <div className="flex-1">
                  <h4 className="font-serif font-bold text-ink line-clamp-1">{item.title}</h4>
                  <div className="text-[10px] text-ink-muted">
                    {item.size}码 · {item.colorName} · {item.fabricName}
                  </div>
                  <div className="text-[11px] font-semibold text-vermilion mt-0.5">
                    ¥{item.price.toLocaleString()} × {item.quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gold/30 space-y-2 text-xs">
            <div className="flex justify-between text-ink-muted">
              <span>专属会员：</span>
              <span className="text-ink font-semibold">{currentUser.username}</span>
            </div>
            <div className="flex justify-between text-ink-muted">
              <span>顺丰特快保价保送：</span>
              <span className="text-green-700 font-semibold">尊享免运费</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-gold/20">
              <span className="text-sm font-bold text-ink">定制总额：</span>
              <span className="font-serif text-2xl font-bold text-vermilion">
                ¥{totalPrice.toLocaleString()}
              </span>
            </div>
            <p className="text-[10px] text-vermilion leading-tight flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3 h-3 shrink-0" />
              <span>{BRAND_CONFIG.pricingDisclaimer}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 下单成功与二维码扫码模态框 */}
      <OrderSuccessModal
        order={createdOrder}
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          navigate('/');
        }}
        onViewOrders={() => {
          setIsSuccessModalOpen(false);
          navigate('/orders');
        }}
      />
    </div>
  );
};
