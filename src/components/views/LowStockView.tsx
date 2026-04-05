import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft 
} from 'lucide-react';
import { Product } from '../../types';

interface LowStockViewProps {
  products: Product[];
  onBack: () => void;
}

export function LowStockView({ products, onBack }: LowStockViewProps) {
  const lowStockItems = products.filter(p => p.stock <= p.minStock);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-red-500 dark:text-red-400">کەشفی کاڵا کەمبووەکان</h2>
      </div>
      <div className="space-y-2">
        {!lowStockItems || lowStockItems.length === 0 ? (
          <div className="text-center p-12 text-emerald-500 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl">هەموو کاڵاکان بڕی پێویستیان هەیە ✅</div>
        ) : (
          lowStockItems?.map(p => (
            <div key={p.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl flex justify-between items-center shadow-sm border border-red-100 dark:border-red-900/30">
              <div className="text-right">
                <b className="text-slate-700 dark:text-slate-200 block">{p.name}</b>
                <span className="text-[10px] text-red-400 dark:text-red-500 font-bold">کەمترین بڕ: {p.minStock}</span>
              </div>
              <div className="text-sm font-black text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full">
                ماوە: {p.stock}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
