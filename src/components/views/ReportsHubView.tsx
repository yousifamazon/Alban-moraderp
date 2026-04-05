import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  PieChart, 
  CreditCard, 
  Users, 
  DollarSign, 
  Bell, 
  Calendar, 
  UserCheck, 
  ChevronLeft, 
  ArrowRight,
  History,
  Receipt
} from 'lucide-react';

interface ReportsHubViewProps {
  onNavigate: (s: string) => void;
  onBack: () => void;
}

export function ReportsHubView({ onNavigate, onBack }: ReportsHubViewProps) {
  const reports = [
    { id: 'daily-summary', label: 'پوختەی ڕۆژانە', icon: <Calendar />, desc: 'کۆی فرۆش و خەرجی و قازانجی ڕۆژ' },
    { id: 'sales-history', label: 'مێژووی فرۆشتن', icon: <Receipt />, desc: 'بینینی هەموو وەسڵە فرۆشراوەکان' },
    { id: 'profits-rep', label: 'ڕاپۆرتی قازانج', icon: <TrendingUp />, desc: 'پوختەی داهات و تێچوو و قازانجی پاک' },
    { id: 'category-report', label: 'فرۆشتنی بەشەکان', icon: <PieChart />, desc: 'فرۆشتنی هەر بەشێک بە جیا' },
    { id: 'expense-report', label: 'ڕاپۆرتی خەرجی', icon: <CreditCard />, desc: 'وردەکاری خەرجییە گشتییەکان' },
    { id: 'qist-dash', label: 'داشبۆردی قەرز', icon: <Users />, desc: 'بەڕێوەبردنی قەرز و قیستەکان' },
    { id: 'cash-rep', label: 'ڕاپۆرتی کاش', icon: <DollarSign />, desc: 'جوڵەی پارەی کاش لە سندوقدا' },
    { id: 'low-stock', label: 'کاڵای کەمبوو', icon: <Bell />, desc: 'لیستی ئەو کاڵانەی بڕیان کەمە' },
    { id: 'expired', label: 'بەسەرچووەکان', icon: <Calendar />, desc: 'کاڵاکان کە بەرواریان بەسەرچووە' },
    { id: 'emp-perf-report', label: 'کارایی کارمەند', icon: <UserCheck />, desc: 'فرۆشتن و چالاکی هەر کارمەندێک' },
    { id: 'driver-report', label: 'ڕاپۆرتی شۆفێرەکان', icon: <Users />, desc: 'پوختەی فرۆشتن بەپێی شۆفێر' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={onBack} className="p-3 rounded-2xl bg-current/5 hover:bg-current/10 transition-all">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-black tracking-tight">ناوەندی ڕاپۆرتەکان</h2>
          <p className="text-[10px] font-bold theme-muted uppercase tracking-widest mt-1">شیکردنەوەی وردی داتاکانی سیستەم</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reports.map(report => (
          <button 
            key={report.id}
            onClick={() => onNavigate(report.id)}
            className="pro-card p-10 flex flex-col items-start gap-6 theme-hover text-right group relative overflow-hidden border-none bg-current/5"
          >
            <div className="p-4 rounded-[1.5rem] bg-current/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              {React.cloneElement(report.icon as React.ReactElement, { size: 28, className: "opacity-80" })}
            </div>
            <div>
              <h3 className="text-xl font-black mb-2 tracking-tight">{report.label}</h3>
              <p className="text-xs theme-muted leading-relaxed font-medium opacity-60">{report.desc}</p>
            </div>
            <div className="absolute top-8 left-8 opacity-0 group-hover:opacity-20 transition-opacity">
              <ArrowRight size={24} />
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
