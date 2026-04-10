import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Printer,
  Calendar,
  Filter,
  ArrowUpDown,
  X,
  FileDown,
  Download
} from 'lucide-react';
import { Sale, Product, Customer } from '../../types';
import { cn } from '../../lib/utils';
import * as XLSX from 'xlsx';
import { PrintableInvoice } from '../PrintableInvoice';

interface SalesHistoryViewProps {
  sales: Sale[];
  products: Product[];
  customers: Customer[];
  currency: string;
  invoiceTemplate?: string;
  onPrint: (title: string, content: string) => void;
  onBack: () => void;
}

export function SalesHistoryView({ sales, products, customers, currency, invoiceTemplate, onPrint, onBack }: SalesHistoryViewProps) {
  const [driverFilter, setDriverFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<'all' | 'cash' | 'qist'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortByTotal, setSortByTotal] = useState<'none' | 'asc' | 'desc'>('none');
  const [showFilters, setShowFilters] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  
  const groupedSales = (sales || [])
    .filter(s => {
      const matchesDriver = !driverFilter || s.driverName?.toLowerCase().includes(driverFilter.toLowerCase());
      const matchesPayment = paymentMethodFilter === 'all' || s.paymentMethod === paymentMethodFilter;
      const matchesDate = (!startDate || s.date >= startDate) && (!endDate || s.date <= endDate);
      const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
      return matchesDriver && matchesPayment && matchesDate && matchesCategory;
    })
    .reduce((acc, sale) => {
    const key = sale.receiptId || `SINGLE-${sale.id}`;
    if (!acc[key]) {
      acc[key] = {
        id: sale.id,
        receiptId: sale.receiptId,
        customerName: sale.customerName,
        date: sale.date,
        items: [],
        total: 0,
        paymentMethod: sale.paymentMethod
      };
    }
    acc[key].items.push(sale);
    acc[key].total += sale.total;
    return acc;
  }, {} as Record<string, any>) || {};

  const history = Object.values(groupedSales);

  if (sortByTotal === 'asc') {
    history.sort((a: any, b: any) => a.total - b.total);
  } else if (sortByTotal === 'desc') {
    history.sort((a: any, b: any) => b.total - a.total);
  } else {
    history.sort((a: any, b: any) => b.id - a.id);
  }

  const exportToExcel = () => {
    const exportData = history.map((h: any) => ({
      'ژمارەی وەسڵ': h.receiptId || h.id,
      'کڕیار': h.customerName,
      'بەروار': h.date,
      'جۆری پارەدان': h.paymentMethod === 'cash' ? 'نەختینە' : 'قەرز',
      'کۆی گشتی': h.total
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
    XLSX.writeFile(wb, `Sales_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const printReceipt = (h: any) => {
    const customer = customers.find(c => c.name === h.customerName);
    setSelectedReceipt({ ...h, customer });
    setShowPrintPreview(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-teal-600 dark:text-teal-400">وەسڵە فرۆشەکان</h2>
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "p-2 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold",
            showFilters ? "bg-teal-600 text-white border-teal-600" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
          )}
        >
          <Filter size={16} />
          فلتەرەکان
        </button>
        <div className="flex items-center gap-2">
          <button 
            onClick={exportToExcel}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all flex items-center gap-2 text-xs font-bold"
            title="Export to Excel"
          >
            <Download size={16} />
            ئێکسڵ
          </button>
        </div>
      </div>

      {showFilters && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }} 
          animate={{ height: 'auto', opacity: 1 }} 
          className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4 overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">گەڕان بەپێی سایەق</label>
              <input 
                type="text" 
                value={driverFilter} 
                onChange={e => setDriverFilter(e.target.value)} 
                placeholder="ناوی سایەق..." 
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">لە بەرواری</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)} 
                  className="w-full p-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">بۆ بەرواری</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={e => setEndDate(e.target.value)} 
                  className="w-full p-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">جۆری پارەدان</label>
              <select 
                value={paymentMethodFilter} 
                onChange={e => setPaymentMethodFilter(e.target.value as any)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm"
              >
                <option value="all">هەمووی</option>
                <option value="cash">نەختینە</option>
                <option value="qist">قەرز</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">جۆری کاڵا</label>
              <select 
                value={categoryFilter} 
                onChange={e => setCategoryFilter(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm"
              >
                <option value="all">هەمووی</option>
                {Array.from(new Set(sales.map(s => s.category).filter(Boolean))).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ڕیزکردن بەپێی کۆی گشتی:</span>
              <div className="flex p-1 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <button 
                  onClick={() => setSortByTotal('none')} 
                  className={cn("px-3 py-1.5 text-[10px] font-black rounded-lg transition-all", sortByTotal === 'none' ? "bg-white dark:bg-slate-700 text-teal-600 shadow-sm" : "text-slate-500")}
                >
                  سەرەتا
                </button>
                <button 
                  onClick={() => setSortByTotal('asc')} 
                  className={cn("px-3 py-1.5 text-[10px] font-black rounded-lg transition-all flex items-center gap-1", sortByTotal === 'asc' ? "bg-white dark:bg-slate-700 text-teal-600 shadow-sm" : "text-slate-500")}
                >
                  <ArrowUpDown size={12} className="rotate-180" /> کەم بۆ زۆر
                </button>
                <button 
                  onClick={() => setSortByTotal('desc')} 
                  className={cn("px-3 py-1.5 text-[10px] font-black rounded-lg transition-all flex items-center gap-1", sortByTotal === 'desc' ? "bg-white dark:bg-slate-700 text-teal-600 shadow-sm" : "text-slate-500")}
                >
                  <ArrowUpDown size={12} /> زۆر بۆ کەم
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setDriverFilter('');
                setStartDate('');
                setEndDate('');
                setPaymentMethodFilter('all');
                setCategoryFilter('all');
                setSortByTotal('none');
              }}
              className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
            >
              <X size={14} />
              پاککردنەوەی فلتەرەکان
            </button>
          </div>
        </motion.div>
      )}
      <div className="space-y-3">
        {history.length === 0 ? (
          <div className="text-center p-12 text-slate-400 dark:text-slate-600">هیچ وەسڵێک نییە</div>
        ) : (
          history.map((h: any) => (
            <div key={h.receiptId || h.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-start border-b dark:border-slate-800 pb-2">
                <div>
                  <b className="text-slate-700 dark:text-slate-200 block">{h.customerName}</b>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{h.date} | {h.paymentMethod === 'cash' ? 'نەختینە' : 'قەرز'}</span>
                    {h.items[0]?.driverName && (
                      <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">• {h.items[0].driverName}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg font-mono text-slate-500">{h.receiptId || 'وەسڵی کۆن'}</span>
                  <button onClick={() => printReceipt(h)} className="text-teal-600 dark:text-teal-400 p-1 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg"><Printer size={14} /></button>
                </div>
              </div>
              <div className="space-y-1">
                {h.items.map((item: Sale) => (
                  <div key={item.id} className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>{item.itemName} x {item.quantity}</span>
                    <span>{item.total.toLocaleString()} {currency}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 border-t dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500">کۆی گشتی:</span>
                <b className="text-lg text-emerald-600 dark:text-emerald-400">{h.total.toLocaleString()} {currency}</b>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Print Preview Modal */}
      {showPrintPreview && selectedReceipt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md no-print">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg flex flex-col shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-black text-2xl text-slate-800 dark:text-slate-100">پیشاندانی وەسڵ</h3>
              <button onClick={() => setShowPrintPreview(false)} className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-slate-500 transition-all">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto max-h-[60vh]">
              <div id="printable-receipt" className="bg-white text-black p-4 rounded-xl border border-slate-200 overflow-x-auto">
                <PrintableInvoice 
                  receiptId={selectedReceipt.receiptId || selectedReceipt.id.toString()}
                  date={selectedReceipt.date}
                  customer={selectedReceipt.customer}
                  customerName={selectedReceipt.customerName}
                  items={selectedReceipt.items}
                  total={selectedReceipt.total}
                  currency={currency}
                  products={products}
                  template={invoiceTemplate}
                />
              </div>
            </div>
            
            <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex gap-4">
              <button onClick={() => setShowPrintPreview(false)} className="flex-1 py-4 rounded-2xl font-black text-sm bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all active:scale-95">
                داخستن
              </button>
              <button onClick={handlePrint} className="flex-[2] bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-200 dark:shadow-none active:scale-95 flex items-center justify-center gap-2">
                <Printer size={20} />
                چاپکردن
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
