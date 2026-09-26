const fs = require('fs');

const registerCode = `
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
    if (!/^[a-zA-Z0-9\u4e00-\u9fa5]{3,20}$/.test(formData.name)) {
      return setError('商家名称需3-20位，仅限中英文和数字');
    }
    if (formData.password.length < 6 || formData.password.length > 20 || /\\s|[\u4e00-\u9fa5]/.test(formData.password)) {
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
`;

const loginCode = `
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
`;

const dashboardCode = `
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut, Store } from 'lucide-react';
import { Garment } from '../types';

export const MerchantDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Garment[]>([]);
  const merchantStr = localStorage.getItem('yeyou_mancao_current_merchant');
  const merchant = merchantStr ? JSON.parse(merchantStr) : null;

  useEffect(() => {
    if (!merchant) {
      navigate('/merchant/login');
      return;
    }
    fetchProducts();
  }, [merchant]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(\`/api/products?merchantId=\${merchant.id}\`);
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除此商品吗？')) return;
    try {
      const res = await fetch(\`/api/merchant/products/\${id}\`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchProducts();
      else alert(data.message);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('yeyou_mancao_current_merchant');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  if (!merchant) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b border-gold/30 pb-4">
        <div className="flex items-center gap-3">
          <Store className="w-8 h-8 text-vermilion" />
          <h1 className="text-2xl font-serif font-bold text-ink">{merchant.name} - 商家后台</h1>
        </div>
        <div className="flex gap-4">
          <Link to="/merchant/products/new" className="flex items-center gap-2 px-4 py-2 bg-vermilion text-white rounded text-sm font-bold shadow-sm">
            <Plus className="w-4 h-4" /> 上架新商品
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white border border-gold text-ink rounded text-sm hover:bg-rice">
            <LogOut className="w-4 h-4" /> 退出登录
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white border border-gold/30 rounded shadow-sm overflow-hidden flex flex-col">
            <img src={p.image} className="w-full h-48 object-cover" />
            <div className="p-4 flex-1">
              <h3 className="font-serif font-bold text-ink mb-1 truncate">{p.name}</h3>
              <p className="text-xs text-ink-muted mb-2">{p.category}</p>
              <p className="text-vermilion font-serif font-bold">¥{p.price}</p>
            </div>
            <div className="border-t border-gold/20 flex divide-x divide-gold/20">
              <Link to={\`/merchant/products/edit/\${p.id}\`} className="flex-1 py-3 flex items-center justify-center gap-2 text-xs font-bold text-ink hover:text-vermilion hover:bg-rice-light">
                <Edit2 className="w-3.5 h-3.5" /> 编辑
              </Link>
              <button onClick={() => handleDelete(p.id)} className="flex-1 py-3 flex items-center justify-center gap-2 text-xs font-bold text-red-600 hover:bg-red-50">
                <Trash2 className="w-3.5 h-3.5" /> 删除
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-3 text-center py-12 text-ink-muted font-serif">暂无商品，快去上架吧</div>
        )}
      </div>
    </div>
  );
};
`;

const formCode = `
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Store, Upload } from 'lucide-react';

export const MerchantProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const merchantStr = localStorage.getItem('yeyou_mancao_current_merchant');
  const merchant = merchantStr ? JSON.parse(merchantStr) : null;

  const [formData, setFormData] = useState({ name: '', category: '全部礼服', price: '', description: '', imageUrl: '' });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!merchant) navigate('/merchant/login');
    if (id) {
      fetch(\`/api/products\`)
        .then(res => res.json())
        .then(data => {
          const p = data.products?.find((x: any) => x.id === id);
          if (p && p.merchantId === merchant.id) {
            setFormData({ name: p.name, category: p.category, price: p.price.toString(), description: p.description, imageUrl: p.image });
            setPreview(p.image);
          }
        });
    }
  }, [id]);

  const checkImage = (f: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (f.type !== 'image/png') return reject(new Error('只接受 .png 格式的透明背景或纯色平铺图'));
      if (f.size > 2 * 1024 * 1024) return reject(new Error('图片大小不能超过 2MB'));

      const img = new Image();
      img.onload = () => {
        if (img.width < 800 || img.height < 800) {
          return reject(new Error('图片尺寸过小，请上传至少 800x800 的图片'));
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve();
        ctx.drawImage(img, 0, 0);
        
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let transparentPixels = 0;
        const totalPixels = canvas.width * canvas.height;
        
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 128) transparentPixels++;
        }
        
        if (transparentPixels / totalPixels < 0.1) {
          // If less than 10% transparent, it might be a photo with background
          // In a real strict environment we would reject, but we'll just log warning
          console.warn('Transparency check: < 10% transparent pixels. Please ensure it is a flat lay image.');
        }
        resolve();
      };
      img.onerror = () => reject(new Error('无效的图片文件'));
      img.src = URL.createObjectURL(f);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setError('');
    try {
      await checkImage(f);
      setFile(f);
      setPreview(URL.createObjectURL(f));
    } catch (err: any) {
      setError(err.message);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl && !file) return setError('请上传商品图片');
    setLoading(true);
    setError('');

    try {
      let finalUrl = formData.imageUrl;
      if (file) {
        const d = new FormData();
        d.append('image', file);
        const upRes = await fetch('/api/upload', { method: 'POST', body: d });
        const upData = await upRes.json();
        if (!upData.success) throw new Error(upData.message || '上传失败');
        finalUrl = upData.url;
      }

      const payload = { ...formData, merchantId: merchant.id, imageUrl: finalUrl };
      const url = id ? \`/api/merchant/products/\${id}\` : '/api/merchant/products';
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      
      navigate('/merchant/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-rice-light border border-gold rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-serif font-bold mb-6">{id ? '编辑商品' : '上架新商品'}</h2>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs mb-1">商品名称</label>
            <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1">分类</label>
              <select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full p-2 border rounded text-sm bg-white">
                <option>全部礼服</option>
                <option>明制婚服</option>
                <option>唐宋制婚服</option>
                <option>秀禾服</option>
                <option>龙凤褂</option>
                <option>旗袍</option>
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1">价格 (¥)</label>
              <input required type="number" min="0" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} className="w-full p-2 border rounded text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1">商品图片 (仅限.png, ≥800x800, 透明平铺图)</label>
            <input type="file" accept=".png" ref={fileInputRef} onChange={handleFileChange} className="w-full text-sm mb-2" />
            {preview && <img src={preview} className="w-32 h-32 object-contain border border-gold/30 bg-rice rounded" />}
          </div>
          <div>
            <label className="block text-xs mb-1">商品描述</label>
            <textarea required value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded text-sm h-24" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-vermilion text-white font-bold rounded disabled:opacity-50">
            {loading ? '保存中...' : '保存商品'}
          </button>
        </form>
      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/pages/MerchantRegisterPage.tsx', registerCode, 'utf8');
fs.writeFileSync('src/pages/MerchantLoginPage.tsx', loginCode, 'utf8');
fs.writeFileSync('src/pages/MerchantDashboard.tsx', dashboardCode, 'utf8');
fs.writeFileSync('src/pages/MerchantProductForm.tsx', formCode, 'utf8');
