/**
 * 野有蔓草 · 页脚组件
 * 展示品牌理念、非遗故事链接、联系方式与定价免责声明
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND_CONFIG } from '../config';
import { Heart, ShieldAlert, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ink text-rice-light border-t-2 border-gold/40 relative overflow-hidden">
      {/* 祥云纹样顶部装饰 */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-vermilion via-gold to-vermilion" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* 品牌理念 */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="野有蔓草" className="w-10 h-10" />
              <span className="font-serif text-2xl font-bold tracking-widest text-gold-light">
                {BRAND_CONFIG.name}
              </span>
            </div>
            <p className="font-serif text-xs text-gold/80 italic leading-relaxed">
              “{BRAND_CONFIG.slogan}”
            </p>
            <p className="text-xs text-rice-dark/70 leading-relaxed">
              野有蔓草秉持守正创新之志，将周礼六礼之庄重与苏绣、潮绣非遗绝艺交融，为天下佳偶定制传世东方婚嫁吉服。
            </p>
          </div>

          {/* 快速导航 */}
          <div>
            <h4 className="font-serif text-sm font-bold text-gold-light tracking-widest mb-4 border-b border-gold/20 pb-2">
              华服选萃
            </h4>
            <ul className="space-y-2 text-xs text-rice-dark/80 font-serif">
              <li>
                <Link to="/shop?category=xiuhe" className="hover:text-gold transition-colors">
                  正统秀禾服系列
                </Link>
              </li>
              <li>
                <Link to="/shop?category=longfeng" className="hover:text-gold transition-colors">
                  重工潮绣龙凤褂
                </Link>
              </li>
              <li>
                <Link to="/try-on" className="hover:text-gold transition-colors flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-vermilion inline-block" />
                  AR 实时人体试穿
                </Link>
              </li>
              <li>
                <Link to="/custom" className="hover:text-gold transition-colors">
                  一客一版定制工坊
                </Link>
              </li>
              <li>
                <Link to="/designers" className="hover:text-gold transition-colors">
                  非遗传承人与版型总师
                </Link>
              </li>
            </ul>
          </div>

          {/* 文化与关于 */}
          <div>
            <h4 className="font-serif text-sm font-bold text-gold-light tracking-widest mb-4 border-b border-gold/20 pb-2">
              传统礼序
            </h4>
            <ul className="space-y-2 text-xs text-rice-dark/80 font-serif">
              <li>
                <Link to="/about" className="hover:text-gold transition-colors">
                  周礼六礼文化考究
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold transition-colors">
                  苏绣与潮绣金银线技艺
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold transition-colors">
                  非遗工坊到店量体预约
                </Link>
              </li>
              <li>
                <a href="/credits.txt" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">
                  版权声明与设计来源
                </a>
              </li>
            </ul>
          </div>

          {/* 联系与工坊 */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-gold-light tracking-widest mb-4 border-b border-gold/20 pb-2">
              工坊雅集
            </h4>
            <div className="space-y-2 text-xs text-rice-dark/80">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>定制热线：{BRAND_CONFIG.contact.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>电子专函：{BRAND_CONFIG.contact.email}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                <span>工坊地址：{BRAND_CONFIG.contact.address}</span>
              </p>
            </div>
          </div>
        </div>

        {/* 演示定价安全警示 */}
        <div className="mt-10 pt-6 border-t border-gold/20 flex flex-col sm:flex-row items-center justify-between text-xs text-rice-dark/60 gap-4">
          <div className="flex items-center gap-2 text-gold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{BRAND_CONFIG.pricingDisclaimer}</span>
          </div>

          <p className="flex items-center gap-1 font-serif">
            野有蔓草 秉承非遗匠心 · 演示工程
          </p>
        </div>

        {/* 版权信息 */}
        <div className="mt-4 text-center text-[11px] text-rice-dark/40 font-serif">
          © {new Date().getFullYear()} {BRAND_CONFIG.fullName}. 保留所有权利.
        </div>
      </div>
    </footer>
  );
};
