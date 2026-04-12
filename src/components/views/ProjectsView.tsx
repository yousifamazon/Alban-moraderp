import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Plus 
} from 'lucide-react';
import { toast } from 'sonner';
import { Project } from '../../types';
import { cn } from '../../lib/utils';

interface ProjectsViewProps {
  projects: Project[];
  currency: string;
  onSave: (p: Project) => void;
  onUpdate: (p: Project) => void;
  onBack: () => void;
}

export function ProjectsView({ projects, currency, onSave, onUpdate, onBack }: ProjectsViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [budget, setBudget] = useState('');

  const handleAdd = () => {
    if (!name || !clientName || !budget) return toast.error("تکایە زانیارییەکان پڕبکەرەوە");
    onSave({
      id: Date.now(),
      name,
      clientName,
      startDate: startDate || new Date().toLocaleDateString('ku-IQ'),
      budget: parseFloat(budget),
      status: 'planning',
      spent: 0
    });
    setShowAdd(false);
    setName('');
    setClientName('');
    setStartDate('');
    setBudget('');
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-purple-600 dark:text-purple-400">پڕۆژەکان</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-purple-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Plus size={18} /> پڕۆژەی نوێ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">زیادکردنی پڕۆژە</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ناوی پڕۆژە" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="ناوی کڕیار / خاوەن کار" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="بودجەی تەرخانکراو" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          </div>
          <button onClick={handleAdd} className="w-full bg-purple-600 text-white p-3 rounded-xl font-bold">پاشەکەوتکردن</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => {
          const progress = Math.min(100, Math.round((p.spent / p.budget) * 100));
          return (
            <div key={p.id} className="item-card group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-purple-500 group-hover:text-white transition-all">
                    <Plus size={28} className="rotate-45" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-white">{p.name}</h3>
                    <p className="text-[10px] font-bold theme-muted mt-1">کڕیار: {p.clientName}</p>
                  </div>
                </div>
                <select 
                  value={p.status} 
                  onChange={e => onUpdate({...p, status: e.target.value as any})}
                  className={cn("text-[8px] px-2 py-1 rounded-full font-black uppercase outline-none transition-all border", 
                    p.status === 'completed' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                    p.status === 'in-progress' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : 
                    p.status === 'planning' ? "bg-purple-500/10 text-purple-500 border-purple-500/20" : "bg-white/5 text-slate-400 border-white/10"
                  )}
                >
                  <option value="planning">پلاندانان</option>
                  <option value="in-progress">لە جێبەجێکردن</option>
                  <option value="on-hold">ڕاگیراوە</option>
                  <option value="completed">تەواوبووە</option>
                </select>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="theme-muted">خەرجکراو: {p.spent.toLocaleString()} {currency}</span>
                    <span className="text-white">بودجە: {p.budget.toLocaleString()} {currency}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className={cn("h-full rounded-full", progress > 90 ? "bg-red-500" : "bg-purple-500")} 
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {projects.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
            <Plus size={48} className="mx-auto text-slate-700 mb-4 opacity-20" />
            <p className="text-slate-500 font-bold">هیچ پڕۆژەیەک تۆمار نەکراوە</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
