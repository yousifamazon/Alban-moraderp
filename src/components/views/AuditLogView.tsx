import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  History, 
  User, 
  Calendar, 
  Tag, 
  Info,
  ChevronLeft
} from 'lucide-react';
import { AuditLog } from '../../types';
import { cn } from '../../lib/utils';

interface AuditLogViewProps {
  logs: AuditLog[];
  onBack: () => void;
}

export function AuditLogView({ logs, onBack }: AuditLogViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEntity, setFilterEntity] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toString().includes(searchTerm);
    
    const matchesEntity = filterEntity === 'all' || log.entity === filterEntity;
    
    return matchesSearch && matchesEntity;
  });

  const entities = ['all', ...Array.from(new Set(logs.map(l => l.entity)))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 pb-20"
      dir="rtl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">تۆماری چالاکییەکان (Audit Log)</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">بەدواداچوونی هەموو گۆڕانکارییەکانی سیستەم</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              placeholder="گەڕان بۆ چالاکی، بەکارهێنەر، یان وردەکاری..." 
              className="w-full pr-12 pl-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500" 
            />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <select 
            value={filterEntity} 
            onChange={e => setFilterEntity(e.target.value)}
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 font-bold text-sm"
          >
            {entities.map(e => (
              <option key={e} value={e}>{e === 'all' ? 'هەموو بەشەکان' : e}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
            <History size={48} className="mx-auto text-slate-700 mb-4 opacity-20" />
            <p className="text-slate-500 font-bold">هیچ تۆمارێک نەدۆزرایەوە</p>
          </div>
        ) : (
          filteredLogs.map(log => (
            <div key={log.id} className="item-card group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-500">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-white">{log.userName}</span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[8px] font-black uppercase border",
                        log.action.includes('Delete') ? "bg-red-500/10 text-red-500 border-red-500/20" :
                        log.action.includes('Update') ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      )}>
                        {log.action}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-[10px] theme-muted font-bold flex items-center gap-1">
                        <Tag size={10} /> {log.entity}
                      </p>
                      <p className="text-[10px] theme-muted font-bold flex items-center gap-1">
                        <Calendar size={10} /> {new Date(log.date).toLocaleString('ku-IQ')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                  <div className="flex-1 md:flex-none">
                    <span className="text-[8px] font-black theme-muted uppercase tracking-widest block mb-1">کۆد/ID</span>
                    <span className="font-mono-data text-xs text-white">#{log.entityId}</span>
                  </div>
                  <div className="flex-1 md:flex-none text-left">
                    <span className="text-[8px] font-black theme-muted uppercase tracking-widest block mb-1">وردەکاری</span>
                    <p className="text-xs font-medium text-white/70 line-clamp-1 max-w-[200px]">{log.details}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
