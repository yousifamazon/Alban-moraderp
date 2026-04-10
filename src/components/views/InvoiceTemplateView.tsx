import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Save, 
  RotateCcw, 
  Info, 
  Plus, 
  Trash2, 
  Check, 
  Layout, 
  Code, 
  Type, 
  Table as TableIcon, 
  Image as ImageIcon,
  AlignRight,
  Settings as SettingsIcon,
  Eye,
  EyeOff
} from 'lucide-react';
import { Settings, InvoiceTemplate, VisualInvoiceSection } from '../../types';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

interface InvoiceTemplateViewProps {
  settings: Settings;
  onSaveTemplates: (templates: InvoiceTemplate[], activeId: string) => void;
  onBack: () => void;
}

export function InvoiceTemplateView({ settings, onSaveTemplates, onBack }: InvoiceTemplateViewProps) {
  const [templates, setTemplates] = useState<InvoiceTemplate[]>(
    settings.invoiceTemplates && settings.invoiceTemplates.length > 0 
      ? settings.invoiceTemplates 
      : [{ id: 'default', name: 'کلێشەی بنەڕەتی', content: settings.invoiceTemplate || DEFAULT_TEMPLATE, visualConfig: DEFAULT_VISUAL_CONFIG }]
  );
  const [activeId, setActiveId] = useState(settings.activeInvoiceTemplateId || 'default');
  const [editingId, setEditingId] = useState(activeId);
  const [editorMode, setEditorMode] = useState<'code' | 'visual'>('visual');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const currentTemplate = templates.find(t => t.id === editingId) || templates[0];
  const visualConfig = currentTemplate.visualConfig || DEFAULT_VISUAL_CONFIG;

  const handleSave = () => {
    // Generate HTML content from visualConfig if in visual mode
    const updatedTemplates = templates.map(t => {
      if (t.visualConfig) {
        return { ...t, content: generateHtmlFromConfig(t.visualConfig, settings.currency) };
      }
      return t;
    });
    onSaveTemplates(updatedTemplates, activeId);
    toast.success('هەموو گۆڕانکارییەکان بە سەرکەوتوویی پاشەکەوت کران');
  };

  const handleAddTemplate = () => {
    const newId = `template-${Date.now()}`;
    const newTemplate: InvoiceTemplate = {
      id: newId,
      name: `کلێشەی نوێ ${templates.length + 1}`,
      content: DEFAULT_TEMPLATE,
      visualConfig: DEFAULT_VISUAL_CONFIG
    };
    setTemplates([...templates, newTemplate]);
    setEditingId(newId);
    toast.success('کلێشەیەکی نوێ دروستکرا');
  };

  const handleDeleteTemplate = (id: string) => {
    if (templates.length === 1) return toast.error('ناکرێت هەموو کلێشەکان بسڕیتەوە');
    if (window.confirm('ئایا دڵنیایت لە سڕینەوەی ئەم کلێشەیە؟')) {
      const newTemplates = templates.filter(t => t.id !== id);
      setTemplates(newTemplates);
      if (editingId === id) setEditingId(newTemplates[0].id);
      if (activeId === id) setActiveId(newTemplates[0].id);
    }
  };

  const updateCurrentContent = (content: string) => {
    setTemplates(templates.map(t => t.id === editingId ? { ...t, content } : t));
  };

  const updateCurrentName = (name: string) => {
    setTemplates(templates.map(t => t.id === editingId ? { ...t, name } : t));
  };

  const updateSection = (sectionId: string, updates: Partial<VisualInvoiceSection>) => {
    const newConfig = visualConfig.map(s => s.id === sectionId ? { ...s, ...updates } : s);
    setTemplates(templates.map(t => t.id === editingId ? { ...t, visualConfig: newConfig } : t));
  };

  const handleAddSection = (type: VisualInvoiceSection['type']) => {
    const newId = `section-${Date.now()}`;
    const newSection: VisualInvoiceSection = {
      id: newId,
      type,
      isVisible: true,
      styles: { fontSize: '12px', textAlign: 'right', padding: '10px' },
      content: type === 'text' ? { title: 'دەقی نوێ لێرە بنووسە...' } : 
               type === 'image' ? { logoUrl: 'https://picsum.photos/seed/logo/200/200' } : {}
    };
    const newConfig = [...visualConfig, newSection];
    setTemplates(templates.map(t => t.id === editingId ? { ...t, visualConfig: newConfig } : t));
    setSelectedSectionId(newId);
    toast.success('بەشێکی نوێ زیادکرا');
  };

  const handleDeleteSection = (sectionId: string) => {
    const newConfig = visualConfig.filter(s => s.id !== sectionId);
    setTemplates(templates.map(t => t.id === editingId ? { ...t, visualConfig: newConfig } : t));
    setSelectedSectionId(null);
    toast.success('بەشەکە سڕایەوە');
  };

  const selectedSection = visualConfig.find(s => s.id === selectedSectionId);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto pb-20 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-black tracking-tight">دیزاینەری وەسڵ</h2>
            <p className="text-[10px] font-bold theme-muted uppercase tracking-widest mt-1">دروستکردن و دەستکاری کلێشەی وەسڵەکان وەک بەرنامەی Word</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all">
            <Save size={18} />
            پاشەکەوتکردنی هەمووی
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar: Template List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-sm">لیستی کلێشەکان</h3>
              <button onClick={handleAddTemplate} className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500/20 transition-all">
                <Plus size={18} />
              </button>
            </div>
            <div className="space-y-2">
              {templates.map(t => (
                <div key={t.id} className={cn(
                  "group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer",
                  editingId === t.id 
                    ? "bg-emerald-500/5 border-emerald-500/20 ring-1 ring-emerald-500/20" 
                    : "bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                )} onClick={() => setEditingId(t.id)}>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                      activeId === t.id ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                    )}>
                      {activeId === t.id ? <Check size={14} /> : <Layout size={14} />}
                    </div>
                    <span className="text-xs font-bold truncate max-w-[120px]">{t.name}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveId(t.id); toast.success(`کلێشەی "${t.name}" کرا بە کلێشەی سەرەکی`); }}
                      className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-lg"
                      title="دیاریکردن وەک سەرەکی"
                    >
                      <Check size={14} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(t.id); }}
                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg"
                      title="سڕینەوە"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {editorMode === 'visual' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="font-black text-sm mb-4">زیادکردنی بەش</h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleAddSection('text')} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-500/10 transition-all border border-transparent hover:border-emerald-500/20">
                  <Type size={18} className="text-emerald-500" />
                  <span className="text-[10px] font-bold">دەق</span>
                </button>
                <button onClick={() => handleAddSection('image')} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-500/10 transition-all border border-transparent hover:border-emerald-500/20">
                  <ImageIcon size={18} className="text-emerald-500" />
                  <span className="text-[10px] font-bold">لۆگۆ</span>
                </button>
                <button onClick={() => handleAddSection('items')} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-500/10 transition-all border border-transparent hover:border-emerald-500/20">
                  <TableIcon size={18} className="text-emerald-500" />
                  <span className="text-[10px] font-bold">خشتە</span>
                </button>
                <button onClick={() => handleAddSection('customer')} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-500/10 transition-all border border-transparent hover:border-emerald-500/20">
                  <AlignRight size={18} className="text-emerald-500" />
                  <span className="text-[10px] font-bold">کڕیار</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Editor Area */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex-1">
                <input 
                  type="text" 
                  value={currentTemplate.name} 
                  onChange={(e) => updateCurrentName(e.target.value)}
                  className="text-2xl font-black bg-transparent border-none outline-none focus:ring-0 w-full"
                  placeholder="ناوی کلێشە..."
                />
                <p className="text-[10px] font-bold theme-muted mt-1 uppercase tracking-widest">دەستکاری ناوەڕۆکی کلێشەکە بکە</p>
              </div>
              <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl shrink-0">
                <button 
                  onClick={() => setEditorMode('code')}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs transition-all",
                    editorMode === 'code' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-400"
                  )}
                >
                  <Code size={16} />
                  کۆد (HTML)
                </button>
                <button 
                  onClick={() => setEditorMode('visual')}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs transition-all",
                    editorMode === 'visual' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-400"
                  )}
                >
                  <Layout size={16} />
                  بینراو (Visual)
                </button>
              </div>
            </div>

            {editorMode === 'code' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <Info className="text-blue-500 shrink-0" size={18} />
                  <p className="text-[10px] font-bold theme-muted leading-relaxed">
                    جێگرەوەکان بەکاربهێنە: 
                    <code className="mx-1 text-emerald-500">{'{{receiptId}}'}</code>, 
                    <code className="mx-1 text-emerald-500">{'{{date}}'}</code>, 
                    <code className="mx-1 text-emerald-500">{'{{customerName}}'}</code>, 
                    <code className="mx-1 text-emerald-500">{'{{itemsTable}}'}</code>, 
                    <code className="mx-1 text-emerald-500">{'{{total}}'}</code>
                  </p>
                </div>
                <textarea
                  value={currentTemplate.content}
                  onChange={(e) => updateCurrentContent(e.target.value)}
                  className="w-full h-[500px] p-6 font-mono text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl outline-none focus:ring-2 ring-emerald-500/10 transition-all"
                  dir="ltr"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Visual Editor Toolbox */}
                <div className="md:col-span-4 space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-black text-xs uppercase tracking-widest theme-muted px-2">ڕیزبەندی بەشەکان</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {visualConfig.map((section, index) => (
                        <div 
                          key={section.id}
                          onClick={() => setSelectedSectionId(section.id)}
                          className={cn(
                            "group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer",
                            selectedSectionId === section.id 
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" 
                              : "bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black opacity-20">{index + 1}</span>
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              section.isVisible ? "bg-white dark:bg-slate-800 shadow-sm" : "bg-slate-200 dark:bg-slate-700 opacity-50"
                            )}>
                              {section.type === 'header' && <ImageIcon size={14} />}
                              {section.type === 'customer' && <AlignRight size={14} />}
                              {section.type === 'items' && <TableIcon size={14} />}
                              {section.type === 'totals' && <SettingsIcon size={14} />}
                              {section.type === 'footer' && <Type size={14} />}
                              {section.type === 'text' && <Type size={14} />}
                              {section.type === 'image' && <ImageIcon size={14} />}
                            </div>
                            <span className="text-xs font-bold">{getSectionLabel(section.type)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={(e) => { e.stopPropagation(); updateSection(section.id, { isVisible: !section.isVisible }); }}
                              className={cn("p-1.5 rounded-lg transition-all", section.isVisible ? "text-emerald-500" : "text-slate-400")}
                            >
                              {section.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDeleteSection(section.id); }}
                              className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedSection && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }}
                      className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4"
                    >
                      <h4 className="font-black text-xs uppercase tracking-widest theme-muted mb-4">ڕێکخستنی {getSectionLabel(selectedSection.type)}</h4>
                      
                      {(selectedSection.type === 'header' || selectedSection.type === 'footer' || selectedSection.type === 'text') && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">ناونیشان / دەق</label>
                          <textarea 
                            value={selectedSection.content?.title || ''} 
                            onChange={(e) => updateSection(selectedSection.id, { content: { ...selectedSection.content, title: e.target.value } })}
                            className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none min-h-[80px]"
                          />
                        </div>
                      )}

                      {selectedSection.type === 'image' && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">بەستەری وێنە (URL)</label>
                          <input 
                            type="text" 
                            value={selectedSection.content?.logoUrl || ''} 
                            onChange={(e) => updateSection(selectedSection.id, { content: { ...selectedSection.content, logoUrl: e.target.value } })}
                            className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none"
                            placeholder="https://..."
                          />
                        </div>
                      )}

                      {selectedSection.type === 'header' && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">ناونیشانی لاوەکی</label>
                          <input 
                            type="text" 
                            value={selectedSection.content?.subtitle || ''} 
                            onChange={(e) => updateSection(selectedSection.id, { content: { ...selectedSection.content, subtitle: e.target.value } })}
                            className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">قەبارەی فۆنت</label>
                          <select 
                            value={selectedSection.styles.fontSize}
                            onChange={(e) => updateSection(selectedSection.id, { styles: { ...selectedSection.styles, fontSize: e.target.value } })}
                            className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none"
                          >
                            <option value="10px">بچووک</option>
                            <option value="12px">مامناوەند</option>
                            <option value="14px">گەورە</option>
                            <option value="16px">زۆر گەورە</option>
                            <option value="20px">ناونیشان</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">ئاڕاستە</label>
                          <select 
                            value={selectedSection.styles.textAlign}
                            onChange={(e) => updateSection(selectedSection.id, { styles: { ...selectedSection.styles, textAlign: e.target.value as any } })}
                            className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none"
                          >
                            <option value="right">ڕاست</option>
                            <option value="center">ناوەڕاست</option>
                            <option value="left">چەپ</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">ئەستووری</label>
                          <select 
                            value={selectedSection.styles.fontWeight}
                            onChange={(e) => updateSection(selectedSection.id, { styles: { ...selectedSection.styles, fontWeight: e.target.value } })}
                            className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none"
                          >
                            <option value="normal">ئاسایی</option>
                            <option value="bold">ئەستوور</option>
                            <option value="black">زۆر ئەستوور</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">پادینگ</label>
                          <input 
                            type="text" 
                            value={selectedSection.styles.padding} 
                            onChange={(e) => updateSection(selectedSection.id, { styles: { ...selectedSection.styles, padding: e.target.value } })}
                            className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none"
                            placeholder="10px"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black theme-muted uppercase tracking-widest px-1">ڕەنگی پاشبنەما</label>
                        <div className="flex flex-wrap gap-2">
                          {['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#000000'].map(color => (
                            <button 
                              key={color}
                              onClick={() => updateSection(selectedSection.id, { styles: { ...selectedSection.styles, backgroundColor: color, color: color === '#000000' ? '#ffffff' : '#000000' } })}
                              className={cn(
                                "w-8 h-8 rounded-lg border transition-all",
                                selectedSection.styles.backgroundColor === color ? "ring-2 ring-emerald-500 ring-offset-2" : ""
                              )}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                
                {/* Preview Area */}
                <div className="md:col-span-8">
                  <h4 className="font-black text-xs uppercase tracking-widest theme-muted px-2 mb-4 flex items-center gap-2">
                    <Eye size={14} />
                    پێشبینین (لێرە کلیک بکە بۆ دەستکاری ڕاستەوخۆ)
                  </h4>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-[2rem] p-8 h-[800px] overflow-auto border border-slate-200 dark:border-slate-700 shadow-inner custom-scrollbar">
                    <div className="bg-white shadow-2xl mx-auto w-[148mm] min-h-[210mm] p-8 text-black relative overflow-hidden" dir="rtl">
                      {visualConfig.map(section => {
                        if (!section.isVisible) return null;
                        return (
                          <div 
                            key={section.id}
                            onClick={() => setSelectedSectionId(section.id)}
                            className={cn(
                              "relative transition-all cursor-pointer hover:ring-2 hover:ring-emerald-500/30 rounded-lg p-2 mb-2",
                              selectedSectionId === section.id ? "ring-2 ring-emerald-500" : ""
                            )}
                            style={{
                              fontSize: section.styles.fontSize,
                              textAlign: section.styles.textAlign,
                              backgroundColor: section.styles.backgroundColor,
                              color: section.styles.color,
                              padding: section.styles.padding,
                              borderBottom: section.styles.borderBottom,
                              fontWeight: section.styles.fontWeight
                            }}
                          >
                            {section.type === 'header' && (
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="text-xl font-bold">{section.content?.title}</h3>
                                  <p className="opacity-70">{section.content?.subtitle}</p>
                                </div>
                                <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300 overflow-hidden">
                                  {section.content?.logoUrl ? (
                                    <img src={section.content.logoUrl} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                                  ) : (
                                    <ImageIcon size={24} className="text-slate-400" />
                                  )}
                                </div>
                              </div>
                            )}

                            {section.type === 'image' && (
                              <div className="flex justify-center py-4">
                                <div className="w-32 h-32 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300 overflow-hidden">
                                  {section.content?.logoUrl ? (
                                    <img src={section.content.logoUrl} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                                  ) : (
                                    <ImageIcon size={32} className="text-slate-400" />
                                  )}
                                </div>
                              </div>
                            )}

                            {section.type === 'text' && (
                              <div className="whitespace-pre-wrap">{section.content?.title}</div>
                            )}

                            {section.type === 'customer' && (
                              <div className="grid grid-cols-2 gap-4 border-y border-black py-4 my-4">
                                <div>
                                  <p className="text-[10px] opacity-50 font-bold uppercase">زانیاری وەسڵ</p>
                                  <p>ڕقم: <strong>#1001</strong></p>
                                  <p>ڕێکەوت: <strong>2024-01-01</strong></p>
                                </div>
                                <div>
                                  <p className="text-[10px] opacity-50 font-bold uppercase">کڕیار</p>
                                  <p>ناو: <strong>کڕیاری نموونەیی</strong></p>
                                  <p>مەندوب: <strong>سایەقی نموونەیی</strong></p>
                                </div>
                              </div>
                            )}

                            {section.type === 'items' && (
                              <table className="w-full text-sm border-collapse mt-4">
                                <thead>
                                  <tr className="bg-slate-50">
                                    <th className="border border-black p-2">کۆ</th>
                                    <th className="border border-black p-2">نرخ</th>
                                    <th className="border border-black p-2">بڕ</th>
                                    <th className="border border-black p-2">کاڵا</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="border border-black p-2">٥٠,٠٠٠</td>
                                    <td className="border border-black p-2">١٠,٠٠٠</td>
                                    <td className="border border-black p-2">٥</td>
                                    <td className="border border-black p-2">کاڵای ١</td>
                                  </tr>
                                  <tr>
                                    <td className="border border-black p-2">٥٠,٠٠٠</td>
                                    <td className="border border-black p-2">٢٥,٠٠٠</td>
                                    <td className="border border-black p-2">٢</td>
                                    <td className="border border-black p-2">کاڵای ٢</td>
                                  </tr>
                                </tbody>
                              </table>
                            )}

                            {section.type === 'totals' && (
                              <div className="mt-6 flex justify-end">
                                <div className="w-48 space-y-2">
                                  <div className="flex justify-between border-b border-black pb-1">
                                    <span>کۆی گشتی:</span>
                                    <strong>١٠٠,٠٠٠</strong>
                                  </div>
                                  <div className="flex justify-between border-b border-black pb-1">
                                    <span>داشکاندن:</span>
                                    <strong>٠</strong>
                                  </div>
                                  <div className="flex justify-between bg-slate-100 p-2 rounded font-bold border border-black">
                                    <span>کۆی کۆتایی:</span>
                                    <span>١٠٠,٠٠٠ {settings.currency}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {section.type === 'footer' && (
                              <div className="mt-12 pt-8 border-t border-black text-center space-y-4">
                                <p className="opacity-70">{section.content?.title}</p>
                                <div className="flex justify-around pt-8">
                                  <div className="text-center">
                                    <div className="w-32 h-px bg-black mb-2" />
                                    <p className="text-[10px] font-bold">واژووی کڕیار</p>
                                  </div>
                                  <div className="text-center">
                                    <div className="w-32 h-px bg-black mb-2" />
                                    <p className="text-[10px] font-bold">واژووی کۆمپانیا</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function getSectionLabel(type: string) {
  switch (type) {
    case 'header': return 'سەرپەڕە و لۆگۆ';
    case 'customer': return 'زانیاری کڕیار';
    case 'items': return 'خشتەی کاڵاکان';
    case 'totals': return 'کۆی گشتی';
    case 'footer': return 'پێپەڕە و واژوو';
    case 'text': return 'دەقی ئازاد';
    case 'image': return 'وێنە / لۆگۆ';
    default: return type;
  }
}

const DEFAULT_VISUAL_CONFIG: VisualInvoiceSection[] = [
  {
    id: 'header',
    type: 'header',
    isVisible: true,
    styles: { fontSize: '14px', textAlign: 'right', padding: '10px', borderBottom: '2px solid #000' },
    content: { title: 'البان موراد', subtitle: 'بۆ بەرهەمە شیرەمەنییەکان' }
  },
  {
    id: 'customer',
    type: 'customer',
    isVisible: true,
    styles: { fontSize: '12px', textAlign: 'right', padding: '10px' }
  },
  {
    id: 'items',
    type: 'items',
    isVisible: true,
    styles: { fontSize: '12px', textAlign: 'center', padding: '0px' }
  },
  {
    id: 'totals',
    type: 'totals',
    isVisible: true,
    styles: { fontSize: '14px', textAlign: 'right', padding: '10px' }
  },
  {
    id: 'footer',
    type: 'footer',
    isVisible: true,
    styles: { fontSize: '11px', textAlign: 'center', padding: '10px' },
    content: { title: 'سوپاس بۆ کڕینەکەتان، هیوای تەندروستییەکی باشتان بۆ دەخوازین' }
  }
];

function generateHtmlFromConfig(config: VisualInvoiceSection[], currency: string): string {
  let html = `<div class="invoice-paper font-sans" dir="rtl"><style>
    .invoice-paper { background: #fff; padding: 20px; width: 148mm; min-height: 210mm; margin: auto; color: #000; }
    .invoice-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    .invoice-table th, .invoice-table td { border: 1px solid #000; padding: 8px; text-align: center; }
    @media print { .invoice-paper { width: 100%; padding: 10px; } }
  </style>`;

  config.forEach(section => {
    if (!section.isVisible) return;
    const styleStr = Object.entries(section.styles)
      .map(([k, v]) => `${k.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}: ${v}`)
      .join('; ');

    html += `<div style="${styleStr}; margin-bottom: 20px;">`;

    if (section.type === 'header') {
      html += `<div style="display: flex; justify-content: space-between; align-items: center;">
        <div><h2 style="margin: 0;">${section.content?.title || ''}</h2><p style="margin: 5px 0; opacity: 0.8;">${section.content?.subtitle || ''}</p></div>
        <div style="width: 60px; height: 60px; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; overflow: hidden;">
          ${section.content?.logoUrl ? `<img src="${section.content.logoUrl}" style="width: 100%; height: 100%; object-contain: contain;" />` : 'LOGO'}
        </div>
      </div>`;
    } else if (section.type === 'image') {
      html += `<div style="display: flex; justify-content: center;">
        <div style="width: 120px; height: 120px; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; overflow: hidden;">
          ${section.content?.logoUrl ? `<img src="${section.content.logoUrl}" style="width: 100%; height: 100%; object-contain: contain;" />` : 'IMAGE'}
        </div>
      </div>`;
    } else if (section.type === 'text') {
      html += `<div style="white-space: pre-wrap;">${section.content?.title || ''}</div>`;
    } else if (section.type === 'customer') {
      html += `<div style="display: flex; justify-content: space-between; border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 10px 0;">
        <div><p>ڕقم: <strong>{{receiptId}}</strong></p><p>ڕێکەوت: <strong>{{date}}</strong></p></div>
        <div><p>کڕیار: <strong>{{customerName}}</strong></p><p>مەندوب: <strong>{{driverName}}</strong></p></div>
      </div>`;
    } else if (section.type === 'items') {
      html += `<table class="invoice-table"><thead><tr><th>کۆ</th><th>نرخ</th><th>بڕ</th><th>کاڵا</th></tr></thead><tbody>{{itemsTable}}</tbody></table>`;
    } else if (section.type === 'totals') {
      html += `<div style="display: flex; justify-content: flex-end;"><div style="width: 200px;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 5px 0;"><span>کۆی گشتی:</span><strong>{{total}} ${currency}</strong></div>
        <div style="display: flex; justify-content: space-between; background: #f9f9f9; padding: 8px; font-weight: bold; margin-top: 5px;"><span>کۆی کۆتایی:</span><span>{{total}} ${currency}</span></div>
      </div></div>`;
    } else if (section.type === 'footer') {
      html += `<div style="margin-top: 40px; text-align: center;"><p>${section.content?.title}</p>
        <div style="display: flex; justify-content: space-around; margin-top: 40px;">
          <div style="text-align: center;"><div style="width: 120px; border-top: 1px solid #000; margin-bottom: 5px;"></div><p style="font-size: 10px;">واژووی کڕیار</p></div>
          <div style="text-align: center;"><div style="width: 120px; border-top: 1px solid #000; margin-bottom: 5px;"></div><p style="font-size: 10px;">واژووی کۆمپانیا</p></div>
        </div>
      </div>`;
    }

    html += `</div>`;
  });

  html += `</div>`;
  return html;
}

function ToolboxItem({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-500/10 hover:text-emerald-500 border border-transparent hover:border-emerald-500/20 rounded-2xl transition-all group text-right"
    >
      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all">
        {icon}
      </div>
      <span className="font-bold text-xs">{label}</span>
    </button>
  );
}

const DEFAULT_TEMPLATE = `
<div class="invoice-paper font-sans" dir="rtl">
    <style>
        .invoice-paper {
            background-color: #fff;
            padding: 20px;
            width: 148mm; 
            min-height: 210mm; 
            margin-left: auto;
            margin-right: auto;
            box-sizing: border-box;
            color: #000;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #000;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }
        .header-text { width: 35%; line-height: 1.2; font-size: 12px; }
        .header-logo { width: 30%; text-align: center; }
        .header-logo svg { width: 40px; height: 40px; margin: 0 auto; }
        .header-logo p { margin: 2px 0; font-weight: bold; font-size: 11px; }
        .header h3 { margin: 0; font-size: 16px; font-weight: bold; }
        .header p { margin: 2px 0; }

        .invoice-title-container { border-bottom: 1px solid #000; margin-bottom: 15px; padding-bottom: 10px;}
        .invoice-title {
            background-color: #e0e0e0;
            padding: 2px 10px;
            font-weight: bold;
            border: 1px solid #000;
            width: fit-content;
            margin-top: 5px;
        }

        .info-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .info-box {
            border: 1px solid #000;
            padding: 5px 10px;
            width: 47%;
            border-radius: 5px;
            line-height: 1.6;
        }
        .gray-bg { background-color: #e0e0e0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            text-align: center;
            font-size: 12px;
        }
        .invoice-table, .invoice-table th, .invoice-table td { border: 1px solid #000; }
        .invoice-table th { background-color: #f0f0f0; padding: 4px; font-weight: normal; -webkit-print-color-adjust: exact; print-color-adjust: exact;}
        .invoice-table td { padding: 4px; height: 25px; }

        .bottom-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            font-size: 12px;
        }

        .totals-details { width: 45%; border: 1px solid #000; }
        .totals-details div {
            display: flex;
            justify-content: space-between;
            padding: 3px 5px;
            border-bottom: 1px solid #000;
        }
        .totals-details div:last-child { border-bottom: none; }
        .totals-details .bold-total { background-color: #e0e0e0; font-weight: bold; -webkit-print-color-adjust: exact; print-color-adjust: exact;}

        .payment-details { width: 45%; border: 1px solid #000; border-radius: 5px; overflow: hidden; }
        .payment-title { text-align: center; background: #e0e0e0; padding: 3px; border-bottom: 1px solid #000; font-weight: bold; -webkit-print-color-adjust: exact; print-color-adjust: exact;}
        .payment-details div { display: flex; justify-content: space-between; padding: 3px 5px; min-height: 20px;}

        .footer-notes { margin-top: 10px; font-size: 12px;}
        .notes-box {
            border: 1px solid #000;
            background-color: #e0e0e0;
            width: 150px;
            float: left;
            text-align: right;
            border-radius: 5px;
            overflow: hidden;
            min-height: 60px;
            -webkit-print-color-adjust: exact; print-color-adjust: exact;
        }
        .notes-title { background:#000; color:#fff; text-align:center; padding:2px; font-weight:bold; -webkit-print-color-adjust: exact; print-color-adjust: exact;}
        .notes-content { padding: 5px; text-align: right; }
        
        .signatures { clear: both; padding-top: 30px; display: flex; justify-content: space-between; font-size: 12px;}

        @media print {
            .invoice-paper { 
                width: 100%; 
                margin: 0; 
                padding: 10px;
                box-shadow: none; 
                border: none; 
            }
        }
    </style>
    
    <div class="header">
        <div class="header-text" style="text-align: right;">
            <h3>البان موراد</h3>
            <p>بۆ بەرهەمە شیرەمەنییەکان</p>
            <p>هەولێر - ٤٠ مەتری</p>
        </div>
        
        <div class="header-logo">
            <svg width="40" height="40" viewBox="0 0 100 100"><path fill="#555" d="M50 0c27.6 0 50 22.4 50 50s-22.4 50-50 50S0 77.6 0 50 22.4 0 50 0zm0 20c-16.5 0-30 13.5-30 30s13.5 30 30 30 30-13.5 30-30-13.5-30-30-30zm-5 15h10v30H45V35z"/></svg>
            <p>ALBAN MURAD</p>
        </div>

        <div class="header-text" style="text-align: left; direction: ltr;">
            <h3 style="text-align: right; direction: rtl;">البان موراد</h3>
            <p>0750 445 16 72</p>
            <p>0770 445 16 72</p>
        </div>
    </div>

    <div class="invoice-title-container">
        <div class="invoice-title">ڕقم <span>{{receiptId}}</span></div>
    </div>

    <div class="info-container">
        <div class="info-box">
            <div><strong>پسوولە - فرۆشتن</strong></div>
            <div>ڕێکەوتی پسوولە: <span>{{date}}</span></div>
        </div>
        <div class="info-box" style="border: none; padding: 0">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #000; padding-bottom: 5px">
                <div>ناوی کڕیار: <strong>{{customerName}}</strong></div>
            </div>
        </div>
    </div>

    <table class="invoice-table">
        <thead>
            <tr>
                <th>کۆی گشتی</th>
                <th>نرخی یەکە</th>
                <th>بڕ</th>
                <th>یەکە</th>
                <th>ناوی کاڵا</th>
                <th>ژمارە</th>
            </tr>
        </thead>
        <tbody>
            {{itemsTable}}
        </tbody>
    </table>

    <div class="bottom-section">
        <div class="totals-details">
            <div class="bold-total"><span>کۆی گشتیی پسوولە:</span> <strong>{{total}} {{currency}}</strong></div>
        </div>

        <div class="payment-details">
            <div class="payment-title">وردەکاری پارەدان</div>
            <div><span>نەقد:</span> <strong class="gray-bg" style="padding: 0 15px">{{paidAmount}}</strong></div>
            <div><span>ژمارەی وەسڵ: </span> <span>{{receiptId}}</span></div>
        </div>
    </div>

    <div class="footer-notes">
        <p style="float: right"><strong>ناوی مەندوب:</strong> <span>{{driverName}}</span></p>
        
        <div class="notes-box">
            <div class="notes-title">تێبینی</div>
            <div class="notes-content">
                {{note}}
            </div>
        </div>
    </div>

    <div class="signatures">
        <p><strong>واژووی کڕیار:</strong> .....................................</p>
        <p><strong>واژووی کۆمپانیا:</strong> .....................................</p>
    </div>
</div>
`;

