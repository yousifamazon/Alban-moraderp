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
  Database
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { StatCard } from '../ui/StatCard';
import { Card } from '../ui/Card';
import { ERPData } from '../../types';

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
          label="بەهەدەردراو" 
          value={totalWaste} 
          icon={<Trash2 size={20} />}
          color="text-orange-500" 
          currency={data.settings.currency} 
        />
        <StatCard 
          label="کۆی قەرزەکان" 
          value={data.customers?.reduce((sum: number, c: any) => sum + (c.debt || 0), 0) || 0} 
          icon={<Users size={20} />}
          color="text-blue-500" 
          currency={data.settings.currency} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Panel */}
        <Card className="lg:col-span-2 p-8">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-black text-xl tracking-tight">ئاگاداری کۆگا</h4>
            <button 
              onClick={() => setActiveSection('low-stock')}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              بینینی هەمووی
            </button>
          </div>
          
          {data.products.filter(p => p.stock <= p.minStock).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.products.filter(p => p.stock <= p.minStock).slice(0, 4).map(p => (
                <div key={p.id} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Package size={16} className="opacity-40" />
                    </div>
                    <div>
                      <p className="font-black text-sm">{p.name}</p>
                      <p className="text-[10px] font-black text-red-500 mt-0.5">{p.stock} دانە ماوە</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex flex-col justify-center items-center text-slate-400 dark:text-slate-500 gap-2">
              <CheckCircle size={32} className="opacity-20" />
              <p className="text-xs font-bold italic opacity-40">هەموو کاڵاکان لە ئاستێکی باشدان</p>
            </div>
          )}
        </Card>

        {/* Recent Activity */}
        <div className="space-y-6">
          <Card className="p-8">
            <h4 className="font-black text-xl tracking-tight mb-8">دوایین چالاکییەکان</h4>
            <div className="space-y-6">
              {[
                { icon: <ShoppingCart size={16} />, color: "text-blue-500", label: "فرۆشتنی نوێ", time: "٢ خولەک پێش ئێستا" },
                { icon: <Plus size={16} />, color: "text-emerald-500", label: "زیادکردنی کاڵا", time: "١ کاتژمێر پێش ئێستا" },
                { icon: <Users size={16} />, color: "text-purple-500", label: "کڕیاری نوێ", time: "٥ کاتژمێر پێش ئێستا" },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", activity.color, "bg-slate-100 dark:bg-slate-800")}>
                    {activity.icon}
                  </div>
                  <div>
                    <p className="text-xs font-black">{activity.label}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setActiveSection('reports-hub')}
              className="w-full mt-8 py-4 rounded-xl font-black text-[10px] shadow-lg transition-all hover:scale-[1.02] active:scale-95 bg-slate-900 text-white dark:bg-white dark:text-black"
            >
              بینینی ڕاپۆرتی گشتی
            </button>
          </Card>

          <Card className="p-8 bg-blue-500/5 border-blue-500/10">
            <h4 className="font-black text-xl tracking-tight mb-6">پاراستنی داتا</h4>
            <p className="text-xs theme-muted mb-6 leading-relaxed">بۆ پاراستنی زانیارییەکانت، پێشنیار دەکەین ڕۆژانە پاشەکەوتی داتاکان بکەیت.</p>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={onBackup}
                className="w-full py-4 rounded-xl font-black text-[10px] bg-blue-500 text-white shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <Database size={14} />
                پاشەکەوتکردنی داتا (JSON)
              </button>
              <button 
                onClick={() => setActiveSection('settings')}
                className="w-full py-4 rounded-xl font-black text-[10px] theme-hover border theme-border flex items-center justify-center gap-2"
              >
                ڕێکخستنەکان
              </button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
