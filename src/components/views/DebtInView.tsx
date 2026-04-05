import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft 
} from 'lucide-react';
import { toast } from 'sonner';
import { Payment } from '../../types';

interface DebtInViewProps {
  payments: Payment[];
  currency: string;
  onSave: (p: Payment) => void;
  onBack: () => void;
}

export function DebtInView({ payments, currency, onSave, onBack }: DebtInViewProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (!name || !amount) return toast.error("تکایە زانیارییەکان پڕ بکەرەوە");
    onSave({
      id: Date.now(),
      customerName: name,
      amount: parseFloat(amount),
      date: new Date().toLocaleDateString('ku-IQ'),
      note
    });
    setName('');
    setAmount('');
    setNote('');
    toast.success("پارە وەرگیرا!");
  };

  const recentPayments = [...(payments || [])].reverse().slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 pb-12">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-green-600 dark:text-green-400">وەرگرتنی قەرز</h2>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ناوی کڕیار" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="بڕی پارە" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="تێبینی..." className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none h-24" />
        <button onClick={handleSubmit} className="w-full bg-green-600 dark:bg-green-700 text-white p-4 rounded-2xl font-bold">تۆمارکردن</button>
      </div>

      {recentPayments.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2">دوایین پارە وەرگیراوەکان</h3>
          {recentPayments.map(p => (
            <div key={p.id} className="bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div className="text-right">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block">{p.customerName}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">{p.date} | {p.note}</span>
              </div>
              <span className="text-sm text-green-600 font-black">{p.amount.toLocaleString()} {currency}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
