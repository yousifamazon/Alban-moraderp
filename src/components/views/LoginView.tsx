import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, LogIn } from 'lucide-react';
import { User as UserType } from '../../types';
import { toast } from 'sonner';

interface LoginViewProps {
  users: UserType[];
  onLogin: (user: UserType) => void;
  darkMode: boolean;
}

export function LoginView({ users, onLogin, darkMode }: LoginViewProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (users.length === 0 && name === 'admin' && code === 'admin') {
      // Default admin if no users exist
      onLogin({
        id: 1,
        name: 'admin',
        code: 'admin',
        role: 'admin',
        allowedSections: ['*']
      });
      return;
    }

    const user = users.find(u => u.name === name && u.code === code);
    if (user) {
      onLogin(user);
      toast.success(`بەخێربێیت ${user.name}`);
    } else {
      toast.error('ناو یان کۆد هەڵەیە');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Lock size={40} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">چوونەژوورەوە</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mt-2">تکایە ناو و کۆدی نهێنی بنووسە</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">ناوی بەکارهێنەر</label>
            <div className="relative">
              <User className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-5 pr-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20 transition-all font-bold text-sm text-slate-900 dark:text-slate-100"
                placeholder="ناوەکەت بنووسە..."
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">کۆدی نهێنی</label>
            <div className="relative">
              <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full p-5 pr-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20 transition-all font-bold text-sm text-slate-900 dark:text-slate-100"
                placeholder="کۆدەکەت بنووسە..."
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all mt-8"
          >
            <LogIn size={22} />
            چوونەژوورەوە
          </button>
        </form>
        
        {users.length === 0 && (
          <p className="text-center text-xs text-slate-400 mt-6 font-bold">
            تێبینی: بۆ یەکەم جار بەناوی admin و کۆدی admin بچۆ ژوورەوە
          </p>
        )}
      </motion.div>
    </div>
  );
}
