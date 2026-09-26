/**
 * 野有蔓草 · 礼服详情弹窗组件
 * 支持尺码/面料/颜色选择，支持跳转 3D 试穿、加入购物车、立即购买（未登录拦截）
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, ShoppingBag, Eye, ShieldCheck, Check } from 'lucide-react';
import { Garment } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { BRAND_CONFIG } from '../config';

interface GarmentDetailModalProps {
  garment: Garment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GarmentDetailModal: React.FC<GarmentDetailModalProps> = ({
  garment,
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL'>('M');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedFabricIndex, setSelectedFabricIndex] = useState(0);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen || !garment) return null;

    const currentColor = (garment.colors && (garment.merchantColors || garment.colors || []).length > 0) ? ((garment.merchantColors || garment.colors || [])[selectedColorIndex] || (garment.merchantColors || garment.colors || [])[0]) : { name: '默认', hex: '#ffffff', value: 'default' };
  const currentFabricName = (garment.fabrics && (garment.merchantFabrics || garment.fabrics || []).length > 0) ? ((garment.merchantFabrics || garment.fabrics || [])[selectedFabricIndex] || (garment.merchantFabrics || garment.fabrics || [])[0]) : '默认面料';
  

    let mainImage = (currentColor as any).image || (typeof currentFabricName === 'object' && currentFabricName !== null ? currentFabricName.image : null) || garment.image;
  if (garment.merchantVariants && garment.merchantVariants.length > 0) {
    const variant = garment.merchantVariants.find((v: any) => 
      (v.colorId === (currentColor as any).id || v.colorId === (currentColor as any).name || (!v.colorId && !(garment.merchantColors && garment.merchantColors.length > 0))) &&
      (v.fabricId === (currentFabricName as any).id || v.fabricId === (currentFabricName as any).name || (!v.fabricId && !(garment.merchantFabrics && garment.merchantFabrics.length > 0)))
    );
    if (variant && variant.image) {
      mainImage = variant.image;
    }
  }
  // 映射面料类型
  const getFabricType = (index: number): 'silk' | 'satin' | 'embroidery' => {
    if (index === 0) return 'silk';
    if (index === 1) return 'satin';
    return 'embroidery';
  };

  // 拦截未登录并跳转登录页
  const handleAuthCheck = (action: () => void) => {
    if (!currentUser) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    action();
  };

  // 加入购物车
  const handleAddToCart = () => {
    handleAuthCheck(() => {
      addToCart({
        garmentId: garment.id,
        title: garment.name,
        image: garment.image,
        price: garment.price,
        size: selectedSize,
        color: (currentColor as any).value || currentColor.name,
        colorName: currentColor.name,
        fabric: getFabricType(selectedFabricIndex),
        fabricName: currentFabricName,
        quantity: 1
      });
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2200);
    });
  };

  // 立即购买
  const handleBuyNow = () => {
    handleAuthCheck(() => {
      addToCart({
        garmentId: garment.id,
        title: garment.name,
        image: garment.image,
        price: garment.price,
        size: selectedSize,
        color: (currentColor as any).value || currentColor.name,
        colorName: currentColor.name,
        fabric: getFabricType(selectedFabricIndex),
        fabricName: currentFabricName,
        quantity: 1
      });
      navigate('/checkout');
    });
  };

  // 进入 3D 虚拟试穿
  const handleGoToTryOn = () => {
    onClose();
    navigate(`/try-on?id=${garment.id}&color=${(currentColor as any).value || currentColor.name}&fabric=${getFabricType(selectedFabricIndex)}&size=${selectedSize}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-rice-light border border-gold rounded-lg shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-ink/40 text-rice hover:bg-ink hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 左侧：精美礼服图样与试穿快捷入口 */}
        <div className="md:w-1/2 bg-ink/95 p-6 flex flex-col items-center justify-center relative min-h-[320px] md:min-h-full">
          <div className="w-full max-w-[280px] aspect-[3/4] relative rounded overflow-hidden shadow-2xl border border-gold/30">
            <img
              src={mainImage}
              alt={garment.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 px-2 py-0.5 bg-vermilion/90 text-rice text-xs font-serif rounded">
              {garment.categoryName}
            </div>
          </div>

          <button
            onClick={handleGoToTryOn}
            className="mt-5 w-full max-w-[280px] py-2.5 px-4 rounded bg-gold/20 hover:bg-gold/30 text-gold-light border border-gold flex items-center justify-center gap-2 text-sm font-serif transition-colors"
          >
            <Sparkles className="w-4 h-4 text-gold" />
            进入 AR 摄像头实时试穿
          </button>
        </div>

        {/* 右侧：礼服参数、非遗说明与购买控制 */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-[88vh]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs tracking-wider px-2 py-0.5 rounded bg-vermilion/10 text-vermilion border border-vermilion/30">
                {garment.gender === 'men' ? '乾坤君子 · 礼服' : '凤鸾华堂 · 嫁衣'}
              </span>
              <span className="text-xs text-ink-muted">· {garment.craftsmanship}</span>
            </div>

            <h2 className="font-serif text-2xl font-bold text-ink mb-2">
              {garment.name}
            </h2>

            {/* 定价展示与说明 */}
            <div className="mb-4 pb-3 border-b border-gold/20">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-extrabold text-vermilion">
                  ¥{garment.price.toLocaleString()}
                </span>
                {garment.originalPrice && (
                  <span className="text-sm text-ink-muted line-through">
                    ¥{garment.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-vermilion mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 inline shrink-0" />
                {BRAND_CONFIG.pricingDisclaimer}
              </p>
            </div>

            <p className="text-sm text-ink/80 leading-relaxed mb-4">
              {garment.description}
            </p>

            {/* 颜色选择 */}
            <div className="mb-4">
              <label className="block text-xs font-serif text-ink-muted mb-1.5">
                吉色选定：<span className="text-ink font-semibold">{currentColor.name}</span>
              </label>
              <div className="flex gap-2">
                {(garment.merchantColors || garment.colors || []).map((color, idx) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColorIndex(idx)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs border transition-all ${
                      selectedColorIndex === idx
                        ? 'border-vermilion bg-vermilion/5 font-semibold text-vermilion ring-1 ring-vermilion'
                        : 'border-gold/30 hover:border-gold text-ink'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/10 inline-block"
                      style={{ backgroundColor: color.hex }}
                    />
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 面料选择 */}
            <div className="mb-4">
              <label className="block text-xs font-serif text-ink-muted mb-1.5">
                非遗面料：<span className="text-ink font-semibold">{typeof currentFabricName === 'object' && currentFabricName !== null ? currentFabricName.name : currentFabricName}</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(garment.merchantFabrics || garment.fabrics || []).map((fabric, idx) => (
                  <button
                    key={typeof fabric === 'object' && fabric !== null ? fabric.name : fabric}
                    onClick={() => setSelectedFabricIndex(idx)}
                    className={`py-1.5 px-2 rounded text-xs border text-center transition-all ${
                      selectedFabricIndex === idx
                        ? 'border-vermilion bg-vermilion/5 text-vermilion font-medium ring-1 ring-vermilion'
                        : 'border-gold/30 hover:border-gold text-ink'
                    }`}
                  >
                    {typeof fabric === 'object' && fabric !== null ? fabric.name : fabric}
                  </button>
                ))}
              </div>
            </div>

            {/* 尺码选择 */}
            <div className="mb-6">
              <label className="block text-xs font-serif text-ink-muted mb-1.5">
                定制尺码：<span className="text-ink font-semibold">{selectedSize}码</span>
              </label>
              <div className="flex gap-2">
                {(['S', 'M', 'L', 'XL'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-8 rounded text-xs border flex items-center justify-center transition-all ${
                      selectedSize === size
                        ? 'bg-vermilion text-white border-vermilion font-bold'
                        : 'border-gold/40 hover:border-vermilion text-ink'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 底部操作按钮 */}
          <div className="pt-3 border-t border-gold/20 flex flex-col gap-2">
            {addedSuccess && (
              <div className="text-xs text-green-700 bg-green-50 border border-green-200 py-1.5 px-3 rounded flex items-center gap-1.5 justify-center">
                <Check className="w-3.5 h-3.5" /> 已成功加入您的定制购物车！
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="w-full py-2.5 px-4 rounded border border-vermilion text-vermilion font-serif hover:bg-vermilion/5 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                加入购物车
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-2.5 px-4 rounded bg-vermilion text-white font-serif hover:bg-vermilion-light transition-colors shadow-md text-sm"
              >
                立即购买
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
