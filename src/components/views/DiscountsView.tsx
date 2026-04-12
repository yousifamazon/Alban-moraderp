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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!discounted || discounted.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
            <p className="text-slate-500 font-bold">هیچ داشکانێک نییە</p>
          </div>
        ) : (
          discounted?.map(p => (
            <div key={p.id} className="item-card group">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                    <span className="font-black text-lg">%</span>
                  </div>
                  <h3 className="font-black text-sm text-white">{p.name}</h3>
                </div>
                <span className="text-rose-500 font-black text-lg">-{p.discount?.toLocaleString()} {currency}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
