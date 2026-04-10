import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  CreditCard, 
  Trash2, 
  Users, 
  Bell, 
  Package, 
  Calendar, 
  CheckCircle,
  Plus,
  Database,
  AlertTriangle,
  ChevronLeft
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { StatCard } from '../ui/StatCard';
import { Card } from '../ui/Card';
import { ERPData } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface HubViewProps {
  data: ERPData;
  totalSales: number;
  totalExpenses: number;
  totalWaste: number;
  netProfit: number;
  setActiveSection: (s: string) => void;
  onBackup: () => void;
}

export function HubView({ data, totalSales, totalExpenses, totalWaste, netProfit, setActiveSection, onBackup }: HubViewProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthSales = data.sales.filter((s: any) => {
    const d = new Date(s.id);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).reduce((sum: number, s: any) => sum + s.total, 0);

  const lastMonthSales = data.sales.filter((s: any) => {
    const d = new Date(s.id);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  }).reduce((sum: number, s: any) => sum + s.total, 0);

  const growth = lastMonthSales === 0 ? (currentMonthSales > 0 ? 100 : 0) : ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100;
  const isPositiveGrowth = growth >= 0;

  const unreadAlerts = data.alerts?.filter(a => !a.isRead) || [];

  // Prepare chart data for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toLocaleDateString('ku-IQ', { day: 'numeric', month: 'short' });
    const daySales = data.sales.filter(s => new Date(s.id).toDateString() === d.toDateString())
      .reduce((sum, s) => sum + s.total, 0);
    return { name: dateStr, sales: daySales };
  });

  return (
    <motion.div
      key="hub"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pb-24"
    >
      {/* Hero Section - Net Profit Focus */}
      <Card className="mb-8 min-h-[300px] flex flex-col justify-center bg-black text-white">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8">
          <div>
            <div className="flex items-center gap-3 mb-4 opacity-60">
              <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">کۆی قازانجی ئەم مانگە</p>
            </div>
            <h2 className="text-6xl font-black tracking-tighter leading-none font-mono-data mb-6">
              {netProfit.toLocaleString()}
              <span className="text-xl font-normal opacity-30 mr-4">{data.settings.currency}</span>
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-current/10 text-inherit text-xs font-black backdrop-blur-xl border border-current/5">
                {isPositiveGrowth ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-red-500" />}
                <span dir="ltr">{growth.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute -right-20 -bottom-20 opacity-[0.03] rotate-12 pointer-events-none">
          <TrendingUp size={400} />
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="کۆی فرۆشتن" 
          value={totalSales} 
          icon={<ShoppingCart size={20} />}
          color="text-emerald-500" 
          currency={data.settings.currency} 
        />
        <StatCard 
          label="خەرجی گشتی" 
          value={totalExpenses} 
          icon={<CreditCard size={20} />}
          color="text-red-500" 
          currency={data.settings.currency} 
        />
        <StatCard 
          label="قازانجی گشتی" 
          value={netProfit} 
          icon={<TrendingUp size={20} />}
          color="text-blue-500" 
          currency={data.settings.currency} 
        />
        <StatCard 
          label="بەفیڕۆچوون" 
          value={totalWaste} 
          icon={<Trash2 size={20} />}
          color="text-orange-500" 
          currency={data.settings.currency} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white/5 border theme-border rounded-[2.5rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black tracking-tight">فرۆشتنی ٧ ڕۆژی ڕابردوو</h3>
              <p className="text-[10px] font-bold theme-muted uppercase tracking-widest mt-1">گۆڕانکارییەکانی فرۆشتن</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="sales" radius={[8, 8, 0, 0]}>
                  {last7Days.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === last7Days.length - 1 ? '#10b981' : 'rgba(255,255,255,0.1)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts Summary */}
        <div className="bg-white/5 border theme-border rounded-[2.5rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black tracking-tight">ئاگادارکردنەوەکان</h3>
              <p className="text-[10px] font-bold theme-muted uppercase tracking-widest mt-1">پێویستی بە سەرنجە</p>
            </div>
            <button 
              onClick={() => setActiveSection('notifications')}
              className="p-2 rounded-xl theme-hover border theme-border"
            >
              <Bell size={18} />
            </button>
          </div>
          
          <div className="space-y-4">
            {unreadAlerts.length === 0 ? (
              <div className="text-center py-12 opacity-20">
                <CheckCircle size={40} className="mx-auto mb-2" />
                <p className="text-xs font-bold">هەموو شتێک باشە</p>
              </div>
            ) : (
              unreadAlerts.slice(0, 4).map(alert => (
                <div key={alert.id} className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border theme-border">
                  <div className={cn(
                    "p-2 rounded-lg",
                    alert.severity === 'error' ? "bg-red-500/10 text-red-500" : 
                    alert.severity === 'warning' ? "bg-yellow-500/10 text-yellow-500" : "bg-blue-500/10 text-blue-500"
                  )}>
                    <AlertTriangle size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black truncate">{alert.title}</p>
                    <p className="text-[10px] theme-muted truncate">{alert.message}</p>
                  </div>
                </div>
              ))
            )}
            {unreadAlerts.length > 4 && (
              <button 
                onClick={() => setActiveSection('notifications')}
                className="w-full py-3 text-[10px] font-black uppercase tracking-widest theme-muted hover:text-white transition-colors"
              >
                بینینی هەموو ({unreadAlerts.length})
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
