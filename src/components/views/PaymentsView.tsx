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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {payments?.map(p => (
          <div key={p.id} className="item-card group">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <span className="font-black text-lg">$</span>
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">{p.customerName}</h3>
                  <p className="text-[10px] theme-muted font-bold mt-1">{p.date}</p>
                </div>
              </div>
              <b className="text-blue-500 text-lg">{p.amount.toLocaleString()} {currency}</b>
            </div>
          </div>
        ))}
        {(!payments || payments.length === 0) && (
          <div className="col-span-full text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
            <p className="text-slate-500 font-bold">هیچ وەسڵێکی پارەدان نییە</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
