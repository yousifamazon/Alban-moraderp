import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Printer 
} from 'lucide-react';
import { Sale, Payment } from '../../types';

interface CustStatementViewProps {
  sales: Sale[];
  payments: Payment[];
  currency: string;
  onPrint: (title: string, content: string) => void;
  onBack: () => void;
}

export function CustStatementView({ sales, payments, currency, onPrint, onBack }: CustStatementViewProps) {
  const [search, setSearch] = useState('');
  const customerSales = (sales || []).filter(s => s.customerName === search);
  const customerPayments = (payments || []).filter(p => p.customerName === search);
  
  const totalSales = customerSales.reduce((a, b) => a + b.total, 0);
  const totalPaid = customerPayments.reduce((a, b) => a + b.amount, 0);
  
  // Calculate cash payments from sales (including initial payments for qist)
  const cashPaidInSales = customerSales.reduce((a, b) => a + (b.paidAmount || (b.paymentMethod === 'cash' ? b.total : 0)), 0);

  const balance = totalSales - cashPaidInSales - totalPaid;

  const printStatement = () => {
    const content = `
      <div style="margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px;">
        <p><strong>ناوی کڕیار:</strong> ${search}</p>
        <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 10px; margin-top: 10px;">
          <p><strong>کۆی کڕین:</strong> ${totalSales.toLocaleString()} ${currency}</p>
          <p><strong>کۆی دراوە:</strong> ${(cashPaidInSales + totalPaid).toLocaleString()} ${currency}</p>
          <p style="color: #ef4444; font-size: 18px;"><strong>ماوەی قەرز:</strong> ${balance.toLocaleString()} ${currency}</p>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>بەروار</th>
            <th>کاڵا / وەسڵ</th>
            <th style="text-align: center;">بڕ</th>
            <th style="text-align: left;">جۆر</th>
          </tr>
        </thead>
        <tbody>
          ${[...customerSales, ...customerPayments]
            .sort((a, b) => b.id - a.id)
            .map(item => `
              <tr>
                <td>${item.date}</td>
                <td>${'itemName' in item ? item.itemName : 'وەسڵی وەرگرتن'}</td>
                <td style="text-align: center;">${('total' in item ? item.total : item.amount).toLocaleString()}</td>
                <td style="text-align: left; color: ${'total' in item ? '#ef4444' : '#10b981'}; font-weight: bold;">
                  ${'total' in item ? 'کڕین' : 'پارەدان'}
                </td>
              </tr>
            `).join('')}
        </tbody>
      </table>
    `;
    onPrint(`کەشفی حیسابی کڕیار - ${search}`, content);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-slate-500 dark:text-slate-400">کەشفی حیسابی کڕیار</h2>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="ناوی تەواوی کڕیار بنووسە..." className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
        {search && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-2">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400"><span>کۆی کڕین:</span><b>{totalSales.toLocaleString()}</b></div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400"><span>نەختینە دراوە:</span><b>{cashPaidInSales.toLocaleString()}</b></div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400"><span>وەسڵی پارەدان:</span><b>{totalPaid.toLocaleString()}</b></div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-200 dark:border-slate-700"><span>ماوەی قەرز:</span><b className="text-red-600 dark:text-red-400">{balance.toLocaleString()} {currency}</b></div>
            </div>

            <button onClick={printStatement} className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 p-3 rounded-xl font-bold">
              <Printer size={18} /> پرنتکردنی کەشف
            </button>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black theme-muted uppercase tracking-widest px-2">جوڵەی حیساب</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...customerSales, ...customerPayments]
                  .sort((a, b) => b.id - a.id)
                  .map((item, idx) => (
                    <div key={idx} className="item-card group">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center",
                            'total' in item ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"
                          )}>
                            <span className="font-black text-lg">{'total' in item ? '-' : '+'}</span>
                          </div>
                          <div>
                            <h3 className="font-black text-sm text-white">{'itemName' in item ? item.itemName : 'وەسڵی وەرگرتن'}</h3>
                            <p className="text-[10px] theme-muted font-bold mt-1">{item.date}</p>
                          </div>
                        </div>
                        <b className={cn("text-lg", 'total' in item ? "text-red-500" : "text-emerald-500")}>
                          {('total' in item ? item.total : item.amount).toLocaleString()}
                        </b>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
