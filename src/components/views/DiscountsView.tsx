import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft 
} from 'lucide-react';
import { Product } from '../../types';

interface DiscountsViewProps {
  products: Product[];
  currency: string;
  onBack: () => void;
}

export function DiscountsView({ products, currency, onBack }: DiscountsViewProps) {
  const discounted = products.filter(p => p.discount && p.discount > 0);
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-rose-500 dark:text-rose-400">داشکانی کاڵاکان</h2>
      </div>
      <div className="space-y-2">
        {!discounted || discounted.length === 0 ? (
          <div className="text-center p-12 text-slate-400 dark:text-slate-600">هیچ داشکانێک نییە</div>
        ) : (
          discounted?.map(p => (
            <div key={p.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm flex justify-between items-center border border-slate-50 dark:border-slate-800">
              <b className="text-slate-700 dark:text-slate-200">{p.name}</b>
              <span className="text-rose-500 dark:text-rose-400 font-bold">-{p.discount?.toLocaleString()} {currency}</span>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
