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

      <div className="space-y-4">
        {orders.sort((a, b) => b.id - a.id).map(o => {
          const recipe = recipes.find(r => r.id === o.recipeId);
          return (
            <div key={o.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                    {recipe ? recipe.name : 'ڕەچەتەی نەناسراو'}
                  </h3>
                  <p className="text-sm text-slate-500">بڕ: {o.quantityProduced} • {o.date}</p>
                </div>
                <span className={cn("text-xs px-3 py-1 rounded-full font-bold", 
                  o.status === 'completed' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                )}>
                  {o.status === 'completed' ? 'تەواوبووە' : 'چاوەڕێکراو'}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-black text-slate-600 dark:text-slate-400">تێچوو: {o.cost.toLocaleString()} {currency}</span>
                {o.status === 'pending' && (
                  <button onClick={() => handleComplete(o)} className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-xl font-bold text-sm transition-colors">
                    تەواوکردن
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
