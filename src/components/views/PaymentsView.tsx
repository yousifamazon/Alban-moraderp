import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft 
} from 'lucide-react';
import { Payment } from '../../types';

interface PaymentsViewProps {
  payments: Payment[];
  currency: string;
  onBack: () => void;
}

export function PaymentsView({ payments, currency, onBack }: PaymentsViewProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-blue-400">وەسڵی کردراو (پارە وەرگیراوەکان)</h2>
      </div>
      <div className="space-y-2">
        {payments?.map(p => (
          <div key={p.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-blue-50 dark:border-blue-900/30 flex justify-between items-center">
            <div>
              <b className="text-slate-700 dark:text-slate-200 block">{p.customerName}</b>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">{p.date}</span>
            </div>
            <b className="text-blue-600 dark:text-blue-400">{p.amount.toLocaleString()} {currency}</b>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
