import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let resolveConfirm: ((value: boolean) => void) | null = null;
export const customConfirm = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    resolveConfirm = resolve;
    window.dispatchEvent(new CustomEvent('show-confirm', { detail: message }));
  });
};

export const handleConfirm = (result: boolean) => {
  if (resolveConfirm) {
    resolveConfirm(result);
    resolveConfirm = null;
  }
};
