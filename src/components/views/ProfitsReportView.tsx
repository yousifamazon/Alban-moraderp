import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Activity, 
  Calendar,
  Printer
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface ProfitsReportViewProps {
  totalSales: number;
  totalCost: number;
  totalExpenses: number;
  totalWaste: number;
  totalDiscounts: number;
  totalSalaries: number;
  currency: string;
  darkMode: boolean;
  onBack: () => void;
  onPrint: (title: string, content: string) => void;
}

export function ProfitsReportView({ 
  totalSales, 
  totalCost, 
  totalExpenses, 
  totalWaste, 
  totalDiscounts, 
  totalSalaries, 
  currency, 
  darkMode, 
  onBack,
  onPrint
}: ProfitsReportViewProps) {
  const grossProfit = totalSales - totalCost;
  const netProfit = grossProfit - totalExpenses - totalWaste - totalDiscounts - totalSalaries;
  const profitMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;

  const handlePrint = () => {
    const content = `
      <div style="margin-bottom: 30px;">
        <h2 style="color: #3b82f6; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">پوختەی دارایی</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="background: #f8fafc;">
            <td style="padding: 12px; border: 1px solid #e2e8f0;">کۆی فرۆش</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: left; font-weight: bold;">${totalSales.toLocaleString()} ${currency}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e2e8f0;">کۆی تێچوو</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: left; font-weight: bold;">${totalCost.toLocaleString()} ${currency}</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 12px; border: 1px solid #e2e8f0;">کۆی خەرجی</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: left; font-weight: bold;">${totalExpenses.toLocaleString()} ${currency}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e2e8f0;">کۆی زەرەر (تەلف)</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: left; font-weight: bold;">${totalWaste.toLocaleString()} ${currency}</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 12px; border: 1px solid #e2e8f0;">کۆی داشکاندن</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: left; font-weight: bold;">${totalDiscounts.toLocaleString()} ${currency}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e2e8f0;">کۆی مووچە</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: left; font-weight: bold;">${totalSalaries.toLocaleString()} ${currency}</td>
          </tr>
          <tr style="background: #f0fdf4; font-weight: bold; font-size: 18px;">
            <td style="padding: 15px; border: 1px solid #e2e8f0;">قازانجی پاک</td>
            <td style="padding: 15px; border: 1px solid #e2e8f0; text-align: left; color: ${netProfit >= 0 ? '#16a34a' : '#dc2626'};">${netProfit.toLocaleString()} ${currency}</td>
          </tr>
        </table>
      </div>
    `;
    onPrint('ڕاپۆرتی قازانج و زەرەر', content);
  };

  const stats = [
    { label: 'کۆی فرۆش', value: totalSales, icon: DollarSign, color: 'emerald', trend: 'up' },
    { label: 'کۆی تێچوو', value: totalCost, icon: Wallet, color: 'blue', trend: 'down' },
    { label: 'کۆی خەرجی', value: totalExpenses, icon: TrendingDown, color: 'red', trend: 'down' },
    { label: 'کۆی زەرەر (تەلف)', value: totalWaste, icon: Activity, color: 'orange', trend: 'down' },
    { label: 'کۆی داشکاندن', value: totalDiscounts, icon: PieChart, color: 'purple', trend: 'down' },
    { label: 'کۆی مووچە', value: totalSalaries, icon: Calendar, color: 'indigo', trend: 'down' },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-10 pb-20 max-w-6xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-95">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="font-black text-3xl tracking-tight text-slate-800 dark:text-slate-100">ڕاپۆرتی قازانج و زەرەر</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mt-1">شیکردنەوەی وردی داهات و خەرجییەکان</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-95 text-slate-700 dark:text-slate-200 font-bold"
          >
            <Printer size={20} className="text-blue-500" />
            چاپکردن
          </button>
          <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">ڕاپۆرتی دارایی</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 transition-all group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-colors", 
                stat.color === 'emerald' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white" :
                stat.color === 'blue' ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white" :
                stat.color === 'red' ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 group-hover:bg-red-500 group-hover:text-white" :
                stat.color === 'orange' ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white" :
                stat.color === 'purple' ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white" :
                "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white"
              )}>
                <stat.icon size={28} />
              </div>
              <div className={cn("px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1", 
                stat.trend === 'up' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-red-50 dark:bg-red-900/20 text-red-600"
              )}>
                {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.trend === 'up' ? 'بەرزبوونەوە' : 'دابەزین'}
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{stat.value.toLocaleString()} <span className="text-xs font-normal opacity-60">{currency}</span></h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="bg-slate-900 dark:bg-slate-800 p-10 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
          <div className="relative">
            <div className="flex items-center justify-between mb-10">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <TrendingUp size={32} />
              </div>
              <div className="text-right">
                <span className="text-xs font-black uppercase tracking-widest opacity-60">قازانجی گشتی</span>
                <h4 className="text-4xl font-black mt-1">{grossProfit.toLocaleString()} <span className="text-sm font-normal opacity-60">{currency}</span></h4>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/10">
                <span className="text-sm font-bold opacity-80">ڕێژەی قازانج</span>
                <span className="text-2xl font-black text-emerald-400">{profitMargin.toFixed(1)}%</span>
              </div>
              <p className="text-xs font-bold opacity-50 leading-relaxed">قازانجی گشتی بریتییە لە کۆی فرۆش منهای تێچووی کاڵاکان پێش دەرکردنی خەرجییەکان.</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="bg-emerald-600 p-10 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
          <div className="relative">
            <div className="flex items-center justify-between mb-10">
              <div className="w-16 h-16 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow-lg shadow-white/20">
                <TrendingUp size={32} />
              </div>
              <div className="text-right">
                <span className="text-xs font-black uppercase tracking-widest opacity-80">قازانجی سافی</span>
                <h4 className="text-4xl font-black mt-1">{netProfit.toLocaleString()} <span className="text-sm font-normal opacity-80">{currency}</span></h4>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center p-6 bg-black/10 rounded-3xl border border-white/20">
                <span className="text-sm font-bold opacity-90">دۆخی دارایی</span>
                <span className="text-xl font-black">{netProfit >= 0 ? 'قازانج' : 'زەرەر'}</span>
              </div>
              <p className="text-xs font-bold opacity-80 leading-relaxed">قازانجی سافی بریتییە لەو بڕە پارەیەی دەمێنێتەوە دوای دەرکردنی هەموو تێچوو و خەرجی و مووچە و زەرەرەکان.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
