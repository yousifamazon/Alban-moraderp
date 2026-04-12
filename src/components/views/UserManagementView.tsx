import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Plus, Trash2, User as UserIcon, Shield, Key } from 'lucide-react';
import { User } from '../../types';
import { toast } from 'sonner';
import { MENU_ITEMS } from '../../constants';
import { customConfirm } from '../../lib/utils';

interface UserManagementViewProps {
  users: User[];
  onUpdateUsers: (users: User[]) => void;
  onBack: () => void;
  darkMode: boolean;
}

export function UserManagementView({ users, onUpdateUsers, onBack, darkMode }: UserManagementViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    code: '',
    role: 'shop',
    allowedSections: [],
    permissions: {
      canEditPrice: false,
      canDeleteSale: false,
      canGiveDiscount: true,
      canViewProfit: false,
      canManageUsers: false
    }
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.code || !newUser.role) {
      toast.error('تکایە هەموو زانیارییەکان پڕبکەرەوە');
      return;
    }

    const user: User = {
      id: Date.now(),
      name: newUser.name,
      code: newUser.code,
      role: newUser.role as any,
      allowedSections: newUser.allowedSections || [],
      permissions: newUser.permissions || {
        canEditPrice: false,
        canDeleteSale: false,
        canGiveDiscount: true,
        canViewProfit: false,
        canManageUsers: false
      }
    };

    onUpdateUsers([...users, user]);
    setShowAddModal(false);
    setNewUser({ 
      name: '', 
      code: '', 
      role: 'shop', 
      allowedSections: [],
      permissions: {
        canEditPrice: false,
        canDeleteSale: false,
        canGiveDiscount: true,
        canViewProfit: false,
        canManageUsers: false
      }
    });
    toast.success('بەکارهێنەر زیادکرا');
  };

  const handleDeleteUser = async (id: number) => {
    if (await customConfirm('دڵنیایت لە سڕینەوەی ئەم بەکارهێنەرە؟')) {
      onUpdateUsers(users.filter(u => u.id !== id));
      toast.success('بەکارهێنەر سڕایەوە');
    }
  };

  const toggleSection = (sectionId: string) => {
    const current = newUser.allowedSections || [];
    if (current.includes(sectionId)) {
      setNewUser({ ...newUser, allowedSections: current.filter(id => id !== sectionId) });
    } else {
      setNewUser({ ...newUser, allowedSections: [...current, sectionId] });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-6xl mx-auto pb-20" dir="rtl">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-95">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="font-black text-3xl tracking-tight text-slate-800 dark:text-slate-100">بەڕێوەبردنی بەکارهێنەران</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mt-1">زیادکردن و سڕینەوەی بەکارهێنەر و دیاریکردنی دەسەڵاتەکانیان</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-3 px-6 py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20} />
          بەکارهێنەری نوێ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="item-card group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white transition-all">
                  <UserIcon size={28} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">{user.name}</h3>
                  <p className="text-[10px] font-bold theme-muted uppercase tracking-widest mt-1">{user.role}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDeleteUser(user.id)} 
                className="p-2 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-xl transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="space-y-4 flex-1">
              <div className="space-y-2">
                <p className="text-[10px] font-black theme-muted uppercase tracking-widest">بەشە ڕێگەپێدراوەکان</p>
                <div className="flex flex-wrap gap-2">
                  {user.allowedSections.includes('*') ? (
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg text-[10px] font-black">هەموو بەشەکان</span>
                  ) : (
                    user.allowedSections.map(sec => {
                      const menuItem = MENU_ITEMS.find(m => m.id === sec);
                      return menuItem ? (
                        <span key={sec} className="px-3 py-1 bg-white/5 text-slate-300 border border-white/10 rounded-lg text-[10px] font-black">
                          {menuItem.label}
                        </span>
                      ) : null;
                    })
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/5">
                <p className="text-[10px] font-black theme-muted uppercase tracking-widest">دەسەڵاتەکان</p>
                <div className="grid grid-cols-2 gap-2">
                  {user.permissions && Object.entries(user.permissions).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full", value ? 'bg-emerald-500' : 'bg-red-500')} />
                      <span className="text-[10px] font-bold theme-muted">
                        {key === 'canEditPrice' && 'گۆڕینی نرخ'}
                        {key === 'canDeleteSale' && 'سڕینەوەی وەسڵ'}
                        {key === 'canGiveDiscount' && 'داشکان'}
                        {key === 'canViewProfit' && 'بینینی قازانج'}
                        {key === 'canManageUsers' && 'بەڕێوەبردن'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <h3 className="text-2xl font-black mb-8 text-slate-800 dark:text-slate-100">زیادکردنی بەکارهێنەری نوێ</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ناوی بەکارهێنەر</label>
                  <div className="relative">
                    <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={newUser.name}
                      onChange={e => setNewUser({...newUser, name: e.target.value})}
                      className="w-full p-4 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20 font-bold text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">کۆدی نهێنی</label>
                  <div className="relative">
                    <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={newUser.code}
                      onChange={e => setNewUser({...newUser, code: e.target.value})}
                      className="w-full p-4 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20 font-bold text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ڕۆڵ</label>
                <select 
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value as any})}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20 font-bold text-sm"
                >
                  <option value="admin">ئەدمین (بەڕێوەبەر)</option>
                  <option value="accountant">محاسب</option>
                  <option value="driver">شۆفێر</option>
                  <option value="shop">دوکان</option>
                  <option value="factory">کارگە</option>
                  <option value="livestock">ئاژەڵداری</option>
                </select>
              </div>

              {newUser.role !== 'admin' && (
                <>
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">دەسەڵاتەکان</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(newUser.permissions || {}).map(([key, value]) => (
                        <label key={key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                          <span className="text-xs font-bold">
                            {key === 'canEditPrice' && 'گۆڕینی نرخی فرۆشتن'}
                            {key === 'canDeleteSale' && 'سڕینەوەی وەسڵەکان'}
                            {key === 'canGiveDiscount' && 'پێدانی داشکان'}
                            {key === 'canViewProfit' && 'بینینی قازانج و تێچوو'}
                            {key === 'canManageUsers' && 'بەڕێوەبردنی بەکارهێنەران'}
                          </span>
                          <input 
                            type="checkbox" 
                            checked={value as boolean}
                            onChange={(e) => setNewUser({
                              ...newUser,
                              permissions: {
                                ...(newUser.permissions as any),
                                [key]: e.target.checked
                              }
                            })}
                            className="w-5 h-5 rounded-lg accent-emerald-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">بەشە ڕێگەپێدراوەکان</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {MENU_ITEMS.map(item => (
                        <button
                          key={item.id}
                          onClick={() => toggleSection(item.id)}
                          className={`p-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                            (newUser.allowedSections || []).includes(item.id)
                              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-4 pt-6">
                <button 
                  onClick={handleAddUser}
                  className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  پاشەکەوتکردن
                </button>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-4 rounded-2xl font-black text-sm hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
                >
                  پاشگەزبوونەوە
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
