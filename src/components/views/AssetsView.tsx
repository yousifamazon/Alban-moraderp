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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assets.map(a => (
          <div key={a.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{a.name}</h3>
                <p className="text-xs text-slate-500">{a.category} • {a.purchaseDate}</p>
              </div>
              <select 
                value={a.status} 
                onChange={e => onUpdate({...a, status: e.target.value as any})}
                className={cn("text-xs px-2 py-1 rounded-full font-bold outline-none", 
                  a.status === 'active' ? "bg-emerald-100 text-emerald-700" : 
                  a.status === 'maintenance' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                )}
              >
                <option value="active">چالاک</option>
                <option value="maintenance">لە چاککردنەوەدایە</option>
                <option value="disposed">لەکارکەوتوو</option>
              </select>
            </div>
            <div className="flex justify-between mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div>
                <p className="text-[10px] text-slate-500 mb-1">نرخی کڕین</p>
                <p className="font-bold">{a.purchasePrice.toLocaleString()} {currency}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 mb-1">نرخی ئێستا</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">{a.currentValue.toLocaleString()} {currency}</p>
              </div>
            </div>
          </div>
        ))}
        {assets.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">هیچ سەرمایەیەک تۆمار نەکراوە</div>
        )}
      </div>
    </motion.div>
  );
}
