import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Search, 
  Printer 
} from 'lucide-react';
import { Product } from '../../types';

interface JardViewProps {
  products: Product[];
  onPrint: (title: string, content: string) => void;
  onBack: () => void;
}

export function JardView({ products, onPrint, onBack }: JardViewProps) {
  const [search, setSearch] = useState('');
  
  const filtered = products?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.barcode.includes(search)
  ) || [];

  const handlePrintJard = () => {
    const content = `
      <div style="margin-bottom: 20px;">
        <p><strong>جۆری لیست:</strong> لیستی جەرد کردنی کۆگا</p>
        <p><strong>ڕێکەوت:</strong> ${new Date().toLocaleDateString('ku-IQ')}</p>
        <p><strong>کۆی کاڵاکان:</strong> ${filtered.length}</p>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f8fafc;">
            <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: right;">ناوی کاڵا</th>
            <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: center;">بڕی سیستەم</th>
            <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: center;">بڕی فیزیایی</th>
            <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: center;">تێبینی</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(p => `
            <tr>
              <td style="border: 1px solid #e2e8f0; padding: 12px;">${p.name}</td>
              <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: center; font-weight: bold;">${p.stock}</td>
              <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: center; width: 100px;">[ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</td>
              <td style="border: 1px solid #e2e8f0; padding: 12px; width: 150px;"></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="margin-top: 40px; display: flex; justify-content: space-between;">
        <p>واژووی بەرپرسی کۆگا: _________________</p>
        <p>واژووی لیژنەی جەرد: _________________</p>
      </div>
    `;
    onPrint('لیستی جەرد کردنی کۆگا', content);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-slate-700 dark:text-slate-300">جەرد کردنی کۆگا</h2>
        </div>
        <button 
          onClick={handlePrintJard}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-transform"
        >
          <Printer size={18} />
          پرنتکردنی لیستی جەرد
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="گەڕان بەپێی ناو یان بارکۆد..." 
            className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-400">هیچ کاڵایەک نەدۆزرایەوە</div>
          ) : (
            filtered.map(p => (
              <div key={p.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                <div className="space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-200 block">{p.name}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{p.barcode}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">بڕی سیستەم</span>
                  <b className="text-blue-600 dark:text-blue-400 text-lg">{p.stock}</b>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
