/**
 * 野有蔓草 · 下单成功与二维码扫码模态框
 * 展示订单号及 qrcode.react 生成的二维码
 */

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, X } from 'lucide-react';
import { Order } from '../types';
import { BRAND_CONFIG } from '../config';

interface OrderSuccessModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onViewOrders: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
  onViewOrders
}) => {
  if (!isOpen || !order) return null;

  // 后续替换真实付款码：将 qrContent 改为真实支付链接即可
  const qrContent = typeof window !== 'undefined'
    ? `${window.location.origin}/maintenance.html`
    : BRAND_CONFIG.getQrContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-rice-light border border-gold rounded-lg shadow-2xl p-6 text-center">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-muted hover:text-ink transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 成功标识 */}
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-vermilion/10 border border-vermilion/30 flex items-center justify-center text-vermilion">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h3 className="font-serif text-2xl font-bold text-ink mb-1">下单成功</h3>
        <p className="text-xs text-ink-muted mb-4 tracking-wider">
          订单编号：<span className="font-mono font-semibold text-vermilion">{order.orderId}</span>
        </p>

        {/* 订单简要 */}
        <div className="bg-rice/70 rounded p-3 mb-5 border border-gold/30 text-left text-sm space-y-1">
          <div className="flex justify-between text-ink-muted">
            <span>收件人：</span>
            <span className="text-ink font-medium">{order.consignee.name} ({order.consignee.phone})</span>
          </div>
          <div className="flex justify-between text-ink-muted">
            <span>定制总额：</span>
            <span className="text-vermilion font-serif font-bold text-base">¥{order.totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-ink-muted">
            <span>当前状态：</span>
            <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-medium">
              {order.status}
            </span>
          </div>
        </div>

        {/* 下单二维码展示区 */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gold/40 shadow-inner mb-6">
          <div className="p-2 border-2 border-gold/40 rounded">
            <QRCodeSVG
              value={qrContent}
              size={180}
              bgColor="#FFFFFF"
              fgColor="#1A1A1A"
              level="H"
              includeMargin={true}
            />
          </div>
          {/* 二维码下方严格按要求不显示任何文字提示，手机扫码打开后显示 maintenance.html */}
        </div>

        {/* 操作按钮 */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onViewOrders}
            className="w-full py-2.5 px-4 rounded border border-vermilion text-vermilion font-serif hover:bg-vermilion/5 transition-colors text-sm"
          >
            查看我的订单
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded bg-vermilion text-white font-serif hover:bg-vermilion-light transition-colors text-sm shadow-md"
          >
            完成并返回
          </button>
        </div>
      </div>
    </div>
  );
};
