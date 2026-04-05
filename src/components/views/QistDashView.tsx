import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft 
} from 'lucide-react';
import { Sale, Payment, Customer } from '../../types';

interface QistDashViewProps {
  sales: Sale[];
  payments: Payment[];
  customers: Customer[];
  currency: string;
  onBack: () => void;
}

export function QistDashView({ sales, payments, customers, currency, onBack }: QistDashViewProps) {
  const totalDebt = customers.reduce((sum, c) => sum + (c.debt || 0), 0);
  const activeInstallments = customers.filter(c => (c.debt || 0) > 0).length;
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const overdueCustomers = customers.filter(c => {
    if ((c.debt || 0) <= 0) return false;
    const lastPayment = payments
      .filter(p => p.customerName === c.name)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    if (!lastPayment) {
      // If no payment ever, check if the first sale was more than 30 days ago
      const firstSale = sales
        .filter(s => s.customerName === c.name && s.paymentMethod === 'qist')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
      return firstSale && new Date(firstSale.date) < thirtyDaysAgo;
    }
    
    return new Date(lastPayment.date) < thirtyDaysAgo;
  });

  const customerDebts = customers.filter(c => (c.debt || 0) > 0).map(c => ({
    name: c.name,
    balance: c.debt || 0,
    isOverdue: overdueCustomers.some(oc => oc.id === c.id)
  })).sort((a, b) => b.balance - a.balance);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={onBack} className="p-3 rounded-2xl bg-current/5 hover:bg-current/10 transition-all">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-black tracking-tight">داشبۆردی قیستەکان</h2>
          <p className="text-[10px] font-bold theme-muted uppercase tracking-widest mt-1">بەڕێوەبردنی قەرز و قیستەکانی کڕیاران</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">کۆی گشتی قەرزەکان</p>
          <h3 className="text-3xl font-black text-red-500">{totalDebt.toLocaleString()} <span className="text-sm font-normal text-slate-400">{currency}</span></h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">قیستە چالاکەکان</p>
          <h3 className="text-3xl font-black text-blue-500">{activeInstallments} <span className="text-sm font-normal text-slate-400">کڕیار</span></h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">وەسڵە دواکەوتووەکان</p>
          <h3 className="text-3xl font-black text-orange-500">{overdueCustomers.length} <span className="text-sm font-normal text-slate-400">کڕیار</span></h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {customerDebts.length === 0 ? (
          <div className="col-span-full text-center p-20 bg-current/5 theme-muted italic rounded-[2.5rem]">هیچ قیستێک نییە</div>
        ) : (
          customerDebts.map(d => (
            <div key={d.name} className={`p-8 rounded-[2.5rem] border-none flex justify-between items-center group transition-all ${d.isOverdue ? 'bg-red-500/10 hover:bg-red-500/20' : 'bg-current/5 hover:bg-current/10'}`}>
              <div className="text-right">
                <h3 className="font-black text-xl tracking-tight mb-1">{d.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black theme-muted uppercase tracking-widest">کۆی قەرزی ماوە</span>
                  {d.isOverdue && <span className="text-[8px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full uppercase">دواکەوتوو</span>}
                </div>
              </div>
              <div className="text-right">
                <span className={`text-2xl font-black font-mono-data ${d.isOverdue ? 'text-red-600' : 'text-red-500'}`}>{d.balance.toLocaleString()}</span>
                <span className="text-[10px] font-black theme-muted block mt-1 uppercase tracking-widest">{currency}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
