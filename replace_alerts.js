import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Add import
if (!content.includes("import { Toaster, toast } from 'sonner';")) {
  content = content.replace("import React, { useState, useEffect, useMemo } from 'react';", "import React, { useState, useEffect, useMemo } from 'react';\nimport { Toaster, toast } from 'sonner';");
}

// Replace alerts
content = content.replace(/alert\("داتاکان بە سەرکەوتوویی هاوردە کران\."\);/g, 'toast.success("داتاکان بە سەرکەوتوویی هاوردە کران.");');
content = content.replace(/alert\("خەلەلێک لە فایلی هاوردەکراودا هەیە\."\);/g, 'toast.error("خەلەلێک لە فایلی هاوردەکراودا هەیە.");');
content = content.replace(/return alert\("ناوی دابینکەر پێویستە"\);/g, 'return toast.error("ناوی دابینکەر پێویستە");');
content = content.replace(/alert\("زانیارییەکان پاشەکەوت کران"\);/g, 'toast.success("زانیارییەکان پاشەکەوت کران");');
content = content.replace(/return alert\("تکایە بڕی پارە دیاری بکە"\);/g, 'return toast.error("تکایە بڕی پارە دیاری بکە");');
content = content.replace(/alert\("مامەڵەکە بەسەرکەوتوویی تۆمارکرا"\);/g, 'toast.success("مامەڵەکە بەسەرکەوتوویی تۆمارکرا");');
content = content.replace(/return alert\("بڕی پێویست لە کۆگا نییە!"\);/g, 'return toast.error("بڕی پێویست لە کۆگا نییە!");');
content = content.replace(/return alert\("تکایە کاڵا زیاد بکە بۆ سەبەتە"\);/g, 'return toast.error("تکایە کاڵا زیاد بکە بۆ سەبەتە");');
content = content.replace(/return alert\("تکایە ناوی سایەق دیاری بکە"\);/g, 'return toast.error("تکایە ناوی سایەق دیاری بکە");');
content = content.replace(/alert\("داواکارییەکە وەک ڕەشنووس بۆ ژمێریار نێردرا"\);/g, 'toast.success("داواکارییەکە وەک ڕەشنووس بۆ ژمێریار نێردرا");');
content = content.replace(/return alert\("تکایە کاڵا هەڵبژێرە"\);/g, 'return toast.error("تکایە کاڵا هەڵبژێرە");');
content = content.replace(/return alert\("تکایە زانیارییەکان پڕ بکەرەوە"\);/g, 'return toast.error("تکایە زانیارییەکان پڕ بکەرەوە");');
content = content.replace(/alert\("پارە وەرگیرا!"\);/g, 'toast.success("پارە وەرگیرا!");');
content = content.replace(/alert\("تۆمارکرا!"\);/g, 'toast.success("تۆمارکرا!");');
content = content.replace(/alert\("ڕێکخستنەکان پاشەکەوت کران"\);/g, 'toast.success("ڕێکخستنەکان پاشەکەوت کران");');
content = content.replace(/return alert\("ئەم بەشە پێشتر هەیە"\);/g, 'return toast.error("ئەم بەشە پێشتر هەیە");');
content = content.replace(/return alert\("تکایە ناو و مووچە پڕبکەرەوە"\);/g, 'return toast.error("تکایە ناو و مووچە پڕبکەرەوە");');
content = content.replace(/return alert\("تکایە زانیارییەکان پڕبکەرەوە"\);/g, 'return toast.error("تکایە زانیارییەکان پڕبکەرەوە");');
content = content.replace(/return alert\("تکایە کاڵا و بڕ و تێچوو دیاری بکە"\);/g, 'return toast.error("تکایە کاڵا و بڕ و تێچوو دیاری بکە");');
content = content.replace(/return alert\("تکایە دابینکەر و کاڵاکان دیاری بکە"\);/g, 'return toast.error("تکایە دابینکەر و کاڵاکان دیاری بکە");');
content = content.replace(/return alert\("تکایە ناوی کڕیار بنووسە"\);/g, 'return toast.error("تکایە ناوی کڕیار بنووسە");');
content = content.replace(/alert\("وەسڵ نەدۆزرایەوە"\);/g, 'toast.error("وەسڵ نەدۆزرایەوە");');
content = content.replace(/alert\(`گەڕاندنەوە سەرکەوتوو بوو\. بڕی پارەی گەڕاوە: \$\{totalRefund\.toLocaleString\(\)\} \$\{currency\}`\);/g, 'toast.success(`گەڕاندنەوە سەرکەوتوو بوو. بڕی پارەی گەڕاوە: ${totalRefund.toLocaleString()} ${currency}`);');
content = content.replace(/return alert\("تکایە ناونیشان و کارمەند دیاری بکە"\);/g, 'return toast.error("تکایە ناونیشان و کارمەند دیاری بکە");');
content = content.replace(/return alert\("تکایە ناو و نرخی کڕین پڕبکەرەوە"\);/g, 'return toast.error("تکایە ناو و نرخی کڕین پڕبکەرەوە");');
content = content.replace(/return alert\("تکایە هەموو زانیارییەکان پڕبکەرەوە"\);/g, 'return toast.error("تکایە هەموو زانیارییەکان پڕبکەرەوە");');
content = content.replace(/return alert\("تکایە ڕەچەتە و بڕ دیاری بکە"\);/g, 'return toast.error("تکایە ڕەچەتە و بڕ دیاری بکە");');
content = content.replace(/return alert\("تکایە ناو و ژمارەی تابلۆ پڕبکەرەوە"\);/g, 'return toast.error("تکایە ناو و ژمارەی تابلۆ پڕبکەرەوە");');
content = content.replace(/return alert\("تکایە ناو و ژمارەی تەلەفۆن پڕبکەرەوە"\);/g, 'return toast.error("تکایە ناو و ژمارەی تەلەفۆن پڕبکەرەوە");');
content = content.replace(/alert\("پارەکە وەرگیرا و قەرزەکە کەمکرایەوە"\);/g, 'toast.success("پارەکە وەرگیرا و قەرزەکە کەمکرایەوە");');
content = content.replace(/return alert\("تکایە ناو و بودجە پڕبکەرەوە"\);/g, 'return toast.error("تکایە ناو و بودجە پڕبکەرەوە");');
content = content.replace(/return alert\("تکایە بابەت و وەسف پڕبکەرەوە"\);/g, 'return toast.error("تکایە بابەت و وەسف پڕبکەرەوە");');

// Add Toaster to App component
if (!content.includes("<Toaster position=\"top-center\" richColors />")) {
  content = content.replace("<div className=\"flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden\" dir=\"rtl\">", "<div className=\"flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden\" dir=\"rtl\">\n      <Toaster position=\"top-center\" richColors />");
}

fs.writeFileSync('src/App.tsx', content);
console.log("Replaced alerts with toasts.");
