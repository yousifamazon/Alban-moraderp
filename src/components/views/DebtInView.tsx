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
        <div className="space-y-4">
          <h3 className="text-[10px] font-black theme-muted uppercase tracking-widest px-2">دوایین پارە وەرگیراوەکان</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPayments.map(p => (
              <div key={p.id} className="item-card group">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <span className="font-black text-lg">$</span>
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-white">{p.customerName}</h3>
                      <p className="text-[10px] theme-muted font-bold mt-1">{p.date} {p.note && `| ${p.note}`}</p>
                    </div>
                  </div>
                  <b className="text-emerald-500 text-lg">{p.amount.toLocaleString()} {currency}</b>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
