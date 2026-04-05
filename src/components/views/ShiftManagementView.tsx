import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Plus, 
  Wallet 
} from 'lucide-react';
import { ERPData, Shift } from '../../types';

interface ShiftManagementViewProps {
  data: ERPData;
  onSave: (s: Shift) => void;
  onUpdate: (s: Shift) => void;
  onBack: () => void;
}

export function ShiftManagementView({ data, onSave, onUpdate, onBack }: ShiftManagementViewProps) {
  const [showOpen, setShowOpen] = useState(false);
  const [showClose, setShowClose] = useState(false);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [openingCash, setOpeningCash] = useState('');
  const [closingCashInput, setClosingCashInput] = useState('');

  const shifts = data.shifts || [];
  const activeShift = shifts.find(s => s.status === 'open');
  const currency = data.settings.currency;

  const handleOpenShift = () => {
    if (!employeeId || !openingCash) return;
    const employee = data.employees?.find(e => e.id === employeeId);
    const newShift: Shift = {
      id: Date.now(),
      employeeId,
      startTime: new Date().toISOString(),
      openingCash: parseFloat(openingCash),
      status: 'open',
      cashierName: employee?.name || 'نەناسراو'
    };
    onSave(newShift);
    setShowOpen(false);
    setEmployeeId(null);
    setOpeningCash('');
  };

  const calculateShiftStats = (shift: Shift) => {
    const startTime = new Date(shift.startTime).getTime();
    const endTime = shift.endTime ? new Date(shift.endTime).getTime() : Date.now();

    const shiftSales = data.sales.filter(s => s.id >= startTime && s.id <= endTime);
    const cashSales = shiftSales.reduce((sum, s) => sum + (s.paidAmount || (s.paymentMethod === 'cash' ? s.total : 0)), 0);
    const qistSales = shiftSales.filter(s => s.paymentMethod === 'qist').reduce((sum, s) => sum + s.total, 0);

    const shiftExpenses = data.expenses.filter(e => e.id >= startTime && e.id <= endTime);
    const totalExpenses = shiftExpenses.reduce((sum, e) => sum + e.amount, 0);

    const shiftReturns = (data.returns || []).filter(r => r.id >= startTime && r.id <= endTime);
    const totalReturns = shiftReturns.reduce((sum, r) => sum + r.totalRefund, 0);

    const shiftCustomerPayments = data.payments.filter(p => p.id >= startTime && p.id <= endTime);
    const totalCustomerPayments = shiftCustomerPayments.reduce((sum, p) => sum + p.amount, 0);

    const shiftSupplierPayments = (data.supplierPayments || []).filter(p => p.id >= startTime && p.id <= endTime);
    const totalSupplierPayments = shiftSupplierPayments.reduce((sum, p) => sum + p.amount, 0);

    const shiftSalaryPayments = (data.salaryPayments || []).filter(p => p.id >= startTime && p.id <= endTime);
    const totalSalaryPayments = shiftSalaryPayments.reduce((sum, p) => sum + p.amount, 0);

    const expectedCash = shift.openingCash + cashSales + totalCustomerPayments - totalExpenses - totalSupplierPayments - totalSalaryPayments;

    return {
      cashSales,
      qistSales,
      totalExpenses,
      totalReturns,
      totalCustomerPayments,
      totalSupplierPayments,
      totalSalaryPayments,
      expectedCash
    };
  };

  const handleCloseShift = () => {
    if (!activeShift) return;
    
    const closingCash = parseFloat(closingCashInput);
    if (isNaN(closingCash)) return;

    const stats = calculateShiftStats(activeShift);

    onUpdate({
      ...activeShift,
      endTime: new Date().toISOString(),
      closingCash,
      expectedCash: stats.expectedCash,
      status: 'closed'
    });
    setShowClose(false);
    setClosingCashInput('');
  };

  const stats = activeShift ? calculateShiftStats(activeShift) : null;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-emerald-600 dark:text-emerald-400">سندوق و شەفت</h2>
        </div>
        {!activeShift && (
          <button onClick={() => setShowOpen(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-transform">
            <Plus size={18} /> کردنەوەی شەفت
          </button>
        )}
      </div>

      {activeShift && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-6 rounded-3xl space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-300">
                <Wallet size={24} />
              </div>
              <div>
                <h3 className="font-black text-emerald-800 dark:text-emerald-400 text-xl">شەفتی کراوە</h3>
                <p className="text-emerald-600 dark:text-emerald-500 font-bold">کاشێر: {activeShift.cashierName}</p>
              </div>
            </div>
            <div className="text-right bg-white dark:bg-slate-900 px-4 py-2 rounded-xl shadow-sm">
              <p className="text-xs text-slate-500 mb-1">کاتی دەستپێک</p>
              <p className="font-bold text-slate-800 dark:text-slate-200">{new Date(activeShift.startTime).toLocaleTimeString('ku-IQ')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl flex flex-col shadow-sm border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold mb-1">کاشی سەرەتا</span>
              <b className="text-slate-800 dark:text-slate-200">{activeShift.openingCash.toLocaleString()}</b>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl flex flex-col shadow-sm border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold mb-1">فرۆشتنی کاش</span>
              <b className="text-emerald-600 dark:text-emerald-400">{stats?.cashSales.toLocaleString()}</b>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl flex flex-col shadow-sm border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold mb-1">خەرجییەکان</span>
              <b className="text-red-500">{stats?.totalExpenses.toLocaleString()}</b>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl flex flex-col shadow-sm border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold mb-1">کاشی چاوەڕوانکراو</span>
              <b className="text-blue-600 dark:text-blue-400">{stats?.expectedCash.toLocaleString()}</b>
            </div>
          </div>

          <button onClick={() => setShowClose(true)} className="w-full bg-emerald-600 text-white p-4 rounded-2xl font-bold active:scale-95 transition-transform">
            داخستنی شەفت
          </button>
        </div>
      )}

      {showOpen && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">کردنەوەی شەفتی نوێ</h3>
          <select value={employeeId || ''} onChange={e => setEmployeeId(Number(e.target.value))} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
            <option value="">هەڵبژاردنی کارمەند...</option>
            {data.employees?.filter(e => e.status === 'active').map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <input type="number" value={openingCash} onChange={e => setOpeningCash(e.target.value)} placeholder="کاشی سەرەتا" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          <button onClick={handleOpenShift} className="w-full bg-emerald-600 text-white p-4 rounded-2xl font-bold active:scale-95 transition-transform">دەستپێکردن</button>
        </div>
      )}

      {showClose && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">داخستنی شەفت</h3>
          <input type="number" value={closingCashInput} onChange={e => setClosingCashInput(e.target.value)} placeholder="کاشی کۆتایی" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          <button onClick={handleCloseShift} className="w-full bg-red-600 text-white p-4 rounded-2xl font-bold active:scale-95 transition-transform">داخستن و پاشەکەوتکردن</button>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 px-2">مێژووی شەفتەکان</h3>
        {shifts.slice().reverse().map(s => (
          <div key={s.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div className="space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-200 block">{s.cashierName}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">{new Date(s.startTime).toLocaleDateString('ku-IQ')}</span>
            </div>
            <div className="text-right">
              <span className={`text-[10px] font-bold uppercase ${s.status === 'open' ? 'text-emerald-500' : 'text-slate-400'}`}>{s.status === 'open' ? 'کراوە' : 'داخراوە'}</span>
              <b className="block text-slate-700 dark:text-slate-300">{s.closingCash?.toLocaleString() || s.openingCash.toLocaleString()}</b>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
