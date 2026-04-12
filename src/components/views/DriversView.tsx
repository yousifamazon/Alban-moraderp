import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Plus, 
  Edit2,
  Trash2 
} from 'lucide-react';
import { toast } from 'sonner';
import { Driver, Vehicle } from '../../types';
import { customConfirm } from '../../lib/utils';

interface DriversViewProps {
  drivers: Driver[];
  vehicles: Vehicle[];
  onSave: (d: Driver) => void;
  onUpdate: (d: Driver) => void;
  onDelete?: (id: number) => void;
  onBack: () => void;
}

export function DriversView({ drivers, vehicles, onSave, onUpdate, onDelete, onBack }: DriversViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehicleId, setVehicleId] = useState<string>('');
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLicense, setEditLicense] = useState('');
  const [editVehicleId, setEditVehicleId] = useState<string>('');

  const handleAdd = () => {
    if (!name || !phone) return toast.error("تکایە ناو و ژمارەی تەلەفۆن پڕبکەرەوە");
    onSave({
      id: Date.now(),
      name,
      phone,
      licenseNumber,
      status: 'active',
      vehicleId: vehicleId ? Number(vehicleId) : undefined
    });
    setShowAdd(false);
    setName('');
    setPhone('');
    setLicenseNumber('');
    setVehicleId('');
  };

  const startEdit = (d: Driver) => {
    setEditingDriver(d);
    setEditName(d.name);
    setEditPhone(d.phone);
    setEditLicense(d.licenseNumber);
    setEditVehicleId(d.vehicleId?.toString() || '');
  };

  const handleUpdate = () => {
    if (!editingDriver) return;
    onUpdate({
      ...editingDriver,
      name: editName,
      phone: editPhone,
      licenseNumber: editLicense,
      vehicleId: editVehicleId ? Number(editVehicleId) : undefined
    });
    setEditingDriver(null);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">شۆفێرەکان</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-slate-800 dark:bg-slate-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Plus size={18} /> شۆفێری نوێ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">زیادکردنی شۆفێر</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ناوی شۆفێر" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="ژمارەی تەلەفۆن" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="text" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} placeholder="ژمارەی مۆڵەت" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <select value={vehicleId} onChange={e => setVehicleId(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
              <option value="">ئۆتۆمبێل هەڵبژێرە</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <button onClick={handleAdd} className="w-full bg-slate-800 dark:bg-slate-700 text-white p-3 rounded-xl font-bold">پاشەکەوتکردن</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map(d => {
          if (editingDriver?.id === d.id) {
            return (
              <div key={d.id} className="item-card bg-slate-900 border-emerald-500/30">
                <h3 className="font-black text-lg text-white mb-4">دەستکاریکردنی {d.name}</h3>
                <div className="space-y-4">
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} placeholder="ناوی شۆفێر" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-sm font-bold text-white" />
                  <input type="text" value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="ژمارەی تەلەفۆن" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-sm font-bold text-white" />
                  <input type="text" value={editLicense} onChange={e => setEditLicense(e.target.value)} placeholder="ژمارەی مۆڵەت" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-sm font-bold text-white" />
                  <select value={editVehicleId} onChange={e => setEditVehicleId(e.target.value)} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-sm font-bold text-white">
                    <option value="">ئۆتۆمبێل هەڵبژێرە</option>
                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={handleUpdate} className="flex-1 bg-emerald-600 text-white p-4 rounded-2xl font-black text-sm active:scale-95 transition-all">نوێکردنەوە</button>
                  <button onClick={() => setEditingDriver(null)} className="flex-1 bg-white/5 text-slate-400 p-4 rounded-2xl font-black text-sm active:scale-95 transition-all">پاشگەزبوونەوە</button>
                </div>
              </div>
            );
          }
          return (
            <div key={d.id} className="item-card group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white transition-all">
                    <Plus size={28} className="rotate-45" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-white">{d.name}</h3>
                    <p className="text-[10px] font-bold theme-muted mt-1">{d.phone}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(d)} className="p-2 bg-white/5 hover:bg-blue-500/20 text-slate-400 hover:text-blue-500 rounded-xl transition-all">
                    <Edit2 size={16} />
                  </button>
                  {onDelete && (
                    <button 
                      onClick={async () => {
                        if (await customConfirm("ئایا دڵنیایت لە سڕینەوەی ئەم شۆفێرە؟")) {
                          onDelete(d.id);
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
                  <p className="text-[10px] font-black theme-muted uppercase tracking-widest">مۆڵەت</p>
                  <p className="text-sm font-black text-white">{d.licenseNumber || 'دیارینەکراوە'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black theme-muted uppercase tracking-widest">ئۆتۆمبێل</p>
                  <p className="text-sm font-black text-white">{vehicles.find(v => v.id === d.vehicleId)?.name || 'نییە'}</p>
                </div>
              </div>
              
              <div className="mt-2">
                <span className={cn(
                  "text-[8px] font-black uppercase px-2 py-1 rounded-full",
                  d.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                )}>
                  {d.status === 'active' ? 'چالاک' : 'ناچالاک'}
                </span>
              </div>
            </div>
          );
        })}
        {drivers.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
            <Plus size={48} className="mx-auto text-slate-700 mb-4 opacity-20" />
            <p className="text-slate-500 font-bold">هیچ شۆفێرێک تۆمار نەکراوە</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
