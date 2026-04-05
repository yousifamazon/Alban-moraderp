import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Trash2 
} from 'lucide-react';
import { toast } from 'sonner';

interface CategoryMgmtViewProps {
  categories: string[];
  onSave: (c: string[]) => void;
  onBack: () => void;
}

export function CategoryMgmtView({ categories, onSave, onBack }: CategoryMgmtViewProps) {
  const [newCat, setNewCat] = useState('');

  const handleAdd = () => {
    if (!newCat) return toast.error("تکایە ناوی جۆرەکە بنووسە");
    if (categories.includes(newCat)) return toast.error("ئەم جۆرە پێشتر هەیە");
    onSave([...categories, newCat]);
    setNewCat('');
    toast.success("جۆرەکە زیادکرا");
  };

  const handleRemove = (cat: string) => {
    onSave(categories.filter(c => c !== cat));
    toast.success("جۆرەکە سڕایەوە");
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-indigo-400">بەڕێوەبردنی جۆرەکان</h2>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4 mb-4">
        <input type="text" value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="ناوی جۆری نوێ" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
        <button onClick={handleAdd} className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold active:scale-95 transition-transform">زیادکردن</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories?.map(c => (
          <div key={c} className="item-card flex-row justify-between items-center p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-xs">
                {c.charAt(0)}
              </div>
              <span className="text-sm font-black text-white">{c}</span>
            </div>
            <button onClick={() => handleRemove(c)} className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all active:scale-90">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
