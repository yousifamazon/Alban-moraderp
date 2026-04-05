import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-black border border-white/10 rounded-3xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}
