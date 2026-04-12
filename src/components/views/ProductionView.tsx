import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Plus 
} from 'lucide-react';
import { toast } from 'sonner';
import { Product, Recipe, ProductionOrder } from '../../types';
import { cn } from '../../lib/utils';
import { customConfirm } from '../../lib/utils';

interface ProductionViewProps {
  orders: ProductionOrder[];
  recipes: Recipe[];
  products: Product[];
  currency: string;
  onSave: (o: ProductionOrder) => void;
  onUpdate: (o: ProductionOrder, updatedProducts?: Product[]) => void;
  onBack: () => void;
}

export function ProductionView({ orders, recipes, products, currency, onSave, onUpdate, onBack }: ProductionViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [recipeId, setRecipeId] = useState('');
  const [qty, setQty] = useState('');

  const handleAdd = () => {
    if (!recipeId || !qty) return toast.error("تکایە ڕەچەتە و بڕ دیاری بکە");
    
    const recipe = recipes.find(r => r.id === parseInt(recipeId));
    if (!recipe) return;

    let totalCost = 0;
    recipe.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        totalCost += (prod.cost * item.quantity) * parseInt(qty);
      }
    });

    onSave({
      id: Date.now(),
      recipeId: parseInt(recipeId),
      quantityProduced: parseInt(qty),
      date: new Date().toLocaleDateString('ku-IQ'),
      status: 'pending',
      cost: totalCost
    });
    setShowAdd(false);
    setRecipeId('');
    setQty('');
  };

  const handleComplete = async (order: ProductionOrder) => {
    if (await customConfirm("دڵنیایت لە تەواوبوونی ئەم بەرهەمهێنانە؟ کۆگای کەرەستەکان کەمدەکرێتەوە و کاڵای کۆتایی زیاد دەکرێت.")) {
      const recipe = recipes.find(r => r.id === order.recipeId);
      if (!recipe) return;

      let updatedProducts = [...products];
      
      recipe.items.forEach(item => {
        updatedProducts = updatedProducts.map(p => 
          p.id === item.productId ? { ...p, stock: p.stock - (item.quantity * order.quantityProduced) } : p
        );
      });

      updatedProducts = updatedProducts.map(p => 
        p.id === recipe.finishedProductId ? { ...p, stock: p.stock + order.quantityProduced } : p
      );

      onUpdate({ ...order, status: 'completed' }, updatedProducts);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-blue-600 dark:text-blue-400">بەرهەمهێنان</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Plus size={18} /> داواکاری نوێ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">دروستکردنی داواکاری بەرهەمهێنان</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select value={recipeId} onChange={e => setRecipeId(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
              <option value="">هەڵبژاردنی ڕەچەتە...</option>
              {recipes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="بڕی بەرهەمهێنان" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          </div>
          <button onClick={handleAdd} className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold">پاشەکەوتکردن</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.sort((a, b) => b.id - a.id).map(o => {
          const recipe = recipes.find(r => r.id === o.recipeId);
          return (
            <div key={o.id} className="item-card group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-blue-500 group-hover:text-white transition-all">
                    <Plus size={28} className="rotate-45" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-white">
                      {recipe ? recipe.name : 'ڕەچەتەی نەناسراو'}
                    </h3>
                    <p className="text-[10px] font-bold theme-muted mt-1">{o.date}</p>
                  </div>
                </div>
                <span className={cn("text-[8px] px-2 py-1 rounded-full font-black uppercase border", 
                  o.status === 'completed' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                )}>
                  {o.status === 'completed' ? 'تەواوبووە' : 'چاوەڕێکراو'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="space-y-1">
                  <p className="text-[10px] font-black theme-muted uppercase tracking-widest">بڕی بەرهەم</p>
                  <p className="text-sm font-black text-white">{o.quantityProduced}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black theme-muted uppercase tracking-widest">تێچووی گشتی</p>
                  <p className="text-sm font-black text-white">{o.cost.toLocaleString()} {currency}</p>
                </div>
              </div>

              {o.status === 'pending' && (
                <button 
                  onClick={() => handleComplete(o)} 
                  className="w-full mt-4 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 py-4 rounded-2xl font-black text-sm transition-all active:scale-95"
                >
                  تەواوکردن
                </button>
              )}
            </div>
          );
        })}
        {orders.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
            <Plus size={48} className="mx-auto text-slate-700 mb-4 opacity-20" />
            <p className="text-slate-500 font-bold">هیچ داواکارییەک نییە</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
