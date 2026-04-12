import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Plus, 
  Search, 
  Phone, 
  MapPin, 
  ArrowLeftRight, 
  Edit3, 
  Trash2, 
  X, 
  Settings as SettingsIcon 
} from 'lucide-react';
import { toast } from 'sonner';
import { Supplier, SupplierDebt, SupplierPayment } from '../../types';
import { cn, customConfirm } from '../../lib/utils';

interface SupplierManagementViewProps {
  suppliers: Supplier[];
  debts: SupplierDebt[];
  payments: SupplierPayment[];
  currency: string;
  darkMode: boolean;
  onSave: (s: Supplier) => void;
  onUpdate: (s: Supplier) => void;
  onDelete: (id: number) => void;
  onSaveDebt: (d: SupplierDebt) => void;
  onSavePayment: (p: SupplierPayment) => void;
  onBack: () => void;
}

export function SupplierManagementView({ suppliers, debts, payments, currency, darkMode, onSave, onUpdate, onDelete, onSaveDebt, onSavePayment, onBack }: SupplierManagementViewProps) {
  const [form, setForm] = useState<Partial<Supplier>>({ name: '', phone: '', address: '', paymentTerms: '' });
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'debt' | 'recent'>('name');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  
  // Transaction form state
  const [transAmount, setTransAmount] = useState('');
  const [transNote, setTransNote] = useState('');
  const [transType, setTransType] = useState<'debt' | 'payment'>('payment');

  const getSupplierBalance = (supplierName: string) => {
    const sDebts = debts.filter(d => d.supplierName === supplierName).reduce((sum, d) => sum + d.amount, 0);
    const sPayments = payments.filter(p => p.supplierName === supplierName).reduce((sum, p) => sum + p.amount, 0);
    return sDebts - sPayments;
  };

  const getLastPaymentDate = (supplierName: string) => {
    const sPayments = payments.filter(p => p.supplierName === supplierName);
    if (sPayments.length === 0) return 0;
    return Math.max(...sPayments.map(p => new Date(p.date).getTime()));
  };

  const filteredSuppliers = suppliers
    .filter(s => 
      s.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
      s.phone.includes(supplierSearch) ||
      s.address.toLowerCase().includes(supplierSearch.toLowerCase()) ||
      (s.paymentTerms && s.paymentTerms.toLowerCase().includes(supplierSearch.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'debt') return getSupplierBalance(b.name) - getSupplierBalance(a.name);
      if (sortBy === 'recent') return getLastPaymentDate(b.name) - getLastPaymentDate(a.name);
      return 0;
    });

  const totalOutstanding = suppliers.reduce((sum, s) => sum + getSupplierBalance(s.name), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return toast.error("ناوی دابینکەر پێویستە");
    
    const newSupplier: Supplier = {
      id: Date.now(),
      name: form.name!,
      phone: form.phone || '',
      address: form.address || '',
      paymentTerms: form.paymentTerms || ''
    };
    onSave(newSupplier);
    setForm({ name: '', phone: '', address: '', paymentTerms: '' });
    toast.success("دابینکەری نوێ زیادکرا");
  };

  const handleUpdateSupplier = () => {
    if (!editingSupplier || !editingSupplier.name) return toast.error("ناوی دابینکەر پێویستە");
    onUpdate(editingSupplier);
    setEditingSupplier(null);
    toast.success("زانیارییەکانی دابینکەر نوێکرایەوە");
  };

  const handleAddTransaction = () => {
    if (!selectedSupplier || !transAmount) return toast.error("تکایە بڕی پارە دیاری بکە");
    const amount = parseFloat(transAmount);
    const date = new Date().toLocaleDateString('ku-IQ');

    if (transType === 'debt') {
      onSaveDebt({
        id: Date.now(),
        supplierName: selectedSupplier.name,
        amount,
        date,
        note: transNote
      });
    } else {
      onSavePayment({
        id: Date.now(),
        supplierName: selectedSupplier.name,
        amount,
        date,
        note: transNote
      });
    }

    setTransAmount('');
    setTransNote('');
    toast.success("مامەڵەکە بەسەرکەوتوویی تۆمارکرا");
  };

  const handleEdit = (s: Supplier) => {
    setEditingSupplier({ ...s });
  };

  const handleDelete = async (id: number) => {
    if (await customConfirm("ئایا دڵنیایت لە سڕینەوەی ئەم دابینکەرە؟")) {
      onDelete(id);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 pb-12 max-w-6xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all active:scale-95">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="font-black text-2xl tracking-tight text-slate-800 dark:text-slate-100">بەڕێوەبردنی دابینکەرەکان</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">بەڕێوەبردنی لیستی دابینکەرەکان و قەرزەکان</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-6 py-3 flex flex-col items-end rounded-2xl shadow-sm">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">کۆی قەرز</span>
            <span className="text-xl font-black text-red-500">{totalOutstanding.toLocaleString()} {currency}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 space-y-6 sticky top-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <Plus size={18} />
              </div>
              <h3 className="font-black text-sm text-slate-700 dark:text-slate-200">دابینکەری نوێ</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">ناوی دابینکەر</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="بۆ نموونە: کۆمپانیای ئاریا" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-bold text-sm text-slate-900 dark:text-slate-100" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">ژمارەی مۆبایل</label>
                <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="0750XXXXXXX" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-bold text-sm text-slate-900 dark:text-slate-100" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">ناونیشان</label>
                <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="شار، گەڕەک..." className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-bold text-sm text-slate-900 dark:text-slate-100" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">مەرجەکانی پارەدان</label>
                <textarea value={form.paymentTerms} onChange={e => setForm({...form, paymentTerms: e.target.value})} placeholder="بۆ نموونە: پارەدان بە قیست..." className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-bold text-sm h-24 resize-none text-slate-900 dark:text-slate-100" />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-200 dark:shadow-none active:scale-95 transition-all">
                زیادکردنی دابینکەر
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-2 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={supplierSearch} 
                onChange={e => setSupplierSearch(e.target.value)} 
                placeholder="گەڕان لەناو دابینکەرەکان..." 
                className="w-full py-4 pr-12 pl-4 bg-transparent outline-none font-bold text-sm text-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="flex gap-1 p-1 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button onClick={() => setSortBy('name')} className={cn("px-4 py-2 text-[10px] font-black rounded-lg transition-all", sortBy === 'name' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}>
                ناو
              </button>
              <button onClick={() => setSortBy('debt')} className={cn("px-4 py-2 text-[10px] font-black rounded-lg transition-all", sortBy === 'debt' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}>
                قەرز
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSuppliers.map(s => {
              const balance = getSupplierBalance(s.name);
              return (
                <div key={s.id} className="item-card group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl font-black text-white group-hover:scale-110 transition-transform">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-lg tracking-tight text-white">{s.name}</h4>
                      <div className="flex flex-col gap-1 mt-1">
                        <p className="text-[10px] theme-muted font-bold flex items-center gap-1">
                          <Phone size={10} /> {s.phone || 'بێ ژمارە'}
                        </p>
                        <p className="text-[10px] theme-muted font-bold flex items-center gap-1">
                          <MapPin size={10} /> {s.address || 'بێ ناونیشان'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="text-right">
                      <p className="text-[10px] font-black theme-muted uppercase tracking-widest mb-1">قەرزی ئێستا</p>
                      <p className={cn("text-xl font-black font-mono-data", balance > 0 ? "text-red-500" : "text-emerald-500")}>
                        {balance.toLocaleString()} <span className="text-xs font-normal opacity-60">{currency}</span>
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedSupplier(s)} className="p-3 bg-white/5 hover:bg-emerald-500/20 text-white/40 hover:text-emerald-500 rounded-xl transition-all active:scale-95" title="مامەڵە">
                        <ArrowLeftRight size={18} />
                      </button>
                      <button onClick={() => handleEdit(s)} className="p-3 bg-white/5 hover:bg-blue-500/20 text-white/40 hover:text-blue-500 rounded-xl transition-all active:scale-95" title="دەستکاری">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="p-3 bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-500 rounded-xl transition-all active:scale-95" title="سڕینەوە">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredSuppliers.length === 0 && (
              <div className="col-span-full bg-white/5 p-20 flex flex-col items-center justify-center text-white/20 italic text-sm border-2 border-dashed border-white/5 rounded-3xl">
                <Search size={48} className="mb-4 opacity-20" />
                هیچ دابینکەرێک نەدۆزرایەوە
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedSupplier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-md p-8 space-y-8 shadow-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-xl tracking-tight text-slate-800 dark:text-slate-100">تۆمارکردنی مامەڵە</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">بۆ دابینکەر: {selectedSupplier.name}</p>
                </div>
                <button onClick={() => setSelectedSupplier(null)} className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-500">
                  <X size={20} />
                </button>
              </div>

              <div className="flex p-1 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <button onClick={() => setTransType('payment')} className={cn("flex-1 py-3 rounded-xl font-black text-xs transition-all", transType === 'payment' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-lg" : "text-slate-500")}>
                  پارەدان (وەصل)
                </button>
                <button onClick={() => setTransType('debt')} className={cn("flex-1 py-3 rounded-xl font-black text-xs transition-all", transType === 'debt' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-lg" : "text-slate-500")}>
                  قەرزی نوێ
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">بڕی پارە</label>
                  <div className="relative">
                    <input type="number" value={transAmount} onChange={e => setTransAmount(e.target.value)} placeholder="0.00" className="w-full p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-black text-2xl text-center text-slate-900 dark:text-slate-100" />
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-slate-400">{currency}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">تێبینی (ئارەزوومەندانە)</label>
                  <textarea value={transNote} onChange={e => setTransNote(e.target.value)} placeholder="زانیاری زیاتر..." className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-bold text-sm h-24 resize-none text-slate-900 dark:text-slate-100" />
                </div>
              </div>

              <button onClick={handleAddTransaction} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 dark:shadow-none active:scale-95 transition-all">
                تۆمارکردن
              </button>
            </motion.div>
          </div>
        )}

        {editingSupplier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-md p-8 space-y-8 shadow-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-xl tracking-tight text-slate-800 dark:text-slate-100">دەستکاری دابینکەر</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">نوێکردنەوەی زانیارییەکانی {editingSupplier.name}</p>
                </div>
                <button onClick={() => setEditingSupplier(null)} className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-500">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">ناوی دابینکەر</label>
                  <input type="text" value={editingSupplier.name} onChange={e => setEditingSupplier({...editingSupplier, name: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-bold text-sm text-slate-900 dark:text-slate-100" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">ژمارەی مۆبایل</label>
                  <input type="text" value={editingSupplier.phone} onChange={e => setEditingSupplier({...editingSupplier, phone: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-bold text-sm text-slate-900 dark:text-slate-100" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">ناونیشان</label>
                  <input type="text" value={editingSupplier.address} onChange={e => setEditingSupplier({...editingSupplier, address: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-bold text-sm text-slate-900 dark:text-slate-100" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">مەرجەکانی پارەدان</label>
                  <textarea value={editingSupplier.paymentTerms} onChange={e => setEditingSupplier({...editingSupplier, paymentTerms: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-bold text-sm h-24 resize-none text-slate-900 dark:text-slate-100" />
                </div>
              </div>

              <button onClick={handleUpdateSupplier} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 dark:shadow-none active:scale-95 transition-all">
                پاشەکەوتکردنی گۆڕانکارییەکان
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
