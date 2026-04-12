import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  UserPlus, 
  Trash2, 
  DollarSign, 
  Calendar, 
  UserCheck, 
  UserX 
} from 'lucide-react';
import { toast } from 'sonner';
import { Employee, SalaryPayment } from '../../types';
import { customConfirm } from '../../lib/utils';

interface EmployeeManagementViewProps {
  employees: Employee[];
  employeePayments: SalaryPayment[];
  onSaveEmployee: (e: Employee) => void;
  onUpdateEmployee: (e: Employee) => void;
  onDeleteEmployee: (id: number) => void;
  onSavePayment: (p: SalaryPayment) => void;
  onBack: () => void;
}

export function EmployeeManagementView({ employees, employeePayments, onSaveEmployee, onUpdateEmployee, onDeleteEmployee, onSavePayment, onBack }: EmployeeManagementViewProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = () => {
    if (!name || !role || !salary) return toast.error("تکایە زانیارییەکان پڕ بکەرەوە");
    onSaveEmployee({
      id: Date.now(),
      name,
      role: role as 'admin' | 'manager' | 'cashier' | 'accountant',
      phone: '',
      salary: parseFloat(salary),
      joinDate: new Date().toLocaleDateString(),
      status: 'active'
    });
    setName('');
    setRole('');
    setSalary('');
    setShowAdd(false);
    toast.success("کارمەندەکە زیادکرا");
  };

  const handlePayment = (emp: Employee) => {
    const amount = prompt(`بڕی مووچە بۆ ${emp.name} بنووسە:`, emp.salary.toString());
    if (amount && !isNaN(parseFloat(amount))) {
      onSavePayment({
        id: Date.now(),
        employeeId: emp.id,
        employeeName: emp.name,
        amount: parseFloat(amount),
        date: new Date().toLocaleDateString(),
        month: new Date().toLocaleString('ku-IQ', { month: 'long' })
      });
      toast.success("مووچە پاشەکەوت کرا");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-emerald-600 dark:text-emerald-400">بەڕێوەبردنی کارمەندان</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-transform">
          <UserPlus size={18} /> نوێ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4 border-2 border-emerald-100 dark:border-emerald-900/30">
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ناوی کارمەند" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="پلە / ئەرک" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          <input type="number" value={salary} onChange={e => setSalary(e.target.value)} placeholder="مووچەی مانگانە" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          <button onClick={handleAdd} className="w-full bg-emerald-600 text-white p-4 rounded-2xl font-bold active:scale-95 transition-transform">زیادکردن</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees?.map(emp => (
          <div key={emp.id} className={cn("item-card group", emp.status !== 'active' && 'opacity-60')}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white transition-all">
                  <UserCheck size={28} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">{emp.name}</h3>
                  <span className="text-[10px] bg-white/5 text-slate-400 px-2 py-1 rounded-lg font-black uppercase tracking-widest border border-white/5">{emp.role}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onUpdateEmployee({ ...emp, status: emp.status === 'active' ? 'inactive' : 'active' })} className={cn("p-2 rounded-xl transition-all", emp.status === 'active' ? 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20' : 'text-slate-400 bg-white/5 border border-white/10')}>
                  {emp.status === 'active' ? <UserCheck size={18} /> : <UserX size={18} />}
                </button>
                <button 
                  onClick={async () => {
                    if (await customConfirm("ئایا دڵنیایت لە سڕینەوەی ئەم کارمەندە؟")) {
                      onDeleteEmployee(emp.id);
                    }
                  }} 
                  className="p-2 text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="space-y-1">
                <p className="text-[10px] font-black theme-muted uppercase tracking-widest flex items-center gap-1"><DollarSign size={10} /> مووچە</p>
                <p className="text-sm font-black text-white">{emp.salary.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black theme-muted uppercase tracking-widest flex items-center gap-1"><Calendar size={10} /> دەستپێک</p>
                <p className="text-sm font-black text-white">{emp.joinDate}</p>
              </div>
            </div>
            
            <button onClick={() => handlePayment(emp)} disabled={emp.status !== 'active'} className="w-full bg-white/5 text-slate-400 py-4 rounded-2xl font-black text-sm hover:bg-emerald-500/10 hover:text-emerald-500 transition-all disabled:opacity-50 border border-white/5">
              پێدانی مووچە
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 space-y-6">
        <h3 className="text-xl font-black flex items-center gap-2 px-2">
          <DollarSign size={20} className="text-emerald-500" /> دوایین مووچە دراوەکان
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employeePayments?.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
              <DollarSign size={48} className="mx-auto text-slate-700 mb-4 opacity-20" />
              <p className="text-slate-500 font-bold">هیچ مووچەیەک تۆمار نەکراوە</p>
            </div>
          ) : (
            employeePayments?.slice().reverse().map(p => (
              <div key={p.id} className="p-5 bg-white/5 border border-white/10 rounded-3xl flex justify-between items-center hover:bg-white/10 transition-all group">
                <div className="space-y-1">
                  <span className="font-black text-sm text-white block">{p.employeeName}</span>
                  <span className="text-[10px] font-bold theme-muted">{p.date} - {p.month}</span>
                </div>
                <div className="text-left">
                  <b className="text-lg font-black text-emerald-500">{p.amount.toLocaleString()}</b>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
