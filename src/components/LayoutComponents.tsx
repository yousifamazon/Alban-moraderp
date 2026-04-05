import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../lib/utils';

export function FooterNavButton({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all active:scale-90",
        active ? "theme-text" : "theme-muted"
      )}
    >
      <div className={cn(
        "p-2 rounded-xl transition-all",
        active ? "bg-current/10" : ""
      )}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

export function SidebarItem({ active, icon, label, onClick, darkMode }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void, darkMode: boolean, key?: any }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-black text-xs group relative overflow-hidden",
        active 
          ? "sidebar-active-bg shadow-2xl" 
          : "theme-muted hover:bg-current/5"
      )}
    >
      <span className={cn("transition-all duration-500 group-hover:scale-110 group-hover:rotate-3", active ? "text-inherit" : "theme-muted")}>{icon}</span>
      <span className="tracking-tight">{label}</span>
      {active && (
        <motion.div 
          layoutId="sidebar-active"
          className="absolute right-0 w-1.5 h-8 rounded-l-full sidebar-active-indicator"
        />
      )}
      <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-[0.02] transition-opacity pointer-events-none" />
    </button>
  );
}

export function StatCard({ label, value, icon, trend, color, darkMode, currency }: { label: string, value: string | number, icon?: React.ReactNode, trend?: string, color: string, darkMode: boolean, currency?: string }) {
  return (
    <div className="pro-card group relative overflow-hidden border-none bg-white/5">
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
