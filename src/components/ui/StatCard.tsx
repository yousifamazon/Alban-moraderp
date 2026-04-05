import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  color: string;
  currency?: string;
}

export function StatCard({ label, value, icon, trend, color, currency }: StatCardProps) {
  return (
    <div className="pro-card group relative overflow-hidden border-none bg-current/5">
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className={cn("p-3.5 rounded-2xl transition-all duration-700 group-hover:rotate-[360deg] group-hover:scale-110", color)}>
          {icon || <TrendingUp size={20} />}
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black backdrop-blur-md",
            trend.startsWith('+') ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
          )}>
            {trend.startsWith('+') ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trend}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black theme-muted uppercase tracking-[0.3em] mb-3 opacity-60">{label}</p>
        <h3 className="text-4xl font-black tracking-tighter font-mono-data leading-none">
          {typeof value === 'number' ? value.toLocaleString() : value}
          <span className="text-[10px] font-normal theme-muted mr-3 opacity-40">{currency}</span>
        </h3>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 pointer-events-none transform group-hover:scale-150">
        {icon || <TrendingUp size={120} />}
      </div>
    </div>
  );
}
