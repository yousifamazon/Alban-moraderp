import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  Wallet, 
  Users, 
  Package,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { ERPData } from '../../types';
import { cn } from '../../lib/utils';

interface FinancialStatementsViewProps {
  data: ERPData;
  currency: string;
  onBack: () => void;
}

export function FinancialStatementsView({ data, currency, onBack }: FinancialStatementsViewProps) {
  // Assets
  const inventoryValue = data.products.reduce((sum, p) => sum + (p.stock * p.cost), 0);
  const customerDebts = (data.customers || []).reduce((sum, c) => sum + (c.debt || 0), 0);
  const totalAssetsValue = (data.assets || []).reduce((sum, a) => sum + a.currentValue, 0);
  
  // Liabilities
  const supplierDebts = (data.supplierDebts || []).reduce((sum, d) => sum + (d.amount || 0), 0);
  
  // Equity / Profit
  const totalSales = data.sales.reduce((sum, s) => sum + s.total, 0);
  const totalCost = data.sales.reduce((sum, s) => sum + (s.itemCost * s.quantity), 0);
  const grossProfit = totalSales - totalCost;
  const totalExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = grossProfit - totalExpenses;

  const totalAssets = inventoryValue + customerDebts + totalAssetsValue;
  const totalLiabilities = supplierDebts;
  const equity = totalAssets - totalLiabilities;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 pb-20"
      dir="rtl"
    >
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">ڕاپۆرتی دارایی گشتی</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">تەرازووی پێداچوونەوە و باری دارایی کۆمپانیا</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assets Section */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">سەرمایەکان (Assets)</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Package size={16} className="text-slate-400" />
                <span className="text-sm font-bold">بەهای کۆگا (تێچوو)</span>
              </div>
              <span className="font-black">{inventoryValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Users size={16} className="text-slate-400" />
                <span className="text-sm font-bold">قەرزی لای کڕیاران</span>
              </div>
              <span className="font-black">{customerDebts.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Wallet size={16} className="text-slate-400" />
                <span className="text-sm font-bold">سەرمایە جێگیرەکان</span>
              </div>
              <span className="font-black">{totalAssetsValue.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <span className="font-black text-lg">کۆی سەرمایە</span>
            <span className="text-2xl font-black text-emerald-600">{totalAssets.toLocaleString()}</span>
          </div>
        </div>

        {/* Liabilities Section */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center">
              <TrendingDown size={24} />
            </div>
            <span className="text-[10px] font-black text-red-500 bg-red-500/10 px-3 py-1 rounded-full uppercase tracking-widest">قەرزەکان (Liabilities)</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Users size={16} className="text-slate-400" />
                <span className="text-sm font-bold">قەرزی دابینکەران</span>
              </div>
              <span className="font-black">{supplierDebts.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl opacity-40">
              <div className="flex items-center gap-3">
                <Wallet size={16} className="text-slate-400" />
                <span className="text-sm font-bold">قەرزە بانکییەکان</span>
              </div>
              <span className="font-black">0</span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <span className="font-black text-lg">کۆی قەرزەکان</span>
            <span className="text-2xl font-black text-red-600">{totalLiabilities.toLocaleString()}</span>
          </div>
        </div>

        {/* Equity Section */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
              <Scale size={24} />
            </div>
            <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-widest">سەرمایەی خاوەن (Equity)</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="flex items-center gap-3">
                <ArrowUpRight size={16} className="text-emerald-500" />
                <span className="text-sm font-bold">قازانجی گشتی</span>
              </div>
              <span className="font-black text-emerald-600">{grossProfit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="flex items-center gap-3">
                <ArrowDownRight size={16} className="text-red-500" />
                <span className="text-sm font-bold">کۆی خەرجییەکان</span>
              </div>
              <span className="font-black text-red-600">{totalExpenses.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <span className="font-black text-lg">پوختەی قازانج</span>
            <span className={cn("text-2xl font-black", netProfit >= 0 ? "text-emerald-600" : "text-red-600")}>
              {netProfit.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Balance */}
      <div className="bg-emerald-600 text-white p-10 rounded-[3rem] shadow-2xl shadow-emerald-500/20 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-right">
          <h3 className="text-3xl font-black mb-2">هاوسەنگی دارایی</h3>
          <p className="opacity-80 font-bold">کۆی گشتی بەهای کۆمپانیا لەم ساتەدا</p>
        </div>
        <div className="flex items-center gap-12">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">سەرمایە - قەرز</p>
            <p className="text-4xl font-black">{equity.toLocaleString()} <span className="text-sm font-normal opacity-60">{currency}</span></p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
