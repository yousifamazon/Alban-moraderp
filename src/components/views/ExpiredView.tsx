import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft 
} from 'lucide-react';
import { Product } from '../../types';

interface ExpiredViewProps {
  products: Product[];
  onBack: () => void;
}

export function ExpiredView({ products, onBack }: ExpiredViewProps) {
  const today = new Date();
  const expired = products.filter(p => p.expiryDate && new Date(p.expiryDate) < today);
  
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-red-600 dark:text-red-400">کاڵا بەسەرچووەکان</h2>
      </div>
      <div className="space-y-2">
        {!expired || expired.length === 0 ? (
          <div className="text-center p-12 text-emerald-500 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl">هیچ کاڵایەکی بەسەرچوو نییە ✅</div>
        ) : (
          expired?.map(p => (
            <div key={p.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-l-4 border-red-600 shadow-sm flex justify-between items-center">
              <div>
                <b className="text-slate-700 dark:text-slate-200 block">{p.name}</b>
                <span className="text-[10px] text-red-500 dark:text-red-400 font-bold">بەسەرچووە لە: {p.expiryDate}</span>
              </div>
              <div className="text-xs font-bold text-slate-400 dark:text-slate-500">بڕ: {p.stock}</div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
