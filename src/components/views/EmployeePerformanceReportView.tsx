import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft 
} from 'lucide-react';
import { Employee, SalaryPayment, Shift } from '../../types';

interface EmployeePerformanceReportViewProps {
  employees: Employee[];
  salaryPayments: SalaryPayment[];
  shifts: Shift[];
  currency: string;
  onBack: () => void;
}

export function EmployeePerformanceReportView({ employees, salaryPayments, shifts, currency, onBack }: EmployeePerformanceReportViewProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-indigo-600 dark:text-indigo-400">ڕاپۆرتی کارمەندان</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map(emp => {
          const empSalary = salaryPayments.filter(s => s.employeeId === emp.id).reduce((sum, s) => sum + s.amount, 0);
          const empShifts = shifts.filter(s => s.employeeId === emp.id);
          return (
            <div key={emp.id} className="item-card group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <span className="font-black text-xl">{emp.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">{emp.name}</h3>
                  <p className="text-[10px] font-bold theme-muted uppercase tracking-widest mt-1">{emp.position}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-[8px] font-black theme-muted uppercase tracking-widest mb-1">کۆی مووچە</p>
                  <p className="text-xs font-black text-white">{empSalary.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black theme-muted uppercase tracking-widest mb-1">شەفتەکان</p>
                  <p className="text-xs font-black text-white">{empShifts.length}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black theme-muted uppercase tracking-widest mb-1">دەستپێک</p>
                  <p className="text-xs font-black text-white">{emp.joinDate}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
