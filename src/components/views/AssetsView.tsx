import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Plus 
} from 'lucide-react';
import { toast } from 'sonner';
import { Asset } from '../../types';
import { cn } from '../../lib/utils';

interface AssetsViewProps {
  assets: Asset[];
  currency: string;
  onSave: (a: Asset) => void;
  onUpdate: (a: Asset) => void;
  onBack: () => void;
}

export function AssetsView({ assets, currency, onSave, onUpdate, onBack }: AssetsViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [currentValue, setCurrentValue] = useState('');

  const handleAdd = () => {
    if (!name || !purchasePrice) return toast.error("تکایە ناو و نرخی کڕین پڕبکەرەوە");
    onSave({
      id: Date.now(),
      name,
      category,
      purchaseDate,
      purchasePrice: parseFloat(purchasePrice),
      currentValue: parseFloat(currentValue || purchasePrice),
      status: 'active'
    });
    setShowAdd(false);
    setName('');
    setCategory('');
    setPurchasePrice('');
    setCurrentValue('');
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-emerald-600 dark:text-emerald-400">سەرمایەکان (Assets)</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Plus size={18} /> سەرمایەی نوێ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">زیادکردنی سەرمایە</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ناوی سەرمایە (بۆ نموونە: ئۆتۆمبێل، کۆمپیوتەر)" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="جۆر (ئامێر، مۆبیلیات، هتد)" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="number" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} placeholder="نرخی کڕین" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="number" value={currentValue} onChange={e => setCurrentValue(e.target.value)} placeholder="نرخی ئێستا (بۆ هەژمارکردنی دابەزینی نرخ)" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          </div>
          <button onClick={handleAdd} className="w-full bg-emerald-600 text-white p-3 rounded-xl font-bold">پاشەکەوتکردن</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map(a => (
          <div key={a.id} className="item-card group">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-500 group-hover:text-white transition-all">
                  <Plus size={28} className="rotate-45" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">{a.name}</h3>
                  <p className="text-[10px] font-bold theme-muted mt-1">{a.category} • {a.purchaseDate}</p>
                </div>
              </div>
              <select 
                value={a.status} 
                onChange={e => onUpdate({...a, status: e.target.value as any})}
                className={cn("text-[8px] px-2 py-1 rounded-full font-black uppercase outline-none transition-all border", 
                  a.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                  a.status === 'maintenance' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                )}
              >
                <option value="active">چالاک</option>
                <option value="maintenance">چاککردنەوە</option>
                <option value="disposed">لەکارکەوتوو</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="space-y-1">
                <p className="text-[10px] font-black theme-muted uppercase tracking-widest">نرخی کڕین</p>
                <p className="text-sm font-black text-white">{a.purchasePrice.toLocaleString()} {currency}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black theme-muted uppercase tracking-widest">نرخی ئێستا</p>
                <p className="text-sm font-black text-emerald-500">{a.currentValue.toLocaleString()} {currency}</p>
              </div>
            </div>
          </div>
        ))}
        {assets.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
            <Plus size={48} className="mx-auto text-slate-700 mb-4 opacity-20" />
            <p className="text-slate-500 font-bold">هیچ سەرمایەیەک تۆمار نەکراوە</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
