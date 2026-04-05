import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft 
} from 'lucide-react';
import { Sale, Expense, Payment } from '../../types';

interface CashRepViewProps {
  sales: Sale[];
  expenses: Expense[];
  payments: Payment[];
  supplierPayments: any[];
  salaryPayments: any[];
  currency: string;
  onBack: () => void;
}

export function CashRepView({ sales, expenses, payments, supplierPayments, salaryPayments, currency, onBack }: CashRepViewProps) {
  const cashFromSales = sales.reduce((a, b) => a + (b.paidAmount || (b.paymentMethod === 'cash' ? b.total : 0)), 0);
  const totalPayments = payments.reduce((a, b) => a + b.amount, 0);
  const totalExp = expenses.reduce((a, b) => a + b.amount, 0);
  const totalSupplierPayments = supplierPayments?.reduce((a, b) => a + b.amount, 0) || 0;
  const totalSalaryPayments = salaryPayments?.reduce((a, b) => a + b.amount, 0) || 0;
  const netCash = (cashFromSales + totalPayments) - totalExp - totalSupplierPayments - totalSalaryPayments;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-teal-500 dark:text-teal-400">ڕاپۆرتی پارەی نەختینە</h2>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>نەختینەی فرۆش:</span><b>{cashFromSales.toLocaleString()}</b></div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>وەرگرتنی قەرز:</span><b>{totalPayments.toLocaleString()}</b></div>
        <div className="flex justify-between text-red-500 dark:text-red-400"><span>خەرجییەکان:</span><b>-{totalExp.toLocaleString()}</b></div>
        <div className="flex justify-between text-red-500 dark:text-red-400"><span>دانەوەی قەرزی کارگە:</span><b>-{totalSupplierPayments.toLocaleString()}</b></div>
        <div className="flex justify-between text-red-500 dark:text-red-400"><span>مووچەی دراو:</span><b>-{totalSalaryPayments.toLocaleString()}</b></div>
        <div className="flex justify-between text-xl font-black text-teal-600 dark:text-teal-400 pt-4 border-t border-slate-100 dark:border-slate-800"><span>پارەی بەردەست:</span><b>{netCash.toLocaleString()} {currency}</b></div>
      </div>
    </motion.div>
  );
}
