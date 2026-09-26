
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut, Store } from 'lucide-react';
import { Garment } from '../types';

export const MerchantDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Garment[]>([]);
  const merchantStr = localStorage.getItem('yeyou_mancao_current_merchant');
  let merchant = null; try { merchant = (merchantStr && merchantStr !== 'undefined') ? JSON.parse(merchantStr) : null; } catch(e) {}

  useEffect(() => {
    if (!merchant) {
      navigate('/merchant/login');
      return;
    }
    fetchProducts();
  }, [merchant]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/products?merchantId=${merchant.id}`);
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除此商品吗？')) return;
    try {
      const res = await fetch(`/api/merchant/products/${id}`, { method: 'DELETE' });
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
              <Link to={`/merchant/products/edit/${p.id}`} className="flex-1 py-3 flex items-center justify-center gap-2 text-xs font-bold text-ink hover:text-vermilion hover:bg-rice-light">
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
