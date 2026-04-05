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
      <div className="space-y-2">
        {qists?.map(q => (
          <div key={q.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-r-4 border-yellow-500 shadow-sm flex justify-between items-center">
            <div>
              <b className="text-slate-700 dark:text-slate-200 block">{q.customerName}</b>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">بڕی ماوە: {q.total.toLocaleString()} {currency}</span>
            </div>
            <div className="text-[10px] bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full font-bold">پێویستە وەربگیرێت</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
