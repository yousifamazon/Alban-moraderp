import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  BarChart as BarChartIcon 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { ERPData } from '../../types';

interface AdvancedDashboardViewProps {
  data: ERPData;
  currency: string;
  onBack: () => void;
}

export function AdvancedDashboardView({ data, currency, onBack }: AdvancedDashboardViewProps) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toLocaleDateString('ku-IQ');
  }).reverse();

  const salesData = last7Days.map(date => {
    const daySales = data.sales.filter(s => s.date === date);
    const total = daySales.reduce((sum, s) => sum + s.total, 0);
    const profit = daySales.reduce((sum, s) => sum + (s.total - (s.itemCost * s.quantity)), 0);
    return { name: date, فرۆشتن: total, قازانج: profit };
  });

  const productSales = data.products.map(p => {
    const sold = data.sales.reduce((sum, s) => {
      return sum + (s.itemName === p.name ? s.quantity : 0);
    }, 0);
    return { name: p.name, بڕ: sold };
  }).sort((a, b) => b.بڕ - a.بڕ).slice(0, 5);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-indigo-600 dark:text-indigo-400">داشبۆردی پێشکەوتوو</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-500" /> فرۆشتن و قازانجی ٧ ڕۆژی ڕابردوو
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} tick={{ fill: '#94a3b8' }} />
                <YAxis fontSize={10} tick={{ fill: '#94a3b8' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="فرۆشتن" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="قازانج" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-6 flex items-center gap-2">
            <BarChartIcon size={18} className="text-emerald-500" /> ٥ پڕفرۆشترین کاڵاکان
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productSales} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" fontSize={10} tick={{ fill: '#94a3b8' }} />
                <YAxis dataKey="name" type="category" fontSize={10} width={80} tick={{ fill: '#94a3b8' }} />
                <Tooltip />
                <Bar dataKey="بڕ" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 lg:col-span-2">
          <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-6 flex items-center gap-2">
            <PieChartIcon size={18} className="text-amber-500" /> دابەشبوونی فرۆشتن بەپێی کاڵا
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productSales}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="بڕ"
                >
                  {productSales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
