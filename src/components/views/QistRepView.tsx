import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft 
} from 'lucide-react';
import { Sale, Payment } from '../../types';

interface QistRepViewProps {
  sales: Sale[];
  payments: Payment[];
  currency: string;
  onBack: () => void;
}

export function QistRepView({ sales, payments, currency, onBack }: QistRepViewProps) {
  const qistSales = sales.filter(s => s.paymentMethod === 'qist');
  const totalQist = qistSales.reduce((a, b) => a + b.total, 0);
  const downPayments = qistSales.reduce((a, b) => a + (b.paidAmount || 0), 0);
  const totalPaid = payments.reduce((a, b) => a + b.amount, 0) + downPayments;
  const remaining = totalQist - totalPaid;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-indigo-400">ڕاپۆرتی قیستەکان</h2>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>کۆی قیستەکان:</span><b>{totalQist.toLocaleString()}</b></div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>کۆی وەرگیراو:</span><b>{totalPaid.toLocaleString()}</b></div>
        <div className="flex justify-between text-xl font-black text-indigo-600 dark:text-indigo-400 pt-4 border-t border-slate-100 dark:border-slate-800"><span>ماوەی گشتی:</span><b>{remaining.toLocaleString()} {currency}</b></div>
      </div>
    </motion.div>
  );
}
