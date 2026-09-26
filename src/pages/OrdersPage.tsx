/**
 * 野有蔓草 · 我的订单页面
 * 只展示当前登录用户的定制订单，订单状态显示为“待处理”
 * 数据基于 localStorage: yeyou_mancao_orders_${username}
 */

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Clock, ShieldCheck, ArrowRight, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BRAND_CONFIG } from '../config';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { orders } = useCart();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login?redirect=/orders');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 顶部标题区 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gold/30 gap-2">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            我的华服定制订单
          </h1>
          <p className="text-xs text-ink-muted mt-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-gold" />
            <span>会员账号：<strong className="text-ink">{currentUser.username}</strong></span>
          </p>
        </div>
        <Link
          to="/shop"
          className="text-xs font-serif px-3 py-1.5 rounded bg-rice border border-gold/40 text-gold-dark hover:bg-gold/15 transition-colors self-start sm:self-auto"
        >
          挑选更多吉服
        </Link>
      </div>

      {/* 订单列表 */}
      {orders.length === 0 ? (
        <div className="bg-rice rounded-lg border border-gold/30 p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gold/15 flex items-center justify-center text-gold">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-ink">
            暂无已提交的定制订单
          </h3>
          <p className="text-xs text-ink-muted max-w-sm mx-auto">
            您在野有蔓草下单的定制礼服将在此归档呈现。
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded bg-vermilion text-white font-serif text-xs hover:bg-vermilion-light transition-colors"
            >
              <span>前往礼服商城</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div
              key={order.orderId}
              className="bg-rice rounded-lg border border-gold/40 shadow-xs overflow-hidden"
            >
              {/* 订单头部状态栏 */}
              <div className="bg-rice-light px-6 py-3.5 border-b border-gold/25 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="font-serif text-ink">
                    订单号：<strong className="font-mono text-vermilion">{order.orderId}</strong>
                  </span>
                  <span className="text-ink-muted">
                    提交时间：{order.createdAt}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-100 text-amber-800 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    {order.status}
                  </span>
                </div>
              </div>

              {/* 订单商品项 */}
              <div className="p-6 divide-y divide-gold/15">
                {order.items.map(item => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-20 object-cover rounded bg-ink border border-gold/20 shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="font-serif text-sm font-bold text-ink mb-1">
                        {item.title}
                      </h4>
                      <div className="flex flex-wrap gap-2 text-xs text-ink-muted">
                        <span>尺码：{item.size}码</span>
                        <span>·</span>
                        <span>吉色：{item.colorName}</span>
                        <span>·</span>
                        <span>面料：{item.fabricName}</span>
                      </div>
                      <div className="text-xs font-serif font-bold text-vermilion mt-1">
                        ¥{item.price.toLocaleString()} × {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 订单收件信息与总额 */}
              <div className="bg-rice-light/60 px-6 py-4 border-t border-gold/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-ink-muted space-y-0.5">
                  <p>收件人：<strong className="text-ink">{order.consignee.name}</strong> ({order.consignee.phone})</p>
                  <p>配送地址：{order.consignee.address}</p>
                  {order.consignee.notes && <p>附言备注：{order.consignee.notes}</p>}
                </div>

                <div className="text-right sm:self-center">
                  <span className="text-ink-muted text-xs mr-2">定制总额：</span>
                  <span className="font-serif text-xl font-bold text-vermilion">
                    ¥{order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 演示安全提示 */}
      <div className="text-center pt-4">
        <p className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-gold" />
          <span>{BRAND_CONFIG.pricingDisclaimer}</span>
        </p>
      </div>
    </div>
  );
};
