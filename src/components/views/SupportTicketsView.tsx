import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Plus 
} from 'lucide-react';
import { toast } from 'sonner';
import { SupportTicket, Customer } from '../../types';
import { cn } from '../../lib/utils';

interface SupportTicketsViewProps {
  tickets: SupportTicket[];
  customers: Customer[];
  onSave: (t: SupportTicket) => void;
  onUpdate: (t: SupportTicket) => void;
  onBack: () => void;
}

export function SupportTicketsView({ tickets, customers, onSave, onUpdate, onBack }: SupportTicketsViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleAdd = () => {
    if (!subject || !description) return toast.error("تکایە بابەت و وەسف پڕبکەرەوە");
    onSave({
      id: Date.now(),
      subject,
      description,
      customerId: customerId ? parseInt(customerId) : undefined,
      status: 'open',
      priority,
      createdAt: new Date().toISOString()
    });
    setShowAdd(false);
    setSubject(''); setDescription(''); setCustomerId('');
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-sky-600 dark:text-sky-400">تیکێتەکانی پشتیوانی</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-sky-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Plus size={18} /> تیکێتی نوێ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">دروستکردنی تیکێت</h3>
          <div className="grid grid-cols-1 gap-4">
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="بابەت" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="وەسفی کێشەکە" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <select value={customerId} onChange={e => setCustomerId(e.target.value)} className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                <option value="">هەڵبژاردنی کڕیار (ئارەزوومەندانە)</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={priority} onChange={e => setPriority(e.target.value as any)} className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                <option value="low">نزم</option>
                <option value="medium">مامناوەند</option>
                <option value="high">بەرز</option>
              </select>
            </div>
          </div>
          <button onClick={handleAdd} className="w-full bg-sky-600 text-white p-3 rounded-xl font-bold">ناردن</button>
        </div>
      )}

      <div className="space-y-4">
        {tickets.map(t => (
          <div key={t.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">{t.subject}</h3>
              <div className="flex gap-2">
                <span className={cn("text-[10px] px-2 py-1 rounded-full font-bold", 
                  t.priority === 'high' ? "bg-red-100 text-red-700" : 
                  t.priority === 'medium' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                )}>
                  {t.priority === 'high' ? 'بەرز' : t.priority === 'medium' ? 'مامناوەند' : 'نزم'}
                </span>
                <select value={t.status} onChange={e => onUpdate({...t, status: e.target.value as any})} className="text-[10px] px-2 py-1 rounded-full font-bold outline-none bg-sky-100 text-sky-700">
                  <option value="open">کراوە</option>
                  <option value="in-progress">لە کارکردندایە</option>
                  <option value="resolved">چارەسەرکراوە</option>
                  <option value="closed">داخراوە</option>
                </select>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-2">{t.description}</p>
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>کڕیار: {customers.find(c => c.id === t.customerId)?.name || 'گشتی'}</span>
              <span>{new Date(t.createdAt).toLocaleString('ku-IQ')}</span>
            </div>
          </div>
        ))}
        {tickets.length === 0 && <div className="text-center py-12 text-slate-400">هیچ تیکێتێک نییە</div>}
      </div>
    </motion.div>
  );
}
