import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Activity,
  RotateCcw,
  Printer
} from 'lucide-react';
import { Sale, Expense, Return, Waste, SalaryPayment } from '../../types';
import { cn } from '../../lib/utils';

interface DailySummaryReportViewProps {
  sales: Sale[];
  expenses: Expense[];
  returns: Return[];
  waste: Waste[];
  salaryPayments: SalaryPayment[];
  currency: string;
  onBack: () => void;
  onPrint: (title: string, content: string) => void;
}

export function DailySummaryReportView({
  sales,
  expenses,
  returns,
  waste,
  salaryPayments,
  currency,
  onBack,
  onPrint
}: DailySummaryReportViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const targetDate = new Date(selectedDate).toLocaleDateString('ku-IQ');

  const dailySales = sales.filter(s => s.date === targetDate);
  const dailyExpenses = expenses.filter(e => e.date === targetDate);
  const dailyReturns = returns.filter(r => r.date === targetDate);
  const dailyWaste = waste.filter(w => w.date === targetDate);
  const dailySalaries = salaryPayments.filter(s => s.date === targetDate);

  const totalSales = dailySales.reduce((sum, s) => sum + s.total, 0);
  const totalCost = dailySales.reduce((sum, s) => sum + (s.itemCost * s.quantity), 0);
  const totalExpenses = dailyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalRefunds = dailyReturns.reduce((sum, r) => sum + r.totalRefund, 0);
  const totalWasteCost = dailyWaste.reduce((sum, w) => sum + (w.cost * w.quantity), 0);
  const totalSalariesPaid = dailySalaries.reduce((sum, s) => sum + s.amount, 0);

  const grossProfit = totalSales - totalCost;
  const netProfit = grossProfit - totalExpenses - totalRefunds - totalWasteCost - totalSalariesPaid;

  const handlePrint = () => {
    const content = `
      <div style="margin-bottom: 30px;">
        <h2 style="color: #3b82f6; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">پوختەی ڕۆژانە - ${targetDate}</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="background: #f8fafc;">
            <td style="padding: 12px; border: 1px solid #e2e8f0;">فرۆشی ڕۆژانە</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: left; font-weight: bold;">${totalSales.toLocaleString()} ${currency}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e2e8f0;">تێچووی کاڵا</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: left; font-weight: bold;">${totalCost.toLocaleString()} ${currency}</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 12px; border: 1px solid #e2e8f0;">خەرجی ڕۆژانە</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: left; font-weight: bold;">${totalExpenses.toLocaleString()} ${currency}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e2e8f0;">گەڕانەوە</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: left; font-weight: bold;">${totalRefunds.toLocaleString()} ${currency}</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 12px; border: 1px solid #e2e8f0;">تەلف و زەرەر</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: left; font-weight: bold;">${totalWasteCost.toLocaleString()} ${currency}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e2e8f0;">مووچەی دراو</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: left; font-weight: bold;">${totalSalariesPaid.toLocaleString()} ${currency}</td>
          </tr>
          <tr style="background: #f0fdf4; font-weight: bold; font-size: 18px;">
            <td style="padding: 15px; border: 1px solid #e2e8f0;">قازانجی پاک</td>
            <td style="padding: 15px; border: 1px solid #e2e8f0; text-align: left; color: ${netProfit >= 0 ? '#16a34a' : '#dc2626'};">${netProfit.toLocaleString()} ${currency}</td>
          </tr>
        </table>
      </div>
    `;
    onPrint(`پوختەی ڕۆژانە - ${targetDate}`, content);
  };

  const stats = [
    { label: 'فرۆشی ڕۆژانە', value: totalSales, icon: DollarSign, color: 'emerald' },
    { label: 'تێچووی کاڵا', value: totalCost, icon: Wallet, color: 'blue' },
    { label: 'خەرجی ڕۆژانە', value: totalExpenses, icon: TrendingDown, color: 'red' },
    { label: 'گەڕانەوە', value: totalRefunds, icon: RotateCcw, color: 'orange' },
    { label: 'تەلف و زەرەر', value: totalWasteCost, icon: Activity, color: 'purple' },
    { label: 'مووچەی دراو', value: totalSalariesPaid, icon: Calendar, color: 'indigo' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20 max-w-6xl mx-auto" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-95">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="font-black text-3xl tracking-tight text-slate-800 dark:text-slate-100">پوختەی ڕۆژانە</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mt-1">کۆی گشتی چالاکییە داراییەکانی ڕۆژ</p>
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
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <Calendar className="text-blue-500 mr-2" size={20} />
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-slate-700 dark:text-slate-200 p-2"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4 mb-4">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", 
                stat.color === 'emerald' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" :
                stat.color === 'blue' ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" :
                stat.color === 'red' ? "bg-red-50 dark:bg-red-900/20 text-red-600" :
                stat.color === 'orange' ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600" :
                stat.color === 'purple' ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600" :
                "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600"
              )}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{stat.value.toLocaleString()} <span className="text-xs font-normal opacity-60">{currency}</span></h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-black">قازانجی گشتی (Gross)</h4>
            <TrendingUp className="text-emerald-400" size={32} />
          </div>
          <div className="text-4xl font-black">{grossProfit.toLocaleString()} <span className="text-sm font-normal opacity-60">{currency}</span></div>
          <p className="text-xs opacity-50">ئەمە تەنها فرۆش منهای تێچووی کاڵایە پێش دەرکردنی خەرجییەکان.</p>
        </div>

        <div className={cn("p-10 rounded-[3rem] text-white space-y-6 shadow-2xl", netProfit >= 0 ? "bg-emerald-600" : "bg-red-600")}>
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-black">قازانجی پاک (Net)</h4>
            {netProfit >= 0 ? <TrendingUp size={32} /> : <TrendingDown size={32} />}
          </div>
          <div className="text-4xl font-black">{netProfit.toLocaleString()} <span className="text-sm font-normal opacity-60">{currency}</span></div>
          <p className="text-xs opacity-80">ئەمە بڕی کۆتاییە دوای دەرکردنی هەموو خەرجی و زەرەر و مووچەکان.</p>
        </div>
      </div>
    </motion.div>
  );
}
