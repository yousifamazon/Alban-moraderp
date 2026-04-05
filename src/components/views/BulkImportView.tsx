import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Product } from '../../types';

interface BulkImportViewProps {
  onImport: (products: Product[]) => void;
  onBack: () => void;
}

export function BulkImportView({ onImport, onBack }: BulkImportViewProps) {
  const [fileData, setFileData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [step, setStep] = useState<1 | 2>(1);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      if (data.length > 0) {
        setFileData(data);
        setColumns(Object.keys(data[0] as object));
        setStep(2);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = () => {
    const products: Product[] = fileData.map((row, idx) => ({
      id: Date.now() + idx,
      name: row[mapping['name']] || 'بێ ناو',
      barcode: row[mapping['barcode']] || Math.floor(Math.random() * 1000000000).toString(),
      category: row[mapping['category']] || 'گشتی',
      cost: parseFloat(row[mapping['cost']]) || 0,
      price: parseFloat(row[mapping['price']]) || 0,
      stock: parseFloat(row[mapping['stock']]) || 0,
      minStock: parseFloat(row[mapping['minStock']]) || 5,
      expiryDate: row[mapping['expiryDate']] || '',
      discount: parseFloat(row[mapping['discount']]) || 0,
      unit: row[mapping['unit']] || 'دانە'
    }));

    onImport(products);
    onBack();
  };

  const fields = [
    { key: 'name', label: 'ناوی کاڵا' },
    { key: 'barcode', label: 'بارکۆد' },
    { key: 'category', label: 'جۆر (بەش)' },
    { key: 'cost', label: 'تێچووی کڕین' },
    { key: 'price', label: 'نرخی فرۆشتن' },
    { key: 'stock', label: 'بڕ (Stock)' },
    { key: 'unit', label: 'یەکەی پێوانە (Unit)' },
    { key: 'minStock', label: 'کەمترین بڕ' },
    { key: 'expiryDate', label: 'بەرواری بەسەرچوون' },
    { key: 'discount', label: 'داشکان' }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-24 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={onBack} className="p-3 rounded-2xl bg-current/5 hover:bg-current/10 transition-all">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-black tracking-tight">هاوردەکردنی کاڵا</h2>
          <p className="text-[10px] font-bold theme-muted uppercase tracking-widest mt-1">هاوردەکردنی بەکۆمەڵ لە ڕێگەی فایلی Excel</p>
        </div>
      </div>

      {step === 1 ? (
        <div className="pro-card p-20 border-2 border-dashed theme-border bg-current/5 text-center space-y-8 group hover:border-current/20 transition-all">
          <div className="w-24 h-24 bg-current/10 rounded-[2.5rem] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <Download size={40} className="opacity-40" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black">فایلی Excel هەڵبژێرە</h3>
            <p className="text-xs theme-muted font-bold opacity-60 tracking-wide">تکایە فایلی .xlsx یان .xls بەکاربهێنە</p>
          </div>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" id="excel-upload" />
          <label 
            htmlFor="excel-upload" 
            className="inline-block bg-current text-inherit px-10 py-5 rounded-2xl font-black text-sm cursor-pointer hover:scale-[1.05] active:scale-95 transition-all shadow-2xl"
          >
            هەڵبژاردنی فایل
          </label>
        </div>
      ) : (
        <div className="pro-card p-12 border-none bg-current/5 space-y-12">
          <div className="space-y-8">
            <h3 className="text-lg font-black tracking-tight">دیاریکردنی ستوونەکان (Mapping)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {fields.map(f => (
                <div key={f.key} className="space-y-3">
                  <label className="text-[10px] font-black theme-muted uppercase tracking-[0.2em] mr-2">{f.label}</label>
                  <select 
                    value={mapping[f.key] || ''} 
                    onChange={e => setMapping({...mapping, [f.key]: e.target.value})}
                    className="w-full p-4 bg-current/5 border-none rounded-xl outline-none font-bold text-xs focus:ring-2 ring-current/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">هەڵبژێرە...</option>
                    {columns.map(col => <option key={col} value={col}>{col}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={handleImport} 
            className="w-full bg-current text-inherit py-5 rounded-2xl font-black text-sm shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            تەواوکردنی هاوردەکردن
          </button>
        </div>
      )}
    </motion.div>
  );
}
