import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Plus, Save, ShoppingCart, Trash2, Package } from 'lucide-react';
import { Product, ShopRequest, ShopRequestItem, User } from '../../types';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

interface ShopRequestViewProps {
  products: Product[];
  currentUser: User;
  onRequest: (req: ShopRequest) => void;
  onBack: () => void;
  darkMode: boolean;
}

export function ShopRequestView({ products, currentUser, onRequest, onBack, darkMode }: ShopRequestViewProps) {
  const [items, setItems] = useState<ShopRequestItem[]>([]);
  const [search, setSearch] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode.includes(search)
  );

  const addItem = (product: Product) => {
    const existing = items.find(item => item.productId === product.id);
    if (existing) {
      setItems(items.map(item => 
        item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setItems([...items, { productId: product.id, itemName: product.name, quantity: 1 }]);
    }
    toast.success(`${product.name} زیادکرا`);
  };

  const updateQuantity = (productId: number, delta: number) => {
    setItems(items.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(0.1, item.quantity + delta);
        return { ...item, quantity: parseFloat(newQty.toFixed(2)) };
      }
      return item;
    }));
  };

  const removeItem = (productId: number) => {
    setItems(items.filter(item => item.productId !== productId));
  };

  const handleSendRequest = () => {
    if (items.length === 0) {
      toast.error('تکایە کاڵا زیاد بکە بۆ داواکارییەکە');
      return;
    }

    const request: ShopRequest = {
      id: Date.now(),
      shopName: currentUser.name,
      items: items,
      date: new Date().toLocaleDateString('ku-IQ'),
      status: 'pending'
    };

    onRequest(request);
    setItems([]);
    toast.success('داواکارییەکەت بەسەرکەوتوویی نێردرا بۆ محاسب');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto pb-20" dir="rtl">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-95">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="font-black text-3xl tracking-tight text-slate-800 dark:text-slate-100">داواکاری دوکان</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mt-1">داواکردنی کاڵا لە کۆگای سەرەکییەوە</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">دوکان: {currentUser.name}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 space-y-8">
        <button 
          onClick={() => setShowProductModal(true)} 
          className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-slate-200 dark:shadow-none active:scale-95 transition-all"
        >
          <Plus size={20} />
          زیادکردنی کاڵا بۆ داواکاری
        </button>

        {items.length > 0 ? (
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-black text-lg text-slate-800 dark:text-slate-100">لیستی داواکراوەکان</h3>
            {items.map(item => (
              <div key={item.productId} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                    <Package size={20} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-slate-800 dark:text-slate-100">{item.itemName}</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-1">بڕی داواکراو: {item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1">
                    <button onClick={() => updateQuantity(item.productId, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-all">
                      <Plus size={16} />
                    </button>
                    <span className="w-12 text-center font-black text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-all">
                      <span className="text-lg font-bold">-</span>
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={handleSendRequest}
                className="w-full bg-blue-500 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <ShoppingCart size={22} />
                ناردنی داواکاری بۆ محاسب
              </button>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem]">
            <ShoppingCart size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-bold">هیچ کاڵایەک زیاد نەکراوە بۆ داواکارییەکە</p>
          </div>
        )}
      </div>

      {/* Product Selection Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col max-h-[80vh]"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-xl text-slate-800 dark:text-slate-100">هەڵبژاردنی کاڵا</h3>
              <button onClick={() => setShowProductModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                <ChevronLeft size={20} />
              </button>
            </div>
            
            <input 
              type="text" 
              placeholder="گەڕان بۆ کاڵا..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 font-bold text-sm mb-4"
            />

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
              {filteredProducts.map(product => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-300 transition-all cursor-pointer" onClick={() => addItem(product)}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                      <Package size={16} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="font-black text-sm text-slate-800 dark:text-slate-100">{product.name}</p>
                      <p className="text-[10px] font-bold text-slate-500 mt-1">کۆگا: {product.stock} {product.unit}</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center shadow-md shadow-blue-500/30">
                    <Plus size={16} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
