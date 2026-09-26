/**
 * 野有蔓草 · 定制工坊页面
 * 选择款式、颜色、面料、刺绣图案，实时显示配置摘要和价格估算
 * 礼服款式与【AI虚拟试穿】100%保持一致，支持男女吉服双向互通跳转
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, ShieldCheck, Check, Heart, Scissors, Ruler, ArrowRight, Eye } from 'lucide-react';
import { CUSTOM_OPTIONS, GARMENTS } from '../data/mockData';
import { Garment } from '../types';
import { BRAND_CONFIG } from '../config';

export const CustomPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const styleIdParam = searchParams.get('id');

  const [remoteGarments, setRemoteGarments] = useState<Garment[]>([]);
  const [styles, setStyles] = useState<any[]>(CUSTOM_OPTIONS.styles);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          setRemoteGarments(data.products);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const allGarments = [...GARMENTS, ...remoteGarments];
    const dynamicStyles = allGarments.map(g => ({
      id: g.id,
      name: g.name,
      basePrice: g.price,
      gender: g.gender as 'men' | 'women',
      image: g.image || g.overlayImage || '/images/ar_dress1.svg',
      desc: g.description,
      category: g.category,
      merchantColors: g.merchantColors,
      merchantFabrics: g.merchantFabrics,
      merchantPatterns: g.merchantPatterns
    }));
    setStyles(dynamicStyles);
    
    // 如果 URL 参数在 dynamicStyles 中，或者当前 selectedStyleId 在里面
    const foundByUrl = dynamicStyles.find(s => s.id === styleIdParam);
    if (foundByUrl) {
      setSelectedStyleId(foundByUrl.id);
      setGenderFilter(foundByUrl.gender);
    } else if (!dynamicStyles.find(s => s.id === selectedStyleId) && dynamicStyles.length > 0) {
      setSelectedStyleId(dynamicStyles[0].id);
    }
  }, [remoteGarments, styleIdParam]);


  // 1. 性别分类与选定款式
  const [genderFilter, setGenderFilter] = useState<'all' | 'men' | 'women'>('all');
  const [selectedStyleId, setSelectedStyleId] = useState(styleIdParam || 'g1');
  const [selectedColorId, setSelectedColorId] = useState("");
  const [selectedFabricId, setSelectedFabricId] = useState("");
  const [selectedPatternId, setSelectedPatternId] = useState("");

  // URL 参数监听联动
  useEffect(() => {
    if (styleIdParam) {
      const found = styles.find(s => s.id === styleIdParam);
      if (found) {
        setSelectedStyleId(found.id);
        setGenderFilter(found.gender);
      }
    }
  }, [styleIdParam]);

  // 用户量体定制表单
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    weddingDate: '',
    height: '',
    weight: '',
    bust: '',
    waist: '',
    specialRequest: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // 计算当前配置选中的对象
    const currentStyle = styles.find(s => s.id === selectedStyleId) || styles[0];
  const availableColors = currentStyle.merchantColors && currentStyle.merchantColors.length > 0 ? currentStyle.merchantColors : CUSTOM_OPTIONS.colors;
  const availableFabrics = currentStyle.merchantFabrics && currentStyle.merchantFabrics.length > 0 ? currentStyle.merchantFabrics : CUSTOM_OPTIONS.fabrics;
  const availablePatterns = currentStyle.merchantPatterns && currentStyle.merchantPatterns.length > 0 ? currentStyle.merchantPatterns : CUSTOM_OPTIONS.patterns;

  const currentColor = availableColors?.find(c => c.id === selectedColorId) || availableColors[0];
  const currentFabric = availableFabrics?.find(f => f.id === selectedFabricId) || availableFabrics[0];
  const currentPattern = availablePatterns?.find(p => p.id === selectedPatternId) || availablePatterns[0];

  const estimatedPrice = currentStyle.basePrice + (currentColor.priceOffset || 0) + (currentFabric.priceOffset || 0) + (currentPattern.priceOffset || 0);
  
  let displayImage = currentColor?.image || currentFabric?.image || currentPattern?.image || currentStyle.image;
  if (currentStyle.merchantVariants && currentStyle.merchantVariants.length > 0) {
    const variant = currentStyle.merchantVariants.find((v: any) => 
      (v.colorId === currentColor.id || v.colorId === currentColor.name || (!v.colorId && !(currentStyle.merchantColors && currentStyle.merchantColors.length > 0))) &&
      (v.fabricId === currentFabric.id || v.fabricId === currentFabric.name || (!v.fabricId && !(currentStyle.merchantFabrics && currentStyle.merchantFabrics.length > 0)))
    );
    if (variant && variant.image) {
      displayImage = variant.image;
    }
  }


  // 过滤展示款式
  const displayedStyles = styles.filter(s => {
    if (genderFilter === 'all') return true;
    return s.gender === genderFilter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('请填写预约人姓名与联系电话');
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 顶部标题区 */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-serif tracking-widest text-vermilion uppercase font-semibold">
          ATELIER BESPOKE
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-2 mb-3 tracking-wider">
          一客一版 · 高级定制工坊
        </h1>
        <div className="w-16 h-0.5 bg-vermilion mx-auto mb-3" />
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-serif">
          遵从古法六礼规制，精选非遗丝缎与盘金绣线。男女礼服双全，支持与虚拟试穿同款实时互通。
        </p>

        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-50 border border-gold/40 text-xs text-amber-900 font-serif">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
          <span>{BRAND_CONFIG.pricingDisclaimer}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 左侧：4大模块交互选择 (占用 7 列) */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. 款式选择 */}
          <div className="bg-rice p-6 rounded-lg border border-gold/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gold/20">
              <h3 className="font-serif text-base font-bold text-ink flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-vermilion text-white text-xs flex items-center justify-center font-mono">1</span>
                选择基础版型与礼制款式（男女各3款 · 与虚拟试穿一致）
              </h3>

              {/* 性别筛选 Tab */}
              <div className="flex items-center rounded-lg p-0.5 bg-rice-light border border-gold/30 text-[11px] font-serif shrink-0">
                <button
                  type="button"
                  onClick={() => setGenderFilter('all')}
                  className={`px-2.5 py-0.5 rounded transition-all ${
                    genderFilter === 'all' ? 'bg-vermilion text-white font-bold' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  全部 (6)
                </button>
                <button
                  type="button"
                  onClick={() => setGenderFilter('men')}
                  className={`px-2.5 py-0.5 rounded transition-all ${
                    genderFilter === 'men' ? 'bg-vermilion text-white font-bold' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  男士吉服 (3)
                </button>
                <button
                  type="button"
                  onClick={() => setGenderFilter('women')}
                  className={`px-2.5 py-0.5 rounded transition-all ${
                    genderFilter === 'women' ? 'bg-vermilion text-white font-bold' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  女士华服 (3)
                </button>
              </div>
            </div>

            {/* 6 款核心款式列表 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {displayedStyles.map(style => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyleId(style.id)}
                  className={`p-3 rounded text-left border flex gap-3 transition-all ${
                    selectedStyleId === style.id
                      ? 'border-vermilion bg-vermilion/5 ring-2 ring-vermilion shadow-md'
                      : 'border-gold/30 hover:border-gold bg-white'
                  }`}
                >
                  {/* 服装缩略图 */}
                  <div className="w-20 h-24 rounded overflow-hidden shrink-0 bg-white border border-gold/20 relative">
                    <img
                      src={style.image}
                      alt={style.name}
                      className="w-full h-full object-contain p-1"
                    />
                    <span className={`absolute top-0.5 left-0.5 px-1 py-0.2 rounded text-[8px] font-serif ${
                      style.gender === 'men' ? 'bg-sky-800 text-sky-100' : 'bg-rose-800 text-rose-100'
                    }`}>
                      {style.gender === 'men' ? '男' : '女'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="font-serif font-bold text-xs sm:text-sm text-ink truncate" title={style.name}>
                        {style.name}
                      </div>
                      <div className="text-[11px] text-ink-muted mt-0.5 line-clamp-2 leading-relaxed">
                        {style.desc}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-gold/15">
                      <span className="text-[10px] text-ink-muted font-serif">{style.category}</span>
                      <span className="text-xs font-bold text-vermilion font-serif">
                        ¥{style.basePrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. 颜色选择 */}
          <div className="bg-rice p-6 rounded-lg border border-gold/30">
            <h3 className="font-serif text-base font-bold text-ink mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-vermilion text-white text-xs flex items-center justify-center font-mono">2</span>
              选择吉庆配色
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {availableColors.map(color => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColorId(color.id)}
                  className={`p-3 rounded text-left border flex flex-col justify-between transition-all ${
                    selectedColorId === color.id
                      ? 'border-vermilion bg-vermilion/5 ring-1 ring-vermilion'
                      : 'border-gold/30 hover:border-gold bg-rice-light'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: color.hex || '#E5E7EB', backgroundImage: color.image ? `url(${color.image})` : 'none', backgroundSize: 'cover' }}
                    />
                    <span className="text-xs font-bold text-ink">{color.name.slice(0, 2)}</span>
                  </div>
                  <div className="text-[10px] text-ink-muted">{color.name}</div>
                  <div className="text-[10px] text-vermilion font-medium mt-1">
                    {color.priceOffset > 0 ? `+¥${color.priceOffset}` : '标准配色'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. 面料选择 */}
          <div className="bg-rice p-6 rounded-lg border border-gold/30">
            <h3 className="font-serif text-base font-bold text-ink mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-vermilion text-white text-xs flex items-center justify-center font-mono">3</span>
              选择非遗面料织造工艺
            </h3>
            <div className="space-y-3">
              {availableFabrics.map(fabric => (
                <button
                  key={fabric.id}
                  type="button"
                  onClick={() => setSelectedFabricId(fabric.id)}
                  className={`w-full p-3.5 rounded text-left border flex items-center justify-between transition-all ${
                    selectedFabricId === fabric.id
                      ? 'border-vermilion bg-vermilion/5 ring-1 ring-vermilion shadow-xs'
                      : 'border-gold/30 hover:border-gold bg-rice-light'
                  }`}
                >
                  <div>
                    <div className="font-serif text-sm font-bold text-ink">{fabric.name}</div>
                    <div className="text-xs text-ink-muted mt-0.5">{fabric.desc}</div>
                  </div>
                  <div className="text-xs font-semibold text-vermilion shrink-0 ml-3">
                    {fabric.priceOffset > 0 ? `+¥${fabric.priceOffset.toLocaleString()}` : '标准配置'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. 刺绣图案选择 */}
          <div className="bg-rice p-6 rounded-lg border border-gold/30">
            <h3 className="font-serif text-base font-bold text-ink mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-vermilion text-white text-xs flex items-center justify-center font-mono">4</span>
              选择主题刺绣图腾纹样
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availablePatterns.map(pattern => (
                <button
                  key={pattern.id}
                  type="button"
                  onClick={() => setSelectedPatternId(pattern.id)}
                  className={`p-3.5 rounded text-left border transition-all ${
                    selectedPatternId === pattern.id
                      ? 'border-vermilion bg-vermilion/5 ring-1 ring-vermilion shadow-xs'
                      : 'border-gold/30 hover:border-gold bg-rice-light'
                  }`}
                >
                  <div className="font-serif text-sm font-bold text-ink">{pattern.name}</div>
                  <div className="text-xs text-ink-muted mt-1 leading-relaxed">{pattern.desc}</div>
                  <div className="text-xs font-semibold text-vermilion mt-2">
                    +¥{pattern.priceOffset.toLocaleString()} (纯手工重工绣)
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：实时配置摘要与估价提交 (占用 5 列) */}
        <div className="lg:col-span-5 sticky top-28 space-y-6">
          <div className="bg-rice-light p-6 rounded-lg border-2 border-gold shadow-lg">
            <h3 className="font-serif text-lg font-bold text-ink mb-4 pb-3 border-b border-gold/30 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-gold" />
                定制配置摘要与预算
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-serif ${
                currentStyle.gender === 'men' ? 'bg-sky-100 text-sky-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {currentStyle.gender === 'men' ? '男士吉服定制' : '女士华服定制'}
              </span>
            </h3>

            {/* 当前款式大图与试穿联动卡片 */}
            <div className="mb-5 p-3 rounded-lg bg-white border border-gold/30 flex items-center gap-3">
              <div className="w-20 h-24 rounded overflow-hidden shrink-0 bg-white border border-gold/20">
                <img src={displayImage}
                  alt={currentStyle.name}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="font-serif font-bold text-sm text-ink truncate">
                  {currentStyle.name}
                </div>
                <div className="text-xs text-ink-muted">
                  基础工时费：<strong className="text-vermilion">¥{currentStyle.basePrice.toLocaleString()}</strong>
                </div>
                <Link
                  to={`/try-on?id=${currentStyle.id}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-vermilion/10 text-vermilion hover:bg-vermilion hover:text-white transition-colors text-xs font-serif"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>去虚拟试穿此款式</span>
                  <ArrowRight className="w-3 h-3 ml-0.5" />
                </Link>
              </div>
            </div>

            {/* 配置清单 */}
            <div className="space-y-3 text-xs mb-6 font-serif">
              <div className="flex justify-between py-1.5 border-b border-gold/15">
                <span className="text-ink-muted">选定款式：</span>
                <span className="font-medium text-ink">{currentStyle.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gold/15">
                <span className="text-ink-muted">吉色配选：</span>
                <span className="font-medium text-ink flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: currentColor.hex }} />
                  {currentColor.name}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gold/15">
                <span className="text-ink-muted">面料织锦：</span>
                <span className="font-medium text-ink">{currentFabric.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gold/15">
                <span className="text-ink-muted">刺绣图腾：</span>
                <span className="font-medium text-ink">{currentPattern.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gold/15">
                <span className="text-ink-muted">定制周期：</span>
                <span className="font-medium text-ink">约 45~60 个工作日</span>
              </div>
            </div>

            {/* 价格估算 */}
            <div className="bg-rice p-4 rounded border border-gold/40 mb-6">
              <span className="text-xs text-ink-muted block mb-1 font-serif">工艺估值总额 (全套定制)：</span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-vermilion">
                  ¥{estimatedPrice.toLocaleString()}
                </span>
                <span className="text-[11px] text-ink-muted font-serif">（含一客一版立裁）</span>
              </div>
              <p className="text-[10px] text-vermilion mt-1 font-serif">
                {BRAND_CONFIG.pricingDisclaimer}
              </p>
            </div>

            {/* 量体表单 */}
            <form onSubmit={handleSubmit} className="space-y-3 font-serif">
              <h4 className="font-serif text-xs font-bold text-ink tracking-wider flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-gold" />
                预约量体与交付信息
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="定制人姓名 *"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-2 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
                  required
                />
                <input
                  type="tel"
                  placeholder="联系电话 *"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs p-2 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  placeholder="大婚吉期"
                  value={formData.weddingDate}
                  onChange={e => setFormData({ ...formData, weddingDate: e.target.value })}
                  className="w-full text-xs p-2 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
                />
                <div className="flex gap-1">
                  <input
                    type="number"
                    placeholder="身高(cm)"
                    value={formData.height}
                    onChange={e => setFormData({ ...formData, height: e.target.value })}
                    className="w-full text-xs p-2 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
                  />
                  <input
                    type="number"
                    placeholder="体重(kg)"
                    value={formData.weight}
                    onChange={e => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full text-xs p-2 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="胸围(cm)"
                  value={formData.bust}
                  onChange={e => setFormData({ ...formData, bust: e.target.value })}
                  className="w-full text-xs p-2 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
                />
                <input
                  type="number"
                  placeholder="腰围(cm)"
                  value={formData.waist}
                  onChange={e => setFormData({ ...formData, waist: e.target.value })}
                  className="w-full text-xs p-2 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
                />
                <input
                  type="number"
                  placeholder="肩宽(cm)"
                  onChange={e => {
                    const val = e.target.value;
                    setFormData(prev => ({ ...prev, specialRequest: prev.specialRequest.includes('肩宽') ? prev.specialRequest.replace(/肩宽: \d+cm\n?/, `肩宽: ${val}cm\n`) : `肩宽: ${val}cm\n${prev.specialRequest}` }));
                  }}
                  className="w-full text-xs p-2 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
                />
              </div>

              <textarea
                placeholder="刺绣暗纹字号（如新人姓名首字母、吉日）、特别工艺要求..."
                rows={2}
                value={formData.specialRequest}
                onChange={e => setFormData({ ...formData, specialRequest: e.target.value })}
                className="w-full text-xs p-2 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
              />

              <button
                type="submit"
                className="w-full py-3 rounded bg-vermilion hover:bg-vermilion-light text-white font-serif tracking-wider shadow-md text-sm transition-colors mt-2"
              >
                提交专属定制需求
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 提交成功弹窗模态框 */}
      {isSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fade-in font-serif">
          <div className="bg-rice-light border border-gold rounded-lg shadow-2xl p-6 max-w-md w-full text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-vermilion/10 border border-vermilion/30 flex items-center justify-center text-vermilion">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-ink mb-2">定制方案已提交</h3>
            <p className="text-xs text-ink/80 leading-relaxed mb-4">
              尊敬的 <strong>{formData.name}</strong> 阁下，您所配置的【{currentStyle.name}】高级定制方案已录入野有蔓草非遗工坊档案。
            </p>
            <div className="bg-rice p-3 rounded text-left text-xs space-y-1 mb-5 border border-gold/30">
              <p>预留电话：<span className="font-semibold text-ink">{formData.phone}</span></p>
              <p>定制总估值：<span className="font-serif font-bold text-vermilion">¥{estimatedPrice.toLocaleString()}</span></p>
              <p>款式类别：<span className="font-semibold text-ink">{currentStyle.category}</span></p>
              <p>后续安排：工坊非遗量体师将在 24 小时内与您电话沟通胚样打板事宜。</p>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/try-on?id=${currentStyle.id}`}
                className="flex-1 py-2.5 rounded border border-vermilion text-vermilion text-xs hover:bg-vermilion/10 transition-colors flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                虚拟试穿此款
              </Link>
              <button
                onClick={() => setIsSubmitted(false)}
                className="flex-1 py-2.5 rounded bg-vermilion text-white font-serif text-xs hover:bg-vermilion-light transition-colors"
              >
                确定并返回工坊
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
