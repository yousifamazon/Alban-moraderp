import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Printer, 
  Users, 
  TrendingUp, 
  ShoppingCart, 
  DollarSign 
} from 'lucide-react';
import { Sale } from '../../types';
import { Card } from '../ui/Card';

interface DriverSalesReportViewProps {
  sales: Sale[];
  currency: string;
  onPrint: (title: string, content: string) => void;
  onBack: () => void;
}

export function DriverSalesReportView({ sales, currency, onPrint, onBack }: DriverSalesReportViewProps) {
  const driverStats = useMemo(() => {
    const stats: Record<string, { totalSales: number; count: number }> = {};
    
    sales.forEach(sale => {
      const driver = sale.driverName || 'بێ شۆفێر';
      if (!stats[driver]) {
        stats[driver] = { totalSales: 0, count: 0 };
      }
      stats[driver].totalSales += sale.total;
      stats[driver].count += 1;
    });

    return Object.entries(stats).map(([name, data]) => ({
      name,
      ...data,
      avg: data.totalSales / data.count
    })).sort((a, b) => b.totalSales - a.totalSales);
  }, [sales]);

  const handlePrint = () => {
    const content = `
      <div style="margin-bottom: 30px;">
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background: #f8fafc;">
              <th style="padding: 12px; border: 1px solid #e2e8f0; text-align: right;">ناوی شۆفێر</th>
              <th style="padding: 12px; border: 1px solid #e2e8f0; text-align: right;">کۆی فرۆشتن</th>
              <th style="padding: 12px; border: 1px solid #e2e8f0; text-align: right;">ژمارەی مامەڵە</th>
              <th style="padding: 12px; border: 1px solid #e2e8f0; text-align: right;">تێکڕای فرۆشتن</th>
            </tr>
          </thead>
          <tbody>
            ${driverStats.map(s => `
              <tr>
                <td style="padding: 12px; border: 1px solid #e2e8f0;">${s.name}</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">${s.totalSales.toLocaleString()} ${currency}</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0;">${s.count}</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0;">${s.avg.toLocaleString()} ${currency}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    onPrint('ڕاپۆرتی فرۆشتنی شۆفێرەکان', content);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 pb-20 max-w-7xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-95">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="font-black text-3xl tracking-tight text-slate-800 dark:text-slate-100">ڕاپۆرتی شۆفێرەکان</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mt-1">شیکردنەوەی فرۆشتن بەپێی شۆفێرەکان</p>
          </div>
        </div>
        <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white dark:bg-white dark:text-black rounded-2xl font-black text-sm transition-all active:scale-95">
          <Printer size={18} />
          چاپکردن
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {driverStats.map((stat, idx) => (
          <div key={idx}>
            <Card className="p-8 space-y-6 group hover:border-emerald-500/50 transition-all">
              <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Users size={24} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ناوی شۆفێر</p>
                <h3 className="font-black text-lg">{stat.name}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex justify-between items-center">
                <div className="flex items-center gap-2 text-emerald-500">
                  <DollarSign size={14} />
                  <span className="text-[10px] font-black uppercase">کۆی فرۆشتن</span>
                </div>
                <span className="font-black text-sm">{stat.totalSales.toLocaleString()} {currency}</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex justify-between items-center">
                <div className="flex items-center gap-2 text-blue-500">
                  <ShoppingCart size={14} />
                  <span className="text-[10px] font-black uppercase">ژمارەی مامەڵە</span>
                </div>
                <span className="font-black text-sm">{stat.count}</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex justify-between items-center">
                <div className="flex items-center gap-2 text-purple-500">
                  <TrendingUp size={14} />
                  <span className="text-[10px] font-black uppercase">تێکڕای فرۆشتن</span>
                </div>
                <span className="font-black text-sm">{stat.avg.toLocaleString()} {currency}</span>
              </div>
            </div>
          </Card>
        </div>
      ))}
      </div>
    </motion.div>
  );
}
