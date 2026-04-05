import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft 
} from 'lucide-react';
import { Product } from '../../types';

interface ShelfLabelViewProps {
  products: Product[];
  currency: string;
  onBack: () => void;
}

export function ShelfLabelView({ products, currency, onBack }: ShelfLabelViewProps) {
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('');
  const p = products.find(x => x.id === selectedProductId);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-24 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={onBack} className="p-3 rounded-2xl bg-current/5 hover:bg-current/10 transition-all">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-black tracking-tight">لایبڵی ڕەفە</h2>
          <p className="text-[10px] font-bold theme-muted uppercase tracking-widest mt-1">دروستکردنی لایبڵی نرخ بۆ سەر ڕەفەکان</p>
        </div>
      </div>

      <div className="pro-card p-12 border-none bg-current/5 space-y-12">
        <div className="space-y-3">
          <label className="text-[10px] font-black theme-muted uppercase tracking-widest mr-2">کاڵا هەڵبژێرە</label>
          <select 
            value={selectedProductId} 
            onChange={e => setSelectedProductId(Number(e.target.value))} 
            className="w-full p-5 bg-current/5 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-current/10 transition-all appearance-none cursor-pointer"
          >
            <option value="">کاڵا هەڵبژێرە...</option>
            {products?.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        
        <div className="relative p-12 w-full max-w-sm mx-auto rounded-[2.5rem] bg-current text-inherit text-center overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-3 bg-current/20"></div>
          <h3 className="font-black text-2xl border-b border-current/10 pb-6 mb-8 opacity-90">{p?.name || 'ناوی کاڵا'}</h3>
          <div className="flex items-center justify-center gap-2">
            <span className="text-7xl font-black tracking-tighter font-mono-data">{p?.price.toLocaleString() || '0'}</span>
            <span className="text-xs font-black uppercase tracking-widest opacity-40 mt-6">{currency}</span>
          </div>
          <p className="text-[8px] font-black uppercase tracking-[0.4em] mt-12 opacity-20">ALBAN MURAD ERP SYSTEM</p>
        </div>
        
        <button 
          onClick={() => window.print()} 
          className="w-full bg-current text-inherit py-5 rounded-2xl font-black text-sm shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
        >
          چاپکردنی لایبڵ
        </button>
      </div>
    </motion.div>
  );
}
