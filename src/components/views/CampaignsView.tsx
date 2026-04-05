import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Plus 
} from 'lucide-react';
import { toast } from 'sonner';
import { Campaign } from '../../types';
import { cn } from '../../lib/utils';

interface CampaignsViewProps {
  campaigns: Campaign[];
  currency: string;
  onSave: (c: Campaign) => void;
  onUpdate: (c: Campaign) => void;
  onBack: () => void;
}

export function CampaignsView({ campaigns, currency, onSave, onUpdate, onBack }: CampaignsViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [targetAudience, setTargetAudience] = useState('');

  const handleAdd = () => {
    if (!name || !budget) return toast.error("تکایە ناو و بودجە پڕبکەرەوە");
    onSave({
      id: Date.now(),
      name,
      startDate: startDate || new Date().toLocaleDateString('ku-IQ'),
      endDate: endDate || new Date().toLocaleDateString('ku-IQ'),
      budget: parseFloat(budget),
      spent: 0,
      status: 'active',
      targetAudience
    });
    setShowAdd(false);
    setName(''); setBudget(''); setTargetAudience('');
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-pink-600 dark:text-pink-400">کەمپەینەکان</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-pink-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Plus size={18} /> کەمپەینی نوێ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">زیادکردنی کەمپەین</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ناوی کەمپەین" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="بودجە" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="text" value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="کڕیارانی ئامانج" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none md:col-span-2" />
          </div>
          <button onClick={handleAdd} className="w-full bg-pink-600 text-white p-3 rounded-xl font-bold">پاشەکەوتکردن</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map(c => (
          <div key={c.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{c.name}</h3>
              <select value={c.status} onChange={e => onUpdate({...c, status: e.target.value as any})} className="text-xs px-2 py-1 rounded-full font-bold outline-none bg-pink-100 text-pink-700">
                <option value="active">چالاک</option>
                <option value="completed">تەواوبووە</option>
                <option value="paused">ڕاگیراوە</option>
              </select>
            </div>
            <p className="text-xs text-slate-500 mb-4">ئامانج: {c.targetAudience}</p>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">خەرجکراو: {c.spent.toLocaleString()} {currency}</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">بودجە: {c.budget.toLocaleString()} {currency}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
              <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${Math.min(100, (c.spent / c.budget) * 100)}%` }}></div>
            </div>
          </div>
        ))}
        {campaigns.length === 0 && <div className="col-span-full text-center py-12 text-slate-400">هیچ کەمپەینێک نییە</div>}
      </div>
    </motion.div>
  );
}
