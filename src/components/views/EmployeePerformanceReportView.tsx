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
      <div className="space-y-4">
        {employees.map(emp => {
          const empSalary = salaryPayments.filter(s => s.employeeId === emp.id).reduce((sum, s) => sum + s.amount, 0);
          const empShifts = shifts.filter(s => s.employeeId === emp.id);
          return (
            <div key={emp.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{emp.name}</h3>
              <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                <div><p className="text-slate-500">کۆی مووچە</p><p className="font-bold">{empSalary.toLocaleString()} {currency}</p></div>
                <div><p className="text-slate-500">ژمارەی شەفت</p><p className="font-bold">{empShifts.length}</p></div>
                <div><p className="text-slate-500">ڕۆژی دەستپێک</p><p className="font-bold">{emp.joinDate}</p></div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
