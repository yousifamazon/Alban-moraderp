import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { Expense } from '../../types';

interface ExpenseReportViewProps {
  expenses: Expense[];
  currency: string;
  onBack: () => void;
}

export function ExpenseReportView({ expenses, currency, onBack }: ExpenseReportViewProps) {
  const grouped = expenses.reduce((acc, e) => {
    const desc = e.description || 'گشتی';
    acc[desc] = (acc[desc] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={onBack} className="p-3 rounded-2xl bg-current/5 hover:bg-current/10 transition-all">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-black tracking-tight">ڕاپۆرتی خەرجی</h2>
          <p className="text-[10px] font-bold theme-muted uppercase tracking-widest mt-1">وردەکاری و شیکردنەوەی خەرجییەکان</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="pro-card p-0 overflow-hidden border-none bg-current/5">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b theme-border bg-current/5">
                  <th className="p-6 text-[10px] font-black theme-muted uppercase tracking-widest">خەرجی</th>
                  <th className="p-6 text-[10px] font-black theme-muted uppercase tracking-widest text-center">بڕی پارە</th>
                  <th className="p-6 text-[10px] font-black theme-muted uppercase tracking-widest text-center">ڕێژە</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(grouped).map(([desc, amount], idx) => (
                  <tr key={idx} className="border-b theme-border hover:bg-current/5 transition-colors">
                    <td className="p-6 font-black text-sm">{desc}</td>
                    <td className="p-6 text-center font-mono-data text-sm font-black">{amount.toLocaleString()}</td>
                    <td className="p-6 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-24 h-1.5 rounded-full bg-current/10 overflow-hidden">
                          <div 
                            className="h-full bg-red-500" 
                            style={{ width: `${(amount / total) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-black opacity-40">{((amount / total) * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
          <div className="pro-card p-12 border-none bg-current/5 text-center">
            <p className="text-[10px] font-black theme-muted uppercase tracking-[0.3em] mb-4 opacity-60">کۆی گشتی خەرجی</p>
            <h3 className="text-6xl font-black tracking-tighter font-mono-data leading-none mb-4">
              {total.toLocaleString()}
            </h3>
            <p className="text-sm font-black opacity-40">{currency}</p>
          </div>
          
          <div className="pro-card p-10 border-none bg-current/5">
            <h4 className="font-black text-lg tracking-tight mb-8">دوایین خەرجییەکان</h4>
            <div className="space-y-6">
              {expenses.slice(-5).reverse().map((e, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-black">{e.description}</p>
                    <p className="text-[10px] theme-muted font-bold">{e.date}</p>
                  </div>
                  <span className="font-mono-data text-sm font-black text-red-500">-{e.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
