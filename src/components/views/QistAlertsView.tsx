import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft 
} from 'lucide-react';
import { Sale } from '../../types';

interface QistAlertsViewProps {
  sales: Sale[];
  currency: string;
  onBack: () => void;
}

export function QistAlertsView({ sales, currency, onBack }: QistAlertsViewProps) {
  const qists = sales.filter(s => s.paymentMethod === 'qist');
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-yellow-600 dark:text-yellow-400">ئاگاداری قیستەکان</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {qists?.map(q => (
          <div key={q.id} className="item-card group border-r-4 border-r-yellow-500">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
                  <span className="font-black text-lg">!</span>
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">{q.customerName}</h3>
                  <p className="text-[10px] theme-muted font-bold mt-1">بڕی ماوە: {q.total.toLocaleString()} {currency}</p>
                </div>
              </div>
              <div className="text-[8px] bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-full font-black uppercase tracking-widest border border-yellow-500/20">پێویستە وەربگیرێت</div>
            </div>
          </div>
        ))}
        {(!qists || qists.length === 0) && (
          <div className="col-span-full text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
            <p className="text-slate-500 font-bold">هیچ ئاگادارییەکی قیست نییە</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
