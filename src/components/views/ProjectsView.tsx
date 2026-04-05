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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map(p => {
          const progress = Math.min(100, Math.round((p.spent / p.budget) * 100));
          return (
            <div key={p.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{p.name}</h3>
                  <p className="text-sm text-slate-500">کڕیار: {p.clientName}</p>
                </div>
                <select 
                  value={p.status} 
                  onChange={e => onUpdate({...p, status: e.target.value as any})}
                  className={cn("text-xs px-2 py-1 rounded-full font-bold outline-none", 
                    p.status === 'completed' ? "bg-emerald-100 text-emerald-700" : 
                    p.status === 'in-progress' ? "bg-blue-100 text-blue-700" : 
                    p.status === 'planning' ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-700"
                  )}
                >
                  <option value="planning">پلاندانان</option>
                  <option value="in-progress">لە جێبەجێکردندایە</option>
                  <option value="on-hold">ڕاگیراوە</option>
                  <option value="completed">تەواوبووە</option>
                </select>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">خەرجکراو: {p.spent.toLocaleString()} {currency}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">بودجە: {p.budget.toLocaleString()} {currency}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className={cn("h-2 rounded-full", progress > 90 ? "bg-red-500" : "bg-purple-500")} style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
        {projects.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">هیچ پڕۆژەیەک تۆمار نەکراوە</div>
        )}
      </div>
    </motion.div>
  );
}
