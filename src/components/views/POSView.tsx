import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Search, 
  User, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Save, 
  X, 
  CheckCircle2, 
  Package,
  CreditCard,
  DollarSign,
  RotateCcw,
  Printer,
  Receipt
} from 'lucide-react';
import { toast } from 'sonner';
import { Product, Customer, Sale, CustomField, User as UserType } from '../../types';
import { cn } from '../../lib/utils';
import { PrintableInvoice } from '../PrintableInvoice';

interface POSViewProps {
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  currentUser: UserType;
  currency: string;
  invoiceTemplate?: string;
  customFields?: CustomField[];
  onSaveSale: (sale: Sale[], updatedProducts: Product[], updatedCustomers: Customer[]) => void;
  onOpenReturns: () => void;
  onNavigate: (s: string) => void;
  onBack: () => void;
}

export function POSView({ products, customers, sales, currentUser, currency, invoiceTemplate, customFields = [], onSaveSale, onOpenReturns, onNavigate, onBack }: POSViewProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [generalCustomerName, setGeneralCustomerName] = useState('');
  const [generalCustomerPhone, setGeneralCustomerPhone] = useState('');
  const [orderItems, setOrderItems] = useState<{ productId: number; quantity: number }[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [productQuantities, setProductQuantities] = useState<Record<number, string>>({});
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qist'>('cash');
  const [paidAmount, setPaidAmount] = useState('');
  const [driverName, setDriverName] = useState('');
  const [note, setNote] = useState('');
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, any>>({});
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<{sales: Sale[], total: number, receiptId: string, customer?: Customer | null} | null>(null);

  const saleCustomFields = customFields.filter(f => f.entity === 'sale' && f.isVisible);

  React.useEffect(() => {
    if (showPrintPreview && lastReceipt) {
      // Small delay to ensure the modal is rendered before printing
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showPrintPreview, lastReceipt]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.barcode.includes(productSearch)
  );

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone?.includes(customerSearch)
  );

  const addItem = (product: Product) => {
    const qty = parseFloat(productQuantities[product.id]) || 1;
    const existing = orderItems.find(item => item.productId === product.id);
    if (existing) {
      setOrderItems(orderItems.map(item => 
        item.productId === product.id ? { ...item, quantity: item.quantity + qty } : item
      ));
    } else {
      setOrderItems([...orderItems, { productId: product.id, quantity: qty }]);
    }
    toast.success(`${qty} دانە لە ${product.name} زیادکرا`);
    // Reset quantity for this product
    setProductQuantities({ ...productQuantities, [product.id]: '' });
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

  const handleCompleteSale = (shouldPrint = false) => {
    if (!selectedCustomer && paymentMethod === 'qist') return toast.error("بۆ فرۆشتنی قیست دەبێت کڕیار دیاری بکەیت");
    if (orderItems.length === 0) return toast.error("تکایە کاڵا زیاد بکە");

    // Check required custom fields
    for (const field of saleCustomFields) {
      if (field.required && !customFieldValues[field.id]) {
        return toast.error(`تکایە خانەی ${field.label} پڕبکەرەوە`);
      }
    }

    const total = calculateTotal();
    
    // Check Discount Permission
    const hasDiscount = orderItems.some(item => {
      const product = products.find(p => p.id === item.productId);
      return product && product.discount && product.discount > 0;
    });

    if (hasDiscount && currentUser.role !== 'admin' && currentUser.permissions && !currentUser.permissions.canGiveDiscount) {
      return toast.error("ببورە، تۆ دەسەڵاتی پێدانی داشکانت نییە");
    }

    // Check credit limit
    if (paymentMethod === 'qist' && selectedCustomer && selectedCustomer.creditLimit) {
      const currentDebt = selectedCustomer.debt || 0;
      const newDebt = total - (parseFloat(paidAmount) || 0);
      if (currentDebt + newDebt > selectedCustomer.creditLimit) {
        return toast.error(`ئەم کڕیارە گەیشتووەتە سەقفی قەرز. سەقفی ڕێپێدراو: ${selectedCustomer.creditLimit.toLocaleString()} ${currency}`);
      }
    }

    // Sequential Receipt ID
    const nextReceiptNumber = sales.length > 0 
      ? Math.max(...sales.map(s => parseInt(s.receiptId) || 0)) + 1 
      : 1;
    const receiptId = `${nextReceiptNumber}`;
    
    const date = new Date().toLocaleDateString('ku-IQ');

    let updatedCustomers = [...customers];
    let finalCustomerName = selectedCustomer?.name || 'کڕیاری نەختینە';

    // Handle General Customer auto-registration
    if (!selectedCustomer && generalCustomerName) {
      const newCustomer: Customer = {
        id: Date.now(),
        name: generalCustomerName,
        phone: generalCustomerPhone,
        debt: 0,
        points: 0,
        tier: 'bronze'
      };
      updatedCustomers.push(newCustomer);
      finalCustomerName = generalCustomerName;
    }

    const newSales: Sale[] = orderItems.map((item, index) => {
      const product = products.find(p => p.id === item.productId)!;
      return {
        id: Date.now() + index,
        receiptId,
        customerName: finalCustomerName,
        itemName: product.name,
        itemCost: product.cost,
        quantity: item.quantity,
        discount: 0,
        total: product.price * item.quantity,
        paymentMethod,
        paidAmount: index === 0 ? (parseFloat(paidAmount) || 0) : 0,
        date,
        category: product.category,
        source: 'pos',
        driverName: driverName,
        note: note,
        ...customFieldValues // Include custom fields
      };
    });

    const updatedProducts = products.map(p => {
      const item = orderItems.find(oi => oi.productId === p.id);
      if (item) {
        return { ...p, stock: p.stock - item.quantity };
      }
      return p;
    });

    if (paymentMethod === 'qist') {
      const debtAmount = total - (parseFloat(paidAmount) || 0);
      if (selectedCustomer) {
        updatedCustomers = updatedCustomers.map(c => 
          c.id === selectedCustomer.id ? { ...c, debt: (c.debt || 0) + debtAmount } : c
        );
      } else if (generalCustomerName) {
        // Update the newly created customer's debt
        const lastIdx = updatedCustomers.length - 1;
        updatedCustomers[lastIdx].debt = debtAmount;
      }
    }

    onSaveSale(newSales, updatedProducts, updatedCustomers);
    toast.success("وەصڵەکە بە سەرکەوتوویی تۆمار کرا. دەتوانیت لە 'وەسڵەکان' بیبینیت");
    
    if (shouldPrint) {
      const updatedCustomer = updatedCustomers.find(c => c.id === selectedCustomer?.id);
      setLastReceipt({ sales: newSales, total, receiptId, customer: updatedCustomer || selectedCustomer });
      setShowPrintPreview(true);
    }

    // Reset
    setSelectedCustomer(null);
    setGeneralCustomerName('');
    setGeneralCustomerPhone('');
    setOrderItems([]);
    setPaidAmount('');
    setPaymentMethod('cash');
    setDriverName('');
    setNote('');
    setCustomFieldValues({});
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-6xl mx-auto pb-20" dir="rtl">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="p-4 bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-sm border border-white/10 transition-all active:scale-95">
            <ChevronLeft size={24} />
          </button>
          <button onClick={onOpenReturns} className="p-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl shadow-lg shadow-orange-500/20 transition-all active:scale-95 flex items-center gap-2 font-black">
            <RotateCcw size={20} /> گەڕانەوە
          </button>
          <button onClick={() => onNavigate('sales-history')} className="p-4 bg-teal-500 hover:bg-teal-600 text-white rounded-2xl shadow-lg shadow-teal-500/20 transition-all active:scale-95 flex items-center gap-2 font-black">
            <Receipt size={20} /> وەسڵەکان
          </button>
          <div>
            <h2 className="font-black text-3xl tracking-tight text-slate-800 dark:text-slate-100">فرۆشتنی نوێ (POS)</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mt-1">تۆمارکردنی فرۆشتن و دەرکردنی وەسڵ</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-white/10 space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">کڕیار</label>
                <button onClick={() => setShowCustomerModal(true)} className={cn("w-full p-5 flex items-center justify-between rounded-2xl border-2 border-dashed transition-all active:scale-[0.98]", selectedCustomer ? "bg-emerald-500/10 border-emerald-500/30" : "bg-white/5 border-white/10 hover:border-emerald-500/50")}>
                  {selectedCustomer ? (
                    <div className="flex items-center gap-4 text-right">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black">
                        {selectedCustomer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-sm text-white">{selectedCustomer.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold">{selectedCustomer.phone}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 text-slate-400">
                      <User size={20} />
                      <span className="font-bold text-sm italic">کڕیاری نەختینە (گشتی)</span>
                    </div>
                  )}
                  <Plus size={18} className="text-slate-400" />
                </button>
              </div>

              {!selectedCustomer && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">ناوی کڕیاری گشتی (ئارەزوومەندانە)</label>
                    <input 
                      type="text" 
                      value={generalCustomerName} 
                      onChange={e => setGeneralCustomerName(e.target.value)} 
                      placeholder="ناوی کڕیار" 
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-bold text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">ژمارەی مۆبایل</label>
                    <input 
                      type="text" 
                      value={generalCustomerPhone} 
                      onChange={e => setGeneralCustomerPhone(e.target.value)} 
                      placeholder="ژمارەی مۆبایل" 
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-bold text-sm" 
                    />
                  </div>
                </motion.div>
              )}

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">ناوی مەندوب (شۆفێر)</label>
                <input 
                  type="text" 
                  value={driverName} 
                  onChange={e => setDriverName(e.target.value)} 
                  placeholder="ناوی مەندوب" 
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-bold text-sm" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">تێبینی</label>
                <textarea 
                  value={note} 
                  onChange={e => setNote(e.target.value)} 
                  placeholder="تێبینی وەسڵ..." 
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-bold text-sm h-24" 
                />
              </div>

              {/* Sale Custom Fields */}
              {saleCustomFields.map(field => (
                <div key={field.id} className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <select 
                      required={field.required}
                      value={customFieldValues[field.id] || ''}
                      onChange={e => setCustomFieldValues({...customFieldValues, [field.id]: e.target.value})}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-bold text-sm"
                    >
                      <option value="">هەڵبژێرە...</option>
                      {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input 
                      type={field.type} 
                      required={field.required}
                      value={customFieldValues[field.id] || ''} 
                      onChange={e => setCustomFieldValues({...customFieldValues, [field.id]: e.target.value})} 
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-bold text-sm" 
                      placeholder={field.label}
                    />
                  )}
                </div>
              ))}

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">شێوازی پارەدان</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setPaymentMethod('cash')}
                    className={cn("p-4 rounded-2xl border-2 font-black text-xs flex flex-col items-center gap-2 transition-all", paymentMethod === 'cash' ? "bg-emerald-500 text-white border-emerald-500" : "bg-white/5 border-white/10 text-slate-400")}
                  >
                    <DollarSign size={20} />
                    نەختینە
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('qist')}
                    className={cn("p-4 rounded-2xl border-2 font-black text-xs flex flex-col items-center gap-2 transition-all", paymentMethod === 'qist' ? "bg-orange-500 text-white border-orange-500" : "bg-white/5 border-white/10 text-slate-400")}
                  >
                    <CreditCard size={20} />
                    قیست
                  </button>
                </div>
              </div>

              {paymentMethod === 'qist' && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">بڕی پارەی دراو</label>
                  <input 
                    type="number" 
                    value={paidAmount} 
                    onChange={e => setPaidAmount(e.target.value)} 
                    placeholder="0" 
                    className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-bold text-sm text-white" 
                  />
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/10">
              <button onClick={() => setShowProductModal(true)} className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-white/10 active:scale-95 transition-all">
                <Plus size={20} />
                زیادکردنی کاڵا
              </button>
            </div>
          </div>

          {orderItems.length > 0 && (
            <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white space-y-6 shadow-xl shadow-emerald-200 dark:shadow-none">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest opacity-80">کۆی گشتی</span>
                <span className="text-3xl font-black">{calculateTotal().toLocaleString()} <span className="text-sm font-normal opacity-80">{currency}</span></span>
              </div>
              <div className="flex flex-col gap-3">
                <button onClick={() => handleCompleteSale(false)} className="w-full bg-white text-emerald-600 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Save size={22} />
                  تەواوکردنی فرۆشتن
                </button>
                <button onClick={() => handleCompleteSale(true)} className="w-full bg-emerald-700 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all border-2 border-emerald-400/30">
                  <Printer size={22} />
                  پاشەکەوت و چاپکردن
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-8">
          <div className="bg-slate-900 rounded-[2.5rem] shadow-sm border border-white/10 overflow-hidden min-h-[600px]">
            <div className="p-8 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-black text-xl text-white flex items-center gap-3">
                <Package className="text-emerald-500" />
                کاڵا دیاریکراوەکان
                <span className="bg-white/5 text-slate-400 px-3 py-1 rounded-full text-[10px] font-black">{orderItems.length} دانە</span>
              </h3>
              {orderItems.length > 0 && (
                <button onClick={() => setOrderItems([])} className="text-xs font-black text-red-500 hover:text-red-600 transition-colors">سڕینەوەی هەمووی</button>
              )}
            </div>

            <div className="p-4">
              {orderItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-slate-700">
                  <Package size={80} className="mb-6 opacity-20" />
                  <p className="font-black text-lg italic">هیچ کاڵایەک دیاری نەکراوە</p>
                  <p className="text-xs font-bold mt-2 opacity-60">تکایە کاڵاکان لێرە زیاد بکە</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orderItems.map(item => {
                    const product = products.find(p => p.id === item.productId)!;
                    return (
                      <motion.div layout key={item.productId} className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/10 group">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl font-black text-white border border-white/10 shadow-sm">
                            {product.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-black text-white">{product.name}</h4>
                            <p className="text-[10px] font-bold text-slate-500 mt-0.5">{product.price.toLocaleString()} {currency}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="flex items-center gap-3 bg-slate-900 p-1.5 rounded-2xl border border-white/10 shadow-sm">
                            <button onClick={() => updateQuantity(item.productId, -1)} className="p-2 hover:bg-white/5 text-slate-400 hover:text-red-500 rounded-xl transition-all">
                              <Minus size={16} />
                            </button>
                            <input 
                              type="number" 
                              value={isNaN(item.quantity) ? '' : item.quantity} 
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (!isNaN(val)) {
                                  setOrderItems(orderItems.map(oi => oi.productId === item.productId ? { ...oi, quantity: val } : oi));
                                } else {
                                  setOrderItems(orderItems.map(oi => oi.productId === item.productId ? { ...oi, quantity: NaN } : oi));
                                }
                              }}
                              className="w-16 text-center font-black text-lg bg-transparent border-none outline-none text-white"
                            />
                            <span className="text-[10px] font-black theme-muted ml-2">{product.unit}</span>
                            <button onClick={() => updateQuantity(item.productId, 1)} className="p-2 hover:bg-white/5 text-slate-400 hover:text-emerald-500 rounded-xl transition-all">
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <div className="text-left min-w-[100px]">
                            <p className="text-lg font-black text-white">{(product.price * item.quantity).toLocaleString()}</p>
                          </div>

                          <button onClick={() => removeItem(item.productId)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
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
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-900 rounded-[2.5rem] w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl border border-white/10">
              <div className="p-8 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-black text-2xl text-white">دیاریکردنی کڕیار</h3>
                <button onClick={() => setShowCustomerModal(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 bg-white/5">
                <div className="relative">
                  <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input type="text" value={customerSearch} onChange={e => setCustomerSearch(e.target.value)} placeholder="گەڕان بۆ کڕیار..." className="w-full p-5 pr-14 bg-slate-900 border border-white/10 rounded-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-bold text-sm text-white shadow-sm" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                <button onClick={() => { setSelectedCustomer(null); setShowCustomerModal(false); }} className="w-full p-5 flex items-center justify-between bg-slate-900 hover:bg-emerald-500/10 border border-white/10 rounded-3xl transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl font-black text-white group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      G
                    </div>
                    <div className="text-right">
                      <p className="font-black text-white">کڕیاری گشتی (نەختینە)</p>
                      <p className="text-[10px] font-bold text-slate-500">بەبێ تۆمارکردنی ناو</p>
                    </div>
                  </div>
                </button>
                {filteredCustomers.map(c => (
                  <button key={c.id} onClick={() => { setSelectedCustomer(c); setShowCustomerModal(false); }} className="w-full p-5 flex items-center justify-between bg-slate-900 hover:bg-emerald-500/10 border border-white/10 rounded-3xl transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl font-black text-white group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        {c.name.charAt(0)}
                      </div>
                      <div className="text-right">
                        <p className="font-black text-white">{c.name}</p>
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
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-900 rounded-[2.5rem] w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl border border-white/10">
              <div className="p-8 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-black text-2xl text-white">زیادکردنی کاڵا</h3>
                <button onClick={() => setShowProductModal(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 bg-white/5">
                <div className="relative">
                  <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input type="text" value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="گەڕان بۆ کاڵا یان باڕکۆد..." className="w-full p-5 pr-14 bg-slate-900 border border-white/10 rounded-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all font-bold text-sm text-white shadow-sm" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProducts.map(p => (
                    <button key={p.id} onClick={() => addItem(p)} className="p-5 flex items-center justify-between bg-slate-900 hover:bg-emerald-500/10 border border-white/10 rounded-3xl transition-all group">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl font-black text-white group-hover:bg-emerald-500 group-hover:text-white transition-all">
                          {p.name.charAt(0)}
                        </div>
                        <div className="text-right">
                          <p className="font-black text-white">{p.name}</p>
                          <p className="text-xs font-black text-emerald-400 mt-1">{p.price.toLocaleString()} {currency}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5">کۆگا: {p.stock} {p.unit}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                          <input 
                            type="number" 
                            value={productQuantities[p.id] || ''} 
                            onChange={(e) => setProductQuantities({ ...productQuantities, [p.id]: e.target.value })}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="1" 
                            className="w-16 p-2 bg-white/5 border border-white/10 rounded-xl text-center font-bold text-sm text-white" 
                          />
                          <span className="text-[8px] font-black theme-muted mt-1">{p.unit}</span>
                        </div>
                        <div onClick={(e) => { e.stopPropagation(); addItem(p); }} className="p-3 bg-white/5 rounded-xl text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all cursor-pointer">
                          <Plus size={18} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-8 border-t border-white/10 bg-white/5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">کۆی هەمووی</span>
                  <span className="text-2xl font-black text-white">{calculateTotal().toLocaleString()} {currency}</span>
                </div>
                <button onClick={() => setShowProductModal(false)} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
                  تەواو
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Print Preview Modal */}
      <AnimatePresence>
        {showPrintPreview && lastReceipt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md no-print">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg flex flex-col shadow-2xl border border-slate-100 dark:border-slate-800">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-black text-2xl text-slate-800 dark:text-slate-100">پیشاندانی وەسڵ</h3>
                <button onClick={() => setShowPrintPreview(false)} className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-slate-500 transition-all">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto max-h-[60vh]">
                <div id="printable-receipt" className="bg-white text-black p-4 rounded-xl border border-slate-200 overflow-x-auto">
                  <PrintableInvoice 
                    receiptId={lastReceipt.receiptId}
                    date={lastReceipt.sales[0]?.date || new Date().toLocaleDateString('ku-IQ')}
                    customer={lastReceipt.customer}
                    customerName={lastReceipt.sales[0]?.customerName || 'کڕیاری گشتی'}
                    items={lastReceipt.sales}
                    total={lastReceipt.total}
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
                <button onClick={handlePrint} className="flex-[2] bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-200 dark:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2">
                  <Printer size={20} />
                  چاپکردن
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
