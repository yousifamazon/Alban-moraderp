import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  Warehouse as WarehouseIcon, 
  MapPin,
  Edit2,
  Trash2,
  ChevronLeft,
  Package
} from 'lucide-react';
import { toast } from 'sonner';
import { Warehouse, Product } from '../../types';
import { cn, customConfirm } from '../../lib/utils';

interface WarehouseMgmtViewProps {
  warehouses: Warehouse[];
  products: Product[];
  onSave: (w: Warehouse) => void;
  onUpdate: (w: Warehouse) => void;
  onDelete: (id: number) => void;
  onBack: () => void;
}

export function WarehouseMgmtView({ warehouses, products, onSave, onUpdate, onDelete, onBack }: WarehouseMgmtViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAdd = () => {
    if (!name) return toast.error("تکایە ناوی کۆگا بنووسە");
    onSave({ id: Date.now(), name, location });
    setName(''); setLocation(''); setShowAdd(false);
    toast.success("کۆگا بە سەرکەوتوویی زیادکرا");
  };

  const handleUpdate = () => {
    if (!editingWarehouse || !name) return;
    onUpdate({ ...editingWarehouse, name, location });
    setEditingWarehouse(null);
    setName(''); setLocation('');
    toast.success("زانیارییەکانی کۆگا نوێکرایەوە");
  };

  const handleDelete = async (id: number) => {
    if (await customConfirm("ئایا دڵنیایت لە سڕینەوەی ئەم کۆگایە؟")) {
      onDelete(id);
    }
  };

  const startEdit = (w: Warehouse) => {
    setEditingWarehouse(w);
    setName(w.name);
    setLocation(w.location);
  };

  const filtered = warehouses.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 pb-20"
      dir="rtl"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">بەڕێوەبردنی کۆگاکان</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">ڕێکخستنی شوێنی کاڵاکان و کۆگاکان</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)} 
          className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-emerald-200 dark:shadow-none flex items-center gap-2 hover:bg-emerald-700 transition-all active:scale-95"
        >
          <Plus size={20} /> کۆگای نوێ
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            placeholder="گەڕان بۆ کۆگا..." 
            className="w-full pr-12 pl-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 font-bold" 
          />
        </div>
      </div>

      {(showAdd || editingWarehouse) && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 space-y-6"
        >
          <h3 className="font-black text-lg text-slate-700 dark:text-slate-300">
            {editingWarehouse ? 'دەستکاری کۆگا' : 'زیادکردنی کۆگای نوێ'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ناوی کۆگا</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="بۆ نموونە: کۆگای سەرەکی" 
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 font-bold" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ناونیشان / شوێن</label>
              <input 
                type="text" 
                value={location} 
                onChange={e => setLocation(e.target.value)} 
                placeholder="بۆ نموونە: هەولێر - ناوچەی پیشەسازی" 
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 font-bold" 
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={editingWarehouse ? handleUpdate : handleAdd} 
              className="flex-1 bg-emerald-600 text-white p-4 rounded-2xl font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              {editingWarehouse ? 'نوێکردنەوە' : 'پاشەکەوتکردن'}
            </button>
            <button 
              onClick={() => { setShowAdd(false); setEditingWarehouse(null); setName(''); setLocation(''); }} 
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 p-4 rounded-2xl font-black active:scale-95 transition-all"
            >
              پاشگەزبوونەوە
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(w => {
          const warehouseProducts = products.filter(p => p.warehouseId === w.id);
          const totalItems = warehouseProducts.reduce((sum, p) => sum + p.stock, 0);

          return (
            <div key={w.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                  <WarehouseIcon size={28} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(w)} className="p-2 text-slate-400 hover:text-emerald-500 transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(w.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <h3 className="font-black text-xl text-slate-800 dark:text-slate-100 mb-2">{w.name}</h3>
              <div className="space-y-3 mb-6">
                <p className="text-sm text-slate-500 flex items-center gap-2 font-bold">
                  <MapPin size={14} className="opacity-40" /> {w.location || 'ناونیشان نییە'}
                </p>
                <p className="text-sm text-slate-500 flex items-center gap-2 font-bold">
                  <Package size={14} className="opacity-40" /> {warehouseProducts.length} جۆرە کاڵا
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">کۆی پارچەکان</span>
                <span className="text-lg font-black text-emerald-600">{totalItems.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
