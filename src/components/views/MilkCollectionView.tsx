import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Milk, 
  Plus, 
  Search, 
  Calendar, 
  User, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  ChevronLeft,
  Users,
  History,
  TrendingUp,
  MapPin,
  Phone,
  Save,
  X
} from 'lucide-react';
import { ERPData, Farmer, MilkCollection } from '../../types';
import { toast } from 'sonner';
import { cn, customConfirm } from '../../lib/utils';

interface MilkCollectionViewProps {
  data: ERPData;
  onUpdateData: (newData: ERPData) => void;
  saveToFirebase: (colName: string, item: any) => void;
  deleteFromFirebase: (colName: string, id: string | number) => void;
  onBack: () => void;
}

export function MilkCollectionView({ data, onUpdateData, saveToFirebase, deleteFromFirebase, onBack }: MilkCollectionViewProps) {
  const [activeTab, setActiveTab] = useState<'collections' | 'farmers' | 'history'>('collections');
  const [isAddingFarmer, setIsAddingFarmer] = useState(false);
  const [editingFarmerId, setEditingFarmerId] = useState<number | null>(null);
  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // New Farmer State
  const [newFarmer, setNewFarmer] = useState<Partial<Farmer>>({
    name: '',
    phone: '',
    address: '',
    milkPrice: 1000
  });

  // New Collection State
  const [newCollection, setNewCollection] = useState<Partial<MilkCollection>>({
    farmerId: 0,
    quantity: 0,
    pricePerLiter: 0,
    date: new Date().toISOString().split('T')[0],
    status: 'collected',
    note: ''
  });

  const farmers = data.farmers || [];
  const collections = data.milkCollections || [];

  const handleAddFarmer = () => {
    if (!newFarmer.name || !newFarmer.phone) {
      toast.error('تکایە ناو و مۆبایل بنووسە');
      return;
    }

    if (editingFarmerId) {
      const updatedFarmer = { 
        ...farmers.find(f => f.id === editingFarmerId)!, 
        name: newFarmer.name!, 
        phone: newFarmer.phone!, 
        address: newFarmer.address, 
        milkPrice: newFarmer.milkPrice || 1000 
      };
      const updatedFarmers = farmers.map(f => f.id === editingFarmerId ? updatedFarmer : f);
      const newData = { ...data, farmers: updatedFarmers };
      onUpdateData(newData);
      saveToFirebase('farmers', updatedFarmer);
      toast.success('زانیارییەکان نوێکرانەوە');
    } else {
      const farmer: Farmer = {
        id: Date.now(),
        name: newFarmer.name!,
        phone: newFarmer.phone!,
        address: newFarmer.address,
        milkPrice: newFarmer.milkPrice || 1000
      };

      const newData = { ...data, farmers: [...farmers, farmer] };
      onUpdateData(newData);
      saveToFirebase('farmers', farmer);
      toast.success('فەلاحی نوێ زیادکرا');
    }

    setIsAddingFarmer(false);
    setEditingFarmerId(null);
    setNewFarmer({ name: '', phone: '', address: '', milkPrice: 1000 });
  };

  const handleEditFarmer = (farmer: Farmer) => {
    setNewFarmer({
      name: farmer.name,
      phone: farmer.phone,
      address: farmer.address,
      milkPrice: farmer.milkPrice
    });
    setEditingFarmerId(farmer.id);
    setIsAddingFarmer(true);
  };

  const handleAddCollection = () => {
    if (!newCollection.farmerId || !newCollection.quantity) {
      toast.error('تکایە فەلاح و بڕی شیر دیاری بکە');
      return;
    }

    const farmer = farmers.find(f => f.id === Number(newCollection.farmerId));
    if (!farmer) return;

    const collection: MilkCollection = {
      id: Date.now(),
      farmerId: farmer.id,
      farmerName: farmer.name,
      quantity: Number(newCollection.quantity),
      pricePerLiter: Number(newCollection.pricePerLiter || farmer.milkPrice),
      totalPrice: Number(newCollection.quantity) * Number(newCollection.pricePerLiter || farmer.milkPrice),
      date: newCollection.date || new Date().toISOString().split('T')[0],
      status: 'collected',
      note: newCollection.note
    };

    const newData = { ...data, milkCollections: [collection, ...collections] };
    onUpdateData(newData);
    saveToFirebase('milkCollections', collection);
    setIsAddingCollection(false);
    setNewCollection({ farmerId: 0, quantity: 0, pricePerLiter: 0, date: new Date().toISOString().split('T')[0], status: 'collected', note: '' });
    toast.success('کۆکردنەوەی شیر تۆمارکرا');
  };

  const handleDeleteFarmer = async (id: number) => {
    if (await customConfirm('ئایا دڵنیایت لە سڕینەوەی ئەم فەلاحە؟')) {
      const newData = { ...data, farmers: farmers.filter(f => f.id !== id) };
      onUpdateData(newData);
      deleteFromFirebase('farmers', id);
      toast.success('فەلاحەکە سڕایەوە');
    }
  };

  const handleDeleteCollection = (id: number) => {
    const newData = {
      ...data,
      milkCollections: collections.filter(c => c.id !== id)
    };
    onUpdateData(newData);
    deleteFromFirebase('milkCollections', id);
    toast.success('تۆمارەکە سڕایەوە');
  };

  const updateCollectionStatus = (id: number, status: 'collected' | 'delivered') => {
    const collection = collections.find(c => c.id === id);
    if (!collection) return;
    
    const updatedCollection = { ...collection, status };
    const newData = {
      ...data,
      milkCollections: collections.map(c => c.id === id ? updatedCollection : c)
    };
    onUpdateData(newData);
    saveToFirebase('milkCollections', updatedCollection);
    toast.success(status === 'delivered' ? 'گەیاندن بۆ کارگە تۆمارکرا' : 'بۆ باری کۆکراوە گەڕێندرایەوە');
  };

  const filteredFarmers = farmers.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.phone.includes(searchTerm)
  );

  const totalMilkToday = collections
    .filter(c => c.date === new Date().toISOString().split('T')[0])
    .reduce((sum, c) => sum + c.quantity, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto pb-20 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <Milk size={32} className="text-blue-500" />
              کۆکردنەوەی شیر
            </h2>
            <p className="text-[10px] font-bold theme-muted uppercase tracking-widest mt-1">بەڕێوەبردنی وەرگرتنی شیر لە فەلاحەکان و گەیاندن بە کارگە</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsAddingCollection(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all"
          >
            <Plus size={18} />
            تۆمارکردنی شیر
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Milk size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black theme-muted uppercase tracking-widest">شیری ئەمڕۆ</p>
              <h4 className="text-2xl font-black">{totalMilkToday} <span className="text-sm">لیتر</span></h4>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black theme-muted uppercase tracking-widest">کۆی فەلاحەکان</p>
              <h4 className="text-2xl font-black">{farmers.length} <span className="text-sm">کەس</span></h4>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black theme-muted uppercase tracking-widest">کۆی گشتی شیر</p>
              <h4 className="text-2xl font-black">{collections.reduce((sum, c) => sum + c.quantity, 0)} <span className="text-sm">لیتر</span></h4>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8 w-fit">
        <button 
          onClick={() => setActiveTab('collections')}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs transition-all",
            activeTab === 'collections' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
          )}
        >
          <Milk size={16} />
          کۆکراوەکان
        </button>
        <button 
          onClick={() => setActiveTab('farmers')}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs transition-all",
            activeTab === 'farmers' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
          )}
        >
          <Users size={16} />
          فەلاحەکان
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs transition-all",
            activeTab === 'history' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
          )}
        >
          <History size={16} />
          مێژوو
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'collections' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-black flex items-center gap-2 px-2">
                <Clock size={20} className="text-blue-500" />
                کۆکراوەکانی ئەمڕۆ
              </h3>
              <div className="space-y-3">
                {collections.filter(c => c.date === new Date().toISOString().split('T')[0]).map(collection => (
                  <div key={collection.id} className="bg-slate-900 p-6 rounded-[2rem] border border-white/10 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-500">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="font-black text-sm">{collection.farmerName}</h4>
                        <p className="text-[10px] font-bold text-slate-400">{collection.quantity} لیتر - {collection.pricePerLiter.toLocaleString()} دینار</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <p className="text-sm font-black">{collection.totalPrice.toLocaleString()} دینار</p>
                        <span className={cn(
                          "text-[8px] font-black uppercase px-2 py-1 rounded-full",
                          collection.status === 'delivered' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                        )}>
                          {collection.status === 'delivered' ? 'گەیشتووە' : 'کۆکراوەتەوە'}
                        </span>
                      </div>
                      {collection.status === 'collected' && (
                        <button 
                          onClick={() => updateCollectionStatus(collection.id, 'delivered')}
                          className="p-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                          title="گەیاندن بۆ کارگە"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                      )}
                      <button 
                        onClick={async () => {
                          if (await customConfirm("ئایا دڵنیایت لە سڕینەوەی ئەم تۆمارە؟")) {
                            handleDeleteCollection(collection.id);
                          }
                        }}
                        className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                        title="سڕینەوە"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {collections.filter(c => c.date === new Date().toISOString().split('T')[0]).length === 0 && (
                  <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <Milk size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-400 font-bold">هیچ کۆکردنەوەیەک بۆ ئەمڕۆ تۆمار نەکراوە</p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/10 shadow-sm sticky top-8">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                  <Plus size={20} className="text-blue-500" />
                  تۆمارکردنی نوێ
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">فەلاح</label>
                    <select 
                      value={newCollection.farmerId}
                      onChange={(e) => {
                        const fid = Number(e.target.value);
                        const f = farmers.find(farmer => farmer.id === fid);
                        setNewCollection({ ...newCollection, farmerId: fid, pricePerLiter: f?.milkPrice || 0 });
                      }}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-sm font-bold"
                    >
                      <option value="0">دیاریکردنی فەلاح...</option>
                      {farmers.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">بڕ (لیتر)</label>
                      <input 
                        type="number"
                        value={isNaN(newCollection.quantity ?? NaN) ? '' : newCollection.quantity}
                        onChange={(e) => setNewCollection({ ...newCollection, quantity: Number(e.target.value) })}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-sm font-bold"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">نرخ (لیتر)</label>
                      <input 
                        type="number"
                        value={isNaN(newCollection.pricePerLiter ?? NaN) ? '' : newCollection.pricePerLiter}
                        onChange={(e) => setNewCollection({ ...newCollection, pricePerLiter: Number(e.target.value) })}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-sm font-bold"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">ڕێکەوت</label>
                    <input 
                      type="date"
                      value={newCollection.date}
                      onChange={(e) => setNewCollection({ ...newCollection, date: e.target.value })}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-sm font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">تێبینی</label>
                    <textarea 
                      value={newCollection.note}
                      onChange={(e) => setNewCollection({ ...newCollection, note: e.target.value })}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-sm font-bold min-h-[100px]"
                      placeholder="تێبینی بنووسە..."
                    />
                  </div>
                  <button 
                    onClick={handleAddCollection}
                    className="w-full py-4 bg-blue-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95"
                  >
                    تۆمارکردن
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'farmers' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="گەڕان بۆ فەلاح..."
                  className="w-full pr-12 pl-4 py-4 bg-slate-900 border border-white/10 rounded-2xl outline-none text-sm font-bold shadow-sm"
                />
              </div>
              <button 
                onClick={() => setIsAddingFarmer(true)}
                className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
              >
                <Plus size={18} />
                زیادکردنی فەلاح
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFarmers.map(farmer => (
                <div key={farmer.id} className="bg-slate-900 p-6 rounded-[2.5rem] border border-white/10 shadow-sm space-y-4 relative group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-500">
                      <User size={28} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black">{farmer.name}</h4>
                      <p className="text-xs font-bold text-slate-400">{farmer.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <MapPin size={14} />
                      {farmer.address || 'ناونیشان دیاری نەکراوە'}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Milk size={14} />
                      نرخی شیر: {farmer.milkPrice.toLocaleString()} دینار
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <button 
                      onClick={() => handleEditFarmer(farmer)}
                      className="flex-1 py-3 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all font-bold text-xs flex items-center justify-center gap-2"
                    >
                      دەستکاری
                    </button>
                    <button 
                      onClick={() => handleDeleteFarmer(farmer.id)}
                      className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <Trash2 size={14} />
                      سڕینەوە
                    </button>
                  </div>
                </div>
              ))}
              {filteredFarmers.length === 0 && (
                <div className="col-span-full text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                  <Users size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-400 font-bold">هیچ فەلاحێک نەدۆزرایەوە</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map(collection => (
              <div key={collection.id} className="item-card group">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-500">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-white">{collection.farmerName}</h4>
                      <p className="text-[10px] font-bold theme-muted flex items-center gap-1">
                        <Calendar size={10} /> {collection.date}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[8px] font-black uppercase px-2 py-1 rounded-full",
                    collection.status === 'delivered' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                  )}>
                    {collection.status === 'delivered' ? 'گەیشتووە' : 'کۆکراوەتەوە'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black theme-muted uppercase tracking-widest">بڕ (لیتر)</p>
                    <p className="text-sm font-black text-white">{collection.quantity}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black theme-muted uppercase tracking-widest">نرخی لیتر</p>
                    <p className="text-sm font-black text-white">{collection.pricePerLiter.toLocaleString()}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-black theme-muted uppercase tracking-widest">کۆی گشتی</span>
                  <span className="text-lg font-black text-blue-500">{collection.totalPrice.toLocaleString()} دینار</span>
                </div>
                
                {collection.note && (
                  <div className="mt-2 p-3 bg-white/5 rounded-xl text-[10px] font-bold theme-muted italic">
                    {collection.note}
                  </div>
                )}
              </div>
            ))}
            {collections.length === 0 && (
              <div className="col-span-full text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                <History size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-400 font-bold">هیچ مێژوویەک نییە</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Farmer Modal */}
      <AnimatePresence>
        {isAddingFarmer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => {
                setIsAddingFarmer(false);
                setEditingFarmerId(null);
                setNewFarmer({ name: '', phone: '', address: '', milkPrice: 1000 });
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 w-full max-w-lg rounded-[3rem] shadow-2xl relative z-10 overflow-hidden border border-white/10"
            >
              <div className="p-8 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-2xl font-black">{editingFarmerId ? 'دەستکاریکردنی فەلاح' : 'زیادکردنی فەلاحی نوێ'}</h3>
                <button 
                  onClick={() => {
                    setIsAddingFarmer(false);
                    setEditingFarmerId(null);
                    setNewFarmer({ name: '', phone: '', address: '', milkPrice: 1000 });
                  }} 
                  className="p-2 hover:bg-white/5 rounded-xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">ناوی فەلاح</label>
                  <input 
                    type="text"
                    value={newFarmer.name}
                    onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-sm font-bold"
                    placeholder="ناو بنووسە..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">مۆبایل</label>
                    <input 
                      type="text"
                      value={newFarmer.phone}
                      onChange={(e) => setNewFarmer({ ...newFarmer, phone: e.target.value })}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-sm font-bold"
                      placeholder="0750..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">نرخی شیر (لیتر)</label>
                    <input 
                      type="number"
                      value={isNaN(newFarmer.milkPrice ?? NaN) ? '' : newFarmer.milkPrice}
                      onChange={(e) => setNewFarmer({ ...newFarmer, milkPrice: Number(e.target.value) })}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-sm font-bold"
                      placeholder="1000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">ناونیشان</label>
                  <input 
                    type="text"
                    value={newFarmer.address}
                    onChange={(e) => setNewFarmer({ ...newFarmer, address: e.target.value })}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-sm font-bold"
                    placeholder="ناونیشان بنووسە..."
                  />
                </div>
                <button 
                  onClick={handleAddFarmer}
                  className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  پاشەکەوتکردن
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
