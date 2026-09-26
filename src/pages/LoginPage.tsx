/**
 * 野有蔓草 · 用户登录页面
 * 从 localStorage 读取并比对用户名（转小写）与密码
 * 登录成功后将用户存入 yeyou_mancao_current_user 并恢复购物车与订单数据
 */

import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, ShieldAlert, CheckCircle2, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password) {
      setErrorMessage('请输入用户名和密码');
      return;
    }

    const result = login(username, password);
    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setSuccessMessage('登录成功，正在跳转...');
    setTimeout(() => {
      navigate(redirectUrl);
    }, 800);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-rice-light border border-gold rounded-lg shadow-xl p-8 relative">
        <div className="text-center mb-6">
          <Link to="/" className="inline-block mb-2">
            <img src="/logo.svg" alt="野有蔓草" className="w-12 h-12 mx-auto" />
          </Link>
          <h2 className="font-serif text-2xl font-bold text-ink">
            会员登录
          </h2>
          <p className="text-xs text-ink-muted mt-1 font-serif">
            登录后即可同步您的 AR 试穿方案与定制订单
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-xs text-green-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-serif text-ink mb-1">
              用户名
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="请输入您的注册用户名"
                className="w-full text-xs p-2.5 pl-8 rounded bg-white border border-gold/40 text-ink focus:outline-none focus:border-vermilion"
              />
              <User className="w-4 h-4 text-ink-muted absolute left-2.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-serif text-ink mb-1">
              登录密码
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="请输入您的密码"
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
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded bg-vermilion hover:bg-vermilion-light text-white font-serif tracking-wider shadow-md text-sm transition-colors mt-2"
          >
            登 录
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-ink-muted border-t border-gold/20 pt-4">
          尚未注册账号？{' '}
          <Link
            to={`/register?redirect=${encodeURIComponent(redirectUrl)}`}
            className="text-vermilion font-serif font-bold hover:underline"
          >
            立即注册新账号
          </Link>
        </div>
      </div>
    </div>
  );
};
