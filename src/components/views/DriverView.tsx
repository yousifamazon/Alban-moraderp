import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Search, 
  User, 
  Truck, 
  Plus, 
  Minus, 
  Trash2, 
  Save, 
  X, 
  CheckCircle2, 
  Package 
} from 'lucide-react';
import { toast } from 'sonner';
import { Product, Customer, DraftOrder, Driver } from '../../types';
import { cn, customConfirm } from '../../lib/utils';

interface DriverViewProps {
  products: Product[];
  customers: Customer[];
  drivers: Driver[];
  currency: string;
  darkMode: boolean;
  onSaveDraft: (d: DraftOrder) => void;
  onBack: () => void;
}

export function DriverView({ products, customers, drivers, currency, darkMode, onSaveDraft, onBack }: DriverViewProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [driverName, setDriverName] = useState('');
  const [orderItems, setOrderItems] = useState<{ productId: number; quantity: number }[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qist'>('cash');
  const [paidAmount, setPaidAmount] = useState<string>('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.barcode.includes(productSearch)
  );

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone.includes(customerSearch)
  );

  const addItem = (product: Product) => {
    const existing = orderItems.find(item => item.productId === product.id);
    if (existing) {
      setOrderItems(orderItems.map(item => 
        item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setOrderItems([...orderItems, { productId: product.id, quantity: 1 }]);
    }
    toast.success(`${product.name} زیادکرا`);
  };

  const updateQuantity = (productId: number, delta: number) => {
    setOrderItems(orderItems.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(0.1, item.quantity + delta);
        return { ...item, quantity: parseFloat(newQty.toFixed(2)) };
      }
      return item;
    }));
  };

  const removeItem = (productId: number) => {
    setOrderItems(orderItems.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleSaveOrder = async () => {
    if (!driverName) return toast.error("تکایە ناوی شۆفێر بنووسە");
    if (orderItems.length === 0) return toast.error("تکایە کاڵا زیاد بکە");

    const newOrder: DraftOrder = {
      id: Date.now(),
      driverName: driverName,
      customerName: selectedCustomer ? selectedCustomer.name : 'کڕیاری نەختینە',
      items: orderItems.map(item => {
        const p = products.find(prod => prod.id === item.productId)!;
        return {
          productId: p.id,
          itemName: p.name,
          quantity: item.quantity,
          price: p.price,
          total: p.price * item.quantity
        };
      }),
      totalAmount: calculateTotal(),
      date: new Date().toLocaleDateString('ku-IQ'),
      status: 'pending',
      paymentMethod,
      paidAmount: paymentMethod === 'qist' ? (parseFloat(paidAmount) || 0) : calculateTotal()
    };

    onSaveDraft(newOrder);
    toast.success("وەصڵەکە بەسەرکەوتوویی نێردرا بۆ محاسب");
    
    // Reset form
    setSelectedCustomer(null);
    setDriverName('');
    setOrderItems([]);
    setPaymentMethod('cash');
    setPaidAmount('');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-6xl mx-auto pb-20" dir="rtl">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-95">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="font-black text-3xl tracking-tight text-slate-800 dark:text-slate-100">ئامادەکردنی وەصڵ (شۆفێر)</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mt-1">دروستکردنی وەصڵی کاتی و ناردنی ڕاستەوخۆ بۆ محاسب</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">سیستەمی شۆفێر</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">کڕیار</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowCustomerModal(true)} className={cn("flex-1 p-5 flex items-center justify-between rounded-2xl border-2 border-dashed transition-all active:scale-[0.98]", selectedCustomer ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-300")}>
                    {selectedCustomer ? (
                      <div className="flex items-center gap-4 text-right">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black">
                          {selectedCustomer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-sm text-slate-800 dark:text-slate-100">{selectedCustomer.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold">{selectedCustomer.phone}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 text-slate-400">
                        <User size={20} />
                        <span className="font-bold text-sm italic">دیاریکردنی کڕیار (ئارەزوومەندانە)...</span>
                      </div>
                    )}
                    {!selectedCustomer && <Plus size={18} className="text-slate-400" />}
                  </button>
                  {selectedCustomer && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCustomer(null);
                      }} 
                      className="p-5 rounded-2xl border-2 border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                      title="لابردنی کڕیار"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">ناوی شۆفێر</label>
                <div className="relative">
                  <Truck className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    value={driverName} 
                    onChange={e => setDriverName(e.target.value)} 
                    list="drivers-list"
                    placeholder="ناوی شۆفێر بنووسە یان هەڵبژێرە..." 
                    className="w-full p-5 pr-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-bold text-sm text-slate-900 dark:text-slate-100" 
                  />
                  <datalist id="drivers-list">
                    {drivers.map(d => (
                      <option key={d.id} value={d.name} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setShowProductModal(true)} className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-slate-200 dark:shadow-none active:scale-95 transition-all">
                <Plus size={20} />
                زیادکردنی کاڵا
              </button>
            </div>

            {orderItems.length > 0 && (
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">جۆری پارەدان</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setPaymentMethod('cash')}
                    className={cn("py-4 rounded-2xl font-black text-sm transition-all", paymentMethod === 'cash' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700")}
                  >
                    نەختینە (کاش)
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('qist')}
                    className={cn("py-4 rounded-2xl font-black text-sm transition-all", paymentMethod === 'qist' ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30" : "bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700")}
                  >
                    قیست (قەرز)
                  </button>
                </div>
                
                {paymentMethod === 'qist' && (
                  <div className="space-y-3 mt-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">بڕی پارەی دراو (ئەگەر هەیە)</label>
                    <input 
                      type="number" 
                      value={paidAmount} 
                      onChange={e => setPaidAmount(e.target.value)} 
                      placeholder="نموونە: 50000" 
                      className="w-full p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-blue-500/10 transition-all font-bold text-sm text-slate-900 dark:text-slate-100" 
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {orderItems.length > 0 && (
            <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white space-y-6 shadow-xl shadow-emerald-200 dark:shadow-none">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest opacity-80">کۆی گشتی</span>
                <span className="text-3xl font-black">{calculateTotal().toLocaleString()} <span className="text-sm font-normal opacity-80">{currency}</span></span>
              </div>
              <button onClick={handleSaveOrder} className="w-full bg-white text-emerald-600 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all">
                <Save size={22} />
                ناردن بۆ محاسب
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden min-h-[600px]">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-black text-xl text-slate-800 dark:text-slate-100 flex items-center gap-3">
                <Package className="text-emerald-500" />
                کاڵا دیاریکراوەکان
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black">{orderItems.length} دانە</span>
              </h3>
              {orderItems.length > 0 && (
                <button onClick={() => setOrderItems([])} className="text-xs font-black text-red-500 hover:text-red-600 transition-colors">سڕینەوەی هەمووی</button>
              )}
            </div>

            <div className="p-4">
              {orderItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-slate-300 dark:text-slate-700">
                  <Package size={80} className="mb-6 opacity-20" />
                  <p className="font-black text-lg italic">هیچ کاڵایەک دیاری نەکراوە</p>
                  <p className="text-xs font-bold mt-2 opacity-60">تکایە کاڵاکان لێرە زیاد بکە</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orderItems.map(item => {
                    const product = products.find(p => p.id === item.productId)!;
                    return (
                      <motion.div layout key={item.productId} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 group">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-xl font-black text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 shadow-sm">
                            {product.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-black text-slate-800 dark:text-slate-100">{product.name}</h4>
                            <p className="text-[10px] font-bold text-slate-500 mt-0.5">{product.price.toLocaleString()} {currency}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <button onClick={() => updateQuantity(item.productId, -1)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 rounded-xl transition-all">
                              <Minus size={16} />
                            </button>
                            <input 
                              type="number" 
                              value={item.quantity} 
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (!isNaN(val) && val > 0) {
                                  setOrderItems(orderItems.map(i => i.productId === item.productId ? { ...i, quantity: val } : i));
                                } else if (e.target.value === '') {
                                  setOrderItems(orderItems.map(i => i.productId === item.productId ? { ...i, quantity: '' as any } : i));
                                }
                              }}
                              onBlur={(e) => {
                                if (e.target.value === '' || parseFloat(e.target.value) <= 0) {
                                  setOrderItems(orderItems.map(i => i.productId === item.productId ? { ...i, quantity: 1 } : i));
                                }
                              }}
                              className="w-16 text-center font-black text-lg text-slate-800 dark:text-slate-100 bg-transparent outline-none"
                              min="0.1"
                              step="any"
                            />
                            <button onClick={() => updateQuantity(item.productId, 1)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-500 rounded-xl transition-all">
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <div className="text-left min-w-[100px]">
                            <p className="text-lg font-black text-slate-800 dark:text-slate-100">{(product.price * item.quantity).toLocaleString()}</p>
                          </div>

                          <button onClick={() => removeItem(item.productId)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Selection Modal */}
      <AnimatePresence>
        {showCustomerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl border border-slate-100 dark:border-slate-800">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-black text-2xl text-slate-800 dark:text-slate-100">دیاریکردنی کڕیار</h3>
                <button onClick={() => setShowCustomerModal(false)} className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-slate-500 transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50">
                <div className="relative">
                  <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input type="text" value={customerSearch} onChange={e => setCustomerSearch(e.target.value)} placeholder="گەڕان بۆ کڕیار..." className="w-full p-5 pr-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-bold text-sm text-slate-900 dark:text-slate-100 shadow-sm" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {filteredCustomers.map(c => (
                  <button key={c.id} onClick={() => { setSelectedCustomer(c); setShowCustomerModal(false); }} className="w-full p-5 flex items-center justify-between bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-slate-100 dark:border-slate-800 rounded-3xl transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl font-black text-slate-700 dark:text-slate-200 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        {c.name.charAt(0)}
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-800 dark:text-slate-100">{c.name}</p>
                        <p className="text-[10px] font-bold text-slate-500">{c.phone}</p>
                      </div>
                    </div>
                    <CheckCircle2 className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Selection Modal */}
      <AnimatePresence>
        {showProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 dark:border-slate-800">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-black text-2xl text-slate-800 dark:text-slate-100">زیادکردنی کاڵا</h3>
                <button onClick={() => setShowProductModal(false)} className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-slate-500 transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50">
                <div className="relative">
                  <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input type="text" value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="گەڕان بۆ کاڵا یان باڕکۆد..." className="w-full p-5 pr-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-bold text-sm text-slate-900 dark:text-slate-100 shadow-sm" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProducts.map(p => (
                    <button key={p.id} onClick={() => addItem(p)} className="p-5 flex items-center justify-between bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-slate-100 dark:border-slate-800 rounded-3xl transition-all group">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl font-black text-slate-700 dark:text-slate-200 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                          {p.name.charAt(0)}
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-800 dark:text-slate-100">{p.name}</p>
                          <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1">{p.price.toLocaleString()} {currency}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5">کۆگا: {p.stock}</p>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <Plus size={18} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">کۆی هەمووی</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{calculateTotal().toLocaleString()} {currency}</span>
                </div>
                <button onClick={() => setShowProductModal(false)} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-200 dark:shadow-none active:scale-95 transition-all">
                  تەواو
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
