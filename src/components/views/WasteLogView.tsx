import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft,
  Printer
} from 'lucide-react';
import { Product, Waste } from '../../types';

interface WasteLogViewProps {
  products: Product[];
  waste: Waste[];
  currency: string;
  onSave: (w: Waste, updatedProducts: Product[]) => void;
  onPrint: (title: string, content: string) => void;
  onBack: () => void;
}

export function WasteLogView({ products, waste, currency, onSave, onPrint, onBack }: WasteLogViewProps) {
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');

  const handlePrint = () => {
    const content = `
      <div style="margin-bottom: 30px;">
        <h2 style="color: #f97316; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">لیستی تەلف و زەرەر</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background: #f8fafc;">
              <th style="padding: 12px; border: 1px solid #e2e8f0; text-align: right;">ناوی کاڵا</th>
              <th style="padding: 12px; border: 1px solid #e2e8f0; text-align: right;">بڕ</th>
              <th style="padding: 12px; border: 1px solid #e2e8f0; text-align: right;">بەروار</th>
              <th style="padding: 12px; border: 1px solid #e2e8f0; text-align: left;">تێچوو</th>
            </tr>
          </thead>
          <tbody>
            ${waste.map(w => `
              <tr>
                <td style="padding: 12px; border: 1px solid #e2e8f0;">${w.itemName}</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0;">${w.quantity}</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0;">${w.date}</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: left; font-weight: bold;">${w.cost.toLocaleString()} ${currency}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr style="background: #f8fafc; font-weight: bold;">
              <td colspan="3" style="padding: 12px; border: 1px solid #e2e8f0; text-align: right;">کۆی گشتی تێچووی زیان</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: left;">${waste.reduce((sum, w) => sum + w.cost, 0).toLocaleString()} ${currency}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;
    onPrint('ڕاپۆرتی تەلف و زەرەر', content);
  };

  const handleSubmit = () => {
    const p = products.find(x => x.id === selectedProductId);
    const qty = parseFloat(quantity);
    if (!p || !qty) return;
    if (p.stock < qty) return;

    const newWaste: Waste = {
      id: Date.now(),
      itemName: p.name,
      quantity: qty,
      cost: p.cost * qty,
      note,
      date: new Date().toLocaleDateString('ku-IQ')
    };

    const updatedProducts = (products || []).map(prod => 
      prod.id === p.id ? { ...prod, stock: prod.stock - qty } : prod
    );

    onSave(newWaste, updatedProducts);
    onBack();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-24 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={onBack} className="p-3 rounded-2xl bg-current/5 hover:bg-current/10 transition-all">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center justify-between flex-1">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">تۆمارکردنی زیان</h2>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">تۆمارکردنی کاڵا بەهەدەردراوەکان</p>
          </div>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-95 text-slate-700 dark:text-slate-200 font-bold"
          >
            <Printer size={20} className="text-orange-500" />
            چاپکردن
          </button>
        </div>
      </div>

      <div className="pro-card p-12 border-none bg-current/5 space-y-12">
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black theme-muted uppercase tracking-[0.2em] mr-2">هەڵبژاردنی کاڵا</label>
            <select 
              value={selectedProductId} 
              onChange={e => setSelectedProductId(Number(e.target.value))}
              className="w-full p-5 bg-current/5 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-current/10 transition-all appearance-none cursor-pointer"
            >
              <option value="">کاڵا هەڵبژێرە...</option>
              {products?.map(p => (
                <option key={p.id} value={p.id}>{p.name} (ماوە: {p.stock})</option>
              ))}
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black theme-muted uppercase tracking-[0.2em] mr-2">بڕی زیان</label>
            <input 
              type="number" 
              value={quantity} 
              onChange={e => setQuantity(e.target.value)} 
              className="w-full p-5 bg-current/5 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-current/10 transition-all" 
              placeholder="0"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black theme-muted uppercase tracking-[0.2em] mr-2">تێبینی / هۆکار</label>
            <textarea 
              value={note} 
              onChange={e => setNote(e.target.value)} 
              className="w-full p-5 bg-current/5 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-current/10 transition-all h-32 resize-none" 
              placeholder="هۆکاری زیانەکە بنووسە..."
            />
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black text-sm shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
        >
          تۆمارکردنی زیان
        </button>
      </div>
    </motion.div>
  );
}
