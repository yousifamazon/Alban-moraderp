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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!lowStockItems || lowStockItems.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-emerald-500/10 rounded-[3rem] border-2 border-dashed border-emerald-500/20">
            <p className="text-emerald-500 font-black text-xl">هەموو کاڵاکان بڕی پێویستیان هەیە ✅</p>
          </div>
        ) : (
          lowStockItems?.map(p => (
            <div key={p.id} className="item-card group border-red-500/20">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
                    <b className="text-lg">!</b>
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white">{p.name}</h3>
                    <p className="text-[10px] text-red-400 font-bold mt-1">کەمترین بڕ: {p.minStock}</p>
                  </div>
                </div>
                <div className="text-sm font-black text-red-500 bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20">
                  ماوە: {p.stock}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
