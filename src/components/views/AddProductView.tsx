import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, PackageOpen, Barcode, Plus } from 'lucide-react';
import { Product, CustomField } from '../../types';

interface AddProductViewProps {
  products: Product[];
  categories: string[];
  currency: string;
  customFields?: CustomField[];
  onSave: (p: Product) => void;
  onBack: () => void;
}

export function AddProductView({ products, categories, currency, customFields = [], onSave, onBack }: AddProductViewProps) {
  const [form, setForm] = useState<Record<string, any>>({
    name: '',
    barcode: '',
    category: categories[0] || 'گشتی',
    cost: '',
    price: '',
    stock: '',
    minStock: '5',
    expiryDate: '',
    discount: '0',
    unit: 'دانە'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    
    const newProduct: Product = {
      id: Date.now(),
      name: form.name,
      barcode: form.barcode || Math.floor(Math.random() * 1000000000).toString(),
      category: form.category || 'گشتی',
      cost: parseFloat(form.cost) || 0,
      price: parseFloat(form.price) || 0,
      stock: parseFloat(form.stock) || 0,
      minStock: parseFloat(form.minStock) || 5,
      expiryDate: form.expiryDate,
      discount: parseFloat(form.discount) || 0,
      unit: form.unit || 'دانە',
      ...form // Include custom fields
    };
    
    onSave(newProduct);
    onBack();
  };

  const productCustomFields = customFields.filter(f => f.entity === 'product' && f.isVisible);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-24 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-3 rounded-2xl bg-current/5 hover:bg-current/10 transition-all active:scale-95">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-black tracking-tight">زیادکردنی کاڵا</h2>
          <p className="text-xs font-bold theme-muted mt-1">تۆمارکردنی کاڵای نوێ لە سیستەم</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info Section */}
          <div className="pro-card p-8 border-none bg-current/5 space-y-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                <PackageOpen size={20} />
              </div>
              <h3 className="font-black text-lg">زانیاری سەرەکی</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">ناوی کاڵا <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  className="w-full p-4 bg-current/5 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-current/20 transition-all" 
                  placeholder="نموونە: ئاوی سێو"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">جۆری بەرهەم (بەش)</label>
                <input 
                  type="text" 
                  list="category-list"
                  value={form.category} 
                  onChange={e => setForm({...form, category: e.target.value})} 
                  className="w-full p-4 bg-current/5 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-current/20 transition-all" 
                  placeholder="جۆرێک بنووسە یان هەڵبژێرە..."
                />
                <datalist id="category-list">
                  {categories.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">بارکۆد</label>
                <div className="relative">
                  <Barcode className="absolute right-4 top-1/2 -translate-y-1/2 theme-muted" size={18} />
                  <input 
                    type="text" 
                    value={form.barcode} 
                    onChange={e => setForm({...form, barcode: e.target.value})} 
                    className="w-full p-4 pr-12 bg-current/5 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-current/20 transition-all" 
                    placeholder="بارکۆد سکان بکە یان بنووسە..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Custom Fields Section */}
          {productCustomFields.length > 0 && (
            <div className="pro-card p-8 border-none bg-current/5 space-y-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl">
                  <Plus size={20} />
                </div>
                <h3 className="font-black text-lg">زانیاری زیادە</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {productCustomFields.map(field => (
                  <div key={field.id} className="space-y-2">
                    <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'select' ? (
                      <select 
                        required={field.required}
                        value={form[field.id] || ''}
                        onChange={e => setForm({...form, [field.id]: e.target.value})}
                        className="w-full p-4 bg-current/5 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-current/20 transition-all"
                      >
                        <option value="">هەڵبژێرە...</option>
                        {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input 
                        type={field.type} 
                        required={field.required}
                        value={form[field.id] || ''} 
                        onChange={e => setForm({...form, [field.id]: e.target.value})} 
                        className="w-full p-4 bg-current/5 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-current/20 transition-all" 
                        placeholder={field.label}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inventory Section */}
          <div className="pro-card p-8 border-none bg-current/5 space-y-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-500/10 text-orange-500 rounded-xl">
                <Barcode size={20} />
              </div>
              <h3 className="font-black text-lg">کۆگا و بڕ</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">بڕی ئێستا (Stock)</label>
                <input 
                  type="number" 
                  value={form.stock} 
                  onChange={e => setForm({...form, stock: e.target.value})} 
                  className="w-full p-4 bg-current/5 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-current/20 transition-all" 
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">ئاگادارکردنەوە لە کەمترین بڕ</label>
                <input 
                  type="number" 
                  value={form.minStock} 
                  onChange={e => setForm({...form, minStock: e.target.value})} 
                  className="w-full p-4 bg-current/5 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-current/20 transition-all" 
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">یەکەی پێوانە (Unit)</label>
                <input 
                  type="text" 
                  value={form.unit} 
                  onChange={e => setForm({...form, unit: e.target.value})} 
                  className="w-full p-4 bg-current/5 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-current/20 transition-all" 
                  placeholder="دانە، کیلۆ، لیتر..."
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">بەرواری بەسەرچوون</label>
                <input 
                  type="date" 
                  value={form.expiryDate} 
                  onChange={e => setForm({...form, expiryDate: e.target.value})} 
                  className="w-full p-4 bg-current/5 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-current/20 transition-all" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Pricing Section */}
          <div className="pro-card p-8 border-none bg-current/5 space-y-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                <span className="font-black text-xs">$</span>
              </div>
              <h3 className="font-black text-lg">نرخ و تێچوو</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">تێچووی کڕین</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={form.cost} 
                    onChange={e => setForm({...form, cost: e.target.value})} 
                    className="w-full p-4 bg-current/5 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-current/20 transition-all" 
                    placeholder="0"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-30">{currency}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">نرخی فرۆشتن <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type="number" 
                    required
                    value={form.price} 
                    onChange={e => setForm({...form, price: e.target.value})} 
                    className="w-full p-4 bg-current/5 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-current/20 transition-all" 
                    placeholder="0"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-30">{currency}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">داشکان (بڕ)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={form.discount} 
                    onChange={e => setForm({...form, discount: e.target.value})} 
                    className="w-full p-4 bg-current/5 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-current/20 transition-all" 
                    placeholder="0"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-30">{currency}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t theme-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold theme-muted">قازانجی مەزەندەکراو</span>
                <span className="font-mono-data text-emerald-500 font-black">
                  {((parseFloat(form.price) || 0) - (parseFloat(form.cost) || 0)).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold theme-muted">ڕێژەی قازانج</span>
                <span className="font-mono-data text-xs opacity-40">
                  {form.price && form.cost ? (((parseFloat(form.price) - parseFloat(form.cost)) / parseFloat(form.cost)) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-6 bg-current text-inherit rounded-3xl font-black text-lg shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <PackageOpen size={24} />
            تۆمارکردنی کاڵا
          </button>
        </div>
      </form>
    </motion.div>
  );
}


