import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Plus, 
  Edit2 
} from 'lucide-react';
import { toast } from 'sonner';
import { Driver, Vehicle } from '../../types';

interface DriversViewProps {
  drivers: Driver[];
  vehicles: Vehicle[];
  onSave: (d: Driver) => void;
  onUpdate: (d: Driver) => void;
  onBack: () => void;
}

export function DriversView({ drivers, vehicles, onSave, onUpdate, onBack }: DriversViewProps) {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drivers.map(d => {
          if (editingDriver?.id === d.id) {
            return (
              <div key={d.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="font-bold text-slate-700 dark:text-slate-300">دەستکاریکردنی {d.name}</h3>
                <div className="grid grid-cols-1 gap-4">
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} placeholder="ناوی شۆفێر" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                  <input type="text" value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="ژمارەی تەلەفۆن" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                  <input type="text" value={editLicense} onChange={e => setEditLicense(e.target.value)} placeholder="ژمارەی مۆڵەت" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                  <select value={editVehicleId} onChange={e => setEditVehicleId(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                    <option value="">ئۆتۆمبێل هەڵبژێرە</option>
                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleUpdate} className="flex-1 bg-emerald-600 text-white p-3 rounded-xl font-bold">نوێکردنەوە</button>
                  <button onClick={() => setEditingDriver(null)} className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 p-3 rounded-xl font-bold">هەڵوەشاندنەوە</button>
                </div>
              </div>
            );
          }
          return (
            <div key={d.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{d.name}</h3>
                  <p className="text-sm text-slate-500">{d.phone}</p>
                </div>
                <button onClick={() => startEdit(d)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400">
                  <Edit2 size={18} />
                </button>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>مۆڵەت: {d.licenseNumber || 'دیارینەکراوە'}</span>
                <span>ئۆتۆمبێل: <span className="font-bold text-slate-700 dark:text-slate-300">{vehicles.find(v => v.id === d.vehicleId)?.name || 'نییە'}</span></span>
              </div>
            </div>
          );
        })}
        {drivers.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">هیچ شۆفێرێک تۆمار نەکراوە</div>
        )}
      </div>
    </motion.div>
  );
}
