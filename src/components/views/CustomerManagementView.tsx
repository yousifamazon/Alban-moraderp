import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  Phone, 
  MapPin,
  Edit2
} from 'lucide-react';
import { toast } from 'sonner';
import { Customer, Sale, Payment } from '../../types';
import { cn } from '../../lib/utils';

interface CustomerManagementViewProps {
  customers: Customer[];
  sales: Sale[];
  payments: Payment[];
  currency: string;
  onSave: (c: Customer) => void;
  onUpdate: (c: Customer[]) => void;
  onSavePayment: (p: Payment, updatedCustomers: Customer[]) => void;
  onBack: () => void;
}

export function CustomerManagementView({ customers, sales, payments, currency, onSave, onUpdate, onSavePayment, onBack }: CustomerManagementViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [showPayment, setShowPayment] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAdd = () => {
    if (!name) return toast.error("تکایە ناوی کڕیار بنووسە");
    onSave({ 
      id: Date.now(), 
      name, 
      phone, 
      address, 
      debt: 0, 
      points: 0, 
      tier: 'bronze',
      creditLimit: parseFloat(creditLimit) || 0
    });
    setName(''); setPhone(''); setAddress(''); setCreditLimit(''); setShowAdd(false);
  };

  const handleEdit = () => {
    if (!editingCustomer || !name) return;
    const updatedCustomers = customers.map(c => 
      c.id === editingCustomer.id ? { ...c, name, phone, address, creditLimit: parseFloat(creditLimit) || 0 } : c
    );
    onUpdate(updatedCustomers);
    setEditingCustomer(null);
    setName(''); setPhone(''); setAddress(''); setCreditLimit('');
    toast.success("زانیارییەکانی کڕیار بە سەرکەوتوویی نوێکرایەوە");
  };

  const startEdit = (c: Customer) => {
    setEditingCustomer(c);
    setName(c.name);
    setPhone(c.phone || '');
    setAddress(c.address || '');
    setCreditLimit(c.creditLimit?.toString() || '');
  };

  const handlePayment = () => {
    if (!showPayment || !paymentAmount) return;
    const amount = parseFloat(paymentAmount);
    const newPayment: Payment = {
      id: Date.now(),
      customerName: showPayment.name,
      amount,
      date: new Date().toLocaleDateString('ku-IQ'),
      note: paymentNote
    };

    const updatedCustomers = customers.map(c => 
      c.id === showPayment.id ? { ...c, debt: Math.max(0, (c.debt || 0) - amount) } : c
    );

    onSavePayment(newPayment, updatedCustomers);
    setShowPayment(null);
    setPaymentAmount('');
    setPaymentNote('');
    toast.success("پارەکە وەرگیرا و قەرزەکە کەمکرایەوە");
  };

  const filtered = customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone?.includes(searchTerm));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">بەڕێوەبردنی کڕیاران</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">تۆمارکردن و بەدواداچوونی حیسابی کڕیاران</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAdd(!showAdd)} className="bg-emerald-600 text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-emerald-200 dark:shadow-none flex items-center gap-2 hover:bg-emerald-700 transition-all">
            <Plus size={20} /> کڕیاری نوێ
          </button>
          <button onClick={onBack} className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-5 py-2.5 rounded-2xl font-bold border border-slate-200 dark:border-slate-700">گەڕانەوە</button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="گەڕان بەپێی ناو یان ژمارە مۆبایل..." className="w-full pr-12 pl-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500" />
        </div>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">زیادکردنی کڕیار</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ناوی کڕیار" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="ژمارە مۆبایل" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="ناونیشان" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="number" value={creditLimit} onChange={e => setCreditLimit(e.target.value)} placeholder="سەقفی قەرز" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          </div>
          <button onClick={handleAdd} className="w-full bg-emerald-600 text-white p-3 rounded-xl font-bold">پاشەکەوتکردن</button>
        </div>
      )}

      {editingCustomer && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-xl border dark:border-slate-800">
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-50">دەستکاری کڕیار</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">ناوی کڕیار</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">ژمارە مۆبایل</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">ناونیشان</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">سەقفی قەرز ({currency})</label>
                <input type="number" value={creditLimit} onChange={e => setCreditLimit(e.target.value)} className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleEdit} className="flex-1 bg-emerald-600 text-white p-3 rounded-xl font-bold active:scale-95 transition-transform">پاشکەوتکردن</button>
                <button onClick={() => { setEditingCustomer(null); setName(''); setPhone(''); setAddress(''); }} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 p-3 rounded-xl font-bold active:scale-95 transition-transform">پاشگەزبوونەوە</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {showPayment && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-xl border dark:border-slate-800">
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-50">وەرگرتنی قەرز - {showPayment.name}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">بڕی پارە ({currency})</label>
                <input type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500" placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">تێبینی</label>
                <input type="text" value={paymentNote} onChange={e => setPaymentNote(e.target.value)} className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500" placeholder="..." />
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl">
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">قەرزی ماوە: {(showPayment.debt || 0).toLocaleString()} {currency}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handlePayment} className="flex-1 bg-emerald-600 text-white p-3 rounded-xl font-bold active:scale-95 transition-transform">پاشکەوتکردن</button>
                <button onClick={() => setShowPayment(null)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 p-3 rounded-xl font-bold active:scale-95 transition-transform">پاشگەزبوونەوە</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-xl">
                  {c.name.charAt(0)}
                </div>
                <button onClick={() => startEdit(c)} className="p-2 text-slate-400 hover:text-emerald-500 transition-colors">
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">کۆی قەرز</div>
                <div className={cn("text-lg font-black", (c.debt || 0) > 0 ? "text-red-500" : "text-emerald-500")}>
                  {(c.debt || 0).toLocaleString()} {currency}
                </div>
              </div>
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-1">{c.name}</h3>
            <div className="space-y-1 mb-4">
              <p className="text-sm text-slate-500 flex items-center gap-2"><Phone size={14} /> {c.phone || '---'}</p>
              <p className="text-sm text-slate-500 flex items-center gap-2"><MapPin size={14} /> {c.address || '---'}</p>
              {c.creditLimit ? (
                <p className="text-[10px] font-black text-orange-500 mt-2 uppercase tracking-tighter">سەقفی قەرز: {c.creditLimit.toLocaleString()} {currency}</p>
              ) : null}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowPayment(c)} className="flex-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 py-2 rounded-xl text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all">وەرگرتنی قەرز</button>
              <button className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-2 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">کەشفی حیساب</button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
