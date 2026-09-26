/**
 * 野有蔓草 · 官方首页
 * 包含品牌首屏、核心样例画廊、传统六礼文化故事、非遗定制流程与行动号召
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Scissors, Palette } from 'lucide-react';
import { GARMENTS, CULTURAL_STORIES } from '../data/mockData';
import { BRAND_CONFIG } from '../config';

export const HomePage: React.FC = () => {
  // 取前4件核心样例
  const showcaseGarments = GARMENTS.slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. 英雄首屏区 (Hero Section) */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#1C1313] via-[#150E0E] to-rice-light text-rice">
        {/* 背景雅致祥云与暗纹遮罩 */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#C9A96E_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-rice-light via-transparent to-black/60 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-gold/10 text-gold-light text-xs font-serif tracking-widest mb-8">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>传世非遗 · 一客一版 · 终身传家</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-widest text-rice leading-tight mb-6">
            野有蔓草 · 锦绣良缘
          </h1>

          <p className="font-serif text-lg sm:text-2xl text-gold-light tracking-widest mb-4">
            “野有蔓草，零露漙兮。执子之手，与子偕老。”
          </p>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-rice-dark/80 leading-relaxed font-sans mb-10">
            传承周礼华服气度，融汇苏绣细金与潮绣浮雕之精粹。每一件婚嫁吉服，皆由国家级非遗传承人倾注千余工时手作绣就，以天地之礼，敬一生之诺。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/try-on"
              className="w-full sm:w-auto px-8 py-3.5 rounded bg-vermilion hover:bg-vermilion-light text-white font-serif tracking-widest text-base shadow-lg shadow-vermilion/30 flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              开启 AR 真人摄像头试穿
            </Link>
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-3.5 rounded border border-gold hover:border-gold-light text-gold-light font-serif tracking-widest text-base hover:bg-gold/10 transition-colors flex items-center justify-center gap-2"
            >
              鉴赏传世礼服
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 演示定价安全提示 */}
          <p className="mt-8 text-xs text-gold/70 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{BRAND_CONFIG.pricingDisclaimer}</span>
          </p>
        </div>
      </section>

      {/* 2. 4款传世高定样例展示 (Featured Showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-serif tracking-widest text-vermilion uppercase font-semibold">
            HERITAGE COLLECTION
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-2 mb-4 tracking-wider">
            四大经典婚嫁吉服
          </h2>
          <div className="w-16 h-0.5 bg-vermilion mx-auto mb-4" />
          <p className="text-sm text-ink-muted leading-relaxed">
            涵盖男士正统秀禾长袍、潮绣立体龙凤褂，以及女士霞帔秀禾与全密金银线褂皇，均支持全交互 AR 实时人体贴合试穿。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {showcaseGarments.map(garment => (
            <div
              key={garment.id}
              className="group bg-rice rounded-lg border border-gold/30 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] bg-ink/90 overflow-hidden">
                <img
                  src={garment.image}
                  alt={garment.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-vermilion text-white text-xs font-serif">
                  {garment.categoryName}
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-gold text-xs font-mono">
                  {garment.gender === 'men' ? '男士吉服' : '女士嫁衣'}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-ink group-hover:text-vermilion transition-colors line-clamp-1 mb-2">
                    {garment.name}
                  </h3>
                  <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed mb-4">
                    {garment.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-baseline justify-between pt-3 border-t border-gold/20 mb-3">
                    <span className="font-serif text-xl font-bold text-vermilion">
                      ¥{garment.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-ink-muted">定制工期约45天</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to={`/try-on?id=${garment.id}`}
                      className="py-2 px-3 rounded text-center text-xs font-serif bg-gold/15 hover:bg-gold/25 text-gold-dark border border-gold/40 transition-colors flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      AR试穿
                    </Link>
                    <Link
                      to="/shop"
                      className="py-2 px-3 rounded text-center text-xs font-serif bg-vermilion hover:bg-vermilion-light text-white transition-colors"
                    >
                      查看详情
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 传统婚嫁六礼文化故事 (Cultural Stories) */}
      <section className="bg-rice/80 border-y border-gold/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-serif tracking-widest text-gold-dark uppercase font-semibold">
              RITES & CULTURE
            </span>
            <h2 className="font-serif text-3xl font-bold text-ink mt-2 mb-4 tracking-wider">
              周礼吉庆 · 六礼传承
            </h2>
            <div className="w-12 h-0.5 bg-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CULTURAL_STORIES.map((story, idx) => (
              <div
                key={story.title}
                className="bg-rice-light border border-gold/40 rounded-lg p-6 relative shadow-xs hover:border-vermilion transition-colors"
              >
                <span className="absolute -top-3 left-6 px-3 py-0.5 bg-vermilion text-white text-xs font-serif rounded">
                  {story.tag}
                </span>
                <h3 className="font-serif text-lg font-bold text-ink mt-2 mb-1">
                  {story.title}
                </h3>
                <p className="font-serif text-xs text-vermilion italic mb-3">
                  {story.subtitle}
                </p>
                <p className="text-xs text-ink/80 leading-relaxed">
                  {story.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 非遗服务流程 (Service Workflow) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-serif tracking-widest text-vermilion uppercase font-semibold">
            BESPOKE PROCESS
          </span>
          <h2 className="font-serif text-3xl font-bold text-ink mt-2 mb-4 tracking-wider">
            一客一版 · 六步成衣
          </h2>
          <div className="w-16 h-0.5 bg-vermilion mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
          {[
            { step: '01', title: '选款试穿', desc: '线上3D仿真选样与配色' },
            { step: '02', title: '精细量体', desc: '36处人体黄金比例测量' },
            { step: '03', title: '纹样立意', desc: '定制夫妻双方专属刺绣暗纹' },
            { step: '04', title: '劈丝盘金', desc: '非遗大师千余工时手作' },
            { step: '05', title: '初胚试穿', desc: '微调肩颈与下摆垂坠弧度' },
            { step: '06', title: '吉期封缄', desc: '红木雕花礼盒顺丰特快专递' },
          ].map(item => (
            <div key={item.step} className="p-4 bg-rice rounded border border-gold/30">
              <span className="font-serif text-2xl font-bold text-gold">{item.step}</span>
              <h4 className="font-serif text-sm font-bold text-ink mt-2 mb-1">{item.title}</h4>
              <p className="text-[11px] text-ink-muted leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 底部行动倡议 (CTA) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-ink via-ink-light to-ink p-8 sm:p-12 rounded-xl border border-gold text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gold-light">
              一生一世一次 · 当着东方盛世之华裳
            </h3>
            <p className="text-xs sm:text-sm text-rice/80 leading-relaxed font-sans">
              在线体验 AI 虚拟试穿，或预约苏州平江路刺绣工坊，与国家级工艺美术大师面对面沟通您的专属嫁衣。
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                to="/custom"
                className="px-6 py-2.5 rounded bg-vermilion hover:bg-vermilion-light text-white font-serif text-sm transition-colors"
              >
                进入定制工坊
              </Link>
              <Link
                to="/contact"
                className="px-6 py-2.5 rounded border border-gold text-gold-light hover:bg-gold/15 font-serif text-sm transition-colors"
              >
                预约到店量体
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
