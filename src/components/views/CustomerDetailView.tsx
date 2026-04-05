import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Phone, MapPin, CreditCard, ShoppingCart } from 'lucide-react';
import { Customer, Sale, Payment } from '../../types';
import { cn } from '../../lib/utils';

interface CustomerDetailViewProps {
  customer: Customer;
  sales: Sale[];
  payments: Payment[];
  currency: string;
  onBack: () => void;
}

export function CustomerDetailView({ customer, sales, payments, currency, onBack }: CustomerDetailViewProps) {
  const customerSales = sales.filter(s => s.customerName === customer.name);
  const customerPayments = payments.filter(p => p.customerName === customer.name);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">{customer.name}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">وردەکاری کڕیار و مێژووی مامەڵەکان</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4">زانیاری کڕیار</h3>
          <div className="space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"><Phone size={16} /> {customer.phone || '---'}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"><MapPin size={16} /> {customer.address || '---'}</p>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase">کۆی قەرز</p>
              <p className={cn("text-2xl font-black", (customer.debt || 0) > 0 ? "text-red-500" : "text-emerald-500")}>
                {(customer.debt || 0).toLocaleString()} {currency}
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4">مێژووی مامەڵەکان</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="text-xs text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-3">بەروار</th>
                  <th className="pb-3">جۆر</th>
                  <th className="pb-3">بڕ</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  ...customerSales.map(s => ({ date: s.date, type: 'فرۆشتن', amount: s.total })),
                  ...customerPayments.map(p => ({ date: p.date, type: 'پارەدان', amount: -p.amount }))
                ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((t, i) => (
                  <tr key={i} className="border-b border-slate-50 dark:border-slate-800">
                    <td className="py-3 text-slate-600 dark:text-slate-400">{t.date}</td>
                    <td className="py-3 font-bold text-slate-800 dark:text-slate-200">{t.type}</td>
                    <td className={cn("py-3 font-black", t.amount > 0 ? "text-slate-900 dark:text-slate-100" : "text-emerald-600 dark:text-emerald-400")}>
                      {t.amount.toLocaleString()} {currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
