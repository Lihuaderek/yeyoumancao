/**
 * 野有蔓草 · 纯前端 Canvas 验证码组件
 * 随机生成4位字符（数字+大写字母），带随机倾斜、干扰线和噪点，点击可刷新
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCw } from 'lucide-react';

interface CaptchaCanvasProps {
  onCodeChange: (code: string) => void;
  width?: number;
  height?: number;
}

export const CaptchaCanvas: React.FC<CaptchaCanvasProps> = ({
  onCodeChange,
  width = 130,
  height = 42
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentCode, setCurrentCode] = useState('');

  // 生成4位随机字符 (数字与大写字母，排除易混淆的 0, O, I, 1)
  const generateRandomCode = useCallback((): string => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      code += chars[randomIndex];
    }
    return code;
  }, []);

  // 绘制验证码
  const drawCaptcha = useCallback((code: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空背景
    ctx.fillStyle = '#FAF7F0';
    ctx.fillRect(0, 0, width, height);

    // 绘制干扰线
    const lineColors = ['#C9A96E', '#B22222', '#D97A8F', '#8E6A28', '#A0A0A0'];
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = lineColors[Math.floor(Math.random() * lineColors.length)];
      ctx.lineWidth = 1 + Math.random() * 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height
      );
      ctx.stroke();
    }

    // 绘制干扰噪点
    for (let i = 0; i < 35; i++) {
      ctx.fillStyle = lineColors[Math.floor(Math.random() * lineColors.length)];
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, 1 + Math.random() * 1.5, 0, 2 * Math.PI);
      ctx.fill();
    }

    // 绘制4个字符
    const fontFamilies = ['serif', 'sans-serif'];
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const fontSize = Math.floor(22 + Math.random() * 6);
      const font = fontFamilies[Math.floor(Math.random() * fontFamilies.length)];
      ctx.font = `bold ${fontSize}px ${font}`;
      ctx.fillStyle = ['#8B1818', '#1A1A1A', '#A88647', '#5E1919'][i % 4];

      const x = 16 + i * 26;
      const y = height / 2 + 8;
      const angle = (Math.random() - 0.5) * 0.45; // 随机轻度倾斜

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(char, -8, 4);
      ctx.restore();
    }
  }, [width, height]);

  // 刷新验证码
  const refresh = useCallback(() => {
    const newCode = generateRandomCode();
    setCurrentCode(newCode);
    onCodeChange(newCode);
    drawCaptcha(newCode);
  }, [generateRandomCode, onCodeChange, drawCaptcha]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="flex items-center gap-2">
      <div
        onClick={refresh}
        className="cursor-pointer border border-gold/40 rounded overflow-hidden shadow-sm hover:border-vermilion transition-colors title='点击刷新验证码'"
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="block"
        />
      </div>
      <button
        type="button"
        onClick={refresh}
        className="text-ink-muted hover:text-vermilion transition-colors p-1"
        title="刷新验证码"
      >
        <RotateCw className="w-4 h-4" />
      </button>
    </div>
  );
};
