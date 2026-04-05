import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Package } from 'lucide-react';
import { Sale } from '../../types';

interface CategoryReportViewProps {
  sales: Sale[];
  currency: string;
  onBack: () => void;
}

export function CategoryReportView({ sales, currency, onBack }: CategoryReportViewProps) {
  const reportData = sales.reduce((acc, s) => {
    const cat = s.category || 'گشتی';
    if (!acc[cat]) acc[cat] = { sales: 0, cost: 0, profit: 0 };
    acc[cat].sales += s.total;
    acc[cat].cost += s.itemCost * s.quantity;
    acc[cat].profit += (s.total - (s.itemCost * s.quantity));
    return acc;
  }, {} as Record<string, { sales: number, cost: number, profit: number }>);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={onBack} className="p-3 rounded-2xl bg-current/5 hover:bg-current/10 transition-all">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-black tracking-tight">ڕاپۆرتی جۆرەکان</h2>
          <p className="text-[10px] font-bold theme-muted uppercase tracking-widest mt-1">شیکردنەوەی فرۆشتن و قازانج بەپێی جۆری کاڵا</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {Object.entries(reportData).length === 0 ? (
          <div className="col-span-full text-center p-20 pro-card bg-current/5 theme-muted italic">هیچ داتایەک نییە</div>
        ) : (
          Object.entries(reportData).map(([cat, data]) => (
            <div key={cat} className="pro-card p-8 border-none bg-current/5 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-xl tracking-tight">{cat}</h3>
                <div className="w-10 h-10 rounded-xl bg-current/10 flex items-center justify-center">
                  <Package size={20} className="opacity-40" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black theme-muted uppercase tracking-widest">فرۆشتن</span>
                  <span className="font-mono-data text-sm font-black">{data.sales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black theme-muted uppercase tracking-widest">تێچوو</span>
                  <span className="font-mono-data text-sm font-black text-red-500">{data.cost.toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t theme-border flex justify-between items-center">
                  <span className="text-xs font-black">قازانج</span>
                  <span className="text-lg font-black font-mono-data text-emerald-500">{data.profit.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
