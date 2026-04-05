import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface SidebarItemProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  darkMode: boolean;
}

export function SidebarItem({ active, icon, label, onClick, darkMode }: SidebarItemProps) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-black text-xs group relative overflow-hidden",
        active 
          ? (darkMode ? "bg-white text-black shadow-2xl shadow-white/10" : "bg-black text-white shadow-2xl shadow-black/10") 
          : "theme-muted hover:bg-current/5"
      )}
    >
      <span className={cn("transition-all duration-500 group-hover:scale-110 group-hover:rotate-3", active ? "text-inherit" : "theme-muted")}>{icon}</span>
      <span className="tracking-tight">{label}</span>
      {active && (
        <motion.div 
          layoutId="sidebar-active"
          className={cn("absolute right-0 w-1.5 h-8 rounded-l-full", darkMode ? "bg-black" : "bg-white")}
        />
      )}
      <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-[0.02] transition-opacity pointer-events-none" />
    </button>
  );
}
