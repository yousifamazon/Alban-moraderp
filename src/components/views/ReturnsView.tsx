import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Search, 
  RotateCcw, 
  CheckCircle2 
} from 'lucide-react';
import { toast } from 'sonner';
import { Product, Sale, Customer, Return } from '../../types';

interface ReturnsViewProps {
  returns: Return[];
  sales: Sale[];
  products: Product[];
  customers: Customer[];
  currency: string;
  onSave: (r: Return, updatedProducts: Product[], updatedSales: Sale[], updatedCustomers: Customer[]) => void;
  onBack: () => void;
}

export function ReturnsView({ returns, sales, products, customers, currency, onSave, onBack }: ReturnsViewProps) {
  const [receiptId, setReceiptId] = useState('');
  const [foundSales, setFoundSales] = useState<Sale[]>([]);
  const [returnItems, setReturnItems] = useState<{saleId: number, qty: number}[]>([]);
  const [reason, setReason] = useState('');

  const searchReceipt = () => {
    const salesWithReceipt = sales.filter(s => s.receiptId === receiptId);
    
    const netSales = salesWithReceipt.reduce((acc, sale) => {
      if (!acc[sale.itemName]) {
        acc[sale.itemName] = { ...sale, quantity: 0, total: 0, discount: 0 };
      }
      acc[sale.itemName].quantity += sale.quantity;
      acc[sale.itemName].total += sale.total;
      acc[sale.itemName].discount += sale.discount;
      return acc;
    }, {} as Record<string, Sale>);

    const validSales = Object.values(netSales).filter(s => s.quantity > 0);

    if (validSales.length > 0) {
      setFoundSales(validSales);
      setReturnItems([]);
    } else {
      toast.error("وەسڵ نەدۆزرایەوە یان گەڕێندراوەتەوە");
      setFoundSales([]);
    }
  };

  const handleToggleItem = (saleId: number) => {
    const existing = returnItems.find(i => i.saleId === saleId);
    if (existing) {
      setReturnItems(returnItems.filter(i => i.saleId !== saleId));
    } else {
      setReturnItems([...returnItems, { saleId, qty: 1 }]);
    }
  };

  const updateReturnQty = (saleId: number, qty: number, maxQty: number) => {
    if (qty < 1 || qty > maxQty) return;
    setReturnItems(returnItems.map(i => i.saleId === saleId ? { ...i, qty } : i));
  };

  const processReturn = () => {
    if (foundSales.length === 0 || returnItems.length === 0) return;

    let totalRefund = 0;
    const finalReturnItems: any[] = [];
    let updatedProducts = [...products];
    let updatedSales = [...sales];
    let updatedCustomers = [...customers];

    returnItems.forEach(retItem => {
      const saleItem = foundSales.find(s => s.id === retItem.saleId);
      if (saleItem) {
        const unitPrice = (saleItem.total + saleItem.discount) / saleItem.quantity;
        const unitDiscount = saleItem.discount / saleItem.quantity;
        const itemRefund = (unitPrice - unitDiscount) * retItem.qty;
        
        totalRefund += itemRefund;
        
        const product = products.find(p => p.name === saleItem.itemName);
        
        finalReturnItems.push({
          productId: product?.id || 0,
          itemName: saleItem.itemName,
          quantity: retItem.qty,
          refundAmount: itemRefund
        });

        if (product) {
          updatedProducts = updatedProducts.map(p => 
            p.id === product.id ? { ...p, stock: p.stock + retItem.qty } : p
          );
        }

        const newSale: Sale = {
          ...saleItem,
          id: Date.now() + Math.random(),
          quantity: -retItem.qty,
          total: -itemRefund,
          discount: -unitDiscount * retItem.qty,
          date: new Date().toLocaleDateString('ku-IQ'),
          note: `گەڕانەوەی وەسڵی ${receiptId}: ${reason}`
        };
        updatedSales.push(newSale);

        if (saleItem.paymentMethod === 'qist') {
          updatedCustomers = updatedCustomers.map(c => 
            c.name === saleItem.customerName ? { ...c, debt: (c.debt || 0) - itemRefund } : c
          );
        }
      }
    });

    const newReturn: Return = {
      id: Date.now(),
      receiptId,
      customerName: foundSales[0]?.customerName || 'نادیار',
      items: finalReturnItems,
      totalRefund,
      reason,
      date: new Date().toLocaleDateString('ku-IQ')
    };

    onSave(newReturn, updatedProducts, updatedSales, updatedCustomers);
    toast.success("گەڕانەوەکە بەسەرکەوتوویی تۆمارکرا");
    onBack();
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-orange-600 dark:text-orange-400">گەڕانەوەی کاڵا (Return)</h2>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={receiptId} 
              onChange={e => setReceiptId(e.target.value)} 
              placeholder="ژمارەی وەسڵ بنووسە..." 
              className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-orange-500 transition-all" 
            />
          </div>
          <button onClick={searchReceipt} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold active:scale-95 transition-transform">گەڕان</button>
        </div>

        {foundSales.length > 0 && (
          <div className="space-y-6 pt-4 border-t border-slate-50 dark:border-slate-800">
            <div className="space-y-3">
              <h3 className="font-bold text-slate-700 dark:text-slate-300">کاڵاکانی وەسڵ</h3>
              {foundSales.map(sale => {
                const isSelected = returnItems.some(i => i.saleId === sale.id);
                const currentRet = returnItems.find(i => i.saleId === sale.id);
                return (
                  <div key={sale.id} className={`p-4 rounded-2xl border transition-all flex justify-between items-center ${isSelected ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' : 'bg-slate-50 dark:bg-slate-800 border-transparent'}`}>
                    <div className="flex items-center gap-4">
                      <button onClick={() => handleToggleItem(sale.id)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                        {isSelected && <CheckCircle2 size={16} />}
                      </button>
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-200 block">{sale.itemName}</span>
                        <span className="text-xs text-slate-500">بڕی کڕدراو: {sale.quantity}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-500">بڕی گەڕاوە:</span>
                        <input 
                          type="number" 
                          value={currentRet?.qty} 
                          onChange={e => updateReturnQty(sale.id, parseInt(e.target.value) || 1, sale.quantity)} 
                          className="w-16 p-2 bg-white dark:bg-slate-700 border border-orange-200 dark:border-orange-800 rounded-lg text-center font-bold" 
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400">هۆکاری گەڕانەوە</label>
              <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="بۆچی دەگەڕێندرێتەوە؟" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-orange-500 h-24 resize-none" />
            </div>

            <div className="flex justify-between items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl">
              <span className="font-bold text-orange-700 dark:text-orange-400">کۆی پارەی گەڕاوە:</span>
              <b className="text-xl text-orange-600 dark:text-orange-400">
                {returnItems.reduce((acc, retItem) => {
                  const saleItem = foundSales.find(s => s.id === retItem.saleId);
                  if (saleItem) {
                    const unitPrice = (saleItem.total + saleItem.discount) / saleItem.quantity;
                    const unitDiscount = saleItem.discount / saleItem.quantity;
                    return acc + (unitPrice - unitDiscount) * retItem.qty;
                  }
                  return acc;
                }, 0).toLocaleString()} {currency}
              </b>
            </div>

            <button onClick={processReturn} disabled={returnItems.length === 0} className="w-full bg-orange-600 text-white p-4 rounded-2xl font-black text-lg active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2">
              <RotateCcw size={20} /> تۆمارکردنی گەڕانەوە
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 px-2">دوایین گەڕانەوەکان</h3>
        {returns.slice().reverse().map(r => (
          <div key={r.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <b className="text-slate-700 dark:text-slate-200 block">وەسڵی {r.receiptId}</b>
                <span className="text-xs text-slate-400">{r.date}</span>
              </div>
              <b className="text-orange-600 dark:text-orange-400">{r.totalRefund.toLocaleString()} {currency}</b>
            </div>
            <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg italic">
              {r.reason || 'بێ هۆکار'}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
