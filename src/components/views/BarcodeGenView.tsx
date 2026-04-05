import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Search, 
  Plus, 
  Trash2, 
  Printer 
} from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '../../types';

interface BarcodeGenViewProps {
  products: Product[];
  onBack: () => void;
}

export function BarcodeGenView({ products, onBack }: BarcodeGenViewProps) {
  const [selectedItems, setSelectedItems] = useState<{productId: number, quantity: number}[]>([]);
  const [currentProductId, setCurrentProductId] = useState<number | ''>('');
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [search, setSearch] = useState('');
  const [showRangeSelector, setShowRangeSelector] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.barcode.includes(search) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddItem = (id?: number, qty?: number) => {
    const pid = id !== undefined ? id : currentProductId;
    const q = qty !== undefined ? qty : currentQuantity;

    if (pid === '') return;
    const existing = selectedItems.find(item => item.productId === pid);
    if (existing) {
      setSelectedItems(selectedItems.map(item => 
        item.productId === pid ? { ...item, quantity: item.quantity + q } : item
      ));
    } else {
      setSelectedItems([...selectedItems, { productId: pid as number, quantity: q }]);
    }
    if (id === undefined) {
      setCurrentProductId('');
      setCurrentQuantity(1);
    }
  };

  const handleAddAllFiltered = () => {
    const newItems = [...selectedItems];
    filteredProducts.forEach(p => {
      const existing = newItems.find(item => item.productId === p.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        newItems.push({ productId: p.id, quantity: 1 });
      }
    });
    setSelectedItems(newItems);
    setShowRangeSelector(false);
  };

  const handleRemoveItem = (id: number) => {
    setSelectedItems(selectedItems.filter(item => item.productId !== id));
  };

  const handlePrintSelected = () => {
    if (selectedItems.length === 0) return toast.error("تکایە کاڵا هەڵبژێرە");
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let html = `
      <html>
        <head>
          <title>Selected Barcodes</title>
          <style>
            body { display: flex; flex-wrap: wrap; gap: 15px; padding: 20px; font-family: sans-serif; justify-content: center; }
            .barcode-item { border: 1px solid #eee; padding: 10px; text-align: center; width: 180px; margin-bottom: 10px; page-break-inside: avoid; }
            .product-name { font-size: 11px; margin-bottom: 5px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          </style>
        </head>
        <body>
    `;

    selectedItems.forEach((item, itemIdx) => {
      const p = products.find(x => x.id === item.productId);
      if (!p) return;
      
      for (let i = 0; i < item.quantity; i++) {
        html += `
          <div class="barcode-item">
            <div class="product-name">${p.name}</div>
            <svg id="barcode-${itemIdx}-${i}"></svg>
          </div>
        `;
      }
    });

    html += `
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          <script>
            window.onload = () => {
              ${selectedItems.map((item, itemIdx) => {
                const p = products.find(x => x.id === item.productId);
                if (!p) return '';
                let scripts = '';
                for (let i = 0; i < item.quantity; i++) {
                  scripts += `
                    JsBarcode("#barcode-${itemIdx}-${i}", "${p.barcode}", {
                      format: "CODE128",
                      width: 1.2,
                      height: 40,
                      displayValue: true,
                      fontSize: 10
                    });
                  `;
                }
                return scripts;
              }).join('')}
              setTimeout(() => {
                window.print();
                window.close();
              }, 800);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handlePrintAll = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const inStockProducts = products.filter(p => p.stock > 0);
    
    let html = `
      <html>
        <head>
          <title>All Barcodes</title>
          <style>
            body { display: flex; flex-wrap: wrap; gap: 20px; padding: 20px; font-family: sans-serif; }
            .barcode-item { border: 1px solid #eee; padding: 10px; text-align: center; width: 200px; }
            .product-name { font-size: 12px; margin-bottom: 5px; font-weight: bold; }
          </style>
        </head>
        <body>
    `;

    inStockProducts.forEach(p => {
      html += `
        <div class="barcode-item">
          <div class="product-name">${p.name}</div>
          <svg id="barcode-${p.id}"></svg>
        </div>
      `;
    });

    html += `
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          <script>
            window.onload = () => {
              ${inStockProducts.map(p => `
                JsBarcode("#barcode-${p.id}", "${p.barcode}", {
                  format: "CODE128",
                  width: 1.5,
                  height: 50,
                  displayValue: true,
                  fontSize: 10
                });
              `).join('')}
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 rounded-2xl bg-current/5 hover:bg-current/10 transition-all">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-black tracking-tight">دروستکردنی بارکۆد</h2>
            <p className="text-[10px] font-bold theme-muted uppercase tracking-widest mt-1">دروستکردن و چاپکردنی بارکۆدی کاڵاکان</p>
          </div>
        </div>
        <button 
          onClick={handlePrintAll}
          className="bg-emerald-500 text-white px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
        >
          <Printer size={18} />
          چاپکردنی هەموو کاڵاکان
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="pro-card p-10 border-none bg-current/5 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-lg tracking-tight">زیادکردنی کاڵا</h3>
              <button 
                onClick={() => setShowRangeSelector(!showRangeSelector)}
                className="text-[10px] font-black uppercase tracking-widest theme-muted hover:text-current transition-colors"
              >
                {showRangeSelector ? 'بڕینی گەڕان' : 'گەڕان و زیادکردنی بەکۆمەڵ'}
              </button>
            </div>

            {showRangeSelector ? (
              <div className="space-y-6">
                <div className="relative">
                  <input 
                    type="text" 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                    placeholder="گەڕان بەپێی ناو، بارکۆد، یان جۆر..." 
                    className="w-full p-5 bg-current/5 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-current/10 transition-all pr-12"
                  />
                  <Search className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20" size={20} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black theme-muted uppercase tracking-widest">{filteredProducts.length} کاڵا دۆزرایەوە</span>
                  <button 
                    onClick={handleAddAllFiltered}
                    className="text-[10px] font-black uppercase tracking-widest bg-current text-inherit px-4 py-2 rounded-xl hover:scale-105 transition-all"
                  >
                    زیادکردنی هەموو
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredProducts.map(p => (
                    <div key={p.id} className="p-4 bg-current/5 rounded-2xl flex justify-between items-center group hover:bg-current/10 transition-all">
                      <div className="text-right">
                        <span className="text-sm font-black block">{p.name}</span>
                        <span className="text-[10px] font-bold theme-muted uppercase tracking-wider">{p.barcode}</span>
                      </div>
                      <button 
                        onClick={() => handleAddItem(p.id, 1)}
                        className="p-2 rounded-xl bg-current/10 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black theme-muted uppercase tracking-widest mr-2">کاڵا هەڵبژێرە</label>
                  <select 
                    value={currentProductId} 
                    onChange={e => setCurrentProductId(Number(e.target.value))} 
                    className="w-full p-5 bg-current/5 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-current/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">هەڵبژێرە...</option>
                    {products?.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.barcode})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black theme-muted uppercase tracking-widest mr-2">بڕ (دانە)</label>
                  <div className="flex gap-3">
                    <input 
                      type="number" 
                      value={currentQuantity} 
                      onChange={e => setCurrentQuantity(Math.max(1, parseInt(e.target.value) || 1))} 
                      className="w-full p-5 bg-current/5 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-current/10 transition-all" 
                    />
                    <button 
                      onClick={() => handleAddItem()} 
                      className="p-5 bg-current text-inherit rounded-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="pro-card p-10 border-none bg-current/5 space-y-8">
            <h3 className="font-black text-lg tracking-tight">کاڵا هەڵبژێردراوەکان</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {selectedItems.length === 0 ? (
                <div className="text-center py-12 theme-muted italic text-xs">هیچ کاڵایەک هەڵنەبژێردراوە</div>
              ) : (
                selectedItems.map(item => {
                  const p = products.find(x => x.id === item.productId);
                  return (
                    <div key={item.productId} className="flex justify-between items-center p-4 bg-current/5 rounded-2xl border border-transparent hover:border-current/10 transition-all">
                      <div className="text-right">
                        <span className="text-sm font-black block">{p?.name}</span>
                        <span className="text-[10px] font-bold theme-muted uppercase tracking-wider">{p?.barcode}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black">{item.quantity} دانە</span>
                        <button onClick={() => handleRemoveItem(item.productId)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {selectedItems.length > 0 && (
              <button 
                onClick={handlePrintSelected} 
                className="w-full bg-current text-inherit py-5 rounded-2xl font-black text-sm shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Printer size={20} />
                چاپکردنی هەڵبژێردراوەکان
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
