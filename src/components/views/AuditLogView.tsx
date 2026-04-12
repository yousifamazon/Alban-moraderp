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

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">بەکارهێنەر</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">چالاکی</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">بەش</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">کۆد/ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">کاتی چالاکی</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">وردەکاری</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center opacity-20">
                    <History size={48} className="mx-auto mb-4" />
                    <p className="font-black">هیچ تۆمارێک نەدۆزرایەوە</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                          <User size={14} />
                        </div>
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{log.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                        log.action.includes('Delete') ? "bg-red-500/10 text-red-500" :
                        log.action.includes('Update') ? "bg-blue-500/10 text-blue-500" : "bg-emerald-500/10 text-emerald-500"
                      )}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Tag size={12} />
                        <span className="text-xs font-bold">{log.entity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono-data text-xs text-slate-500">#{log.entityId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Calendar size={12} />
                        <span className="text-xs font-bold">{new Date(log.date).toLocaleString('ku-IQ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 max-w-xs">
                        <Info size={12} />
                        <span className="text-xs font-medium truncate">{log.details}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
