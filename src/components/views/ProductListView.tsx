import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Search, 
  Download, 
  Printer, 
  Filter, 
  ArrowUpDown, 
  Edit3, 
  Check, 
  X, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Barcode 
} from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import JsBarcode from 'jsbarcode';
import { Card } from '../ui/Card';
import { Product } from '../../types';
import { cn } from '../../lib/utils';

interface ProductListViewProps {
  products: Product[];
  currency: string;
  onPrint: (title: string, content: string) => void;
  onUpdate: (updatedProducts: Product[]) => void;
  onBack: () => void;
}

export function ProductListView({ products, currency, onPrint, onUpdate, onBack }: ProductListViewProps) {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'category'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                             p.barcode.includes(search) || 
                             (p.category && p.category.toLowerCase().includes(search.toLowerCase()));
        const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'name') comparison = a.name.localeCompare(b.name);
        if (sortBy === 'price') comparison = a.price - b.price;
        if (sortBy === 'stock') comparison = a.stock - b.stock;
        if (sortBy === 'category') comparison = (a.category || '').localeCompare(b.category || '');
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [products, search, sortBy, sortOrder, filterCategory]);

  const handleSort = (key: typeof sortBy) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const handleExport = () => {
    const data = filteredAndSortedProducts.map(p => ({
      'ناو': p.name,
      'باڕکۆد': p.barcode,
      'جۆر': p.category || 'دیاری نەکراو',
      'نرخ': p.price,
      'بڕ': p.stock,
      'یەکە': p.unit,
      'کۆی نرخ': p.price * p.stock
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, `products_report_${new Date().toLocaleDateString()}.xlsx`);
    toast.success("لیستەکە هەناردەی ئێکسڵ کرا");
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html dir="rtl">
        <head>
          <title>لیستی کاڵاکان</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: right; }
            th { background-color: #f8f9fa; font-weight: bold; }
            h1 { text-align: center; color: #333; }
            .header-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <h1>لیستی کاڵاکان</h1>
          <div class="header-info">
            <span>بەروار: ${new Date().toLocaleDateString('ku-IQ')}</span>
            <span>کۆی کاڵاکان: ${filteredAndSortedProducts.length}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>ناو</th>
                <th>باڕکۆد</th>
                <th>جۆر</th>
                <th>نرخ</th>
                <th>بڕ</th>
                <th>کۆی نرخ</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAndSortedProducts.map(p => `
                <tr>
                  <td>${p.name}</td>
                  <td>${p.barcode}</td>
                  <td>${p.category || '-'}</td>
                  <td>${p.price.toLocaleString()}</td>
                  <td>${p.stock} ${p.unit}</td>
                  <td>${(p.price * p.stock).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const startEditing = (p: Product) => {
    setEditingId(p.id);
    setEditForm({ ...p });
  };

  const saveEdit = () => {
    if (!editingId) return;
    const updated = products.map(p => p.id === editingId ? { ...p, ...editForm } as Product : p);
    onUpdate(updated);
    setEditingId(null);
    toast.success("گۆڕانکارییەکان پاشەکەوت کران");
  };

  const generateBarcode = (barcode: string) => {
    const canvas = document.createElement('canvas');
    try {
      JsBarcode(canvas, barcode, { format: "CODE128", width: 2, height: 100, displayValue: true });
      const img = canvas.toDataURL("image/png");
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`<img src="${img}" style="width: 300px; margin: 20px auto; display: block;">`);
        printWindow.document.close();
        printWindow.print();
      }
    } catch (e) {
      toast.error("هەڵە لە دروستکردنی باڕکۆد");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 pb-20 max-w-7xl mx-auto" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-95">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="font-black text-3xl tracking-tight text-slate-800 dark:text-slate-100">لیستی هەموو کاڵاکان</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mt-1">بینین و دەستکاریکردنی هەموو کاڵاکانی کۆگا</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl font-black text-sm border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 transition-all active:scale-95">
            <Download size={18} />
            هەناردەی ئێکسڵ
          </button>
          <button onClick={handlePrint} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-all active:scale-95">
            <Printer size={18} />
            چاپکردن
          </button>
        </div>
      </div>

      <Card className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="گەڕان بەپێی ناو، باڕکۆد، جۆر..." 
            className="w-full py-5 pr-14 pl-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-3xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-bold text-sm text-slate-900 dark:text-slate-100"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button onClick={() => setShowFilters(!showFilters)} className={cn("p-5 rounded-2xl transition-all border", showFilters ? "bg-emerald-500 text-white border-emerald-500" : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-800")}>
            <Filter size={20} />
          </button>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="flex-1 md:w-48 p-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none font-black text-xs text-slate-700 dark:text-slate-200 appearance-none text-center">
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'هەموو جۆرەکان' : cat}</option>
            ))}
          </select>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedProducts.map(p => (
          <motion.div 
            layout
            key={p.id} 
            className={cn(
              "item-card group",
              editingId === p.id ? "ring-2 ring-emerald-500 bg-emerald-500/5" : ""
            )}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl font-black group-hover:scale-110 transition-transform">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-lg leading-tight">{p.name}</h3>
                  <span className="text-[10px] font-black theme-muted uppercase tracking-widest">{p.category || 'گشتی'}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-mono-data text-xs theme-muted opacity-60">{p.barcode}</span>
                <button onClick={() => generateBarcode(p.barcode)} className="p-2 theme-muted hover:text-emerald-500 transition-colors">
                  <Barcode size={14} />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black theme-muted uppercase tracking-widest mb-1">نرخی تاک</p>
                  <p className="text-2xl font-black text-emerald-500 font-mono-data">
                    {p.price.toLocaleString()} <span className="text-xs font-normal opacity-60">{currency}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black theme-muted uppercase tracking-widest mb-1">بڕی بەردەست</p>
                  <div className="flex items-center gap-2 justify-end">
                    <span className={cn("text-xl font-black font-mono-data", p.stock <= (p.minStock || 5) ? "text-red-500" : "text-white")}>
                      {p.stock}
                    </span>
                    <span className="text-[10px] font-black theme-muted">{p.unit}</span>
                    {p.stock <= (p.minStock || 5) && <AlertTriangle size={14} className="text-red-500 animate-pulse" />}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <button 
                  onClick={() => setSelectedProductForDetail(p)}
                  className="text-[10px] font-black text-emerald-500 hover:underline"
                >
                  بینینی وردەکاری
                </button>
                <div className="flex gap-2">
                  {editingId === p.id ? (
                    <>
                      <button onClick={saveEdit} className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg active:scale-95 transition-all">
                        <Check size={18} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-3 bg-white/10 text-white rounded-xl active:scale-95 transition-all">
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => startEditing(p)} className="p-3 bg-white/5 hover:bg-emerald-500/20 text-white/40 hover:text-emerald-500 rounded-xl transition-all active:scale-95">
                      <Edit3 size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {editingId === p.id && (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-sm p-6 flex flex-col gap-4 z-20">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-black text-sm uppercase tracking-widest">دەستکاریکردن</h4>
                  <button onClick={() => setEditingId(null)}><X size={20} /></button>
                </div>
                <div className="space-y-3">
                  <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="ناوی کاڵا" className="w-full" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})} placeholder="نرخ" className="w-full" />
                    <input type="number" value={editForm.stock} onChange={e => setEditForm({...editForm, stock: parseFloat(e.target.value)})} placeholder="بڕ" className="w-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={editForm.unit} onChange={e => setEditForm({...editForm, unit: e.target.value})} placeholder="یەکە" className="w-full" />
                    <input type="text" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} placeholder="جۆر" className="w-full" />
                  </div>
                </div>
                <button onClick={saveEdit} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black mt-auto">پاشەکەوتکردن</button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {selectedProductForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 dark:border-slate-800">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-2xl text-slate-800 dark:text-slate-100">{selectedProductForDetail.name}</h3>
                  <p className="text-xs font-bold text-slate-500 mt-1">کۆدی کاڵا: {selectedProductForDetail.barcode}</p>
                </div>
                <button onClick={() => setSelectedProductForDetail(null)} className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-slate-500 transition-all">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">بڕی بەردەست</p>
                    <p className="text-xl font-black">{selectedProductForDetail.stock} {selectedProductForDetail.unit}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">کەمترین بڕ</p>
                    <p className="text-xl font-black">{selectedProductForDetail.minStock} {selectedProductForDetail.unit}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">نرخی کڕین</p>
                    <p className="text-xl font-black">{selectedProductForDetail.cost.toLocaleString()} {currency}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">نرخی فرۆشتن</p>
                    <p className="text-xl font-black text-emerald-500">{selectedProductForDetail.price.toLocaleString()} {currency}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-black text-lg flex items-center gap-2">
                    <TrendingUp size={18} className="text-emerald-500" />
                    زانیاری زیاتر
                  </h4>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-bold">جۆری کاڵا:</span>
                      <span className="font-black">{selectedProductForDetail.category || 'گشتی'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-bold">بەرواری بەسەرچوون:</span>
                      <span className="font-black text-orange-500">{selectedProductForDetail.expiryDate || 'دیاری نەکراوە'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-bold">داشکاندن:</span>
                      <span className="font-black text-emerald-500">{selectedProductForDetail.discount || 0}%</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-3xl">
                  <p className="text-xs font-bold text-amber-700 dark:text-amber-400 leading-relaxed">
                    تێبینی: بۆ بینینی مێژووی فرۆشتن و وردەکاری زیاتر، دەتوانیت سەردانی بەشی ڕاپۆرتەکان بکەیت و گەڕان بۆ ئەم کاڵایە بکەیت.
                  </p>
                </div>
              </div>
              
              <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                <button onClick={() => setSelectedProductForDetail(null)} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-sm transition-all active:scale-95">
                  داخستن
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
