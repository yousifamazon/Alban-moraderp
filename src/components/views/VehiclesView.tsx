import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Plus,
  Trash2,
  Truck
} from 'lucide-react';
import { toast } from 'sonner';
import { Vehicle, Employee } from '../../types';
import { cn, customConfirm } from '../../lib/utils';

interface VehiclesViewProps {
  vehicles: Vehicle[];
  employees: Employee[];
  onSave: (v: Vehicle) => void;
  onUpdate: (v: Vehicle) => void;
  onDelete?: (id: number) => void;
  onBack: () => void;
}

export function VehiclesView({ vehicles, employees, onSave, onUpdate, onDelete, onBack }: VehiclesViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [driverId, setDriverId] = useState('');
  const [mileage, setMileage] = useState('');

  const handleAdd = () => {
    if (!name || !plateNumber) return toast.error("تکایە ناو و ژمارەی تابلۆ پڕبکەرەوە");
    onSave({
      id: Date.now(),
      name,
      plateNumber,
      driverId: driverId ? parseInt(driverId) : undefined,
      status: 'active',
      mileage: parseInt(mileage || '0')
    });
    setShowAdd(false);
    setName('');
    setPlateNumber('');
    setDriverId('');
    setMileage('');
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">ئۆتۆمبێلەکان</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-slate-800 dark:bg-slate-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Plus size={18} /> ئۆتۆمبێلی نوێ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">زیادکردنی ئۆتۆمبێل</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="جۆر و مۆدێل (نموونە: تۆیۆتا هیلۆکس)" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="text" value={plateNumber} onChange={e => setPlateNumber(e.target.value)} placeholder="ژمارەی تابلۆ" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <select value={driverId} onChange={e => setDriverId(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
              <option value="">دیاریکردنی شۆفێر...</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            <input type="number" value={mileage} onChange={e => setMileage(e.target.value)} placeholder="کیلۆمەتر (Mileage)" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          </div>
          <button onClick={handleAdd} className="w-full bg-slate-800 dark:bg-slate-700 text-white p-3 rounded-xl font-bold">پاشەکەوتکردن</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map(v => (
          <div key={v.id} className="item-card group">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white transition-all">
                  <Truck size={28} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">{v.name}</h3>
                  <p className="text-[10px] font-mono bg-white/5 text-slate-400 px-2 py-1 rounded-lg inline-block mt-1 border border-white/5">{v.plateNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select 
                  value={v.status} 
                  onChange={e => onUpdate({...v, status: e.target.value as any})}
                  className={cn("text-[8px] px-2 py-1 rounded-full font-black uppercase outline-none transition-all", 
                    v.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : 
                    v.status === 'maintenance' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                  )}
                >
                  <option value="active">چالاک</option>
                  <option value="maintenance">چاککردنەوە</option>
                  <option value="inactive">ناچالاک</option>
                </select>
                {onDelete && (
                  <button 
                    onClick={async () => {
                      if (await customConfirm("ئایا دڵنیایت لە سڕینەوەی ئەم ئۆتۆمبێلە؟")) {
                        onDelete(v.id);
                      }
                    }} 
                    className="p-2 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="space-y-1">
                <p className="text-[10px] font-black theme-muted uppercase tracking-widest">شۆفێر</p>
                <p className="text-sm font-black text-white">{employees.find(e => e.id === v.driverId)?.name || 'دیارینەکراوە'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black theme-muted uppercase tracking-widest">کیلۆمەتر</p>
                <p className="text-sm font-black text-white">{v.mileage.toLocaleString()} KM</p>
              </div>
            </div>
          </div>
        ))}
        {vehicles.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
            <Truck size={48} className="mx-auto text-slate-700 mb-4 opacity-20" />
            <p className="text-slate-500 font-bold">هیچ ئۆتۆمبێلێک تۆمار نەکراوە</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
