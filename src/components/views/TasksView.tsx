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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['todo', 'in-progress', 'done'].map(status => (
          <div key={status} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl">
            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 capitalize">
              {status === 'todo' ? 'بۆ کردن' : status === 'in-progress' ? 'لە جێبەجێکردندایە' : 'تەواوبووە'}
            </h3>
            <div className="space-y-3">
              {tasks.filter(t => t.status === status).map(t => (
                <div key={t.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-sm mb-1">{t.title}</h4>
                  <p className="text-xs text-slate-500 mb-3">{t.description}</p>
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-3">
                    <span>{employees.find(e => e.id === t.assignedTo)?.name}</span>
                    <span>{t.dueDate}</span>
                  </div>
                  <select 
                    value={t.status} 
                    onChange={e => onUpdate({...t, status: e.target.value as any})}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none"
                  >
                    <option value="todo">بۆ کردن</option>
                    <option value="in-progress">لە جێبەجێکردندایە</option>
                    <option value="done">تەواوبووە</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
