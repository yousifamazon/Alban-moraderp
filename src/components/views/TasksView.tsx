import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Plus 
} from 'lucide-react';
import { toast } from 'sonner';
import { Task, Employee } from '../../types';

interface TasksViewProps {
  tasks: Task[];
  employees: Employee[];
  onSave: (t: Task) => void;
  onUpdate: (t: Task) => void;
  onBack: () => void;
}

export function TasksView({ tasks, employees, onSave, onUpdate, onBack }: TasksViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleAdd = () => {
    if (!title || !assignedTo) return toast.error("تکایە ناونیشان و کارمەند دیاری بکە");
    onSave({
      id: Date.now(),
      title,
      description,
      assignedTo: parseInt(assignedTo),
      dueDate,
      status: 'todo'
    });
    setShowAdd(false);
    setTitle('');
    setDescription('');
    setAssignedTo('');
    setDueDate('');
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-indigo-600 dark:text-indigo-400">ئەرکەکان</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Plus size={18} /> ئەرکی نوێ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">زیادکردنی ئەرک</h3>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="ناونیشانی ئەرک" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="وردەکاری" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none h-24" />
          <div className="grid grid-cols-2 gap-4">
            <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
              <option value="">دیاریکردنی کارمەند...</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          </div>
          <button onClick={handleAdd} className="w-full bg-indigo-600 text-white p-3 rounded-xl font-bold">پاشەکەوتکردن</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['todo', 'in-progress', 'done'].map(status => (
          <div key={status} className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5">
            <h3 className="font-black text-slate-400 mb-6 flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", 
                status === 'todo' ? "bg-slate-400" : status === 'in-progress' ? "bg-amber-500" : "bg-emerald-500"
              )} />
              {status === 'todo' ? 'بۆ کردن' : status === 'in-progress' ? 'لە جێبەجێکردندایە' : 'تەواوبووە'}
            </h3>
            <div className="space-y-4">
              {tasks.filter(t => t.status === status).map(t => (
                <div key={t.id} className="item-card p-5 gap-3">
                  <h4 className="font-black text-sm text-white">{t.title}</h4>
                  <p className="text-[10px] font-bold theme-muted line-clamp-2">{t.description}</p>
                  
                  <div className="flex justify-between items-center text-[10px] font-bold theme-muted pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[8px]">
                        {employees.find(e => e.id === t.assignedTo)?.name.charAt(0)}
                      </div>
                      {employees.find(e => e.id === t.assignedTo)?.name}
                    </span>
                    <span>{t.dueDate}</span>
                  </div>
                  
                  <select 
                    value={t.status} 
                    onChange={e => onUpdate({...t, status: e.target.value as any})}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white outline-none focus:ring-2 ring-indigo-500/20 transition-all mt-2"
                  >
                    <option value="todo">بۆ کردن</option>
                    <option value="in-progress">لە جێبەجێکردندایە</option>
                    <option value="done">تەواوبووە</option>
                  </select>
                </div>
              ))}
              {tasks.filter(t => t.status === status).length === 0 && (
                <div className="text-center py-10 text-[10px] font-bold theme-muted border-2 border-dashed border-white/5 rounded-3xl">
                  هیچ ئەرکێک نییە
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
