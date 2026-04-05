import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Search, CheckCircle2, XCircle, Clock, Trash2 } from 'lucide-react';
import { ShopRequest } from '../../types';
import { toast } from 'sonner';
import { customConfirm } from '../../lib/utils';

interface ShopRequestManagementViewProps {
  shopRequests: ShopRequest[];
  onUpdateStatus: (id: number, status: 'pending' | 'approved' | 'rejected') => void;
  onDelete: (id: number) => void;
  onBack: () => void;
}

export function ShopRequestManagementView({ shopRequests, onUpdateStatus, onDelete, onBack }: ShopRequestManagementViewProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredRequests = shopRequests.filter(req => {
    const matchesSearch = req.shopName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || req.status === filter;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => b.id - a.id);

  const handleDelete = (id: number) => {
    customConfirm('دڵنیایت لە سڕینەوەی ئەم داواکارییە؟', () => {
      onDelete(id);
      toast.success('داواکارییەکە سڕایەوە');
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-24 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-3 rounded-2xl bg-current/5 hover:bg-current/10 transition-all">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-black tracking-tight">بەڕێوەبردنی داواکاری دوکانەکان</h2>
          <p className="text-[10px] font-bold theme-muted uppercase tracking-widest mt-1">بینین و بەڕێوەبردنی هەموو داواکارییەکان</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="گەڕان بەپێی ناوی دوکان..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-12 pl-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-4 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
                filter === f 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {f === 'all' ? 'هەمووی' : f === 'pending' ? 'چاوەڕێکراو' : f === 'approved' ? 'پەسەندکراو' : 'ڕەتکراوە'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.map(req => (
          <div key={req.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6 flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{req.shopName}</h3>
                <span className="text-xs text-slate-500">{req.date}</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                req.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                req.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {req.status === 'pending' && <Clock size={14} />}
                {req.status === 'approved' && <CheckCircle2 size={14} />}
                {req.status === 'rejected' && <XCircle size={14} />}
                {req.status === 'pending' ? 'چاوەڕێکراو' : req.status === 'approved' ? 'پەسەندکراو' : 'ڕەتکراوە'}
              </div>
            </div>

            <div className="space-y-3 flex-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">کاڵاکان</span>
              <div className="space-y-2">
                {req.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                    <span className="font-medium">{item.itemName}</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              {req.status === 'pending' && (
                <>
                  <button 
                    onClick={() => onUpdateStatus(req.id, 'approved')}
                    className="flex-1 bg-emerald-500 text-white py-2 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors"
                  >
                    پەسەندکردن
                  </button>
                  <button 
                    onClick={() => onUpdateStatus(req.id, 'rejected')}
                    className="flex-1 bg-red-500 text-white py-2 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors"
                  >
                    ڕەتکردنەوە
                  </button>
                </>
              )}
              <button 
                onClick={() => handleDelete(req.id)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                title="سڕینەوە"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
        
        {filteredRequests.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
            <p className="text-slate-500 font-medium">هیچ داواکارییەکی دوکان نەدۆزرایەوە</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
