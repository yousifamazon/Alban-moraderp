import React from 'react';
import { cn } from '../../lib/utils';

interface FooterNavButtonProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export function FooterNavButton({ active, icon, label, onClick }: FooterNavButtonProps) {
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
