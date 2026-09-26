
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';

export const MerchantLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/merchant/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      
      localStorage.setItem('yeyou_mancao_current_merchant', JSON.stringify(data.merchant));
      window.dispatchEvent(new Event('storage'));
      navigate('/merchant/dashboard');
    } catch (err: any) {
      setError(err.message || '登录失败');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-rice-light border border-gold rounded-lg shadow-xl p-8">
        <div className="text-center mb-6">
          <Store className="w-12 h-12 mx-auto text-vermilion mb-2" />
          <h2 className="font-serif text-2xl font-bold text-ink">商家登录</h2>
        </div>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="text" placeholder="商家名称" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 rounded border text-sm" />
          <input required type="password" placeholder="密码" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2.5 rounded border text-sm" />
          <button type="submit" className="w-full py-3 bg-vermilion text-white font-bold rounded">登录</button>
        </form>
        <div className="mt-4 text-center text-xs">还没有商家账号？ <Link to="/merchant/register" className="text-vermilion font-bold">去入驻</Link></div>
      </div>
    </div>
  );
};
