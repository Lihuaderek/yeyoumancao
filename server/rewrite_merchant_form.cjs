const fs = require('fs');

const code = `import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Store, Upload, Plus, Trash2 } from 'lucide-react';

export const MerchantProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const merchantStr = localStorage.getItem('yeyou_mancao_current_merchant');
  let merchant = null; try { merchant = (merchantStr && merchantStr !== 'undefined') ? JSON.parse(merchantStr) : null; } catch(e) {}

  const [formData, setFormData] = useState({ name: '', category: '明制婚服', price: '', description: '', imageUrl: '' });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  
  const [colors, setColors] = useState<any[]>([]);
  const [fabrics, setFabrics] = useState<any[]>([]);
  const [patterns, setPatterns] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  
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
            setColors(p.merchantColors || []);
            setFabrics(p.merchantFabrics || []);
            setPatterns(p.merchantPatterns || []);
            if (p.merchantVariants) setVariants(p.merchantVariants);
          }
        });
    }
  }, [id]);

  useEffect(() => {
    setVariants(prev => {
        const newVariants: any[] = [];
        const colorIds = colors.length > 0 ? colors.map(c => c.id) : [undefined];
        const fabricIds = fabrics.length > 0 ? fabrics.map(f => f.id) : [undefined];
        
        colorIds.forEach(cid => {
          fabricIds.forEach(fid => {
            if (cid === undefined && fid === undefined) return;
            const existing = prev.find(v => v.colorId === cid && v.fabricId === fid);
            newVariants.push({ colorId: cid, fabricId: fid, image: existing?.image || '' });
          });
        });
        return newVariants;
    });
  }, [colors, fabrics]);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || '上传失败');
    return data.url;
  };

  const handleOptionImageChange = async (e: React.ChangeEvent<HTMLInputElement>, list: any[], setList: Function, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      const url = await handleImageUpload(file);
      const newList = [...list];
      newList[index].image = url;
      setList(newList);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateMainImage = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (file.type !== 'image/png') return reject(new Error('主图仅接受 .png 格式'));
      if (file.size > 2 * 1024 * 1024) return reject(new Error('图片大小不能超过 2MB'));
      const img = new Image();
      img.onload = () => {
        if (img.width < 800 || img.height < 800) return reject(new Error('图片尺寸过小，请上传至少 800x800 的图片'));
        resolve();
      };
      img.onerror = () => reject(new Error('无效的图片文件'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError('');
      try {
        await validateMainImage(file);
        setFile(file);
        setPreview(URL.createObjectURL(file));
      } catch (err: any) {
        setError(err.message);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const renderOptionList = (title: string, list: any[], setList: Function) => (
    <div className="border border-gold/30 p-4 rounded bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-serif font-bold text-sm">{title}</h3>
        <button type="button" onClick={() => setList([...list, { id: Date.now().toString() + Math.random().toString().slice(2,6), name: '', priceOffset: 0, image: '' }])} className="text-vermilion text-xs flex items-center gap-1 hover:underline"><Plus className="w-3 h-3" /> 添加</button>
      </div>
      {list.map((item, index) => (
        <div key={item.id} className="flex gap-3 mb-3 items-start border-b border-gold/10 pb-3">
          <div className="flex-1 space-y-2">
            <input placeholder="名称" value={item.name} onChange={e => { const n = [...list]; n[index].name = e.target.value; setList(n); }} className="w-full p-2 border rounded text-xs" required />
            <input type="number" placeholder="加价" value={item.priceOffset} onChange={e => { const n = [...list]; n[index].priceOffset = Number(e.target.value); setList(n); }} className="w-full p-2 border rounded text-xs" required />
          </div>
          <div className="w-24 text-center">
            {item.image ? (
               <img src={item.image} className="w-full h-16 object-cover border rounded mb-1" />
            ) : (
               <div className="w-full h-16 bg-rice border rounded mb-1 flex items-center justify-center text-xs text-ink-muted">无图</div>
            )}
            <label className="text-[10px] cursor-pointer text-vermilion hover:underline">
              上传图片
              <input type="file" accept="image/*" className="hidden" onChange={e => handleOptionImageChange(e, list, setList, index)} />
            </label>
          </div>
          <button type="button" onClick={() => { const n = [...list]; n.splice(index, 1); setList(n); }} className="text-red-500 mt-2"><Trash2 className="w-4 h-4" /></button>
        </div>
      ))}
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl && !file) {
      setError('请上传商品主图片');
      return;
    }
    setLoading(true);
    setError('');

    try {
      let finalImageUrl = formData.imageUrl;
      if (file) {
        finalImageUrl = await handleImageUpload(file);
      }

      const payload = {
        ...formData,
        merchantId: merchant.id,
        imageUrl: finalImageUrl,
        merchantColors: colors,
        merchantFabrics: fabrics,
        merchantPatterns: patterns,
        merchantVariants: variants
      };

      const url = id ? \`/api/merchant/products/\${id}\` : '/api/merchant/products';
      const response = await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      
      navigate('/merchant/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-rice-light border border-gold rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-serif font-bold mb-6">{id ? '编辑商品' : '上架新商品'}</h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs mb-1 font-bold">商品名称</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1 font-bold">分类</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 border rounded text-sm bg-white">
                    <option>全部礼服</option><option>明制婚服</option><option>唐宋制婚服</option>
                    <option>秀禾服</option><option>龙凤褂</option><option>旗袍</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-1 font-bold">基础价格 (¥)</label>
                  <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-2 border rounded text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1 font-bold">主图 (仅限.png, ≥800x800, 透明平铺)</label>
                <input type="file" accept=".png" ref={fileInputRef} onChange={handleFileChange} className="w-full text-sm mb-2" />
                {preview && <img src={preview} className="w-32 h-32 object-contain border border-gold/30 bg-rice rounded" />}
              </div>
              <div>
                <label className="block text-xs mb-1 font-bold">商品描述</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded text-sm h-24" />
              </div>
            </div>
            
            <div className="space-y-4">
               {renderOptionList('自定义颜色选项', colors, setColors)}
               {renderOptionList('自定义面料选项', fabrics, setFabrics)}
               {renderOptionList('自定义纹样选项', patterns, setPatterns)}
            </div>
          </div>
          
          <div className="border border-gold/30 p-4 rounded bg-white mt-6">
            <h3 className="font-serif font-bold text-sm mb-4 text-vermilion">高级配置：多规格图片矩阵 (颜色 x 面料)</h3>
            <p className="text-xs text-ink-muted mb-4">若您同时设置了颜色和面料，可为每一种特定的组合（例如"红色-真丝"）单独上传实物图片。在虚拟试穿时，系统将精确匹配此处上传的图片。</p>
            {variants.length === 0 ? <div className="text-xs text-ink-muted">请先添加颜色或面料选项。</div> : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {variants.map((v, i) => {
                  const colorName = colors.find(c => c.id === v.colorId)?.name || '';
                  const fabricName = fabrics.find(f => f.id === v.fabricId)?.name || '';
                  const label = [colorName, fabricName].filter(Boolean).join(' + ');
                  return (
                    <div key={i} className="border border-gold/10 p-3 rounded flex flex-col items-center gap-2 bg-rice-light">
                      <div className="text-xs font-bold text-center h-8 flex items-center">{label}</div>
                      {v.image ? <img src={v.image} className="w-20 h-20 object-cover border border-gold/30 rounded" /> : <div className="w-20 h-20 bg-white border border-gold/30 border-dashed rounded flex items-center justify-center text-[10px] text-ink-muted">暂无对应图</div>}
                      <label className="text-[10px] text-vermilion cursor-pointer hover:underline bg-vermilion/5 px-2 py-1 rounded">
                        上传专用图
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                          const file = e.target.files?.[0]; if (!file) return;
                          setLoading(true);
                          try {
                            const url = await handleImageUpload(file);
                            setVariants(prev => { const n = [...prev]; n[i].image = url; return n; });
                          } catch(err:any){ setError(err.message); } finally { setLoading(false); }
                        }} />
                      </label>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          
          <button type="submit" disabled={loading} className="w-full py-4 mt-6 bg-vermilion text-white font-bold rounded disabled:opacity-50 text-lg shadow-md hover:bg-red-800 transition-colors">
            {loading ? '保存中...' : '确认发布 / 保存'}
          </button>
        </form>
      </div>
    </div>
  );
};
`;
fs.writeFileSync('src/pages/MerchantProductForm.tsx', code, 'utf8');
