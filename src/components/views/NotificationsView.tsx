import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Bell, AlertCircle, AlertTriangle, Info, CheckCircle2, Trash2 } from 'lucide-react';
import { Alert } from '../../types';
import { cn } from '../../lib/utils';

interface NotificationsViewProps {
  alerts: Alert[];
  onMarkAsRead: (id: number) => void;
  onClearAll: () => void;
  onBack: () => void;
}

export function NotificationsView({ alerts, onMarkAsRead, onClearAll, onBack }: NotificationsViewProps) {
  const sortedAlerts = [...alerts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getIcon = (type: Alert['type'], severity: Alert['severity']) => {
    switch (severity) {
      case 'error': return <AlertCircle className="text-red-500" size={20} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'info': return <Info className="text-blue-500" size={20} />;
      default: return <Bell className="text-slate-400" size={20} />;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-24 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 rounded-2xl bg-current/5 hover:bg-current/10 transition-all">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-black tracking-tight">ئاگادارکردنەوەکان</h2>
            <p className="text-[10px] font-bold theme-muted uppercase tracking-widest mt-1">هەموو ئاگادارکردنەوەکانی سیستەم</p>
          </div>
        </div>
        {alerts.length > 0 && (
          <button 
            onClick={onClearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-all"
          >
            <Trash2 size={16} />
            سڕینەوەی هەموو
          </button>
        )}
      </div>

      <div className="space-y-3">
        {sortedAlerts.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed theme-border">
            <Bell size={48} className="mx-auto mb-4 opacity-20" />
            <p className="theme-muted font-bold">هیچ ئاگادارکردنەوەیەک نییە</p>
          </div>
        ) : (
          sortedAlerts.map(alert => (
            <motion.div 
              key={alert.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "p-5 rounded-[1.5rem] border transition-all flex items-start gap-4",
                alert.isRead ? "theme-bg theme-border opacity-60" : "bg-white/5 border-white/10 shadow-lg"
              )}
              onClick={() => onMarkAsRead(alert.id)}
            >
              <div className={cn(
                "p-3 rounded-xl",
                alert.severity === 'error' ? "bg-red-500/10" : 
                alert.severity === 'warning' ? "bg-yellow-500/10" : "bg-blue-500/10"
              )}>
                {getIcon(alert.type, alert.severity)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-black text-sm">{alert.title}</h3>
                  <span className="text-[10px] theme-muted font-bold">
                    {new Date(alert.date).toLocaleTimeString('ku-IQ', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs theme-muted leading-relaxed">{alert.message}</p>
                {!alert.isRead && (
                  <div className="mt-3 flex justify-end">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      وەک بینراو دیاری بکە
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
