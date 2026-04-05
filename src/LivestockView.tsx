import React, { useState } from 'react';
import { Animal, MilkingRecord, HealthRecord, Employee, FeedLog, VaccinationLog } from './types';
import { motion } from 'motion/react';
import { ChevronLeft, Plus, Trash2, Edit2, ClipboardCheck, Database, Milk, Syringe, Wheat } from 'lucide-react';
import { cn } from './lib/utils';

export function LivestockView({ animals, milkingRecords, healthRecords, feedLogs, vaccinationLogs, employees, onSave, onBack, initialTab = 'animals' }: { 
  animals: Animal[], 
  milkingRecords: MilkingRecord[], 
  healthRecords: HealthRecord[], 
  feedLogs: FeedLog[],
  vaccinationLogs: VaccinationLog[],
  employees: Employee[], 
  onSave: (animals: Animal[], milkingRecords: MilkingRecord[], healthRecords: HealthRecord[], feedLogs: FeedLog[], vaccinationLogs: VaccinationLog[]) => void, 
  onBack: () => void,
  initialTab?: 'animals' | 'milking' | 'health' | 'feed' | 'vaccination' | 'analysis'
}) {
  const [activeTab, setActiveTab] = useState<'animals' | 'milking' | 'health' | 'feed' | 'vaccination' | 'analysis'>(initialTab as any);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isCustomType, setIsCustomType] = useState(false);
  const [customType, setCustomType] = useState('');
  
  // Form states
  const [animalForm, setAnimalForm] = useState<Partial<Animal>>({ type: 'مانگا', status: 'تەندروست' });
  const [milkingForm, setMilkingForm] = useState<Partial<MilkingRecord>>({ date: new Date().toISOString().split('T')[0], shift: 'بەیانی' });
  const [healthForm, setHealthForm] = useState<Partial<HealthRecord>>({ date: new Date().toISOString().split('T')[0], status: 'نەخۆش' });
  const [feedForm, setFeedForm] = useState<Partial<FeedLog>>({ date: new Date().toISOString().split('T')[0] });
  const [vaccinationForm, setVaccinationForm] = useState<Partial<VaccinationLog>>({ date: new Date().toISOString().split('T')[0] });

  const handleAddAnimal = () => {
    if (!animalForm.name || !animalForm.tagNumber) return;
    const finalType = isCustomType ? customType : animalForm.type;
    if (!finalType) return;
    
    const newAnimal: Animal = {
      ...animalForm as Animal,
      type: finalType,
      id: Date.now(),
      weight: Number(animalForm.weight) || 0,
      birthDate: animalForm.birthDate || new Date().toISOString().split('T')[0],
      caretakerId: animalForm.caretakerId ? Number(animalForm.caretakerId) : undefined,
      milkerId: animalForm.milkerId ? Number(animalForm.milkerId) : undefined,
      cleanerId: animalForm.cleanerId ? Number(animalForm.cleanerId) : undefined
    };
    onSave([...animals, newAnimal], milkingRecords, healthRecords, feedLogs, vaccinationLogs);
    setShowAddModal(false);
    setAnimalForm({ type: 'مانگا', status: 'تەندروست' });
    setIsCustomType(false);
    setCustomType('');
  };

  const handleAddMilking = () => {
    if (!milkingForm.animalId || !milkingForm.amount) return;
    const newRecord: MilkingRecord = {
      ...milkingForm as MilkingRecord,
      id: Date.now(),
      animalId: Number(milkingForm.animalId),
      amount: Number(milkingForm.amount),
      shift: milkingForm.shift || 'بەیانی',
      milkerId: milkingForm.milkerId ? Number(milkingForm.milkerId) : undefined
    };
    onSave(animals, [...milkingRecords, newRecord], healthRecords, feedLogs, vaccinationLogs);
    setShowAddModal(false);
    setMilkingForm({ date: new Date().toISOString().split('T')[0], shift: 'بەیانی' });
  };

  const handleAddHealth = () => {
    if (!healthForm.animalId || !healthForm.diagnosis) return;
    const newRecord: HealthRecord = {
      ...healthForm as HealthRecord,
      id: Date.now(),
      animalId: Number(healthForm.animalId),
      status: healthForm.status || 'نەخۆش'
    };
    onSave(animals, milkingRecords, [...healthRecords, newRecord], feedLogs, vaccinationLogs);
    setShowAddModal(false);
    setHealthForm({ date: new Date().toISOString().split('T')[0] });
  };

  const handleAddFeed = () => {
    if (!feedForm.animalId || !feedForm.amount || !feedForm.cost) return;
    const newLog: FeedLog = {
      ...feedForm as FeedLog,
      id: Date.now(),
      animalId: Number(feedForm.animalId),
      amount: Number(feedForm.amount),
      cost: Number(feedForm.cost)
    };
    onSave(animals, milkingRecords, healthRecords, [...feedLogs, newLog], vaccinationLogs);
    setShowAddModal(false);
    setFeedForm({ date: new Date().toISOString().split('T')[0] });
  };

  const handleAddVaccination = () => {
    if (!vaccinationForm.animalId || !vaccinationForm.vaccineName) return;
    const newLog: VaccinationLog = {
      ...vaccinationForm as VaccinationLog,
      id: Date.now(),
      animalId: Number(vaccinationForm.animalId)
    };
    onSave(animals, milkingRecords, healthRecords, feedLogs, [...vaccinationLogs, newLog]);
    setShowAddModal(false);
    setVaccinationForm({ date: new Date().toISOString().split('T')[0] });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 text-slate-900 dark:text-slate-100">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <ChevronLeft size={20} /> گەڕانەوە
        </button>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> زیادکردن
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-4">بەڕێوەبردنی ئاژەڵان</h1>
      
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button onClick={() => setActiveTab('animals')} className={cn("px-4 py-2 rounded-lg transition-colors whitespace-nowrap", activeTab === 'animals' ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700")}>ئاژەڵەکان</button>
        <button onClick={() => setActiveTab('milking')} className={cn("px-4 py-2 rounded-lg transition-colors whitespace-nowrap", activeTab === 'milking' ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700")}>تۆماری شیر</button>
        <button onClick={() => setActiveTab('health')} className={cn("px-4 py-2 rounded-lg transition-colors whitespace-nowrap", activeTab === 'health' ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700")}>تۆماری تەندروستی</button>
        <button onClick={() => setActiveTab('feed')} className={cn("px-4 py-2 rounded-lg transition-colors whitespace-nowrap", activeTab === 'feed' ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700")}>تۆماری ئالیک</button>
        <button onClick={() => setActiveTab('vaccination')} className={cn("px-4 py-2 rounded-lg transition-colors whitespace-nowrap", activeTab === 'vaccination' ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700")}>کوتان</button>
        <button onClick={() => setActiveTab('analysis')} className={cn("px-4 py-2 rounded-lg transition-colors whitespace-nowrap", activeTab === 'analysis' ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700")}>شیکاری تێچوو</button>
      </div>

      {activeTab === 'animals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {animals.length === 0 && <p className="text-slate-500 dark:text-slate-400 col-span-full text-center py-10">هیچ ئاژەڵێک تۆمار نەکراوە</p>}
          {animals.map(animal => (
            <div key={animal.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-lg text-slate-900 dark:text-slate-100">{animal.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">جۆر: {animal.type} - ژمارە: {animal.tagNumber}</p>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 space-y-0.5">
                  {animal.caretakerId && <p>بەخێوکەر: {employees.find(e => e.id === animal.caretakerId)?.name}</p>}
                  {animal.milkerId && <p>دۆشەر: {employees.find(e => e.id === animal.milkerId)?.name}</p>}
                  {animal.cleanerId && <p>خاوێنکەرەوە: {employees.find(e => e.id === animal.cleanerId)?.name}</p>}
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">{animal.weight}kg</span>
                  <span className={cn("text-xs px-2 py-1 rounded-full", animal.status === 'تەندروست' ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400")}>{animal.status}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-slate-500">تێچووی ئالیک: <span className="font-bold text-slate-700 dark:text-slate-300">{feedLogs.filter(f => f.animalId === animal.id).reduce((sum, f) => sum + f.cost, 0).toLocaleString()}</span></p>
                </div>
              </div>
              <button onClick={() => onSave(animals.filter(a => a.id !== animal.id), milkingRecords, healthRecords, feedLogs, vaccinationLogs)} className="text-red-400 hover:text-red-600 p-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'milking' && (
        <div className="space-y-3">
          {milkingRecords.length === 0 && <p className="text-slate-500 dark:text-slate-400 text-center py-10">هیچ تۆمارێکی شیر نییە</p>}
          {milkingRecords.map(record => (
            <div key={record.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">ئاژەڵ: {animals.find(a => a.id === record.animalId)?.name || 'نادیار'}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">بڕ: <span className="text-blue-600 dark:text-blue-400 font-bold">{record.amount}</span> لیتر</p>
                {record.milkerId && <p className="text-xs text-slate-500 dark:text-slate-400">دۆشەر: {employees.find(e => e.id === record.milkerId)?.name}</p>}
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{record.date} - {record.shift}</p>
              </div>
              <button onClick={() => onSave(animals, milkingRecords.filter(r => r.id !== record.id), healthRecords, feedLogs, vaccinationLogs)} className="text-red-400 hover:text-red-600 p-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'health' && (
        <div className="space-y-3">
          {healthRecords.length === 0 && <p className="text-slate-500 dark:text-slate-400 text-center py-10">هیچ تۆمارێکی تەندروستی نییە</p>}
          {healthRecords.map(record => (
            <div key={record.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">ئاژەڵ: {animals.find(a => a.id === record.animalId)?.name || 'نادیار'}</p>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">نەخۆشی: {record.diagnosis}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">چارەسەر: {record.treatment}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{record.date}</p>
              </div>
              <button onClick={() => onSave(animals, milkingRecords, healthRecords.filter(r => r.id !== record.id), feedLogs, vaccinationLogs)} className="text-red-400 hover:text-red-600 p-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'feed' && (
        <div className="space-y-3">
          {feedLogs.length === 0 && <p className="text-slate-500 dark:text-slate-400 text-center py-10">هیچ تۆمارێکی ئالیک نییە</p>}
          {feedLogs.map(log => (
            <div key={log.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">ئاژەڵ: {animals.find(a => a.id === log.animalId)?.name || 'نادیار'}</p>
                <p className="text-sm text-slate-500">جۆر: {log.feedType} - بڕ: {log.amount}kg</p>
                <p className="text-xs text-emerald-600 font-bold">تێچوو: {log.cost.toLocaleString()}</p>
                <p className="text-xs text-slate-400 mt-1">{log.date}</p>
              </div>
              <button onClick={() => onSave(animals, milkingRecords, healthRecords, feedLogs.filter(f => f.id !== log.id), vaccinationLogs)} className="text-red-400 hover:text-red-600 p-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'vaccination' && (
        <div className="space-y-3">
          {vaccinationLogs.length === 0 && <p className="text-slate-500 dark:text-slate-400 text-center py-10">هیچ تۆمارێکی کوتان نییە</p>}
          {vaccinationLogs.map(log => (
            <div key={log.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">ئاژەڵ: {animals.find(a => a.id === log.animalId)?.name || 'نادیار'}</p>
                <p className="text-sm text-blue-600 font-bold">ڤاکسین: {log.vaccineName}</p>
                {log.nextDueDate && <p className="text-[10px] text-amber-600">کاتی کوتانی داهاتوو: {log.nextDueDate}</p>}
                <p className="text-xs text-slate-400 mt-1">{log.date}</p>
              </div>
              <button onClick={() => onSave(animals, milkingRecords, healthRecords, feedLogs, vaccinationLogs.filter(v => v.id !== log.id))} className="text-red-400 hover:text-red-600 p-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 mb-1 uppercase font-bold tracking-wider">کۆی تێچووی ئالیک</p>
              <h3 className="text-2xl font-black text-red-600">{feedLogs.reduce((sum, f) => sum + f.cost, 0).toLocaleString()}</h3>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 mb-1 uppercase font-bold tracking-wider">کۆی بەرهەمی شیر</p>
              <h3 className="text-2xl font-black text-blue-600">{milkingRecords.reduce((sum, m) => sum + m.amount, 0).toLocaleString()} <span className="text-sm font-normal">لیتر</span></h3>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 mb-1 uppercase font-bold tracking-wider">تێچووی هەر لیترێک</p>
              <h3 className="text-2xl font-black text-emerald-600">
                {milkingRecords.reduce((sum, m) => sum + m.amount, 0) > 0 
                  ? (feedLogs.reduce((sum, f) => sum + f.cost, 0) / milkingRecords.reduce((sum, m) => sum + m.amount, 0)).toFixed(2)
                  : 0}
              </h3>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 mb-1 uppercase font-bold tracking-wider">ئاژەڵی نەخۆش</p>
              <h3 className="text-2xl font-black text-orange-600">{animals.filter(a => a.status === 'نەخۆش').length}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <h3 className="font-bold text-sm">شیکاری بەپێی جۆر</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {Array.from(new Set(animals.map(a => a.type))).map(type => {
                    const typeAnimals = animals.filter(a => a.type === type);
                    const typeMilk = milkingRecords.filter(m => {
                      const animal = animals.find(a => a.id === m.animalId);
                      return animal?.type === type;
                    }).reduce((sum, m) => sum + m.amount, 0);
                    const typeFeedCost = feedLogs.filter(f => {
                      const animal = animals.find(a => a.id === f.animalId);
                      return animal?.type === type;
                    }).reduce((sum, f) => sum + f.cost, 0);
                    const sickCount = typeAnimals.filter(a => a.status === 'نەخۆش').length;

                    return (
                      <div key={type} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-black text-lg">{type}</h4>
                          <span className="text-xs font-bold px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">{typeAnimals.length} سەر</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">شیر</p>
                            <p className="text-sm font-black text-blue-600">{typeMilk.toLocaleString()}L</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">تێچوو</p>
                            <p className="text-sm font-black text-red-600">{typeFeedCost.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">نەخۆش</p>
                            <p className="text-sm font-black text-orange-600">{sickCount}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <h3 className="font-bold text-sm">بەرهەمی شیر بەپێی ئاژەڵ</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/30 text-slate-500">
                      <th className="p-4 font-bold">ئاژەڵ</th>
                      <th className="p-4 font-bold">تێچووی ئالیک</th>
                      <th className="p-4 font-bold">بەرهەمی شیر</th>
                      <th className="p-4 font-bold">تێچوو/لیتر</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {animals.map(animal => {
                      const animalFeedCost = feedLogs.filter(f => f.animalId === animal.id).reduce((sum, f) => sum + f.cost, 0);
                      const animalMilk = milkingRecords.filter(m => m.animalId === animal.id).reduce((sum, m) => sum + m.amount, 0);
                      return (
                        <tr key={animal.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-4 font-bold">{animal.name}</td>
                          <td className="p-4 text-red-600">{animalFeedCost.toLocaleString()}</td>
                          <td className="p-4 text-blue-600">{animalMilk.toLocaleString()}</td>
                          <td className="p-4 font-black text-emerald-600">
                            {animalMilk > 0 ? (animalFeedCost / animalMilk).toFixed(2) : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-xl dark:shadow-none border dark:border-slate-800">
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-50">
              {activeTab === 'animals' ? 'زیادکردنی ئاژەڵ' : 
               activeTab === 'milking' ? 'تۆمارکردنی شیر' : 
               activeTab === 'health' ? 'تۆماری تەندروستی' :
               activeTab === 'feed' ? 'تۆماری ئالیک' : 'تۆماری کوتان'}
            </h2>
            
            <div className="space-y-4">
              {activeTab === 'animals' && (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                  <input type="text" placeholder="ناوی ئاژەڵ" className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" value={animalForm.name || ''} onChange={e => setAnimalForm({ ...animalForm, name: e.target.value })} />
                  <input type="text" placeholder="ژمارەی تاگ" className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" value={animalForm.tagNumber || ''} onChange={e => setAnimalForm({ ...animalForm, tagNumber: e.target.value })} />
                  <div className="grid grid-cols-2 gap-2">
                    <select 
                      className="p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" 
                      value={isCustomType ? 'other' : animalForm.type} 
                      onChange={e => {
                        if (e.target.value === 'other') {
                          setIsCustomType(true);
                        } else {
                          setIsCustomType(false);
                          setAnimalForm({ ...animalForm, type: e.target.value as any });
                        }
                      }}
                    >
                      <option value="مانگا">مانگا</option>
                      <option value="مەڕ">مەڕ</option>
                      <option value="بزن">بزن</option>
                      <option value="other">تر...</option>
                    </select>
                    <select className="p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" value={animalForm.gender || ''} onChange={e => setAnimalForm({ ...animalForm, gender: e.target.value as any })}>
                      <option value="">ڕەگەز</option>
                      <option value="نێر">نێر</option>
                      <option value="مێ">مێ</option>
                    </select>
                  </div>
                  {isCustomType && (
                    <input 
                      type="text" 
                      placeholder="جۆری ئاژەڵ بنوسە" 
                      className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" 
                      value={customType} 
                      onChange={e => setCustomType(e.target.value)} 
                    />
                  )}
                  <input type="text" placeholder="نەژاد (Breed)" className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" value={animalForm.breed || ''} onChange={e => setAnimalForm({ ...animalForm, breed: e.target.value })} />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 px-1">بەرواری لەدایکبوون</label>
                      <input type="date" className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" value={animalForm.birthDate || ''} onChange={e => setAnimalForm({ ...animalForm, birthDate: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 px-1">کێش (kg)</label>
                      <input type="number" placeholder="کێش (kg)" className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" value={animalForm.weight || ''} onChange={e => setAnimalForm({ ...animalForm, weight: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 px-1">بەرواری کڕین</label>
                      <input type="date" className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" value={animalForm.purchaseDate || ''} onChange={e => setAnimalForm({ ...animalForm, purchaseDate: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 px-1">نرخی کڕین</label>
                      <input type="number" placeholder="نرخ" className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" value={animalForm.purchasePrice || ''} onChange={e => setAnimalForm({ ...animalForm, purchasePrice: Number(e.target.value) })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="تاگی دایک" className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" value={animalForm.motherId || ''} onChange={e => setAnimalForm({ ...animalForm, motherId: e.target.value })} />
                    <input type="text" placeholder="تاگی باوک" className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" value={animalForm.fatherId || ''} onChange={e => setAnimalForm({ ...animalForm, fatherId: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <select className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" value={animalForm.caretakerId || ''} onChange={e => setAnimalForm({ ...animalForm, caretakerId: Number(e.target.value) })}>
                      <option value="">هەڵبژاردنی بەخێوکەر</option>
                      {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                    <select className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" value={animalForm.milkerId || ''} onChange={e => setAnimalForm({ ...animalForm, milkerId: Number(e.target.value) })}>
                      <option value="">هەڵبژاردنی دۆشەر</option>
                      {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                    <select className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" value={animalForm.cleanerId || ''} onChange={e => setAnimalForm({ ...animalForm, cleanerId: Number(e.target.value) })}>
                      <option value="">هەڵبژاردنی خاوێنکەرەوە</option>
                      {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                  </div>
                  <select className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" value={animalForm.status} onChange={e => setAnimalForm({ ...animalForm, status: e.target.value as any })}>
                    <option value="تەندروست">تەندروست</option>
                    <option value="نەخۆش">نەخۆش</option>
                    <option value="چارەسەر">لەژێر چارەسەر</option>
                  </select>
                  <button onClick={handleAddAnimal} className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold active:scale-95 transition-transform mt-2">پاشکەوتکردن</button>
                </div>
              )}

              {activeTab === 'milking' && (
                <>
                  <select className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" value={milkingForm.animalId || ''} onChange={e => setMilkingForm({ ...milkingForm, animalId: e.target.value })}>
                    <option value="">هەڵبژاردنی ئاژەڵ</option>
                    {animals.map(a => <option key={a.id} value={a.id}>{a.name} ({a.tagNumber})</option>)}
                  </select>
                  <input type="number" placeholder="بڕی شیر (لیتر)" className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" value={milkingForm.amount || ''} onChange={e => setMilkingForm({ ...milkingForm, amount: e.target.value })} />
                  <select className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" value={milkingForm.milkerId || ''} onChange={e => setMilkingForm({ ...milkingForm, milkerId: Number(e.target.value) })}>
                    <option value="">هەڵبژاردنی دۆشەر</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" className="p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" value={milkingForm.date || ''} onChange={e => setMilkingForm({ ...milkingForm, date: e.target.value })} />
                    <select className="p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" value={milkingForm.shift} onChange={e => setMilkingForm({ ...milkingForm, shift: e.target.value as any })}>
                      <option value="بەیانی">بەیانی</option>
                      <option value="ئێوارە">ئێوارە</option>
                    </select>
                  </div>
                  <button onClick={handleAddMilking} className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold active:scale-95 transition-transform">پاشکەوتکردن</button>
                </>
              )}

              {activeTab === 'health' && (
                <>
                  <select className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100" value={healthForm.animalId || ''} onChange={e => setHealthForm({ ...healthForm, animalId: e.target.value })}>
                    <option value="">هەڵبژاردنی ئاژەڵ</option>
                    {animals.map(a => <option key={a.id} value={a.id}>{a.name} ({a.tagNumber})</option>)}
                  </select>
                  <input type="text" placeholder="دەستنیشانکردنی نەخۆشی" className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100" value={healthForm.diagnosis || ''} onChange={e => setHealthForm({ ...healthForm, diagnosis: e.target.value })} />
                  <textarea placeholder="چارەسەر" className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100" rows={3} value={healthForm.treatment || ''} onChange={e => setHealthForm({ ...healthForm, treatment: e.target.value })} />
                  <input type="date" className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100" value={healthForm.date || ''} onChange={e => setHealthForm({ ...healthForm, date: e.target.value })} />
                  <button onClick={handleAddHealth} className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold">پاشکەوتکردن</button>
                </>
              )}

              {activeTab === 'feed' && (
                <>
                  <select className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100" value={feedForm.animalId || ''} onChange={e => setFeedForm({ ...feedForm, animalId: e.target.value })}>
                    <option value="">هەڵبژاردنی ئاژەڵ</option>
                    {animals.map(a => <option key={a.id} value={a.id}>{a.name} ({a.tagNumber})</option>)}
                  </select>
                  <input type="text" placeholder="جۆری ئالیک" className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100" value={feedForm.feedType || ''} onChange={e => setFeedForm({ ...feedForm, feedType: e.target.value })} />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" placeholder="بڕ (kg)" className="p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100" value={feedForm.amount || ''} onChange={e => setFeedForm({ ...feedForm, amount: e.target.value })} />
                    <input type="number" placeholder="تێچوو" className="p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100" value={feedForm.cost || ''} onChange={e => setFeedForm({ ...feedForm, cost: e.target.value })} />
                  </div>
                  <input type="date" className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100" value={feedForm.date || ''} onChange={e => setFeedForm({ ...feedForm, date: e.target.value })} />
                  <button onClick={handleAddFeed} className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold">پاشکەوتکردن</button>
                </>
              )}

              {activeTab === 'vaccination' && (
                <>
                  <select className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100" value={vaccinationForm.animalId || ''} onChange={e => setVaccinationForm({ ...vaccinationForm, animalId: e.target.value })}>
                    <option value="">هەڵبژاردنی ئاژەڵ</option>
                    {animals.map(a => <option key={a.id} value={a.id}>{a.name} ({a.tagNumber})</option>)}
                  </select>
                  <input type="text" placeholder="ناوی ڤاکسین" className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100" value={vaccinationForm.vaccineName || ''} onChange={e => setVaccinationForm({ ...vaccinationForm, vaccineName: e.target.value })} />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-1">بەرواری کوتان</label>
                      <input type="date" className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100" value={vaccinationForm.date || ''} onChange={e => setVaccinationForm({ ...vaccinationForm, date: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-1">کوتانی داهاتوو</label>
                      <input type="date" className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100" value={vaccinationForm.nextDueDate || ''} onChange={e => setVaccinationForm({ ...vaccinationForm, nextDueDate: e.target.value })} />
                    </div>
                  </div>
                  <button onClick={handleAddVaccination} className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold">پاشکەوتکردن</button>
                </>
              )}

              <button onClick={() => setShowAddModal(false)} className="w-full text-slate-500 dark:text-slate-400 p-2 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">پاشگەزبوونەوە</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
