/**
 * 野有蔓草 · 用户注册页面
 * 包含用户名规则校验、密码规则校验、确认密码比对与纯前端 Canvas 干扰线验证码
 * 校验通过后写入 localStorage (yeyou_mancao_users)，自动登录并跳转
 */

import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlus, ShieldAlert, CheckCircle2, Lock, User, Eye, EyeOff } from 'lucide-react';
import { CaptchaCanvas } from '../components/CaptchaCanvas';
import { useAuth } from '../context/AuthContext';
import { BRAND_CONFIG } from '../config';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const { register } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaGenerated, setCaptchaGenerated] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // 1. 验证码校验 (纯前端内存比对，大小写不敏感或完全一致，通常为大写)
    if (!captchaInput || captchaInput.trim().toUpperCase() !== captchaGenerated.toUpperCase()) {
      setErrorMessage('验证码错误');
      return;
    }

    // 2. 确认密码比对
    if (password !== confirmPassword) {
      setErrorMessage('两次输入的密码不一致');
      return;
    }

    // 3. 执行注册 (AuthContext 内部会严格校验用户名与密码规则，并转换为小写)
    const result = register(username, password);
    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setSuccessMessage('注册成功，正在为您自动登录并跳转...');
    setTimeout(() => {
      navigate(redirectUrl);
    }, 1200);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-rice-light border border-gold rounded-lg shadow-xl p-8 relative">
        {/* 顶部标识 */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block mb-2">
            <img src="/logo.svg" alt="野有蔓草" className="w-12 h-12 mx-auto" />
          </Link>
          <h2 className="font-serif text-2xl font-bold text-ink">
            注册定制会员
          </h2>
          <p className="text-xs text-ink-muted mt-1 font-serif">
            加入野有蔓草，定制属于您的传世婚嫁吉服
          </p>
        </div>

        {/* 错误提示 */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 成功提示 */}
        {successMessage && (
          <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-xs text-green-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 用户名 */}
          <div>
            <label className="block text-xs font-serif text-ink mb-1">
              用户名 *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="3~20位，字母数字开头，可含 _ -"
                className="w-full text-xs p-2.5 pl-8 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
              />
              <User className="w-4 h-4 text-ink-muted absolute left-2.5 top-3" />
            </div>
            <p className="text-[10px] text-ink-muted mt-1">
              只能包含字母、数字、下划线或连字符，且以字母或数字开头（不区分大小写）
            </p>
          </div>

          {/* 密码 */}
          <div>
            <label className="block text-xs font-serif text-ink mb-1">
              设置密码 *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="6~20位，不能包含中文或空格"
                className="w-full text-xs p-2.5 pl-8 pr-8 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
              />
              <Lock className="w-4 h-4 text-ink-muted absolute left-2.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-3 text-ink-muted hover:text-ink"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-ink-muted mt-1">
              需为6-20位，不能包含中文或空格
            </p>
          </div>

          {/* 确认密码 */}
          <div>
            <label className="block text-xs font-serif text-ink mb-1">
              确认密码 *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="再次输入上述密码"
                className="w-full text-xs p-2.5 pl-8 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
              />
              <Lock className="w-4 h-4 text-ink-muted absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Canvas 干扰线噪点验证码 */}
          <div>
            <label className="block text-xs font-serif text-ink mb-1">
              安全验证码 *
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                required
                maxLength={4}
                value={captchaInput}
                onChange={e => setCaptchaInput(e.target.value)}
                placeholder="输入4位验证码"
                className="w-full text-xs p-2.5 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion uppercase tracking-widest font-mono text-center"
              />
              <CaptchaCanvas onCodeChange={setCaptchaGenerated} />
            </div>
            <p className="text-[10px] text-ink-muted mt-1">
              点击验证码图形可刷新
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded bg-vermilion hover:bg-vermilion-light text-white font-serif tracking-wider shadow-md text-sm transition-colors mt-2"
          >
            同意礼序并注册
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-ink-muted border-t border-gold/20 pt-4">
          已有野有蔓草账号？{' '}
          <Link
            to={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
            className="text-vermilion font-serif font-bold hover:underline"
          >
            直接登录
          </Link>
        </div>
      </div>
    </div>
  );
};
