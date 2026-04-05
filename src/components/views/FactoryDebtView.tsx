import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft 
} from 'lucide-react';
import { toast } from 'sonner';
import { SupplierDebt } from '../../types';
import { cn } from '../../lib/utils';

interface FactoryDebtViewProps {
  debts: SupplierDebt[];
  payments: any[];
  currency: string;
  onSaveDebt: (d: SupplierDebt) => void;
  onSavePayment: (p: any) => void;
  onBack: () => void;
}

export function FactoryDebtView({ debts, payments, currency, onSaveDebt, onSavePayment, onBack }: FactoryDebtViewProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mode, setMode] = useState<'debt' | 'payment'>('debt');

  const handleSubmit = () => {
    if (!name || !amount) return toast.error("تکایە زانیارییەکان پڕ بکەرەوە");
    const val = parseFloat(amount);
    const formattedDate = new Date(date).toLocaleDateString('ku-IQ');
    if (mode === 'debt') {
      onSaveDebt({
        id: Date.now(),
        supplierName: name,
        amount: val,
        date: formattedDate
      });
    } else {
      onSavePayment({
        id: Date.now(),
        supplierName: name,
        amount: val,
        date: formattedDate
      });
    }
    setName('');
    setAmount('');
    toast.success("تۆمارکرا!");
  };

  const suppliers = Array.from(new Set([...(debts?.map(d => d.supplierName) || []), ...(payments?.map(p => p.supplierName) || [])]));
  const recentTransactions = [...(debts || []), ...(payments || [])].sort((a, b) => b.id - a.id).slice(0, 5);

  const totalDebt = (debts || []).reduce((sum, d) => sum + d.amount, 0);
  const totalPaid = (payments || []).reduce((sum, p) => sum + p.amount, 0);
  const totalOutstanding = totalDebt - totalPaid;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 pb-12">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-slate-600 dark:text-slate-400">قەرزی کارگە</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider">کۆی قەرزی ماوە</p>
          <h3 className="text-lg font-black text-red-500">{totalOutstanding.toLocaleString()} <span className="text-[10px] font-normal">{currency}</span></h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider">کۆی پارەی دراو</p>
          <h3 className="text-lg font-black text-emerald-500">{totalPaid.toLocaleString()} <span className="text-[10px] font-normal">{currency}</span></h3>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4 mb-4">
        <div className="flex gap-2 p-1 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <button 
            onClick={() => setMode('debt')}
            className={cn("flex-1 py-2 rounded-lg text-xs font-bold transition-all", mode === 'debt' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-400")}
          >زیادکردنی قەرز</button>
          <button 
            onClick={() => setMode('payment')}
            className={cn("flex-1 py-2 rounded-lg text-xs font-bold transition-all", mode === 'payment' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-400")}
          >دانەوەی قەرز</button>
        </div>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ناوی کارگە / دابەشکەر" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="بڕی پارە" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
        <button onClick={handleSubmit} className={cn("w-full text-white p-4 rounded-2xl font-bold transition-colors", mode === 'debt' ? "bg-slate-700 dark:bg-slate-800" : "bg-emerald-600 dark:bg-emerald-700")}>
          {mode === 'debt' ? 'زیادکردنی قەرز' : 'دانەوەی قەرز'}
        </button>
      </div>

      {recentTransactions.length > 0 && (
        <div className="space-y-2 mb-6">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2">دوایین مامەڵەکان</h3>
          {recentTransactions.map(t => (
            <div key={t.id} className="bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div className="text-right">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block">{t.supplierName}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">{t.date}</span>
              </div>
              <span className={cn("text-sm font-black", 'supplierName' in t && 'amount' in t ? (debts.some(d => d.id === t.id) ? "text-red-500" : "text-emerald-500") : "")}>
                {t.amount.toLocaleString()} {currency}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2">کۆی قەرزەکان بەپێی کارگە</h3>
        {suppliers?.map(s => {
          const sDebts = debts?.filter(d => d.supplierName === s) || [];
          const sPayments = payments?.filter(p => p.supplierName === s) || [];
          const totalD = sDebts.reduce((a, b) => a + b.amount, 0);
          const totalP = sPayments.reduce((a, b) => a + b.amount, 0);
          const balance = totalD - totalP;

          return (
            <div key={s} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div className="text-right">
                <b className="text-slate-700 dark:text-slate-200 block">{s}</b>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">کڕین: {totalD.toLocaleString()} | دراوە: {totalP.toLocaleString()}</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">ماوە</p>
                <b className={cn("text-lg", balance > 0 ? "text-red-500" : "text-emerald-500")}>{balance.toLocaleString()} {currency}</b>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
