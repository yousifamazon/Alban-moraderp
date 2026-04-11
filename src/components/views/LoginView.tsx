import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, LogIn, Chrome } from 'lucide-react';
import { User as UserType } from '../../types';
import { toast } from 'sonner';
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup, signInAnonymously } from 'firebase/auth';

interface LoginViewProps {
  users: UserType[];
  onLogin: (user: UserType) => void;
  darkMode: boolean;
}

export function LoginView({ users, onLogin, darkMode }: LoginViewProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((users.length === 0 && name === 'admin' && code === 'admin') || (name === 'admin' && code === 'admin')) {
      try {
        await signInAnonymously(auth);
        onLogin({
          id: 1,
          name: 'admin',
          code: 'admin',
          role: 'admin',
          allowedSections: ['*']
        });
      } catch (error: any) {
        console.error(error);
        toast.error(`هەڵە لە چوونەژوورەوە: ${error.message || 'پەیوەندی نییە'}`);
      }
      return;
    }

    const user = users.find(u => u.name === name && u.code === code);
    if (user) {
      try {
        await signInAnonymously(auth);
        onLogin(user);
        toast.success(`بەخێربێیت ${user.name}`);
      } catch (error: any) {
        console.error(error);
        toast.error(`هەڵە لە چوونەژوورەوە: ${error.message || 'پەیوەندی نییە'}`);
      }
    } else {
      toast.error('ناو یان کۆد هەڵەیە');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in system or is default admin
      const existingUser = users.find(u => u.email === user.email);
      if (existingUser) {
        onLogin(existingUser);
      } else if (user.email === 'yusfa886@gmail.com') {
        onLogin({
          id: Date.now(),
          name: user.displayName || 'Admin',
          code: 'google-auth',
          role: 'admin',
          allowedSections: ['*'],
          email: user.email
        });
      } else {
        toast.error('ئەم ئیمەیڵە ڕێگەی پێنەدراوە بچێتە ژوورەوە');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(`هەڵە لە چوونەژوورەوە بە گووگڵ: ${error.message || 'پەیوەندی نییە'}`);
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

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-4 text-slate-500 font-bold">یان</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
        >
          <Chrome size={22} />
          چوونەژوورەوە بە گووگڵ
        </button>
        
        {users.length === 0 && (
          <p className="text-center text-xs text-slate-400 mt-6 font-bold">
            تێبینی: بۆ یەکەم جار بەناوی admin و کۆدی admin بچۆ ژوورەوە
          </p>
        )}
      </motion.div>
    </div>
  );
}
