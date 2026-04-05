import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Add customConfirm definition at the top
const confirmDef = `
let resolveConfirm: ((value: boolean) => void) | null = null;
export const customConfirm = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    resolveConfirm = resolve;
    window.dispatchEvent(new CustomEvent('show-confirm', { detail: message }));
  });
};
`;

if (!content.includes('export const customConfirm')) {
  content = content.replace("import { Toaster, toast } from 'sonner';", "import { Toaster, toast } from 'sonner';\n" + confirmDef);
}

// Add state and effect to App component
const appStateDef = `
  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });

  useEffect(() => {
    const handleShowConfirm = (e: any) => setConfirmState({ isOpen: true, message: e.detail });
    window.addEventListener('show-confirm', handleShowConfirm);
    return () => window.removeEventListener('show-confirm', handleShowConfirm);
  }, []);

  const handleConfirm = (result: boolean) => {
    setConfirmState({ isOpen: false, message: '' });
    if (resolveConfirm) {
      resolveConfirm(result);
      resolveConfirm = null;
    }
  };
`;

if (!content.includes('const [confirmState, setConfirmState]')) {
  content = content.replace("const [activeSection, setActiveSection] = useState<string>('hub');", appStateDef + "\n  const [activeSection, setActiveSection] = useState<string>('hub');");
}

// Add modal JSX
const modalJsx = `
      {/* Confirm Modal */}
      {confirmState.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">دڵنیایت؟</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{confirmState.message}</p>
            <div className="flex gap-3">
              <button onClick={() => handleConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium">نەخێر</button>
              <button onClick={() => handleConfirm(true)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors font-medium shadow-lg shadow-red-500/20">بەڵێ</button>
            </div>
          </motion.div>
        </div>
      )}
`;

if (!content.includes('{/* Confirm Modal */}')) {
  content = content.replace("<Toaster position=\"top-center\" richColors />", "<Toaster position=\"top-center\" richColors />\n" + modalJsx);
}

// Replace confirm calls
content = content.replace(/reader\.onload = \(event\) => \{/g, 'reader.onload = async (event) => {');
content = content.replace(/if \(confirm\("ئایا دڵنیایت لە هاوردەکردنی ئەم داتایانە؟ هەموو داتاکانی ئێستات دەسڕێنەوە\."\)\) \{/g, 'if (await customConfirm("ئایا دڵنیایت لە هاوردەکردنی ئەم داتایانە؟ هەموو داتاکانی ئێستات دەسڕێنەوە.")) {');

content = content.replace(/const resetSystem = \(\) => \{/g, 'const resetSystem = async () => {');
content = content.replace(/if \(confirm\("ئایا دڵنیایت لە سڕینەوەی هەموو داتاکان؟"\)\) \{/g, 'if (await customConfirm("ئایا دڵنیایت لە سڕینەوەی هەموو داتاکان؟")) {');

content = content.replace(/const handleDelete = \(id: number\) => \{/g, 'const handleDelete = async (id: number) => {');
content = content.replace(/if \(confirm\("ئایا دڵنیایت لە سڕینەوەی ئەم دابینکەرە؟"\)\) \{/g, 'if (await customConfirm("ئایا دڵنیایت لە سڕینەوەی ئەم دابینکەرە؟")) {');

content = content.replace(/if \(window\.confirm\('ئایا دڵنیایت لە سڕینەوەی ئەم کاڵایە؟'\)\) \{/g, 'if (await customConfirm("ئایا دڵنیایت لە سڕینەوەی ئەم کاڵایە؟")) {');

content = content.replace(/const removeCat = \(cat: string\) => \{/g, 'const removeCat = async (cat: string) => {');
content = content.replace(/if \(confirm\(\`ئایا دڵنیایت لە سڕینەوەی بەشی "\$\{cat\}"؟\`\)\) \{/g, 'if (await customConfirm(`ئایا دڵنیایت لە سڕینەوەی بەشی "${cat}"؟`)) {');

content = content.replace(/const handleReceivePO = \(order: PurchaseOrder\) => \{/g, 'const handleReceivePO = async (order: PurchaseOrder) => {');
content = content.replace(/if \(confirm\("دڵنیایت لە وەرگرتنی ئەم داواکارییە؟ کۆگای کاڵاکان زیاد دەکرێت\."\)\) \{/g, 'if (await customConfirm("دڵنیایت لە وەرگرتنی ئەم داواکارییە؟ کۆگای کاڵاکان زیاد دەکرێت.")) {');

content = content.replace(/const handleComplete = \(order: ProductionOrder\) => \{/g, 'const handleComplete = async (order: ProductionOrder) => {');
content = content.replace(/if \(confirm\("دڵنیایت لە تەواوبوونی ئەم بەرهەمهێنانە؟ کۆگای کەرەستەکان کەمدەکرێتەوە و کاڵای کۆتایی زیاد دەکرێت\."\)\) \{/g, 'if (await customConfirm("دڵنیایت لە تەواوبوونی ئەم بەرهەمهێنانە؟ کۆگای کەرەستەکان کەمدەکرێتەوە و کاڵای کۆتایی زیاد دەکرێت.")) {');

fs.writeFileSync('src/App.tsx', content);
console.log("Replaced confirms with customConfirm.");
