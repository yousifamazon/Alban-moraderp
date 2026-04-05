import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Plus 
} from 'lucide-react';
import { toast } from 'sonner';
import { Customer, Sale } from '../../types';
import { cn } from '../../lib/utils';

interface CustomerLoyaltyViewProps {
  customers: Customer[];
  sales: Sale[];
  onSave: (c: Customer) => void;
  onUpdate: (c: Customer) => void;
  onBack: () => void;
}

export function CustomerLoyaltyView({ customers, sales, onSave, onUpdate, onBack }: CustomerLoyaltyViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleAddCustomer = () => {
    if (!name) return toast.error("تکایە ناوی کڕیار بنووسە");
    onSave({
      id: Date.now(),
      name,
      phone,
      points: 0,
      tier: 'bronze',
      debt: 0
    });
    setShowAdd(false);
    setName('');
    setPhone('');
    toast.success("کڕیارەکە زیادکرا");
  };

  const calculatePoints = (customerName: string) => {
    const customerSales = sales.filter(s => s.customerName === customerName);
    const totalSpent = customerSales.reduce((sum, s) => sum + s.total, 0);
    return Math.floor(totalSpent / 1000);
  };

  const getTier = (points: number) => {
    if (points >= 10000) return { name: 'پلاتینۆم', color: 'bg-slate-800 text-slate-200' };
    if (points >= 5000) return { name: 'زێڕ', color: 'bg-yellow-100 text-yellow-700' };
    if (points >= 1000) return { name: 'زیو', color: 'bg-slate-200 text-slate-700' };
    return { name: 'بڕۆنز', color: 'bg-orange-100 text-orange-800' };
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-yellow-600 dark:text-yellow-400">سیستەمی دڵسۆزی کڕیار</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-yellow-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-transform">
          <Plus size={18} /> کڕیاری نوێ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">زیادکردنی کڕیار بۆ سیستەمی خاڵ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ناوی کڕیار" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="ژمارەی مۆبایل" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          </div>
          <button onClick={handleAddCustomer} className="w-full bg-yellow-500 text-white p-3 rounded-xl font-bold active:scale-95 transition-transform">پاشەکەوتکردن</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customers.map(c => {
          const calculatedPoints = calculatePoints(c.name);
          const tier = getTier(calculatedPoints);
          
          return (
            <div key={c.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-1">{c.name}</h3>
                <p className="text-xs text-slate-500 mb-2">{c.phone || 'بێ ژمارە'}</p>
                <span className={cn("text-xs px-2 py-1 rounded-full font-bold", tier.color)}>
                  ئاستی {tier.name}
                </span>
              </div>
              <div className="text-center bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-2xl min-w-[80px]">
                <p className="text-[10px] text-yellow-600 dark:text-yellow-500 font-bold mb-1">خاڵەکان</p>
                <p className="text-2xl font-black text-yellow-600 dark:text-yellow-400">{calculatedPoints}</p>
              </div>
            </div>
          );
        })}
        {customers.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">هیچ کڕیارێک تۆمار نەکراوە</div>
        )}
      </div>
    </motion.div>
  );
}
