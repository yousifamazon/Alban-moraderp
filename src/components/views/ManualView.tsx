import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft 
} from 'lucide-react';

interface ManualViewProps {
  onBack: () => void;
}

export function ManualView({ onBack }: ManualViewProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-24 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={onBack} className="p-3 rounded-2xl bg-current/5 hover:bg-current/10 transition-all">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-black tracking-tight">ڕێبەری سیستەم</h2>
          <p className="text-[10px] font-bold theme-muted uppercase tracking-widest mt-1">چۆنێتی بەکارهێنان و ڕێنماییەکانی سیستەم</p>
        </div>
      </div>

      <div className="pro-card p-8 md:p-16 border-none bg-current/5 space-y-12">
        <div className="space-y-8">
          <h3 className="text-2xl font-black tracking-tight">چۆنێتی بەکارهێنان:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { num: '01', title: 'کۆگا و بەرهەم', text: 'سەرەتا لە بەشی "کاڵای نوێ" هەموو بەرهەمەکانت داخڵ بکە. دەتوانیت لە "لیستی کاڵا" دەسکارییان بکەیت. بەشی "بەهەدەردراو" بەکاربهێنە بۆ ئەو کاڵایانەی تیاچوون یان شکاون بۆ ئەوەی حیسابی قازانجت ڕاست بێت.' },
              { num: '02', title: 'فرۆشتن و وەسڵ', text: 'لە بەشی "فرۆشتنی نوێ (POS)" دەتوانیت وەسڵ دروست بکەیت. سیستەمەکە ئۆتۆماتیکی لە بڕی کۆگا کەم دەکاتەوە. ئەگەر کاڵایەک گەڕایەوە، بەشی "گەڕاندنەوەی کاڵا" بەکاربهێنە.' },
              { num: '03', title: 'محاسب و شۆفێران', text: 'لە بەشی "محاسب" دەتوانیت داواکاری شۆفێران و دوکانەکان پەسەند بکەیت. شۆفێران دەتوانن لە ڕێگەی مۆبایلەکانیانەوە داواکاری بنێرن.' },
              { num: '04', title: 'کڕیاران و قەرز', text: 'بەشی "بەڕێوەبردنی کڕیار" یارمەتیدەرە بۆ ناسینەوەی ئەو کڕیارانەی پارەیان لایە (قیست) و بەڕێوەبردنی قەرزەکان. دەتوانیت کەشفی حیسابیان بۆ دەربهێنیت.' },
              { num: '05', title: 'ڕاپۆرتەکان', text: 'لە بەشی "ڕاپۆرتەکان" دەتوانیت قازانج، خەرجی، و ئامارەکانی ڕۆژانە و مانگانە ببینیت. هەروەها ڕاپۆرتی تایبەت بە شۆفێران و جۆرەکانی کاڵا بەردەستە.' },
              { num: '06', title: 'پاراستنی داتا', text: 'هەمیشە لە بەشی ڕێکخستنەکان "Backup" بکە بۆ ئەوەی داتاکانت پارێزراو بن. هەروەها دەتوانیت داتاکان بنێریت بۆ Excel.' },
              { num: '07', title: 'کارمەندان و ئاژەڵان', text: 'دەتوانیت مووچە و زانیاری کارمەندان لە "کارمەندان و شۆفێران" تۆمار بکەیت. هەروەها بەشێکی تایبەت هەیە بۆ بەڕێوەبردنی ئاژەڵان و تۆماری شیر.' },
              { num: '08', title: 'خەرجییەکان', text: 'هەموو خەرجییە ڕۆژانەکانت لە بەشی "خەرجی" تۆمار بکە بۆ ئەوەی لە کاتی حیسابکردنی قازانجی سافیدا دەربکرێن.' }
            ].map(item => (
              <div key={item.num} className="space-y-4 bg-white/5 p-6 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black opacity-20 font-mono-data">{item.num}</span>
                  <h4 className="font-bold text-lg">{item.title}</h4>
                </div>
                <p className="text-sm font-medium leading-relaxed opacity-70">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
