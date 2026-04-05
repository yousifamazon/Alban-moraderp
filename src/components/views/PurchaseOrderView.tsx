import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Save, 
  PackageCheck, 
  Search 
} from 'lucide-react';
import { toast } from 'sonner';
import { Product, PurchaseOrder, PurchaseOrderItem } from '../../types';

interface PurchaseOrderViewProps {
  products: Product[];
  purchaseOrders: PurchaseOrder[];
  onSaveOrder: (o: PurchaseOrder) => void;
  onUpdateOrder: (o: PurchaseOrder) => void;
  onReceiveOrder: (o: PurchaseOrder) => void;
  onBack: () => void;
}

export function PurchaseOrderView({ products, purchaseOrders, onSaveOrder, onUpdateOrder, onReceiveOrder, onBack }: PurchaseOrderViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [supplier, setSupplier] = useState('');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.barcode.includes(search)
  ) || [];

  const addItem = (p: Product) => {
    const existing = items.find(i => i.productId === p.id);
    if (existing) {
      setItems(items.map(i => i.productId === p.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setItems([...items, { productId: p.id, itemName: p.name, quantity: 1, unitCost: p.cost, total: p.cost }]);
    }
    toast.success(`${p.name} زیادکرا`);
  };

  const handleSave = () => {
    if (!supplier || items.length === 0) return toast.error("تکایە زانیارییەکان پڕ بکەرەوە");
    const newOrder: PurchaseOrder = {
      id: Date.now(),
      poNumber: `PO-${Date.now()}`,
      supplierName: supplier,
      items,
      status: 'pending',
      date: new Date().toLocaleDateString(),
      totalAmount: items.reduce((acc, i) => acc + (i.quantity * i.unitCost), 0)
    };
    onSaveOrder(newOrder);
    setSupplier('');
    setItems([]);
    setShowAdd(false);
    toast.success("داواکارییەکە پاشەکەوت کرا");
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-blue-600 dark:text-blue-400">داواکاری کڕین (Purchase Order)</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-transform">
          <Plus size={18} /> داواکاری نوێ
        </button>
      </div>

      {showAdd && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4 border-2 border-blue-100 dark:border-blue-900/30">
            <input type="text" value={supplier} onChange={e => setSupplier(e.target.value)} placeholder="ناوی کۆمپانیا / کارگە" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="گەڕان بۆ کاڵا..." className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {filteredProducts.map(p => (
                <button key={p.id} onClick={() => addItem(p)} className="w-full text-right p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex justify-between items-center group">
                  <span className="font-bold text-slate-700 dark:text-slate-200">{p.name}</span>
                  <Plus size={16} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4 border-2 border-blue-100 dark:border-blue-900/30">
            <h3 className="font-bold text-slate-700 dark:text-slate-300">لیستی داواکاری</h3>
            <div className="max-h-80 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">{item.itemName}</span>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        value={item.quantity} 
                        onChange={e => setItems(items.map(i => i.productId === item.productId ? { ...i, quantity: parseFloat(e.target.value) || 0, total: (parseFloat(e.target.value) || 0) * i.unitCost } : i))} 
                        className="w-16 p-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-center text-xs" 
                      />
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 self-center">دانە</span>
                    </div>
                  </div>
                  <button onClick={() => setItems(items.filter(i => i.productId !== item.productId))} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="font-bold text-slate-500 dark:text-slate-400">کۆی گشتی:</span>
              <b className="text-blue-600 dark:text-blue-400 text-lg">
                {items.reduce((acc, i) => acc + i.total, 0).toLocaleString()}
              </b>
            </div>
            <button onClick={handleSave} className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold active:scale-95 transition-transform flex items-center justify-center gap-2">
              <Save size={18} /> پاشەکەوتکردنی داواکاری
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {purchaseOrders?.slice().reverse().map(order => (
          <div key={order.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{order.supplierName}</h3>
                <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase ${order.status === 'received' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'}`}>
                  {order.status === 'received' ? 'وەرگیراوە' : 'لە چاوەڕوانیدایە'}
                </span>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500">{order.date}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">کاڵاکان</span>
              <div className="flex flex-wrap gap-1">
                {order.items.map(i => (
                  <span key={i.productId} className="text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700">
                    {i.itemName} ({i.quantity})
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
              <b className="text-blue-600 dark:text-blue-400">{order.totalAmount.toLocaleString()}</b>
              {order.status === 'pending' && (
                <button onClick={() => onReceiveOrder(order)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 active:scale-95 transition-transform">
                  <PackageCheck size={14} /> وەرگرتنی کاڵاکان
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
