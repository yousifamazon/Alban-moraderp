import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Download, 
  Upload,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { Settings } from '../../types';
import { customConfirm } from '../../lib/utils';

interface SettingsViewProps {
  settings: Settings;
  onBackup: () => void;
  onRestore: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: (s: Settings) => void;
  onBack: () => void;
}

export function SettingsView({ settings, onBackup, onRestore, onSave, onBack }: SettingsViewProps) {
  const [name, setName] = useState(settings.storeName);
  const [curr, setCurr] = useState(settings.currency);

  const handleSubmit = () => {
    onSave({ ...settings, storeName: name, currency: curr });
    toast.success("ڕێکخستنەکان پاشەکەوت کران");
    onBack();
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-slate-800 dark:text-slate-200">ڕێکخستنەکان</h2>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">ناوی دوکان</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">دراو</label>
          <select value={curr} onChange={e => setCurr(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
            <option value="د.ع">دیناری عێراقی (د.ع)</option>
            <option value="$">دۆلار ($)</option>
            <option value="تۆمان">تۆمان</option>
            <option value="لیرە">لیرە</option>
          </select>
        </div>
        <button onClick={handleSubmit} className="w-full bg-slate-800 dark:bg-slate-700 text-white p-4 rounded-2xl font-bold active:scale-95 transition-transform">پاشەکەوتکردن</button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-700 dark:text-slate-300">پاراستنی داتا (Backup)</h3>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onBackup} className="flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-4 rounded-2xl font-bold">
            <Download size={18} /> پاشەکەوت
          </button>
          <label className="flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl font-bold cursor-pointer">
            <Upload size={18} /> هاوردەکردن
            <input type="file" accept=".json" onChange={onRestore} className="hidden" />
          </label>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4 border border-red-500/10">
        <h3 className="font-bold text-red-500">ناوچەی مەترسیدار</h3>
        <p className="text-xs theme-muted">ئاگاداری: ئەم کارە هەموو داتاکانت دەسڕێتەوە و ناگەڕێتەوە.</p>
        <button 
          onClick={async () => {
            if (await customConfirm("ئایا دڵنیایت لە سڕینەوەی هەموو داتاکان؟ ئەم کارە ناگەڕێتەوە.")) {
              localStorage.removeItem('alban_murad_erp_data');
              window.location.reload();
            }
          }}
          className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl font-bold"
        >
          <Trash2 size={18} /> سڕینەوەی هەموو داتاکان
        </button>
      </div>
    </motion.div>
  );
}
