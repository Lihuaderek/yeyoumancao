/**
 * 野有蔓草 · 联系/预约页面
 * 包含工坊到店量体表单，提交后弹“预约成功”模态框
 */

import React, { useState } from 'react';
import { Phone, MapPin, Mail, Clock, CheckCircle2, Calendar, Users, Sparkles } from 'lucide-react';
import { BRAND_CONFIG } from '../config';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    visitorCount: '2',
    stylePreference: '秀禾服',
    notes: ''
  });

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('请完整填写您的姓名与手机号码');
      return;
    }
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 顶部标题区 */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-serif tracking-widest text-vermilion uppercase font-semibold">
          VISIT & APPOINTMENT
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-2 mb-3 tracking-wider">
          工坊雅叙 · 到店量体预约
        </h1>
        <div className="w-16 h-0.5 bg-vermilion mx-auto mb-3" />
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
          野有蔓草在苏州平江历史街区设有非遗雅集工坊。诚邀天下新人莅临品茗试衣，近距离观摩苏绣非遗手作。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 左侧：工坊信息与交通指南 (5列) */}
        <div className="lg:col-span-5 bg-rice p-6 sm:p-8 rounded-lg border border-gold/40 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-serif text-vermilion">ATELIER LOCATION</span>
            <h3 className="font-serif text-xl font-bold text-ink mt-1">
              野有蔓草 · 苏州非遗工坊
            </h3>
            <p className="text-xs text-ink-muted mt-2 leading-relaxed">
              工坊坐落于姑苏平江水巷深处，原为清代绣庄旧址，三进深四合院，收藏明清古服三十余件。
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-vermilion shrink-0 mt-0.5" />
              <div>
                <strong className="block text-ink">工坊地址</strong>
                <span className="text-ink-muted">{BRAND_CONFIG.contact.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-vermilion shrink-0 mt-0.5" />
              <div>
                <strong className="block text-ink">贵宾预约专线</strong>
                <span className="text-ink-muted">{BRAND_CONFIG.contact.phone}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-vermilion shrink-0 mt-0.5" />
              <div>
                <strong className="block text-ink">接待雅叙时间</strong>
                <span className="text-ink-muted">{BRAND_CONFIG.contact.hours} (请提前1日预约)</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-vermilion shrink-0 mt-0.5" />
              <div>
                <strong className="block text-ink">电子专函</strong>
                <span className="text-ink-muted">{BRAND_CONFIG.contact.email}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gold/20 text-xs text-ink/80 space-y-2">
            <strong className="font-serif text-ink block">交通贴士：</strong>
            <p className="text-ink-muted leading-relaxed">
              自驾可导航至“平江路历史街区南停车场”，步行约 200 米至刺绣工坊；轨道交通 1 号线相门站 3 号口出站步行即达。
            </p>
          </div>
        </div>

        {/* 右侧：预约表单 (7列) */}
        <div className="lg:col-span-7 bg-rice-light p-6 sm:p-8 rounded-lg border-2 border-gold/50 shadow-md">
          <div className="mb-6">
            <h3 className="font-serif text-xl font-bold text-ink">
              填写入席预约单
            </h3>
            <p className="text-xs text-ink-muted mt-1">
              我们将为您安排 1 位国家级刺绣大师助理与 1 位资深量体总师全程专属陪同。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-serif text-ink mb-1">
                  新人姓名 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="如：张先生 / 李女士"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
                />
              </div>

              <div>
                <label className="block text-xs font-serif text-ink mb-1">
                  联系手机号码 *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="用于短信发送入庄门引与茶席预约"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs p-2.5 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-serif text-ink mb-1">
                  期望莅临日期
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full text-xs p-2.5 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
                />
              </div>

              <div>
                <label className="block text-xs font-serif text-ink mb-1">
                  同行人数
                </label>
                <select
                  value={formData.visitorCount}
                  onChange={e => setFormData({ ...formData, visitorCount: e.target.value })}
                  className="w-full text-xs p-2.5 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
                >
                  <option value="1">1 位 (独往量体)</option>
                  <option value="2">2 位 (夫妻同往 · 推荐)</option>
                  <option value="3-4">3~4 位 (携双方父母同鉴)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif text-ink mb-1">
                心仪吉服款式
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['秀禾服', '龙凤褂', '汉服大婚', '海派旗袍'].map(style => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setFormData({ ...formData, stylePreference: style })}
                    className={`py-2 text-xs rounded border transition-all ${
                      formData.stylePreference === style
                        ? 'border-vermilion bg-vermilion/5 font-bold text-vermilion'
                        : 'border-gold/30 hover:border-gold bg-white text-ink'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif text-ink mb-1">
                特别注记或大婚吉日
              </label>
              <textarea
                rows={3}
                placeholder="例如大婚预定月份、特别偏爱的刺绣图腾、饮食饮茶禁忌等..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full text-xs p-2.5 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded bg-vermilion hover:bg-vermilion-light text-white font-serif tracking-wider shadow-md text-sm transition-colors"
            >
              提交到店品鉴预约
            </button>
          </form>
        </div>
      </div>

      {/* 弹窗：“预约成功”模态框 */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-rice-light border border-gold rounded-lg shadow-2xl p-6 sm:p-8 max-w-md w-full text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-vermilion/10 text-vermilion flex items-center justify-center border border-vermilion/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-ink mb-2">
              预约成功
            </h3>

            <p className="text-xs text-ink/80 leading-relaxed mb-4">
              尊敬的 <strong>{formData.name}</strong> 阁下，您所提交的到店量体与非遗品鉴预约已成功登记！
            </p>

            <div className="bg-rice p-4 rounded text-left text-xs space-y-1.5 mb-6 border border-gold/30">
              <p>留存手机：<span className="font-semibold text-ink">{formData.phone}</span></p>
              <p>意向款式：<span className="font-semibold text-vermilion">{formData.stylePreference}</span></p>
              <p>入席人数：<span className="text-ink">{formData.visitorCount} 位</span></p>
              <p className="text-[11px] text-ink-muted pt-1 border-t border-gold/20">
                工坊雅集掌事将在 2 小时内与您电话致意并核准具体席位时间，奉上清茗相待。
              </p>
            </div>

            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full py-2.5 rounded bg-vermilion text-white font-serif text-sm hover:bg-vermilion-light transition-colors"
            >
              确认并关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
