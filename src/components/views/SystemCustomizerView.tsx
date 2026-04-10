import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Save, 
  Eye, 
  EyeOff, 
  Edit3, 
  LayoutGrid, 
  Settings as SettingsIcon,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ChevronRight,
  Command,
  Database,
  Type,
  MousePointer2,
  Box
} from 'lucide-react';
import { Settings, CustomMenuSetting, CustomField, CustomSection, CustomAction } from '../../types';
import { MENU_ITEMS, MENU_CATEGORIES } from '../../constants';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

interface SystemCustomizerViewProps {
  settings: Settings;
  onSaveMenuSettings: (menuSettings: CustomMenuSetting[]) => void;
  onSaveCustomFields: (customFields: CustomField[]) => void;
  onSaveCustomSections: (customSections: CustomSection[]) => void;
  onBack: () => void;
}

export function SystemCustomizerView({ settings, onSaveMenuSettings, onSaveCustomFields, onSaveCustomSections, onBack }: SystemCustomizerViewProps) {
  const [activeTab, setActiveTab] = useState<'menu' | 'fields' | 'sections' | 'dashboard'>('menu');
  const [selectedSection, setSelectedSection] = useState<CustomSection | null>(null);
  
  const [menuSettings, setMenuSettings] = useState<CustomMenuSetting[]>(
    settings.menuSettings && settings.menuSettings.length > 0
      ? settings.menuSettings
      : MENU_ITEMS.map(item => ({ id: item.id, label: item.label, isVisible: true }))
  );
  const [customFields, setCustomFields] = useState<CustomField[]>(settings.customFields || []);
  const [customSections, setCustomSections] = useState<CustomSection[]>(settings.customSections || []);

  const handleToggleVisibility = (id: string) => {
    setMenuSettings(prev => prev.map(item => 
      item.id === id ? { ...item, isVisible: !item.isVisible } : item
    ));
  };

  const handleRename = (id: string, newLabel: string) => {
    setMenuSettings(prev => prev.map(item => 
      item.id === id ? { ...item, label: newLabel } : item
    ));
  };

  const handleAddCustomField = (entity: 'product' | 'sale' | 'customer' | 'supplier') => {
    const newField: CustomField = {
      id: `field-${Date.now()}`,
      entity,
      label: 'خانەی نوێ',
      type: 'text',
      isVisible: true,
      required: false
    };
    setCustomFields([...customFields, newField]);
  };

  const handleUpdateCustomField = (id: string, updates: Partial<CustomField>) => {
    setCustomFields(customFields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleDeleteCustomField = (id: string) => {
    setCustomFields(customFields.filter(f => f.id !== id));
  };

  const handleAddSection = () => {
    const newSection: CustomSection = {
      id: `section-${Date.now()}`,
      label: 'بەشی نوێ',
      icon: 'Box',
      category: 'custom',
      isVisible: true,
      isCustom: true,
      fields: [],
      actions: [],
      description: 'وەسفی بەشەکە لێرە بنووسە'
    };
    setCustomSections([...customSections, newSection]);
    setSelectedSection(newSection);
  };

  const handleUpdateSection = (id: string, updates: Partial<CustomSection>) => {
    setCustomSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    if (selectedSection?.id === id) {
      setSelectedSection(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleDeleteSection = (id: string) => {
    setCustomSections(prev => prev.filter(s => s.id !== id));
    setSelectedSection(null);
  };

  const handleAddFieldToSection = (sectionId: string) => {
    const newField: CustomField = {
      id: `field-${Date.now()}`,
      entity: 'product', // Placeholder entity
      label: 'خانەی نوێ',
      type: 'text',
      isVisible: true,
      required: false
    };
    handleUpdateSection(sectionId, {
      fields: [...(customSections.find(s => s.id === sectionId)?.fields || []), newField]
    });
  };

  const handleAddActionToSection = (sectionId: string) => {
    const newAction: CustomAction = {
      id: `action-${Date.now()}`,
      label: 'دوگمەی نوێ',
      type: 'custom'
    };
    handleUpdateSection(sectionId, {
      actions: [...(customSections.find(s => s.id === sectionId)?.actions || []), newAction]
    });
  };

  const handleSave = () => {
    onSaveMenuSettings(menuSettings);
    onSaveCustomFields(customFields);
    onSaveCustomSections(customSections);
    toast.success('ڕێکخستنەکانی سیستەم بە سەرکەوتوویی پاشەکەوت کران');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto pb-20 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-black tracking-tight">ڕێکخستنی سیستەم (No-Code)</h2>
            <p className="text-[10px] font-bold theme-muted uppercase tracking-widest mt-1">دەستکاری هەموو بەشەکانی سیستەم بکە بەبێ کۆد</p>
          </div>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all">
          <Save size={18} />
          پاشەکەوتکردنی گۆڕانکارییەکان
        </button>
      </div>

      <div className="flex gap-2 mb-8 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
        <TabButton active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} label="مینووی سەرەکی" />
        <TabButton active={activeTab === 'fields'} onClick={() => setActiveTab('fields')} label="خانەی زیادە (Custom Fields)" />
        <TabButton active={activeTab === 'sections'} onClick={() => setActiveTab('sections')} label="بەشەکان (Views)" />
        <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} label="داشبۆرد" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {activeTab === 'menu' && (
          <>
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                  <SettingsIcon size={32} />
                </div>
                <h3 className="text-xl font-black mb-4">ڕێکخستنی مینوو</h3>
                <p className="text-xs font-bold theme-muted leading-relaxed mb-6">
                  لێرە دەتوانیت ناوی بەشەکان بگۆڕیت یان ئەو بەشانەی کە کارت پێیان نییە بیشاریتەوە بۆ ئەوەی مینووەکە سادەتر بێت.
                </p>
                <button 
                  onClick={() => {
                    setMenuSettings(MENU_ITEMS.map(item => ({ id: item.id, label: item.label, isVisible: true })));
                    toast.success('مینوو گەڕێندرایەوە بۆ باری سەرەتایی');
                  }}
                  className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  گەڕانەوە بۆ باری سەرەتایی
                </button>
              </div>
            </div>
            <div className="lg:col-span-3 space-y-6">
              {MENU_CATEGORIES.map(category => (
                <div key={category.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-bottom border-slate-100 dark:border-slate-800">
                    <h4 className="font-black text-sm flex items-center gap-3">
                      <LayoutGrid size={18} className="text-slate-400" />
                      {category.label}
                    </h4>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {MENU_ITEMS.filter(item => item.category === category.id).map(item => {
                        const setting = menuSettings.find(s => s.id === item.id) || { id: item.id, label: item.label, isVisible: true };
                        return (
                          <div key={item.id} className={cn(
                            "flex items-center justify-between p-4 rounded-2xl transition-all",
                            setting.isVisible ? "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800" : "bg-slate-50 dark:bg-slate-800/30 border border-transparent opacity-60"
                          )}>
                            <div className="flex items-center gap-4 flex-1">
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                                setting.isVisible ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                              )}>
                                {item.icon}
                              </div>
                              <div className="flex-1 max-w-xs">
                                <input 
                                  type="text" 
                                  value={setting.label} 
                                  onChange={(e) => handleRename(item.id, e.target.value)}
                                  className="w-full bg-transparent font-bold text-sm outline-none focus:ring-2 ring-emerald-500/10 rounded-lg px-2 py-1"
                                />
                              </div>
                            </div>
                            <button 
                              onClick={() => handleToggleVisibility(item.id)}
                              className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                                setting.isVisible 
                                  ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" 
                                  : "bg-slate-200 dark:bg-slate-700 text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-600"
                              )}
                            >
                              {setting.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                              {setting.isVisible ? 'دیارە' : 'شاراوە'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'fields' && (
          <div className="lg:col-span-4 space-y-8">
            {['product', 'sale', 'customer', 'supplier'].map((entity) => (
              <div key={entity} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-black capitalize">خانەی زیادە بۆ {entity === 'product' ? 'کاڵاکان' : entity === 'sale' ? 'فرۆشتن' : entity === 'customer' ? 'کڕیاران' : 'دابینکەران'}</h3>
                    <p className="text-[10px] font-bold theme-muted uppercase tracking-widest mt-1">دەتوانیت زانیاری زیاتر زیاد بکەیت بۆ ئەم بەشە</p>
                  </div>
                  <button 
                    onClick={() => handleAddCustomField(entity as any)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-all"
                  >
                    <Plus size={16} />
                    زیادکردنی خانە
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {customFields.filter(f => f.entity === entity).map(field => (
                    <div key={field.id} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <input 
                          type="text" 
                          value={field.label} 
                          onChange={(e) => handleUpdateCustomField(field.id, { label: e.target.value })}
                          className="bg-transparent font-black text-sm outline-none focus:ring-2 ring-emerald-500/10 rounded-lg px-2"
                        />
                        <button onClick={() => handleDeleteCustomField(field.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <select 
                          value={field.type}
                          onChange={(e) => handleUpdateCustomField(field.id, { type: e.target.value as any })}
                          className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-bold outline-none"
                        >
                          <option value="text">دەق (Text)</option>
                          <option value="number">ژمارە (Number)</option>
                          <option value="date">ڕێکەوت (Date)</option>
                          <option value="select">هەڵبژاردن (Select)</option>
                        </select>
                        <div className="flex items-center gap-2 px-2">
                          <input 
                            type="checkbox" 
                            checked={field.required} 
                            onChange={(e) => handleUpdateCustomField(field.id, { required: e.target.checked })}
                            className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                          />
                          <span className="text-[10px] font-bold theme-muted">پێویستە (Required)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {customFields.filter(f => f.entity === entity).length === 0 && (
                    <div className="md:col-span-2 lg:col-span-3 p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center text-center">
                      <Edit3 size={32} className="text-slate-300 mb-4" />
                      <p className="text-xs font-bold theme-muted">هیچ خانەیەکی زیادە نییە</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'sections' && (
          <>
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <Box size={32} />
                  </div>
                  <button 
                    onClick={handleAddSection}
                    className="p-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <h3 className="text-xl font-black mb-4">بەڕێوەبردنی بەشەکان</h3>
                <p className="text-xs font-bold theme-muted leading-relaxed mb-6">
                  لێرە دەتوانیت بەشی نوێ بۆ سیستەمەکە زیاد بکەیت یان دەستکاری بەشە هەبووەکان بکەیت.
                </p>
                
                <div className="space-y-2">
                  {customSections.map(section => (
                    <button 
                      key={section.id}
                      onClick={() => setSelectedSection(section)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl transition-all text-right",
                        selectedSection?.id === section.id ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Command size={16} className={selectedSection?.id === section.id ? "text-white" : "text-blue-500"} />
                        <span className="font-bold text-sm">{section.label}</span>
                      </div>
                      <ChevronRight size={16} className={selectedSection?.id === section.id ? "text-white" : "text-slate-400"} />
                    </button>
                  ))}
                  {customSections.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                      <p className="text-[10px] font-bold theme-muted uppercase tracking-widest">هیچ بەشێکی نوێ نییە</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {selectedSection ? (
                  <motion.div 
                    key={selectedSection.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            <Edit3 size={24} />
                          </div>
                          <div>
                            <h4 className="text-xl font-black">دەستکاریکردنی بەشی {selectedSection.label}</h4>
                            <p className="text-[10px] font-bold theme-muted uppercase tracking-widest mt-1">تایبەتمەندییەکان و کردارەکان ڕێکبخە</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteSection(selectedSection.id)}
                          className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ناوی بەش</label>
                          <input 
                            type="text" 
                            value={selectedSection.label}
                            onChange={(e) => handleUpdateSection(selectedSection.id, { label: e.target.value })}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none font-bold text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">وەسفی کورت</label>
                          <input 
                            type="text" 
                            value={selectedSection.description || ''}
                            onChange={(e) => handleUpdateSection(selectedSection.id, { description: e.target.value })}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none font-bold text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Fields Management */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="font-black text-sm flex items-center gap-2">
                              <Database size={16} className="text-emerald-500" />
                              خانەکان (Fields)
                            </h5>
                            <button 
                              onClick={() => handleAddFieldToSection(selectedSection.id)}
                              className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="space-y-2">
                            {selectedSection.fields.map((field, idx) => (
                              <div key={field.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                <div className="text-[10px] font-black text-slate-300">0{idx + 1}</div>
                                <input 
                                  type="text" 
                                  value={field.label}
                                  onChange={(e) => {
                                    const newFields = [...selectedSection.fields];
                                    newFields[idx] = { ...newFields[idx], label: e.target.value };
                                    handleUpdateSection(selectedSection.id, { fields: newFields });
                                  }}
                                  className="flex-1 bg-transparent font-bold text-xs outline-none"
                                />
                                <select 
                                  value={field.type}
                                  onChange={(e) => {
                                    const newFields = [...selectedSection.fields];
                                    newFields[idx] = { ...newFields[idx], type: e.target.value as any };
                                    handleUpdateSection(selectedSection.id, { fields: newFields });
                                  }}
                                  className="bg-transparent text-[10px] font-black uppercase outline-none"
                                >
                                  <option value="text">Text</option>
                                  <option value="number">Num</option>
                                  <option value="date">Date</option>
                                  <option value="select">List</option>
                                </select>
                                <button 
                                  onClick={() => {
                                    const newFields = selectedSection.fields.filter(f => f.id !== field.id);
                                    handleUpdateSection(selectedSection.id, { fields: newFields });
                                  }}
                                  className="text-red-500 opacity-40 hover:opacity-100 transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                            {selectedSection.fields.length === 0 && (
                              <div className="text-center py-8 opacity-20 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                                <p className="text-[10px] font-bold uppercase tracking-widest">هیچ خانەیەک نییە</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions Management */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="font-black text-sm flex items-center gap-2">
                              <MousePointer2 size={16} className="text-blue-500" />
                              کردارەکان (Buttons)
                            </h5>
                            <button 
                              onClick={() => handleAddActionToSection(selectedSection.id)}
                              className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="space-y-2">
                            {selectedSection.actions.map((action, idx) => (
                              <div key={action.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                <div className="text-[10px] font-black text-slate-300">0{idx + 1}</div>
                                <input 
                                  type="text" 
                                  value={action.label}
                                  onChange={(e) => {
                                    const newActions = [...selectedSection.actions];
                                    newActions[idx] = { ...newActions[idx], label: e.target.value };
                                    handleUpdateSection(selectedSection.id, { actions: newActions });
                                  }}
                                  className="flex-1 bg-transparent font-bold text-xs outline-none"
                                />
                                <select 
                                  value={action.type}
                                  onChange={(e) => {
                                    const newActions = [...selectedSection.actions];
                                    newActions[idx] = { ...newActions[idx], type: e.target.value as any };
                                    handleUpdateSection(selectedSection.id, { actions: newActions });
                                  }}
                                  className="bg-transparent text-[10px] font-black uppercase outline-none"
                                >
                                  <option value="custom">Custom</option>
                                  <option value="save">Save</option>
                                  <option value="print">Print</option>
                                  <option value="delete">Delete</option>
                                </select>
                                <button 
                                  onClick={() => {
                                    const newActions = selectedSection.actions.filter(a => a.id !== action.id);
                                    handleUpdateSection(selectedSection.id, { actions: newActions });
                                  }}
                                  className="text-red-500 opacity-40 hover:opacity-100 transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                            {selectedSection.actions.length === 0 && (
                              <div className="text-center py-8 opacity-20 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                                <p className="text-[10px] font-bold uppercase tracking-widest">هیچ کردارێک نییە</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 p-20 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                    <div className="w-24 h-24 rounded-[2rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-8">
                      <Box size={48} className="text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-black mb-4">بەشێک هەڵبژێرە بۆ دەستکاریکردن</h3>
                    <p className="text-sm font-bold theme-muted max-w-sm mx-auto leading-relaxed">
                      دەتوانیت هەر بەشێک کە دروستت کردووە لێرە ڕێکی بخەیت، خانەی بۆ زیاد بکەیت یان دوگمەی بۆ دابنێیت.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}

        {activeTab === 'dashboard' && (
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm text-center">
              <div className="w-20 h-20 rounded-3xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-6">
                <LayoutGrid size={40} />
              </div>
              <h3 className="text-2xl font-black mb-4">دیزاینەری داشبۆرد</h3>
              <p className="text-sm font-bold theme-muted max-w-md mx-auto leading-relaxed">
                ئەم تایبەتمەندییە ڕێگەت پێدەدات کە داشبۆردەکەت ڕێکبخەیت و تەنها ئەو ئامارانە ببینی کە بۆت گرنگن.
              </p>
              <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 inline-block">
                <p className="text-xs font-black text-emerald-500">بەمنزیکانە بەردەست دەبێت...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-6 py-2.5 rounded-xl font-black text-xs transition-all",
        active ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-400 hover:text-slate-600"
      )}
    >
      {label}
    </button>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 shrink-0">{icon}</div>
      <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">{text}</p>
    </div>
  );
}
