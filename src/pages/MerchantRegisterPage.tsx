
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const MerchantRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', password: '', confirmPassword: '', contact: '', phone: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('两次密码输入不一致');
    }
    if (!/^[a-zA-Z0-9一-龥]{3,20}$/.test(formData.name)) {
      return setError('商家名称需3-20位，仅限中英文和数字');
    }
    if (formData.password.length < 6 || formData.password.length > 20 || /\s|[一-龥]/.test(formData.password)) {
      return setError('密码需6-20位，不能包含中文或空格');
    }

    try {
      const res = await fetch('/api/merchant/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      
      setSuccess('注册成功，正在跳转登录...');
      setTimeout(() => navigate('/merchant/login'), 1500);
    } catch (err: any) {
      setError(err.message || '注册失败');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-rice-light border border-gold rounded-lg shadow-xl p-8">
        <div className="text-center mb-6">
          <Store className="w-12 h-12 mx-auto text-vermilion mb-2" />
          <h2 className="font-serif text-2xl font-bold text-ink">商家入驻</h2>
        </div>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="text" placeholder="商家/店铺名称 (3-20位中英文数字)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 rounded border text-sm" />
          <input required type="password" placeholder="密码 (6-20位非中文无空格)" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2.5 rounded border text-sm" />
          <input required type="password" placeholder="确认密码" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full p-2.5 rounded border text-sm" />
          <input required type="text" placeholder="联系人姓名" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full p-2.5 rounded border text-sm" />
          <input required type="tel" placeholder="联系手机号" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2.5 rounded border text-sm" />
          <textarea placeholder="店铺简介 (可选)" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2.5 rounded border text-sm h-24" />
          <button type="submit" className="w-full py-3 bg-vermilion text-white font-bold rounded">立即注册</button>
        </form>
        <div className="mt-4 text-center text-xs">已有商家账号？ <Link to="/merchant/login" className="text-vermilion font-bold">去登录</Link></div>
      </div>
    </div>
  );
};
