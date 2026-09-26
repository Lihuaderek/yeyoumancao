import React from 'react';
import { BRAND_CONFIG } from '../config';
import { Scroll, Sparkles, Feather, BookOpen, Compass } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* 1. 品牌源起 */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vermilion/10 text-vermilion text-xs font-serif">
          <BookOpen className="w-3.5 h-3.5" />
          <span>诗经国风 · 华夏之美</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink tracking-wider">
          野有蔓草 · 品牌溯源
        </h1>
        <div className="w-16 h-0.5 bg-vermilion mx-auto" />
        <blockquote className="font-serif text-lg sm:text-xl text-gold-dark italic max-w-xl mx-auto leading-relaxed border-y border-gold/30 py-4">
          “野有蔓草，零露漙兮。有美一人，清扬婉兮。邂逅相遇，适我愿兮。”
          <span className="block text-xs text-ink-muted mt-2 not-italic">—《诗经·郑风·野有蔓草》</span>
        </blockquote>
        <p className="text-xs sm:text-sm text-ink/80 leading-relaxed text-left max-w-3xl mx-auto font-sans">
          野有蔓草，生于旷野而沐于清露，至柔至坚，正如世间相知相守之真情。古人以草木起兴，道尽人间最纯粹的良缘。我们以“野有蔓草”为名，愿将中国古老婚礼中执子之手的情义与周礼之威仪，化作一件件可以抚摸、可以传世的华服。
        </p>
      </section>

      {/* 2. 文化传承与工艺精髓 */}
      <section className="bg-rice p-8 sm:p-10 rounded-xl border border-gold/40 shadow-sm space-y-8">
        <div className="text-center">
          <span className="text-xs font-serif tracking-widest text-gold-dark uppercase font-semibold">
            HERITAGE & CRAFTSMANSHIP
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink mt-1">
            非遗工法 · 绣润山河
          </h2>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-ink/85">
          <div className="space-y-3 p-5 bg-rice-light rounded border border-gold/20">
            <h3 className="font-serif text-base font-bold text-vermilion flex items-center gap-2">
              <Feather className="w-4 h-4" />
              苏绣细金 · 劈丝点睛
            </h3>
            <p>
              苏绣以精、细、雅、洁著称。一根普通的真丝线，在刺绣大师手中可劈为十六分、三十二分乃至四十八分之一，细若毫芒。在制作霞帔与秀禾时，大师以平针、套针、盘金绣等多种古法针法交替施艺，令凤羽若振翅，牡丹若迎风带露。
            </p>
          </div>

          <div className="space-y-3 p-5 bg-rice-light rounded border border-gold/20">
            <h3 className="font-serif text-base font-bold text-vermilion flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              潮绣浮雕 · 密地金银
            </h3>
            <p>
              潮绣独创“垫高立体绣”，以脱脂棉絮或麦秆垫底，再覆以真金白银包心捻线层层盘结。龙身鳞片层叠隆起，触之铿然有声，在光影流转间呈现如浮雕般的立体视觉，为传统婚服注入顶级的奢华质感与神圣气场。
            </p>
          </div>
        </div>
      </section>

      {/* 4. 品牌誓约 */}
      <section className="border-t border-gold/30 pt-10 text-center space-y-4">
        <h3 className="font-serif text-xl font-bold text-ink">
          野有蔓草 · 吉服三誓
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-rice rounded border border-gold/20">
            <strong className="block font-serif text-sm text-vermilion mb-1">一誓：守正不伪</strong>
            <span className="text-ink-muted">全系选用真丝重磅织锦与纯金银线，绝无化纤替补。</span>
          </div>
          <div className="p-4 bg-rice rounded border border-gold/20">
            <strong className="block font-serif text-sm text-vermilion mb-1">二誓：一客一版</strong>
            <span className="text-ink-muted">三十六处精细量体立裁，一人一裁绝不套用流水线通版。</span>
          </div>
          <div className="p-4 bg-rice rounded border border-gold/20">
            <strong className="block font-serif text-sm text-vermilion mb-1">三誓：终身护持</strong>
            <span className="text-ink-muted">传家吉服终身免费清香养护、金丝紧固与封存保养。</span>
          </div>
        </div>
      </section>
    </div>
  );
};
