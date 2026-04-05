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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {employees?.map(emp => (
          <div key={emp.id} className={`bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4 ${emp.status !== 'active' ? 'opacity-60' : ''}`}>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{emp.name}</h3>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-lg">{emp.role}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onUpdateEmployee({ ...emp, status: emp.status === 'active' ? 'inactive' : 'active' })} className={`p-2 rounded-xl transition-colors ${emp.status === 'active' ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-400 bg-slate-50 dark:bg-slate-800'}`}>
                  {emp.status === 'active' ? <UserCheck size={18} /> : <UserX size={18} />}
                </button>
                <button onClick={() => onDeleteEmployee(emp.id)} className="p-2 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl transition-colors"><Trash2 size={18} /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50 dark:border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold flex items-center gap-1"><DollarSign size={10} /> مووچە</span>
                <b className="text-emerald-600 dark:text-emerald-400">{emp.salary.toLocaleString()}</b>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold flex items-center gap-1"><Calendar size={10} /> دەستپێک</span>
                <b className="text-slate-600 dark:text-slate-400">{emp.joinDate}</b>
              </div>
            </div>
            <button onClick={() => handlePayment(emp)} disabled={emp.status !== 'active'} className="w-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 p-3 rounded-2xl font-bold text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors disabled:opacity-50">
              پێدانی مووچە
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 px-2">
          <DollarSign size={18} className="text-emerald-500" /> دوایین مووچە دراوەکان
        </h3>
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          {employeePayments?.length === 0 ? (
            <div className="p-8 text-center text-slate-400">هیچ مووچەیەک تۆمار نەکراوە</div>
          ) : (
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {employeePayments?.slice().reverse().map(p => (
                <div key={p.id} className="p-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">{p.employeeName}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{p.date} - {p.month}</span>
                  </div>
                  <b className="text-emerald-600 dark:text-emerald-400">{p.amount.toLocaleString()}</b>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
