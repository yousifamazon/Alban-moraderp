import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft 
} from 'lucide-react';
import { Sale, Customer } from '../../types';

interface CustomerListViewProps {
  customers: Customer[];
  sales: Sale[];
  currency: string;
  onBack: () => void;
}

export function CustomerListView({ customers, sales, currency, onBack }: CustomerListViewProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={onBack} className="p-3 rounded-2xl bg-current/5 hover:bg-current/10 transition-all">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-black tracking-tight">لیستی کڕیارەکان</h2>
          <p className="text-[10px] font-bold theme-muted uppercase tracking-widest mt-1">بەڕێوەبردنی زانیاری و مێژووی کڕیارەکان</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {!customers || customers.length === 0 ? (
          <div className="col-span-full text-center p-20 item-card theme-muted italic">هیچ کڕیارێک نییە</div>
        ) : (
          customers.map((c) => (
            <div key={c.id} className="item-card p-8 flex-row justify-between items-center group">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
                  {c.name.charAt(0)}
                </div>
                <div className="text-right">
                  <h3 className="font-black text-xl tracking-tight mb-1">{c.name}</h3>
                  <span className="text-[10px] font-black theme-muted uppercase tracking-widest">
                    {c.phone || 'بەبێ ژمارە'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono-data">
                  {sales.filter(s => s.customerName === c.name).length}
                </span>
                <span className="text-[10px] font-black theme-muted block mt-1 uppercase tracking-widest">وەسڵ</span>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
