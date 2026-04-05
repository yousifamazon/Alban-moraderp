import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Plus, Package, Truck, Store, Factory, MapPin, Building2, Car } from 'lucide-react';
import { toast } from 'sonner';
import { Supply } from '../../types';

interface SuppliesViewProps {
  supplies: Supply[];
  onSave: (s: Supply) => void;
  onBack: () => void;
}

export function SuppliesView({ supplies, onSave, onBack }: SuppliesViewProps) {
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [cost, setCost] = useState('');
  const [destination, setDestination] = useState<'factory' | 'shop' | 'livestock'>('factory');
  const [source, setSource] = useState<'market' | 'company' | 'driver' | 'taxi'>('market');

  const handleSubmit = () => {
    if (!name || !qty) return toast.error("تکایە زانیارییەکان پڕ بکەرەوە");
    onSave({
      id: Date.now(),
      name,
      quantity: parseFloat(qty),
      cost: cost ? parseFloat(cost) : 0,
      destination,
      source,
      date: new Date().toLocaleDateString('ku-IQ')
    });
    setName('');
    setQty('');
    setCost('');
    toast.success('پێداویستی زیادکرا');
  };

  const getDestinationIcon = (dest: string) => {
    switch(dest) {
      case 'factory': return <Factory size={16} className="text-blue-500" />;
      case 'shop': return <Store size={16} className="text-emerald-500" />;
      case 'livestock': return <Package size={16} className="text-orange-500" />;
      default: return <Package size={16} />;
    }
  };

  const getSourceIcon = (src: string) => {
    switch(src) {
      case 'market': return <MapPin size={16} className="text-purple-500" />;
      case 'company': return <Building2 size={16} className="text-indigo-500" />;
      case 'driver': return <Truck size={16} className="text-teal-500" />;
      case 'taxi': return <Car size={16} className="text-yellow-500" />;
      default: return <MapPin size={16} />;
    }
  };

  const getDestinationLabel = (dest: string) => {
    switch(dest) {
      case 'factory': return 'کارگە';
      case 'shop': return 'دوکان';
      case 'livestock': return 'ئاژەڵداری';
      default: return dest;
    }
  };

  const getSourceLabel = (src: string) => {
    switch(src) {
      case 'market': return 'بازاڕ';
      case 'company': return 'کۆمپانیا';
      case 'driver': return 'شۆفێری خۆمان';
      case 'taxi': return 'تەکسی';
      default: return src;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto pb-20" dir="rtl">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-95">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="font-black text-3xl tracking-tight text-slate-800 dark:text-slate-100">پێداویستییەکان</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mt-1">دابینکردنی پێداویستی بۆ کارگە، دوکان و پڕۆژە</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
            <h3 className="font-black text-lg text-slate-800 dark:text-slate-100 mb-6">زیادکردنی پێداویستی نوێ</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ناوی پێداویستی</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-orange-500/20 font-bold text-sm" placeholder="نموونە: ئالیک، شیر..." />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">بڕ</label>
                  <input type="number" value={qty} onChange={e => setQty(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-orange-500/20 font-bold text-sm" placeholder="بڕ..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">تێچوو (ئارەزوومەندانە)</label>
                  <input type="number" value={cost} onChange={e => setCost(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-orange-500/20 font-bold text-sm" placeholder="نرخ..." />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">بۆ کوێ؟</label>
                <select value={destination} onChange={e => setDestination(e.target.value as any)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-orange-500/20 font-bold text-sm">
                  <option value="factory">کارگە</option>
                  <option value="shop">دوکان</option>
                  <option value="livestock">پڕۆژەی ئاژەڵداری</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">لە کوێوە؟</label>
                <select value={source} onChange={e => setSource(e.target.value as any)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-orange-500/20 font-bold text-sm">
                  <option value="market">بازاڕ</option>
                  <option value="company">کۆمپانیا</option>
                  <option value="driver">شۆفێری خۆمان</option>
                  <option value="taxi">تەکسی</option>
                </select>
              </div>

              <button onClick={handleSubmit} className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all mt-6">
                <Plus size={22} />
                زیادکردن
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {supplies.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 text-center">
              <Package size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
              <p className="text-slate-500 dark:text-slate-400 font-bold">هیچ پێداویستییەک تۆمار نەکراوە</p>
            </div>
          ) : (
            supplies.map(s => (
              <div key={s.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
                    <Package size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-slate-800 dark:text-slate-100">{s.name}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs font-bold text-slate-500">
                      <span className="flex items-center gap-1">{getDestinationIcon(s.destination)} {getDestinationLabel(s.destination)}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <span className="flex items-center gap-1">{getSourceIcon(s.source)} {getSourceLabel(s.source)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-1 w-full sm:w-auto justify-between sm:justify-start">
                  <div className="text-left">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">بڕ</span>
                    <span className="font-black text-lg text-slate-800 dark:text-slate-100">{s.quantity}</span>
                  </div>
                  {s.cost ? (
                    <div className="text-left">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">تێچوو</span>
                      <span className="font-mono-data font-black text-orange-500">{s.cost.toLocaleString()}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
