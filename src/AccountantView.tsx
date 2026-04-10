import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, CheckCheck, Receipt, User, Truck, Calendar, Plus, ShoppingCart } from 'lucide-react';
import { DraftOrder, ShopRequest } from './types';

export function AccountantView({ 
  draftOrders, 
  shopRequests,
  onConvert, 
  onApproveShopRequest,
  onBack, 
  onOpenPOS 
}: { 
  draftOrders: DraftOrder[], 
  shopRequests: ShopRequest[],
  onConvert: (o: DraftOrder) => void, 
  onApproveShopRequest: (r: ShopRequest) => void,
  onBack: () => void, 
  onOpenPOS: () => void 
}) {
  const pendingOrders = draftOrders.filter(o => o.status === 'pending');
  const pendingShopRequests = shopRequests.filter(r => r.status === 'pending');
  const [activeTab, setActiveTab] = useState<'drivers' | 'shops'>('drivers');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 rounded-2xl bg-current/5 hover:bg-current/10 transition-all">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-black tracking-tight">بەشی محاسب</h2>
            <p className="text-[10px] font-bold theme-muted uppercase tracking-widest mt-1">پێداچوونەوە و پەسەندکردنی داواکارییەکان</p>
          </div>
        </div>
        <button 
          onClick={onOpenPOS}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500 text-white text-sm font-black shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20} />
          فرۆشتنی نوێ (POS)
        </button>
      </div>

      <div className="flex gap-4 mb-8 border-b theme-border pb-4">
        <button 
          onClick={() => setActiveTab('drivers')}
          className={`px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'drivers' ? 'bg-white text-slate-900 shadow-xl shadow-white/10' : 'bg-white/5 text-white opacity-60 hover:opacity-100 hover:bg-white/10'}`}
        >
          <Truck size={18} />
          داواکاری شۆفێران
          {pendingOrders.length > 0 && <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px]">{pendingOrders.length}</span>}
        </button>
        <button 
          onClick={() => setActiveTab('shops')}
          className={`px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'shops' ? 'bg-white text-slate-900 shadow-xl shadow-white/10' : 'bg-white/5 text-white opacity-60 hover:opacity-100 hover:bg-white/10'}`}
        >
          <ShoppingCart size={18} />
          داواکاری دوکانەکان
          {pendingShopRequests.length > 0 && <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px]">{pendingShopRequests.length}</span>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {activeTab === 'drivers' && (
          pendingOrders.length === 0 ? (
            <div className="col-span-full text-center p-20 pro-card bg-current/5 theme-muted italic">هیچ داواکارییەکی چاوەڕوانکراو نییە</div>
          ) : (
            pendingOrders.map(o => (
              <div key={o.id} className="pro-card p-8 border-none bg-current/5 space-y-8 flex flex-col">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-black opacity-40 uppercase tracking-widest">
                      <Calendar size={12} />
                      {o.date}
                    </div>
                    <h3 className="font-black text-xl tracking-tight">{o.customerName}</h3>
                  </div>
                  <div className="p-3 rounded-2xl bg-current/10">
                    <Receipt size={20} className="opacity-40" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-6 border-y theme-border">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black theme-muted uppercase tracking-widest flex items-center gap-1">
                      <Truck size={10} /> سایەق
                    </span>
                    <p className="text-xs font-black">{o.driverName}</p>
                  </div>
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-black theme-muted uppercase tracking-widest">جۆری پارەدان</span>
                    <p className="text-xs font-black">{o.paymentMethod === 'qist' ? 'قیست' : 'نەختینە'}</p>
                    {o.paymentMethod === 'qist' && (
                      <div className="mt-2 text-[10px] font-bold text-slate-500">
                        پێشەکی: {(o.paidAmount || 0).toLocaleString()} <br/>
                        ماوە: {(o.totalAmount - (o.paidAmount || 0)).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <span className="text-[10px] font-black theme-muted uppercase tracking-widest">کاڵاکان</span>
                  <div className="space-y-3">
                    {o.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="font-bold opacity-70">{item.itemName} <span className="text-[10px] opacity-40">x{item.quantity}</span></span>
                        <span className="font-mono-data font-black">{item.total.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black theme-muted uppercase tracking-widest">کۆی گشتی</span>
                    <div className="text-left">
                      <span className="text-2xl font-black font-mono-data leading-none">{o.totalAmount.toLocaleString()}</span>
                      <span className="text-[10px] font-black theme-muted block mt-1 uppercase tracking-widest">IQD</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => onConvert(o)}
                    className="w-full bg-current text-inherit py-5 rounded-2xl font-black text-sm shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <CheckCheck size={20} />
                    پەسەندکردن و کردن بە وەسل
                  </button>
                </div>
              </div>
            ))
          )
        )}

        {activeTab === 'shops' && (
          pendingShopRequests.length === 0 ? (
            <div className="col-span-full text-center p-20 pro-card bg-current/5 theme-muted italic">هیچ داواکارییەکی دوکان نییە</div>
          ) : (
            pendingShopRequests.map(r => (
              <div key={r.id} className="pro-card p-8 border-none bg-current/5 space-y-8 flex flex-col">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-black opacity-40 uppercase tracking-widest">
                      <Calendar size={12} />
                      {r.date}
                    </div>
                    <h3 className="font-black text-xl tracking-tight">{r.shopName}</h3>
                  </div>
                  <div className="p-3 rounded-2xl bg-current/10">
                    <ShoppingCart size={20} className="opacity-40" />
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <span className="text-[10px] font-black theme-muted uppercase tracking-widest">کاڵا داواکراوەکان</span>
                  <div className="space-y-3">
                    {r.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="font-bold opacity-70">{item.itemName}</span>
                        <span className="font-mono-data font-black">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 space-y-6">
                  <button 
                    onClick={() => onApproveShopRequest(r)}
                    className="w-full bg-blue-500 text-white py-5 rounded-2xl font-black text-sm shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <CheckCheck size={20} />
                    پەسەندکردن و ناردنی کاڵا
                  </button>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </motion.div>
  );
}
