import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Plus, 
  Trash2, 
  ChefHat 
} from 'lucide-react';
import { toast } from 'sonner';
import { Product, Recipe, RecipeItem } from '../../types';

interface RecipesViewProps {
  recipes: Recipe[];
  products: Product[];
  onSave: (r: Recipe) => void;
  onBack: () => void;
}

export function RecipesView({ recipes, products, onSave, onBack }: RecipesViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [finishedProductId, setFinishedProductId] = useState('');
  const [items, setItems] = useState<RecipeItem[]>([]);
  
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [ingredientQty, setIngredientQty] = useState('');

  const handleFinishedProductChange = (val: string) => {
    setFinishedProductId(val);
    if (!val) return;

    // Check if a recipe already exists for this product
    const existingRecipe = recipes.find(r => r.finishedProductId === parseInt(val));
    if (existingRecipe) {
      toast.info("ڕەچەتەی پێشوو بۆ ئەم بەرهەمە دۆزرایەوە و بارکرا");
      setItems([...existingRecipe.items]);
      if (!name) setName(existingRecipe.name);
    }
  };

  const addIngredient = () => {
    if (!selectedIngredient || !ingredientQty) return;
    const product = products.find(p => p.id === parseInt(selectedIngredient));
    if (!product) return;

    setItems([...items, {
      productId: product.id,
      itemName: product.name,
      quantity: parseFloat(ingredientQty)
    }]);
    setSelectedIngredient('');
    setIngredientQty('');
  };

  const handleSave = () => {
    if (!name || !finishedProductId || items.length === 0) return toast.error("تکایە هەموو زانیارییەکان پڕبکەرەوە");
    onSave({
      id: Date.now(),
      name,
      finishedProductId: parseInt(finishedProductId),
      items
    });
    setShowAdd(false);
    setName('');
    setFinishedProductId('');
    setItems([]);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-orange-600 dark:text-orange-400">ڕەچەتەی بەرهەمهێنان (Recipes)</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-orange-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Plus size={18} /> ڕەچەتەی نوێ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">دروستکردنی ڕەچەتە</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ناوی ڕەچەتە" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <select value={finishedProductId} onChange={e => handleFinishedProductChange(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
              <option value="">بەرهەمی کۆتایی هەڵبژێرە...</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-3">
            <h4 className="font-bold text-sm text-slate-500">پێکهاتەکان</h4>
            <div className="flex gap-2">
              <select value={selectedIngredient} onChange={e => setSelectedIngredient(e.target.value)} className="flex-1 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                <option value="">پێکهاتە هەڵبژێرە...</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input type="number" value={ingredientQty} onChange={e => setIngredientQty(e.target.value)} placeholder="بڕ" className="w-24 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
              <button onClick={addIngredient} className="bg-orange-600 text-white px-4 rounded-xl font-bold">زیادکردن</button>
            </div>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white dark:bg-slate-900 p-2 px-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-sm">{item.itemName}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-orange-600">{item.quantity}</span>
                    <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleSave} className="w-full bg-orange-600 text-white p-3 rounded-xl font-bold">پاشەکەوتکردنی ڕەچەتە</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipes.map(r => (
          <div key={r.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600">
                <ChefHat size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">{r.name}</h3>
                <p className="text-[10px] text-slate-500">بەرهەمی کۆتایی: {products.find(p => p.id === r.finishedProductId)?.name}</p>
              </div>
            </div>
            <div className="space-y-1">
              {r.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-slate-500">
                  <span>{item.itemName}</span>
                  <span className="font-bold">{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
