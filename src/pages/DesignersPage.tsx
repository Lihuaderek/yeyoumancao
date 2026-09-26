/**
 * 野有蔓草 · 匠人手艺页面
 * 卡片展示非遗传承人与高级立裁大师，点击打开模拟联系预约表单
 */

import React, { useState } from 'react';
import { Award, Scissors, Calendar, CheckCircle2, X, MessageSquareQuote } from 'lucide-react';
import { DESIGNERS } from '../data/mockData';
import { Designer } from '../types';

export const DesignersPage: React.FC = () => {
  const [selectedDesigner, setSelectedDesigner] = useState<Designer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOpenContact = (designer: Designer) => {
    setSelectedDesigner(designer);
    setIsModalOpen(true);
    setIsSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('请填写您的姓名与联系方式');
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 顶部标题区 */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-serif tracking-widest text-vermilion uppercase font-semibold">
          MASTER CRAFTSMEN
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-2 mb-3 tracking-wider">
          非遗传承人与手艺大师
        </h1>
        <div className="w-16 h-0.5 bg-vermilion mx-auto mb-3" />
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
          野有蔓草由国家级非物质文化遗产（苏绣、潮绣）传承人与数十年宫廷版型名宿掌针，以代代相传之指尖绝技，为大婚吉服赋魂。
        </p>
      </div>

      {/* 匠人卡片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {DESIGNERS.map(designer => (
          <div
            key={designer.id}
            className="bg-rice rounded-lg border border-gold/40 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* 大师相片 */}
              <div className="relative aspect-[4/3] bg-ink overflow-hidden">
                <img
                  src={designer.avatar}
                  alt={designer.name}
                  className="w-full h-full object-cover filter grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-xs text-gold text-xs font-serif border border-gold/40">
                  从业 {designer.yearsOfExperience} 载
                </div>
              </div>

              {/* 简介与技艺 */}
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-ink mb-1">
                  {designer.name}
                </h3>
                <p className="text-xs text-vermilion font-serif font-medium mb-3">
                  {designer.title}
                </p>
                <p className="text-xs text-ink/80 leading-relaxed mb-4">
                  {designer.description}
                </p>

                <div className="pt-3 border-t border-gold/20 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-ink-muted">
                    <Scissors className="w-3.5 h-3.5 text-gold" />
                    <span>擅长领域：<strong className="text-ink">{designer.specialty}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-ink-muted">
                    <Award className="w-3.5 h-3.5 text-gold" />
                    <span>传世嫁衣成作：<strong className="text-ink">{designer.worksCount} 余套</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* 预约咨询按钮 */}
            <div className="p-6 pt-0">
              <button
                onClick={() => handleOpenContact(designer)}
                className="w-full py-2.5 px-4 rounded border border-vermilion text-vermilion hover:bg-vermilion hover:text-white font-serif text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5" />
                预约大师一对一指导
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 模拟联系表单模态框 */}
      {isModalOpen && selectedDesigner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-rice-light border border-gold rounded-lg shadow-2xl p-6 sm:p-8 max-w-md w-full">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-ink-muted hover:text-ink"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <>
                <div className="text-center mb-6">
                  <span className="text-xs font-serif text-vermilion">大师私享预约</span>
                  <h3 className="font-serif text-xl font-bold text-ink mt-1">
                    预约咨询 · {selectedDesigner.name} 老师
                  </h3>
                  <p className="text-xs text-ink-muted mt-1">
                    {selectedDesigner.title}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-serif text-ink-muted mb-1">
                      您的姓名 *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="例：林清玄 / 夫人"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs p-2.5 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-serif text-ink-muted mb-1">
                      联系电话 *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="用于大师助理回访确认"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs p-2.5 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-serif text-ink-muted mb-1">
                      咨询意向 / 婚期计划
                    </label>
                    <textarea
                      rows={3}
                      placeholder="希望咨询的礼服形制、大婚吉期或特殊花样立意..."
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full text-xs p-2.5 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded bg-vermilion text-white font-serif text-xs hover:bg-vermilion-light transition-colors shadow-md"
                  >
                    确认提交预约申请
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-vermilion/10 text-vermilion flex items-center justify-center border border-vermilion/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-ink mb-2">预约意向已转交</h4>
                <p className="text-xs text-ink/80 leading-relaxed mb-6">
                  已将您的联系信息与意向成功转交至 <strong>{selectedDesigner.name}</strong> 老师助理团队，将在 1 个工作日内电话与您确认工坊面谈吉时。
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded bg-vermilion text-white font-serif text-xs"
                >
                  好的，返回
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
