import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Plus 
} from 'lucide-react';
import { toast } from 'sonner';
import { Vehicle, Employee } from '../../types';
import { cn } from '../../lib/utils';

interface VehiclesViewProps {
  vehicles: Vehicle[];
  employees: Employee[];
  onSave: (v: Vehicle) => void;
  onUpdate: (v: Vehicle) => void;
  onBack: () => void;
}

export function VehiclesView({ vehicles, employees, onSave, onUpdate, onBack }: VehiclesViewProps) {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map(v => (
          <div key={v.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{v.name}</h3>
                <p className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg inline-block mt-1">{v.plateNumber}</p>
              </div>
              <select 
                value={v.status} 
                onChange={e => onUpdate({...v, status: e.target.value as any})}
                className={cn("text-xs px-2 py-1 rounded-full font-bold outline-none", 
                  v.status === 'active' ? "bg-emerald-100 text-emerald-700" : 
                  v.status === 'maintenance' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                )}
              >
                <option value="active">چالاک</option>
                <option value="maintenance">لە چاککردنەوەدایە</option>
                <option value="inactive">لەکارکەوتوو</option>
              </select>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>شۆفێر: <span className="font-bold text-slate-700 dark:text-slate-300">{employees.find(e => e.id === v.driverId)?.name || 'دیارینەکراوە'}</span></span>
              <span>{v.mileage.toLocaleString()} KM</span>
            </div>
          </div>
        ))}
        {vehicles.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">هیچ ئۆتۆمبێلێک تۆمار نەکراوە</div>
        )}
      </div>
    </motion.div>
  );
}
