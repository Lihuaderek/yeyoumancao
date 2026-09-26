/**
 * 野有蔓草 · 礼服商城页面
 * 卡片网格展示，支持按款式（秀禾、龙凤褂、汉服婚服、旗袍）与性别筛选
 * 点击打开详情弹窗，支持加入购物车、立即购买与3D试穿
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Sparkles, ShoppingBag, Eye, ShieldCheck, Filter } from 'lucide-react';
import { GARMENTS } from '../data/mockData';
import { Garment, GarmentCategory } from '../types';
import { GarmentDetailModal } from '../components/GarmentDetailModal';
import { BRAND_CONFIG } from '../config';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get('category') as GarmentCategory) || 'all';

  const [activeCategory, setActiveCategory] = useState<GarmentCategory>(initialCategory);
  const [activeGender, setActiveGender] = useState<'all' | 'men' | 'women'>('all');
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);
  const [remoteGarments, setRemoteGarments] = useState<Garment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          setRemoteGarments(data.products);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category') as GarmentCategory;
    if (cat) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  const handleCategoryChange = (category: GarmentCategory) => {
    setActiveCategory(category);
    if (category === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category });
    }
  };

  // 过滤商品列表
  const allGarments = [...GARMENTS, ...remoteGarments];
  const filteredGarments = allGarments.filter(garment => {
    const categoryMatch = activeCategory === 'all' || garment.category === activeCategory;
    const genderMatch = activeGender === 'all' || garment.gender === activeGender;
    return categoryMatch && genderMatch;
  });

  const handleOpenDetail = (garment: Garment) => {
    setSelectedGarment(garment);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 顶部标题区 */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-serif tracking-widest text-vermilion uppercase font-semibold">
          BOUTIQUE COLLECTION
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-2 mb-3 tracking-wider">
          传统婚嫁礼服商城
        </h1>
        <div className="w-16 h-0.5 bg-vermilion mx-auto mb-3" />
        <p className="text-xs sm:text-sm text-ink-muted">
          每一件吉服皆承载千年礼序与非遗工匠精神。四件核心高定支持 AR 真人摄像头试穿体验。
        </p>

        {/* 演示定价安全提示 */}
        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-50 border border-gold/40 text-xs text-amber-900">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
          <span>{BRAND_CONFIG.pricingDisclaimer}</span>
        </div>
      </div>

      {/* 款式与性别筛选栏 */}
      <div className="bg-rice p-4 rounded-lg border border-gold/30 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* 款式筛选按钮组 */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-serif text-ink-muted flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5" />
            款式分类：
          </span>
          {[
            { id: 'all', label: '全部礼服' },
            { id: 'xiuhe', label: '秀禾服' },
            { id: 'longfeng', label: '龙凤褂' },
            { id: 'hanfu', label: '汉服婚服' },
            { id: 'qipao', label: '旗袍' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleCategoryChange(tab.id as GarmentCategory)}
              className={`px-3.5 py-1.5 rounded text-xs font-serif transition-all ${
                activeCategory === tab.id
                  ? 'bg-vermilion text-white shadow-xs font-bold'
                  : 'bg-rice-light text-ink hover:bg-gold/15 border border-gold/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 性别筛选 */}
        <div className="flex items-center gap-2 text-xs font-serif">
          <span className="text-ink-muted">适穿对象：</span>
          {[
            { id: 'all', label: '全部' },
            { id: 'women', label: '女士嫁衣' },
            { id: 'men', label: '男士吉服' },
          ].map(g => (
            <button
              key={g.id}
              onClick={() => setActiveGender(g.id as 'all' | 'men' | 'women')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeGender === g.id
                  ? 'bg-gold text-ink font-semibold'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* 商品卡片网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGarments.map(garment => (
          <div
            key={garment.id}
            className="group bg-rice rounded-lg border border-gold/30 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* 图片与标签 */}
            <div
              className="relative aspect-[3/4] bg-ink/90 overflow-hidden cursor-pointer"
              onClick={() => handleOpenDetail(garment)}
            >
              <img
                src={garment.image}
                alt={garment.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-vermilion text-white text-xs font-serif shadow-xs">
                {garment.category}
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-gold text-xs font-mono">
                {garment.gender === 'men' ? '男士' : '女士'}
              </div>
            </div>

            {/* 卡片详情信息 */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3
                  onClick={() => handleOpenDetail(garment)}
                  className="font-serif text-base font-bold text-ink group-hover:text-vermilion transition-colors cursor-pointer line-clamp-1 mb-1.5"
                >
                  {garment.name}
                </h3>
                <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed mb-3">
                  {garment.description}
                </p>

                {/* 工艺标签 */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {(garment.tags || []).slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-gold/10 text-gold-dark border border-gold/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                {/* 价格与试穿操作 */}
                <div className="flex items-baseline justify-between pt-3 border-t border-gold/20 mb-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif text-xl font-bold text-vermilion">
                      ¥{garment.price.toLocaleString()}
                    </span>
                    {garment.originalPrice && (
                      <span className="text-[11px] text-ink-muted line-through">
                        ¥{garment.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-ink-muted">一客一版定制</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={`/try-on?id=${garment.id}`}
                    className="py-2 px-2 rounded text-center text-xs font-serif bg-gold/15 hover:bg-gold/25 text-gold-dark border border-gold/40 transition-colors flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-gold" />
                    去试穿
                  </Link>
                  <button
                    onClick={() => handleOpenDetail(garment)}
                    className="py-2 px-2 rounded text-center text-xs font-serif bg-vermilion hover:bg-vermilion-light text-white transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGarments.length === 0 && (
        <div className="text-center py-20 bg-rice rounded border border-gold/30">
          <p className="font-serif text-base text-ink-muted">暂无符合筛选条件的礼服</p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setActiveGender('all');
            }}
            className="mt-3 px-4 py-1.5 rounded text-xs font-serif bg-vermilion text-white"
          >
            重置筛选条件
          </button>
        </div>
      )}

      {/* 礼服详情弹窗 */}
      <GarmentDetailModal
        garment={selectedGarment}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
