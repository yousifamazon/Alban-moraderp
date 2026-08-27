import React from 'react';
import { Smartphone, Download, CheckCircle, Terminal, Cpu, ShieldCheck, X, Layers, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AndroidExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AndroidExportModal({ isOpen, onClose }: AndroidExportModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="theme-card w-full max-w-2xl rounded-3xl border border-blue-500/30 overflow-hidden shadow-2xl bg-[#0B0F19]"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  ئەپڵیکەیشنی ئەندرۆید (Android / APK)
                  <span className="px-2.5 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    Capacitor ئامادەیە
                  </span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">پڕۆژەی ڕەسەنی Android Studio بە تەواوی ڕێکخراوە و ئامادەیە</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {/* Quick Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800">
                <div className="text-xs text-gray-400 font-medium">ناوی پاکێج (App ID)</div>
                <div className="text-sm font-black text-white font-mono mt-1">com.albanmurad.erp</div>
              </div>
              <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800">
                <div className="text-xs text-gray-400 font-medium">فۆڵدەری Android</div>
                <div className="text-sm font-black text-emerald-400 font-mono mt-1">/android (ئامادەیە)</div>
              </div>
              <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800">
                <div className="text-xs text-gray-400 font-medium">تەلارسازی</div>
                <div className="text-sm font-black text-blue-400 font-mono mt-1">Capacitor Native</div>
              </div>
            </div>

            {/* Steps to Build APK */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                هەنگاوەکانی دروستکردنی فایلی APK:
              </h4>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">١</span>
                    داگرتن / هەناردەکردنی پڕۆژەکە (Export ZIP)
                  </div>
                  <p className="text-xs text-gray-300 pr-8">
                    لە لیستی سەرەکی سەرەوە کلیک لە <b>Export / Download ZIP</b> بکە و تەواوی فۆڵدەرەکانی پڕۆژەکە دابەزێنە.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">٢</span>
                    کردنەوە لە ڕێگەی Android Studio
                  </div>
                  <p className="text-xs text-gray-300 pr-8">
                    بەرنامەی <b>Android Studio</b> بکەرەوە و لە بەشی <b>Open Project</b> فۆڵدەری <code className="bg-gray-800 px-2 py-0.5 rounded text-blue-300 font-mono">android/</code> هەڵبژێرە.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">٣</span>
                    دروستکردنی فایلی APK یان فەرمانی تێرمیناڵ
                  </div>
                  <p className="text-xs text-gray-300 pr-8">
                    لە ناو Android Studio بڕۆ بۆ <b>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</b> تا فایلی <code className="bg-gray-800 px-2 py-0.5 rounded text-emerald-300 font-mono">app-debug.apk</code> دروست بێت.
                  </p>
                </div>
              </div>
            </div>

            {/* Terminal Commands */}
            <div className="space-y-2">
              <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                فەرمانەکانی خێرا لە تێرمیناڵ (CLI Commands):
              </h4>
              <div className="p-4 rounded-2xl bg-black border border-gray-800 font-mono text-xs text-gray-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400"># نوێکردنەوەی گۆڕانکارییەکان بۆ ئەندرۆید:</span>
                </div>
                <div className="text-emerald-400 bg-gray-900/80 p-2 rounded-lg select-all">npm run cap:build</div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-gray-400"># کردنەوەی ڕاستەوخۆ لە Android Studio:</span>
                </div>
                <div className="text-blue-400 bg-gray-900/80 p-2 rounded-lg select-all">npm run cap:open:android</div>
              </div>
            </div>

            {/* Features Enabled */}
            <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-900/30 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-200 leading-relaxed">
                تایبەتمەندییە ڕەسەنەکانی ئەندرۆید وەک <b>کۆنتڕۆڵی دوگمەی گەڕانەوە (Hardware Back Button)</b>، <b>ڕێکخستنی شریتی سەرەوە (Status Bar)</b> و <b>شاشەی دەستپێک (Splash Screen)</b> چالاک کراون.
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800 bg-gray-900/40 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30"
            >
              داخستن
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
