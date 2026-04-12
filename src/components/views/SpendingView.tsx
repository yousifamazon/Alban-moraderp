import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Plus, 
  DollarSign, 
  Calendar, 
  FileText, 
  Wallet, 
  CheckCircle2,
  Printer,
  Trash2,
  TrendingDown
} from 'lucide-react';
import { Expense } from '../../types';
import { toast } from 'sonner';
import { customConfirm } from '../../lib/utils';

interface SpendingViewProps {
  expenses: Expense[];
  currency: string;
  darkMode: boolean;
  onSave: (expense: { id: number; description: string; amount: number; date: string }) => void;
  onDelete: (id: number) => void;
  onPrint: (title: string, content: string) => void;
  onBack: () => void;
}

export function SpendingView({ expenses, currency, darkMode, onSave, onDelete, onPrint, onBack }: SpendingViewProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handlePrint = () => {
    const content = `
      <div style="margin-bottom: 30px;">
        <h2 style="color: #3b82f6; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">لیستی خەرجییەکان</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background: #f8fafc;">
              <th style="padding: 12px; border: 1px solid #e2e8f0; text-align: right;">وەسف</th>
              <th style="padding: 12px; border: 1px solid #e2e8f0; text-align: right;">بەروار</th>
              <th style="padding: 12px; border: 1px solid #e2e8f0; text-align: left;">بڕی پارە</th>
            </tr>
          </thead>
          <tbody>
            ${expenses.map(e => `
              <tr>
                <td style="padding: 12px; border: 1px solid #e2e8f0;">${e.description}</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0;">${e.date}</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: left; font-weight: bold;">${e.amount.toLocaleString()} ${currency}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr style="background: #f8fafc; font-weight: bold;">
              <td colspan="2" style="padding: 12px; border: 1px solid #e2e8f0; text-align: right;">کۆی گشتی</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: left;">${expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()} ${currency}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;
    onPrint('ڕاپۆرتی خەرجییەکان', content);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return toast.error("تکایە هەموو خانەکان پڕ بکەرەوە");
    
    onSave({
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      date: new Date(date).toLocaleDateString('ku-IQ')
    });

    setDescription('');
    setAmount('');
    toast.success("خەرجییەکە بەسەرکەوتوویی تۆمارکرا");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto pb-20" dir="rtl">
      <div className="flex items-center gap-5 mb-10">
        <button onClick={onBack} className="p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-95">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center justify-between flex-1">
          <div>
            <h2 className="font-black text-3xl tracking-tight text-slate-800 dark:text-slate-100">تۆمارکردنی خەرجی</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mt-1">تۆمارکردنی خەرجییە ڕۆژانەکان و تێچووەکان</p>
          </div>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-95 text-slate-700 dark:text-slate-200 font-bold"
          >
            <Printer size={20} className="text-blue-500" />
            چاپکردن
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 space-y-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">وەسفی خەرجی</label>
            <div className="relative">
              <FileText className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="بۆ نموونە: کرێی کارەبا، چاککردنەوە..." 
                className="w-full p-5 pr-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-red-500/10 transition-all font-bold text-sm text-slate-900 dark:text-slate-100" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">بڕی پارە</label>
              <div className="relative">
                <DollarSign className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="number" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)} 
                  placeholder="0.00" 
                  className="w-full p-5 pr-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-red-500/10 transition-all font-black text-lg text-slate-900 dark:text-slate-100" 
                />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-slate-400">{currency}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">بەروار</label>
              <div className="relative">
                <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="date" 
                  value={date} 
                  onChange={e => setDate(e.target.value)} 
                  className="w-full p-5 pr-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-red-500/10 transition-all font-bold text-sm text-slate-900 dark:text-slate-100" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button type="submit" className="w-full bg-red-500 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-red-200 dark:shadow-none active:scale-95 transition-all">
            <CheckCircle2 size={24} />
            تۆمارکردنی خەرجی
          </button>
        </div>
      </form>

      <div className="mt-10 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-red-500 shadow-sm">
          <Wallet size={28} />
        </div>
        <div>
          <h4 className="font-black text-slate-800 dark:text-slate-100">ئاگاداری</h4>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">هەموو خەرجییەکان لە کۆی قازانجی گشتی دەردەکرێن بۆ ئەوەی قازانجی سافی بە دروستی هەژمار بکرێت.</p>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <h3 className="font-black text-xl px-2">دوایین خەرجییەکان</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expenses.slice().reverse().map(expense => (
            <div key={expense.id} className="item-card group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
                    <TrendingDown size={20} />
                  </div>
                  <div>
                    <p className="font-black text-sm text-white">{expense.description}</p>
                    <p className="text-[10px] theme-muted font-bold flex items-center gap-1 mt-1">
                      <Calendar size={10} /> {expense.date}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={async () => {
                    if (await customConfirm('ئایا دڵنیایت لە سڕینەوەی ئەم خەرجییە؟')) {
                      onDelete(expense.id);
                    }
                  }}
                  className="p-2 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-black theme-muted uppercase tracking-widest">بڕی پارە</span>
                <span className="text-lg font-black text-red-500">{expense.amount.toLocaleString()} {currency}</span>
              </div>
            </div>
          ))}
          {expenses.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
              <TrendingDown size={48} className="mx-auto text-slate-700 mb-4 opacity-20" />
              <p className="text-slate-500 font-bold">هیچ خەرجییەک تۆمار نەکراوە</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
