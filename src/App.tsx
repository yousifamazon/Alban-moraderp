import React, { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'sonner';

import { 
  LayoutGrid, 
  Plus, 
  Barcode, 
  Tag, 
  Wallet, 
  Receipt, 
  ShoppingCart, 
  PieChart as PieChartIcon, 
  Bell, 
  HandCoins, 
  Factory, 
  CheckCheck, 
  CheckCircle, 
  CheckCircle2,
  AlertCircle,
  Calculator,
  List, 
  Users, 
  FileText, 
  TrendingDown, 
  Percent, 
  CalendarX, 
  BadgeDollarSign, 
  TableProperties, 
  TrendingUp, 
  ClipboardCheck, 
  Database, 
  PackageOpen, 
  BookOpen, 
  Search,
  Settings as SettingsIcon, 
  RotateCcw,
  Home,
  ChevronLeft,
  Download,
  Upload,
  Milk,
  Sun,
  Moon,
  FileDown,
  Trash2,
  ArrowUpDown,
  Printer,
  X,
  Car,
  Briefcase,
  Truck,
  Edit2,
  Edit3,
  Check,
  ArrowLeftRight,
  Megaphone,
  CreditCard,
  DollarSign,
  Calendar,
  UserCheck,
  ArrowRight,
  ShoppingBag,
  Package,
  Ticket,
  Phone,
  MapPin,
  Menu,
  ChevronDown,
  LogOut,
  Command
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import JsBarcode from 'jsbarcode';
import { LivestockView } from './LivestockView';
import { AccountantView } from './AccountantView';
import { cn, customConfirm, handleConfirm } from './lib/utils';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { onSnapshot, collection, doc, setDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import { Product, Sale, Expense, Waste, ERPData, Payment, SupplierDebt, SupplierPayment, Supply, Settings, Supplier, Return, Shift, Employee, SalaryPayment, PurchaseOrder, PurchaseOrderItem, Customer, Task, Asset, Recipe, RecipeItem, ProductionOrder, Vehicle, Project, SupportTicket, Campaign, Driver, Animal, MilkingRecord, HealthRecord, DraftOrder, DraftOrderItem, Alert, InvoiceTemplate, CustomMenuSetting, CustomField, CustomSection, CustomAction } from './types';
import { MENU_CATEGORIES, MENU_ITEMS } from './constants';

// View Components
import { SpendingView } from './components/views/SpendingView';
import { WasteLogView } from './components/views/WasteLogView';
import { BarcodeGenView } from './components/views/BarcodeGenView';
import { ShelfLabelView } from './components/views/ShelfLabelView';
import { QistDashView } from './components/views/QistDashView';
import { ManualView } from './components/views/ManualView';
import { CustomerListView } from './components/views/CustomerListView';
import { CustomerDetailView } from './components/views/CustomerDetailView';
import { LowStockView } from './components/views/LowStockView';
import { SalesHistoryView } from './components/views/SalesHistoryView';
import { QistAlertsView } from './components/views/QistAlertsView';
import { DebtInView } from './components/views/DebtInView';
import { SupplierManagementView } from './components/views/SupplierManagementView';
import { DriverView } from './components/views/DriverView';
import { ProductListView } from './components/views/ProductListView';
import { ProfitsReportView } from './components/views/ProfitsReportView';
import { HubView } from './components/views/HubView';
import { ReportsHubView } from './components/views/ReportsHubView';
import { LoginView } from './components/views/LoginView';
import { NotificationsView } from './components/views/NotificationsView';
import { AdvancedDashboardView } from './components/views/AdvancedDashboardView';
import { UserManagementView } from './components/views/UserManagementView';
import { ShopRequestView } from './components/views/ShopRequestView';
import { ShopRequestManagementView } from './components/views/ShopRequestManagementView';
import { DriverSalesReportView } from './components/views/DriverSalesReportView';
import { AddProductView } from './components/views/AddProductView';
import { BulkImportView } from './components/views/BulkImportView';
import { CategoryReportView } from './components/views/CategoryReportView';
import { ExpenseReportView } from './components/views/ExpenseReportView';
import { PurchaseOrderView } from './components/views/PurchaseOrderView';
import { POSView } from './components/views/POSView';
import { ReturnsView } from './components/views/ReturnsView';
import { DailySummaryReportView } from './components/views/DailySummaryReportView';
import { InvoiceTemplateView } from './components/views/InvoiceTemplateView';
import { SystemCustomizerView } from './components/views/SystemCustomizerView';
import { MilkCollectionView } from './components/views/MilkCollectionView';
import { AuditLogView } from './components/views/AuditLogView';
import { FooterNavButton, SidebarItem, StatCard } from './components/LayoutComponents';

const STORAGE_KEY = 'alban_murad_erp_data';
const USER_STORAGE_KEY = 'alban_murad_erp_user';

const INITIAL_DATA: ERPData = {
  products: [],
  sales: [],
  expenses: [],
  waste: [],
  payments: [],
  supplierDebts: [],
  supplierPayments: [],
  supplies: [],
  suppliers: [],
  farmers: [],
  milkCollections: [],
  categories: ['گشتی', 'خۆراک', 'پاککەرەوە', 'پێداویستی'],
  returns: [],
  shifts: [],
  auditLogs: [],
  employees: [],
  salaryPayments: [],
  purchaseOrders: [],
  customers: [],
  tasks: [],
  assets: [],
  recipes: [],
  productionOrders: [],
  vehicles: [],
  projects: [],
  drivers: [],
  tickets: [],
  campaigns: [],
  animals: [],
  milkingRecords: [],
  healthRecords: [],
  feedLogs: [],
  vaccinationLogs: [],
  draftOrders: [],
  alerts: [],
  rewardRedemptions: [],
  settings: {
    storeName: 'Alban Murad Trading',
    currency: 'IQD',
    theme: 'dark',
    language: 'ku',
    invoiceTemplates: [],
    activeInvoiceTemplateId: 'default',
    menuSettings: []
  }
};

function App() {
  
  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });

  useEffect(() => {
    const handleShowConfirm = (e: any) => setConfirmState({ isOpen: true, message: e.detail });
    window.addEventListener('show-confirm', handleShowConfirm);
    return () => window.removeEventListener('show-confirm', handleShowConfirm);
  }, []);

  const onConfirmResult = (result: boolean) => {
    setConfirmState({ isOpen: false, message: '' });
    handleConfirm(result);
  };

  const [activeSection, setActiveSection] = useState<string>('hub');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [openCategories, setOpenCategories] = useState<string[]>(['sales_customers', 'inventory_production', 'reports']);
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  });
  const [data, setData] = useState<ERPData>(INITIAL_DATA);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Firebase Real-time Sync
  useEffect(() => {
    if (!currentUser || !firebaseUser) return;

    const collections = ['products', 'sales', 'farmers', 'milkCollections', 'users', 'customers', 'expenses', 'waste', 'payments', 'supplierDebts', 'supplierPayments', 'supplies', 'returns', 'shifts', 'employees', 'salaryPayments', 'purchaseOrders', 'assets', 'recipes', 'productionOrders', 'vehicles', 'projects', 'supportTickets', 'campaigns', 'drivers', 'animals', 'milkingRecords', 'healthRecords', 'feedLogs', 'vaccinationLogs', 'rewardRedemptions', 'alerts'];
    
    const unsubscribes = collections.map(colName => {
      return onSnapshot(collection(db, colName), (snapshot) => {
        const items = snapshot.docs.map(doc => ({ ...doc.data() }));
        setData(prev => ({ ...prev, [colName]: items }));
        if (colName === 'products') setIsDataLoaded(true); // Basic check for initial load
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, colName);
      });
    });

    // Settings sync
    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setData(prev => ({ ...prev, settings: { ...prev.settings, ...docSnap.data() } }));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/global');
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
      unsubSettings();
    };
  }, [currentUser, firebaseUser]);

  // Sync data to Firebase (Debounced or on change)
  // Note: In a real app, we should use individual add/update/delete functions
  // instead of syncing the whole state. For now, we'll implement a helper to update Firebase.
  
  const updateFirebaseCollection = async (colName: string, items: any[]) => {
    try {
      const batch = writeBatch(db);
      // This is a naive implementation for the demo. 
      // In production, you'd only update the changed document.
      for (const item of items) {
        const docRef = doc(db, colName, String(item.id || Math.random()));
        batch.set(docRef, item);
      }
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, colName);
    }
  };

  // Persistence (Local storage fallback)
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isDataLoaded]);

  // Alert Generation
  useEffect(() => {
    const newAlerts: Alert[] = [];
    
    // Low Stock Alerts
    data.products.forEach(p => {
      if (p.stock <= p.minStock) {
        newAlerts.push({
          id: Date.now() + Math.random(),
          type: 'low-stock',
          title: 'کەمی کاڵا',
          message: `کاڵای "${p.name}" لە کۆگا بەرەو تەواوبوون دەچێت (بڕی ماوە: ${p.stock})`,
          date: new Date().toISOString(),
          isRead: false,
          severity: 'warning',
          link: 'product-list'
        });
      }
    });

    // Debt Alerts (Example: if debt > 1,000,000)
    data.customers?.forEach(c => {
      if (c.debt > 1000000) {
        newAlerts.push({
          id: Date.now() + Math.random(),
          type: 'debt-due',
          title: 'قەرزی زۆر',
          message: `کڕیار "${c.name}" بڕی ${c.debt.toLocaleString()} قەرزدارە`,
          date: new Date().toISOString(),
          isRead: false,
          severity: 'info',
          link: 'customer-list'
        });
      }
    });

    if (newAlerts.length > 0) {
      setData(prev => {
        const existingMessages = new Set(prev.alerts?.map(a => a.message) || []);
        const uniqueNewAlerts = newAlerts.filter(a => !existingMessages.has(a.message));
        if (uniqueNewAlerts.length === 0) return prev;
        return {
          ...prev,
          alerts: [...(prev.alerts || []), ...uniqueNewAlerts].slice(-50) // Keep last 50
        };
      });
    }
  }, [data.products, data.customers]);

  // Backup & Restore
  const backupData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Alban_Murad_ERP_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("داتاکان بە سەرکەوتوویی پاشەکەوت کران.");
  };

  const restoreData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (await customConfirm("ئایا دڵنیایت لە هاوردەکردنی ئەم داتایانە؟ هەموو داتاکانی ئێستات دەسڕێنەوە.")) {
          setData({ ...INITIAL_DATA, ...parsed });
          
          // Sync to Firebase
          if (firebaseUser) {
            const batch = writeBatch(db);
            Object.entries(parsed).forEach(([colName, items]) => {
              if (Array.isArray(items)) {
                items.forEach((item: any) => {
                  if (item.id) {
                    const docRef = doc(db, colName, String(item.id));
                    batch.set(docRef, item);
                  }
                });
              } else if (colName === 'settings') {
                const docRef = doc(db, 'settings', 'global');
                batch.set(docRef, items);
              }
            });
            await batch.commit();
          }
          
          toast.success("داتاکان بە سەرکەوتوویی هاوردە کران.");
        }
      } catch (err) {
        toast.error("خەلەلێک لە فایلی هاوردەکراودا هەیە.");
      }
    };
    reader.readAsText(file);
  };

  const saveToFirebase = async (colName: string, item: any) => {
    if (!firebaseUser) return;
    try {
      const docRef = doc(db, colName, String(item.id || 'global'));
      await setDoc(docRef, item);
      
      // Don't audit log the audit log itself to avoid infinite loops
      if (colName !== 'auditLogs') {
        createAuditLog('Save/Update', colName, item.id || 'global', `Saved ${colName} entry`);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, colName);
    }
  };

  const deleteFromFirebase = async (colName: string, id: string | number) => {
    if (!firebaseUser) return;
    try {
      const docRef = doc(db, colName, String(id));
      await deleteDoc(docRef);
      createAuditLog('Delete', colName, id, `Deleted ${colName} entry`);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, colName);
    }
  };

  const createAuditLog = async (action: string, entity: string, entityId: string | number, details: string) => {
    if (!firebaseUser) return;
    const log: AuditLog = {
      id: Date.now(),
      userId: firebaseUser.uid,
      userName: firebaseUser.displayName || firebaseUser.email || 'Unknown',
      action,
      entity,
      entityId,
      details,
      date: new Date().toISOString()
    };
    setData(prev => ({ ...prev, auditLogs: [log, ...(prev.auditLogs || [])] }));
    saveToFirebase('auditLogs', log);
  };

  // Calculations
  const totalSales = data.sales.reduce((acc, s) => acc + s.total, 0);
  const totalCost = data.sales.reduce((acc, s) => acc + (s.itemCost * s.quantity), 0);
  const totalExpenses = data.expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalWaste = data.waste.reduce((acc, w) => acc + w.cost, 0);
  const totalDiscounts = data.sales.reduce((acc, s) => acc + s.discount, 0);
  const totalSalaryPayments = data.salaryPayments?.reduce((acc, p) => acc + p.amount, 0) || 0;
  const netProfit = totalSales - totalCost - totalExpenses - totalWaste - totalSalaryPayments;

  // Analytics Data
  const salesByDate = data.sales.reduce((acc: any, s) => {
    const date = s.date.split('T')[0];
    acc[date] = (acc[date] || 0) + s.total;
    return acc;
  }, {});

  const chartData = Object.keys(salesByDate).sort().map(date => ({
    date,
    amount: salesByDate[date]
  })).slice(-7); // Last 7 days

  const salesByCategory = data.sales.reduce((acc: any, s) => {
    const cat = s.category || 'Other';
    acc[cat] = (acc[cat] || 0) + s.total;
    return acc;
  }, {});

  const pieData = Object.keys(salesByCategory).map(name => ({
    name,
    value: salesByCategory[name]
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const lowStockProducts = data.products.filter(p => p.stock <= p.minStock);

  const handlePrint = (title: string, content: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>${title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700;900&display=swap');
            body { 
              font-family: 'Vazirmatn', sans-serif; 
              padding: 40px; 
              color: #0f172a; 
              max-width: 1000px; 
              margin: 0 auto;
              background: #fff;
              line-height: 1.6;
            }
            .print-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 3px solid #0f172a;
              padding-bottom: 20px;
              margin-bottom: 40px;
            }
            .store-brand h1 {
              margin: 0;
              font-size: 32px;
              font-weight: 900;
              color: #0f172a;
              letter-spacing: -0.02em;
            }
            .store-brand p {
              margin: 5px 0 0;
              font-size: 14px;
              font-weight: 700;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.1em;
            }
            .report-meta {
              text-align: left;
              font-size: 14px;
              font-weight: 600;
              color: #64748b;
            }
            .report-title {
              text-align: center;
              font-size: 24px;
              font-weight: 900;
              margin-bottom: 40px;
              color: #0f172a;
              position: relative;
              padding-bottom: 15px;
            }
            .report-title::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 50%;
              transform: translateX(-50%);
              width: 60px;
              height: 4px;
              background: #3b82f6;
              border-radius: 2px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px; 
              font-size: 14px;
              border: 1px solid #e2e8f0;
            }
            th { 
              background-color: #f8fafc; 
              color: #0f172a;
              font-weight: 900; 
              border: 1px solid #e2e8f0;
              padding: 15px 10px;
              text-align: right;
            }
            td { 
              border: 1px solid #e2e8f0; 
              padding: 12px 10px; 
              text-align: right; 
              font-weight: 500;
            }
            tr:nth-child(even) {
              background-color: #fcfdfe;
            }
            .footer {
              margin-top: 60px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              font-weight: 700;
              color: #94a3b8;
            }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <div class="store-brand">
              <h1>${data.settings.storeName || 'Alban Murad'}</h1>
              <p>Enterprise ERP System</p>
            </div>
            <div class="report-meta">
              <div>ڕێکەوت: ${new Date().toLocaleDateString('ku-IQ')}</div>
              <div>کات: ${new Date().toLocaleTimeString('ku-IQ')}</div>
            </div>
          </div>
          
          <h2 class="report-title">${title}</h2>
          
          <div class="report-content">
            ${content}
          </div>

          <div class="footer">
            <div>سیستەمی بەڕێوەبردنی البان موراد</div>
            <div>لاپەڕە 1 لە 1</div>
          </div>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    
    const productsData = data.products.map(p => ({
      'ناو': p.name,
      'باڕکۆد': p.barcode,
      'جۆر': p.category || 'دیاری نەکراو',
      'نرخ': p.price,
      'بڕ': p.stock,
      'یەکە': p.unit,
      'کۆی نرخ': p.price * p.stock
    }));

    const salesData = data.sales.map(s => ({
      'ژمارەی وەسڵ': s.receiptId || s.id,
      'کڕیار': s.customerName,
      'کاڵا': s.itemName,
      'بڕ': s.quantity,
      'کۆی گشتی': s.total,
      'جۆری پارەدان': s.paymentMethod === 'cash' ? 'نەختینە' : 'قەرز',
      'بەروار': s.date,
      'سەرچاوە': s.source === 'driver' ? 'شۆفێر' : s.source === 'shop' ? 'دوکان' : 'فرۆشتنی ڕاستەوخۆ'
    }));

    const expensesData = data.expenses.map(e => ({
      'جۆر': e.category,
      'بڕ': e.amount,
      'تێبینی': e.description,
      'بەروار': e.date
    }));

    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(productsData), "کۆگا");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(salesData), "فرۆشتن");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(expensesData), "خەرجییەکان");
    
    XLSX.writeFile(wb, `Alban_Murad_ERP_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const resetSystem = async () => {
    if (await customConfirm("ئایا دڵنیایت لە سڕینەوەی هەموو داتاکان؟")) {
      setData(INITIAL_DATA);
      localStorage.removeItem(STORAGE_KEY);
      setActiveSection('hub');
    }
  };


  const handleSaveTemplates = (templates: InvoiceTemplate[], activeId: string) => {
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        invoiceTemplates: templates,
        activeInvoiceTemplateId: activeId
      }
    }));
  };

  const handleSaveMenuSettings = (menuSettings: CustomMenuSetting[]) => {
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        menuSettings
      }
    }));
  };

  const handleSaveCustomFields = (customFields: CustomField[]) => {
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        customFields
      }
    }));
  };

  const handleSaveCustomSections = (customSections: CustomSection[]) => {
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        customSections
      }
    }));
  };

  const getActiveTemplate = () => {
    if (data.settings.invoiceTemplates && data.settings.activeInvoiceTemplateId) {
      const active = data.settings.invoiceTemplates.find(t => t.id === data.settings.activeInvoiceTemplateId);
      if (active) return active.content;
    }
    return data.settings.invoiceTemplate || '';
  };

  useEffect(() => {
    const lastBackup = localStorage.getItem('last_backup_date');
    const today = new Date().toLocaleDateString();
    if (lastBackup !== today) {
      backupData();
      localStorage.setItem('last_backup_date', today);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
  }, []);

  if (!currentUser) {
    return <LoginView users={data.users || []} onLogin={setCurrentUser} darkMode={true} />;
  }

  const canAccess = (sectionId: string) => {
    if (!currentUser) return false;
    if (currentUser.allowedSections.includes('*')) return true;
    return currentUser.allowedSections.includes(sectionId);
  };

  return (
    <div className={cn(
      "min-h-screen font-['Vazirmatn',sans-serif] transition-colors duration-500 flex overflow-hidden bg-black text-white"
    )} dir="rtl">
      <Toaster position="top-center" richColors />
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "flex-shrink-0 flex flex-col border-l transition-all duration-500 z-50",
        "bg-black border-white/5",
        "fixed inset-y-0 right-0 lg:static",
        isMobileSidebarOpen ? "translate-x-0 w-72" : "translate-x-full w-72 lg:translate-x-0",
        isDesktopSidebarOpen ? "lg:w-72 lg:opacity-100" : "lg:w-0 lg:opacity-0 lg:overflow-hidden lg:border-none"
      )}>
        <div className="p-8 flex flex-col items-start gap-6">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-current rounded-2xl flex items-center justify-center text-inherit shadow-2xl">
                <Milk size={24} className="text-black" />
              </div>
              <div>
                <h1 className="font-black text-xl tracking-tighter leading-none">{data.settings.storeName}</h1>
                <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest mt-1">Enterprise ERP</p>
              </div>
            </div>
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl theme-hover border theme-border"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-4 space-y-4 custom-scrollbar">
          <div>
            <p className="px-4 mb-2 text-[10px] font-black opacity-20 uppercase tracking-[0.3em]">سەرەکی</p>
            <div className="space-y-1">
              <SidebarItem 
                active={activeSection === 'hub'} 
                icon={<LayoutGrid size={18} />} 
                label="داشبۆرد" 
                onClick={() => {
                  setActiveSection('hub');
                  setIsMobileSidebarOpen(false);
                }} 
                darkMode={true}
              />
            </div>
          </div>
          
          <div>
            <p className="px-4 mb-2 text-[10px] font-black opacity-20 uppercase tracking-[0.3em]">کارپێکردن</p>
            <div className="space-y-1">
              {canAccess('pos') && <SidebarItem active={activeSection === 'pos'} icon={<ShoppingCart size={18} />} label="فرۆشتن (POS)" onClick={() => { setActiveSection('pos'); setIsMobileSidebarOpen(false); }} darkMode={true} />}
              {canAccess('milk-collection') && <SidebarItem active={activeSection === 'milk-collection'} icon={<Milk size={18} />} label="کۆکردنەوەی شیر" onClick={() => { setActiveSection('milk-collection'); setIsMobileSidebarOpen(false); }} darkMode={true} />}
              {canAccess('product-list') && <SidebarItem active={activeSection === 'product-list'} icon={<List size={18} />} label="کۆگا و کاڵاکان" onClick={() => { setActiveSection('product-list'); setIsMobileSidebarOpen(false); }} darkMode={true} />}
              {canAccess('driver-view') && <SidebarItem active={activeSection === 'driver-view'} icon={<Truck size={18} />} label="بەشی سایەق" onClick={() => { setActiveSection('driver-view'); setIsMobileSidebarOpen(false); }} darkMode={true} />}
              {canAccess('accountant-view') && <SidebarItem active={activeSection === 'accountant-view'} icon={<Receipt size={18} />} label="بەشی محاسب" onClick={() => { setActiveSection('accountant-view'); setIsMobileSidebarOpen(false); }} darkMode={true} />}
              
              {/* Custom Sections */}
              {data.settings.customSections?.filter(s => s.isVisible).map(section => (
                <SidebarItem 
                  key={section.id}
                  active={activeSection === section.id} 
                  icon={<Command size={18} />} 
                  label={section.label} 
                  onClick={() => { setActiveSection(section.id); setIsMobileSidebarOpen(false); }} 
                  darkMode={true} 
                />
              ))}
            </div>
          </div>

          {MENU_CATEGORIES.map(cat => {
            const catItems = MENU_ITEMS.filter(item => item.category === cat.id && canAccess(item.id));
            const visibleItems = catItems.filter(item => {
              const setting = data.settings.menuSettings?.find(s => s.id === item.id);
              return setting ? setting.isVisible : true;
            });

            if (visibleItems.length === 0) return null;
            
            const isOpen = openCategories.includes(cat.id);
            return (
              <div key={cat.id} className="mb-2">
                <button 
                  onClick={() => setOpenCategories(prev => isOpen ? prev.filter(c => c !== cat.id) : [...prev, cat.id])}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl theme-hover transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("opacity-40 group-hover:opacity-100 transition-opacity", isOpen ? "opacity-100" : "")}>
                      {(cat as any).icon}
                    </div>
                    <span className="text-[10px] font-black opacity-60 uppercase tracking-[0.3em] group-hover:opacity-100 transition-opacity">{cat.label}</span>
                  </div>
                  <ChevronDown size={14} className={cn("transition-transform opacity-40", isOpen ? "rotate-180" : "")} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1 mt-1">
                        {visibleItems.map(item => {
                          const setting = data.settings.menuSettings?.find(s => s.id === item.id);
                          return (
                            <SidebarItem 
                              key={item.id}
                              active={activeSection === item.id} 
                              icon={item.icon} 
                              label={setting?.label || item.label} 
                              onClick={() => {
                                setActiveSection(item.id);
                                setIsMobileSidebarOpen(false);
                              }} 
                              darkMode={true}
                            />
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="p-6 border-t border-inherit space-y-3">
          <button 
            onClick={async () => {
              const confirmed = await customConfirm('ئایا دڵنیایت لە چوونەدەرەوە؟');
              if (confirmed) {
                setCurrentUser(null);
              }
            }}
            className="w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-black text-xs theme-hover border border-red-500/20 text-red-500 bg-red-500/5"
          >
            <LogOut size={16} />
            <span>چوونەدەرەوە</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative theme-bg">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-24 border-b px-8 items-center justify-between sticky top-0 z-40 backdrop-blur-xl bg-black/80 border-white/5">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
              className="p-3 rounded-2xl theme-hover border theme-border transition-all"
            >
              <Menu size={24} />
            </button>
            <h2 className="font-black text-2xl tracking-tighter">
              {MENU_ITEMS.find(i => i.id === activeSection)?.label || (activeSection === 'hub' ? 'داشبۆرد' : activeSection)}
            </h2>
            <div className="h-6 w-px theme-border border-l" />
            <div className="flex items-center gap-2 theme-muted text-xs font-bold">
              <CalendarX size={14} />
              <span>{new Date().toLocaleDateString('ku-IQ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 theme-muted" size={16} />
              <input 
                type="text" 
                placeholder="گەڕان لە سیستەم..." 
                className="pr-12 pl-4 py-3 w-64 text-xs font-bold"
              />
            </div>
            <button 
              onClick={() => setActiveSection('notifications')}
              className="p-3 rounded-2xl theme-hover border theme-border relative"
            >
              <Bell size={18} />
              {(data.alerts?.filter(a => !a.isRead).length || 0) > 0 && (
                <div className="absolute top-3 left-3 w-2 h-2 bg-red-500 rounded-full border-2 theme-bg" />
              )}
            </button>
            
            <div className="flex items-center gap-3 px-3 py-2 rounded-2xl theme-hover border theme-border">
              <div className="text-left">
                <p className="text-[10px] font-black tracking-tight leading-none">{currentUser.name}</p>
                {currentUser.email && (
                  <p className="text-[8px] theme-muted font-bold mt-1">{currentUser.email}</p>
                )}
              </div>
              {firebaseUser?.photoURL ? (
                <img 
                  src={firebaseUser.photoURL} 
                  alt={currentUser.name}
                  className="h-9 w-9 rounded-xl object-cover border border-white/10"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-9 w-9 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-xs text-white">
                  {currentUser.name.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <button 
              onClick={async () => {
                const confirmed = await customConfirm('ئایا دڵنیایت لە چوونەدەرەوە؟');
                if (confirmed) {
                  setCurrentUser(null);
                }
              }}
              className="p-3 rounded-2xl theme-hover border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all"
              title="چوونەدەرەوە"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="lg:hidden border-b p-6 flex justify-between items-center sticky top-0 z-40 backdrop-blur-xl bg-black/80 border-white/5">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileSidebarOpen(true)} className="p-3 rounded-xl theme-hover border theme-border">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-current rounded-xl flex items-center justify-center">
                <Milk size={20} className="text-black" />
              </div>
              <h1 className="font-black text-lg tracking-tighter">{data.settings.storeName}</h1>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {firebaseUser?.photoURL ? (
              <img 
                src={firebaseUser.photoURL} 
                alt={currentUser.name}
                className="h-8 w-8 rounded-lg object-cover border border-white/10"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-[10px] text-white">
                {currentUser.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <button 
              onClick={async () => {
                const confirmed = await customConfirm('ئایا دڵنیایت لە چوونەدەرەوە؟');
                if (confirmed) {
                  setCurrentUser(null);
                }
              }}
              className="p-3 rounded-xl theme-hover border border-red-500/20 text-red-500"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {activeSection === 'driver-view' && (
                <DriverView 
                  products={data.products} 
                  customers={data.customers || []}
                  drivers={data.drivers || []}
                  currency={data.settings.currency}
                  darkMode={true}
                  onSaveDraft={(o) => setData({...data, draftOrders: [...(data.draftOrders || []), o]})} 
                  onBack={() => setActiveSection('hub')} 
                />
              )}
              {activeSection === 'accountant-view' && (
                <AccountantView 
                  draftOrders={data.draftOrders || []} 
                  shopRequests={data.shopRequests || []}
                  onOpenPOS={() => setActiveSection('pos')}
                  onApproveShopRequest={(r) => {
                    const nextReceiptNumber = data.sales.length > 0 
                      ? Math.max(...data.sales.map(s => parseInt(s.receiptId || '0') || 0)) + 1 
                      : 1;
                    const receiptId = `${nextReceiptNumber}`;
                    const date = new Date().toLocaleDateString('ku-IQ');

                    const newSales: Sale[] = r.items.map((item, index) => {
                      const product = data.products.find(p => p.id === item.productId);
                      return {
                        id: Date.now() + index,
                        receiptId,
                        customerName: r.shopName,
                        itemName: item.itemName,
                        itemCost: product?.cost || 0,
                        quantity: item.quantity,
                        discount: 0,
                        total: 0, // Internal transfer, maybe 0 total? Or should it be price? Let's use 0 for internal transfer or product price if they want it tracked as sale. Let's use product price to be safe.
                        paymentMethod: 'cash',
                        date,
                        source: 'shop'
                      };
                    });

                    // Update totals based on price
                    newSales.forEach(sale => {
                       const product = data.products.find(p => p.name === sale.itemName);
                       if(product) {
                         sale.total = product.price * sale.quantity;
                       }
                    });

                    const updatedProducts = [...data.products];
                    r.items.forEach(item => {
                      const pIndex = updatedProducts.findIndex(p => p.id === item.productId);
                      if (pIndex !== -1) {
                        updatedProducts[pIndex] = { 
                          ...updatedProducts[pIndex], 
                          stock: updatedProducts[pIndex].stock - item.quantity 
                        };
                      }
                    });
                    setData({
                      ...data,
                      products: updatedProducts,
                      sales: [...data.sales, ...newSales],
                      shopRequests: data.shopRequests?.map(req => req.id === r.id ? {...req, status: 'approved'} : req)
                    });
                  }}
                  onConvert={(o) => {
                    const nextReceiptNumber = data.sales.length > 0 
                      ? Math.max(...data.sales.map(s => parseInt(s.receiptId) || 0)) + 1 
                      : 1;
                    const receiptId = `${nextReceiptNumber}`;
                    const date = new Date().toLocaleDateString('ku-IQ');
                  
                  const newSales: Sale[] = o.items.map((item, index) => {
                    const product = data.products.find(p => p.id === item.productId);
                    return {
                      id: Date.now() + index,
                      receiptId,
                      customerName: o.customerName,
                      driverName: o.driverName,
                      itemName: item.itemName,
                      itemCost: product?.cost || 0,
                      quantity: item.quantity,
                      discount: 0,
                      total: item.total,
                      paymentMethod: o.paymentMethod || 'cash',
                      paidAmount: index === 0 ? (o.paidAmount || 0) : 0,
                      date,
                      source: 'driver'
                    };
                  });

                  const updatedProducts = [...data.products];
                  o.items.forEach(item => {
                    const pIndex = updatedProducts.findIndex(p => p.id === item.productId);
                    if (pIndex !== -1) {
                      updatedProducts[pIndex] = { 
                        ...updatedProducts[pIndex], 
                        stock: updatedProducts[pIndex].stock - item.quantity 
                      };
                    }
                  });

                  let updatedCustomers = data.customers ? [...data.customers] : [];
                  if (o.paymentMethod === 'qist') {
                    const debtAmount = o.totalAmount - (o.paidAmount || 0);
                    const existingCustomerIndex = updatedCustomers.findIndex(c => c.name === o.customerName);
                    
                    if (existingCustomerIndex !== -1) {
                      updatedCustomers[existingCustomerIndex] = {
                        ...updatedCustomers[existingCustomerIndex],
                        debt: (updatedCustomers[existingCustomerIndex].debt || 0) + debtAmount
                      };
                    } else if (o.customerName && o.customerName !== 'کڕیاری نەختینە') {
                      updatedCustomers.push({
                        id: Date.now(),
                        name: o.customerName,
                        phone: '',
                        address: '',
                        debt: debtAmount
                      });
                    }
                  }

                  setData({
                    ...data,
                    products: updatedProducts,
                    sales: [...data.sales, ...newSales],
                    customers: updatedCustomers,
                    draftOrders: data.draftOrders?.map(d => d.id === o.id ? {...d, status: 'converted'} : d)
                  });
                }} onBack={() => setActiveSection('hub')} />
              )}
              {activeSection === 'hub' && (
                <HubView 
                  data={data} 
                  totalSales={totalSales} 
                  totalExpenses={totalExpenses} 
                  totalWaste={totalWaste} 
                  netProfit={netProfit} 
                  setActiveSection={setActiveSection} 
                  onBackup={backupData}
                />
              )}

          {activeSection === 'add-product' && (
            <AddProductView 
              products={data.products} 
              categories={data.categories || []} 
              currency={data.settings.currency} 
              customFields={data.settings.customFields}
              onSave={(p) => {
                setData(prev => ({ ...prev, products: [...prev.products, p] }));
                saveToFirebase('products', p);
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'product-list' && (
            <ProductListView 
              products={data.products} 
              currency={data.settings.currency} 
              onPrint={handlePrint} 
              onUpdate={(updatedProducts) => {
                setData(prev => ({ ...prev, products: updatedProducts }));
                // Update changed products in Firebase
                updatedProducts.forEach(p => saveToFirebase('products', p));
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'reports-hub' && <ReportsHubView onNavigate={(s) => setActiveSection(s)} onBack={() => setActiveSection('hub')} />}
          {activeSection === 'daily-summary' && <DailySummaryReportView sales={data.sales} expenses={data.expenses} returns={data.returns || []} waste={data.waste} salaryPayments={data.salaryPayments || []} currency={data.settings.currency} onPrint={handlePrint} onBack={() => setActiveSection('reports-hub')} />}
          {activeSection === 'profits-rep' && <ProfitsReportView totalSales={totalSales} totalCost={totalCost} totalExpenses={totalExpenses} totalWaste={totalWaste} totalDiscounts={totalDiscounts} totalSalaries={totalSalaryPayments} currency={data.settings.currency} darkMode={true} onPrint={handlePrint} onBack={() => setActiveSection('reports-hub')} />}
          {activeSection === 'spending' && (
            <SpendingView 
              expenses={data.expenses} 
              currency={data.settings.currency} 
              darkMode={true} 
              onSave={(e) => {
                setData(prev => ({ ...prev, expenses: [...prev.expenses, e] }));
                saveToFirebase('expenses', e);
              }} 
              onPrint={handlePrint} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'waste-log' && (
            <WasteLogView 
              products={data.products} 
              waste={data.waste} 
              currency={data.settings.currency} 
              onSave={(w, updatedProducts) => {
                setData(prev => ({ ...prev, waste: [...prev.waste, w], products: updatedProducts }));
                saveToFirebase('waste', w);
                updatedProducts.forEach(p => saveToFirebase('products', p));
              }} 
              onPrint={handlePrint} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'barcode-gen' && <BarcodeGenView products={data.products} onBack={() => setActiveSection('hub')} />}
          {activeSection === 'shelf-label' && <ShelfLabelView products={data.products} currency={data.settings.currency} onBack={() => setActiveSection('hub')} />}
          {activeSection === 'qist-dash' && <QistDashView sales={data.sales} payments={data.payments} customers={data.customers || []} currency={data.settings.currency} onBack={() => setActiveSection('reports-hub')} />}
          {activeSection === 'manual' && <ManualView onBack={() => setActiveSection('hub')} />}
          {activeSection === 'customer-list' && <CustomerListView customers={data.customers || []} sales={data.sales} currency={data.settings.currency} onBack={() => setActiveSection('hub')} />}
          {activeSection === 'low-stock' && <LowStockView products={data.products} onBack={() => setActiveSection('reports-hub')} />}
          {activeSection === 'sales-history' && <SalesHistoryView sales={data.sales} products={data.products} customers={data.customers || []} currency={data.settings.currency} invoiceTemplate={getActiveTemplate()} onPrint={handlePrint} onBack={() => setActiveSection('hub')} />}
          {activeSection === 'livestock-mgmt' && (
            <LivestockView 
              initialTab="animals" 
              animals={data.animals || []} 
              milkingRecords={data.milkingRecords || []} 
              healthRecords={data.healthRecords || []} 
              feedLogs={data.feedLogs || []} 
              vaccinationLogs={data.vaccinationLogs || []} 
              employees={data.employees || []} 
              onSave={(a, m, h, f, v) => {
                setData(prev => ({ ...prev, animals: a, milkingRecords: m, healthRecords: h, feedLogs: f, vaccinationLogs: v }));
                a.forEach(item => saveToFirebase('animals', item));
                m.forEach(item => saveToFirebase('milkingRecords', item));
                h.forEach(item => saveToFirebase('healthRecords', item));
                f.forEach(item => saveToFirebase('feedLogs', item));
                v.forEach(item => saveToFirebase('vaccinationLogs', item));
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'milking-log' && (
            <LivestockView 
              initialTab="milking" 
              animals={data.animals || []} 
              milkingRecords={data.milkingRecords || []} 
              healthRecords={data.healthRecords || []} 
              feedLogs={data.feedLogs || []} 
              vaccinationLogs={data.vaccinationLogs || []} 
              employees={data.employees || []} 
              onSave={(a, m, h, f, v) => {
                setData(prev => ({ ...prev, animals: a, milkingRecords: m, healthRecords: h, feedLogs: f, vaccinationLogs: v }));
                a.forEach(item => saveToFirebase('animals', item));
                m.forEach(item => saveToFirebase('milkingRecords', item));
                h.forEach(item => saveToFirebase('healthRecords', item));
                f.forEach(item => saveToFirebase('feedLogs', item));
                v.forEach(item => saveToFirebase('vaccinationLogs', item));
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'health-log' && (
            <LivestockView 
              initialTab="health" 
              animals={data.animals || []} 
              milkingRecords={data.milkingRecords || []} 
              healthRecords={data.healthRecords || []} 
              feedLogs={data.feedLogs || []} 
              vaccinationLogs={data.vaccinationLogs || []} 
              employees={data.employees || []} 
              onSave={(a, m, h, f, v) => {
                setData(prev => ({ ...prev, animals: a, milkingRecords: m, healthRecords: h, feedLogs: f, vaccinationLogs: v }));
                a.forEach(item => saveToFirebase('animals', item));
                m.forEach(item => saveToFirebase('milkingRecords', item));
                h.forEach(item => saveToFirebase('healthRecords', item));
                f.forEach(item => saveToFirebase('feedLogs', item));
                v.forEach(item => saveToFirebase('vaccinationLogs', item));
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'qist-alerts' && <QistAlertsView sales={data.sales} currency={data.settings.currency} onBack={() => setActiveSection('reports-hub')} />}
          {activeSection === 'debt-in' && (
            <DebtInView 
              payments={data.payments} 
              currency={data.settings.currency} 
              onSave={(p) => {
                setData(prev => ({ ...prev, payments: [...prev.payments, p] }));
                saveToFirebase('payments', p);
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'factory-debt' && (
            <FactoryDebtView 
              debts={data.supplierDebts} 
              payments={data.supplierPayments} 
              currency={data.settings.currency} 
              onSaveDebt={(d) => {
                setData(prev => ({ ...prev, supplierDebts: [...prev.supplierDebts, d] }));
                saveToFirebase('supplierDebts', d);
              }} 
              onSavePayment={(p) => {
                setData(prev => ({ ...prev, supplierPayments: [...prev.supplierPayments, p] }));
                saveToFirebase('supplierPayments', p);
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'suppliers-mgmt' && (
            <SupplierManagementView 
              suppliers={data.suppliers} 
              debts={data.supplierDebts} 
              payments={data.supplierPayments} 
              currency={data.settings.currency} 
              darkMode={true} 
              onSave={(s) => {
                setData(prev => ({ ...prev, suppliers: s }));
                s.forEach(sup => saveToFirebase('suppliers', sup));
              }} 
              onSaveDebt={(d) => {
                setData(prev => ({ ...prev, supplierDebts: [...prev.supplierDebts, d] }));
                saveToFirebase('supplierDebts', d);
              }} 
              onSavePayment={(p) => {
                setData(prev => ({ ...prev, supplierPayments: [...prev.supplierPayments, p] }));
                saveToFirebase('supplierPayments', p);
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'bulk-import' && <BulkImportView onImport={(products) => setData(prev => ({ ...prev, products: [...prev.products, ...products] }))} onBack={() => setActiveSection('hub')} />}
          {activeSection === 'category-report' && <CategoryReportView sales={data.sales} currency={data.settings.currency} onBack={() => setActiveSection('reports-hub')} />}
          {activeSection === 'expense-report' && <ExpenseReportView expenses={data.expenses} currency={data.settings.currency} onBack={() => setActiveSection('reports-hub')} />}
          {activeSection === 'payments' && <PaymentsView payments={data.payments} currency={data.settings.currency} onBack={() => setActiveSection('hub')} />}
          {activeSection === 'cust-statement' && <CustStatementView sales={data.sales} payments={data.payments} currency={data.settings.currency} onPrint={handlePrint} onBack={() => setActiveSection('hub')} />}
          {activeSection === 'discounts' && <DiscountsView products={data.products} currency={data.settings.currency} onBack={() => setActiveSection('reports-hub')} />}
          {activeSection === 'expired' && <ExpiredView products={data.products} onBack={() => setActiveSection('reports-hub')} />}
          {activeSection === 'qist-rep' && <QistRepView sales={data.sales} payments={data.payments} currency={data.settings.currency} onBack={() => setActiveSection('reports-hub')} />}
          {activeSection === 'cash-rep' && <CashRepView sales={data.sales} expenses={data.expenses} payments={data.payments} supplierPayments={data.supplierPayments} salaryPayments={data.salaryPayments} currency={data.settings.currency} onBack={() => setActiveSection('reports-hub')} />}
          {activeSection === 'jard' && <JardView products={data.products} onPrint={handlePrint} onBack={() => setActiveSection('hub')} />}
          {activeSection === 'supplies' && (
            <SuppliesView 
              supplies={data.supplies} 
              onSave={(s) => {
                setData(prev => ({ ...prev, supplies: [...prev.supplies, s] }));
                saveToFirebase('supplies', s);
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'user-mgmt' && (
            <UserManagementView 
              users={data.users || []} 
              onUpdateUsers={(users) => setData(prev => ({ ...prev, users }))} 
              onBack={() => setActiveSection('hub')} 
              darkMode={true} 
            />
          )}
          {activeSection === 'shop-request' && (
            <ShopRequestView 
              products={data.products} 
              currentUser={currentUser} 
              onRequest={(req) => setData(prev => ({ ...prev, shopRequests: [...(prev.shopRequests || []), req] }))} 
              onBack={() => setActiveSection('hub')} 
              darkMode={true} 
            />
          )}
          {activeSection === 'shop-request-mgmt' && (
            <ShopRequestManagementView 
              shopRequests={data.shopRequests || []}
              onUpdateStatus={(id, status) => setData(prev => ({ ...prev, shopRequests: (prev.shopRequests || []).map(r => r.id === id ? { ...r, status } : r) }))}
              onDelete={(id) => setData(prev => ({ ...prev, shopRequests: (prev.shopRequests || []).filter(r => r.id !== id) }))}
              onBack={() => setActiveSection('hub')}
            />
          )}
          {activeSection === 'settings' && (
            <SettingsView 
              settings={data.settings} 
              onBackup={backupData} 
              onRestore={restoreData} 
              onExportExcel={exportToExcel}
              onSave={(s) => {
                setData(prev => ({ ...prev, settings: s }));
                saveToFirebase('settings', s);
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'notifications' && (
            <NotificationsView 
              alerts={data.alerts || []} 
              onMarkAsRead={(id) => setData(prev => ({ ...prev, alerts: (prev.alerts || []).map(a => a.id === id ? { ...a, isRead: true } : a) }))}
              onClearAll={() => setData(prev => ({ ...prev, alerts: [] }))}
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'cat-mgmt' && (
            <CategoryMgmtView 
              categories={data.categories || []} 
              onSave={(c) => {
                setData(prev => ({ ...prev, categories: c }));
                c.forEach(cat => saveToFirebase('categories', cat));
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'advanced-dashboard' && <AdvancedDashboardView data={data} currency={data.settings.currency} onBack={() => setActiveSection('reports-hub')} />}
          {activeSection === 'shift-mgmt' && (
            <ShiftManagementView 
              data={data} 
              onSave={(s) => {
                setData(prev => ({ ...prev, shifts: [...(prev.shifts || []), s] }));
                saveToFirebase('shifts', s);
              }} 
              onUpdate={(s) => {
                setData(prev => ({ ...prev, shifts: (prev.shifts || []).map(sh => sh.id === s.id ? s : sh) }));
                saveToFirebase('shifts', s);
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'pos' && (
            <POSView 
              products={data.products} 
              customers={data.customers || []} 
              sales={data.sales}
              currency={data.settings.currency} 
              invoiceTemplate={getActiveTemplate()}
              customFields={data.settings.customFields}
              onSaveSale={(newSales, updatedProducts, updatedCustomers) => {
                setData(prev => ({
                  ...prev,
                  sales: [...prev.sales, ...newSales],
                  products: updatedProducts,
                  customers: updatedCustomers
                }));
                // Sync to Firebase
                newSales.forEach(s => saveToFirebase('sales', s));
                updatedProducts.forEach(p => saveToFirebase('products', p));
                updatedCustomers.forEach(c => saveToFirebase('customers', c));
                setActiveSection('hub');
              }}
              onNavigate={(s) => setActiveSection(s)}
              onBack={() => setActiveSection('hub')} 
              onOpenReturns={() => setActiveSection('returns')}
            />
          )}
          {activeSection === 'returns' && (
            <ReturnsView 
              returns={data.returns || []} 
              sales={data.sales} 
              products={data.products} 
              customers={data.customers || []} 
              currency={data.settings.currency} 
              onSave={(r, updatedProducts, updatedSales, updatedCustomers) => {
                setData(prev => ({ 
                  ...prev, 
                  returns: [...(prev.returns || []), r], 
                  products: updatedProducts, 
                  sales: updatedSales, 
                  customers: updatedCustomers 
                }));
                saveToFirebase('returns', r);
                updatedProducts.forEach(p => saveToFirebase('products', p));
                updatedSales.forEach(s => saveToFirebase('sales', s));
                updatedCustomers.forEach(c => saveToFirebase('customers', c));
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'hr-mgmt' && (
            <EmployeeManagementView 
              employees={data.employees || []} 
              salaryPayments={data.salaryPayments || []} 
              currency={data.settings.currency} 
              onSaveEmployee={(e) => {
                setData(prev => ({ ...prev, employees: [...(prev.employees || []), e] }));
                saveToFirebase('employees', e);
              }} 
              onUpdateEmployee={(e) => {
                setData(prev => ({ ...prev, employees: (prev.employees || []).map(emp => emp.id === e.id ? e : emp) }));
                saveToFirebase('employees', e);
              }} 
              onSaveSalary={(s) => {
                setData(prev => ({ ...prev, salaryPayments: [...(prev.salaryPayments || []), s] }));
                saveToFirebase('salaryPayments', s);
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'purchase-orders' && (
            <PurchaseOrderView 
              products={data.products} 
              purchaseOrders={data.purchaseOrders || []} 
              onSaveOrder={(o) => {
                setData(prev => ({ ...prev, purchaseOrders: [...(prev.purchaseOrders || []), o] }));
                saveToFirebase('purchaseOrders', o);
              }} 
              onUpdateOrder={(o) => {
                setData(prev => ({ ...prev, purchaseOrders: (prev.purchaseOrders || []).map(po => po.id === o.id ? o : po) }));
                saveToFirebase('purchaseOrders', o);
              }} 
              onReceiveOrder={(o) => {
                setData(prev => ({ ...prev, purchaseOrders: (prev.purchaseOrders || []).map(po => po.id === o.id ? o : po) }));
                saveToFirebase('purchaseOrders', o);
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'customer-loyalty' && (
            <CustomerLoyaltyView 
              customers={data.customers || []} 
              sales={data.sales} 
              onSave={(c) => {
                setData(prev => ({ ...prev, customers: [...(prev.customers || []), c] }));
                saveToFirebase('customers', c);
              }} 
              onUpdate={(c) => {
                setData(prev => ({ ...prev, customers: (prev.customers || []).map(cust => cust.id === c.id ? c : cust) }));
                saveToFirebase('customers', c);
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'customer-mgmt' && (
            <CustomerManagementView 
              customers={data.customers || []} 
              sales={data.sales} 
              payments={data.payments} 
              currency={data.settings.currency} 
              onSave={(c) => {
                setData(prev => ({ ...prev, customers: [...(prev.customers || []), c] }));
                saveToFirebase('customers', c);
              }} 
              onUpdate={(c) => {
                setData(prev => ({ ...prev, customers: c }));
                c.forEach(cust => saveToFirebase('customers', cust));
              }} 
              onSavePayment={(p, updatedCustomers) => {
                setData(prev => ({ ...prev, payments: [...prev.payments, p], customers: updatedCustomers }));
                saveToFirebase('payments', p);
                updatedCustomers.forEach(cust => saveToFirebase('customers', cust));
              }} 
              onViewDetails={(c) => { setSelectedCustomer(c); setActiveSection('customer-detail'); }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'customer-detail' && selectedCustomer && <CustomerDetailView customer={selectedCustomer} sales={data.sales} payments={data.payments} currency={data.settings.currency} onBack={() => setActiveSection('customer-mgmt')} />}
          {activeSection === 'tasks' && (
            <TasksView 
              tasks={data.tasks || []} 
              employees={data.employees || []} 
              onSave={(t) => {
                setData(prev => ({ ...prev, tasks: [...(prev.tasks || []), t] }));
                saveToFirebase('tasks', t);
              }} 
              onUpdate={(t) => {
                setData(prev => ({ ...prev, tasks: (prev.tasks || []).map(task => task.id === t.id ? t : task) }));
                saveToFirebase('tasks', t);
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'assets' && (
            <AssetsView 
              assets={data.assets || []} 
              currency={data.settings.currency} 
              onSave={(a) => {
                setData(prev => ({ ...prev, assets: [...(prev.assets || []), a] }));
                saveToFirebase('assets', a);
              }} 
              onUpdate={(a) => {
                setData(prev => ({ ...prev, assets: (prev.assets || []).map(asset => asset.id === a.id ? a : asset) }));
                saveToFirebase('assets', a);
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'recipes' && (
            <RecipesView 
              recipes={data.recipes || []} 
              products={data.products} 
              onSave={(r) => {
                setData(prev => ({ ...prev, recipes: [...(prev.recipes || []), r] }));
                saveToFirebase('recipes', r);
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'production' && (
            <ProductionView 
              orders={data.productionOrders || []} 
              recipes={data.recipes || []} 
              products={data.products} 
              currency={data.settings.currency} 
              onSave={(o) => {
                setData(prev => ({ ...prev, productionOrders: [...(prev.productionOrders || []), o] }));
                saveToFirebase('productionOrders', o);
              }} 
              onUpdate={(o, updatedProducts) => {
                setData(prev => ({ ...prev, productionOrders: (prev.productionOrders || []).map(po => po.id === o.id ? o : po), products: updatedProducts || prev.products }));
                saveToFirebase('productionOrders', o);
                updatedProducts?.forEach(p => saveToFirebase('products', p));
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'vehicles' && (
            <VehiclesView 
              vehicles={data.vehicles || []} 
              employees={data.employees || []} 
              onSave={(v) => {
                setData(prev => ({ ...prev, vehicles: [...(prev.vehicles || []), v] }));
                saveToFirebase('vehicles', v);
              }} 
              onUpdate={(v) => {
                setData(prev => ({ ...prev, vehicles: (prev.vehicles || []).map(veh => veh.id === v.id ? v : veh) }));
                saveToFirebase('vehicles', v);
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'drivers' && (
            <DriversView 
              drivers={data.drivers || []} 
              vehicles={data.vehicles || []} 
              onSave={(d) => {
                setData(prev => ({ ...prev, drivers: [...(prev.drivers || []), d] }));
                saveToFirebase('drivers', d);
              }} 
              onUpdate={(d) => {
                setData(prev => ({ ...prev, drivers: (prev.drivers || []).map(dr => dr.id === d.id ? d : dr) }));
                saveToFirebase('drivers', d);
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'emp-perf-report' && <EmployeePerformanceReportView employees={data.employees || []} salaryPayments={data.salaryPayments || []} shifts={data.shifts || []} currency={data.settings.currency} onBack={() => setActiveSection('reports-hub')} />}
          {activeSection === 'driver-report' && <DriverSalesReportView sales={data.sales} currency={data.settings.currency} onPrint={handlePrint} onBack={() => setActiveSection('reports-hub')} />}
          {activeSection === 'campaigns' && (
            <CampaignsView 
              campaigns={data.campaigns || []} 
              currency={data.settings.currency} 
              onSave={(c) => {
                setData(prev => ({ ...prev, campaigns: [...(prev.campaigns || []), c] }));
                saveToFirebase('campaigns', c);
              }} 
              onUpdate={(c) => {
                setData(prev => ({ ...prev, campaigns: (prev.campaigns || []).map(camp => camp.id === c.id ? c : camp) }));
                saveToFirebase('campaigns', c);
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'tickets' && (
            <SupportTicketsView 
              tickets={data.tickets || []} 
              customers={data.customers || []} 
              onSave={(t) => {
                setData(prev => ({ ...prev, tickets: [...(prev.tickets || []), t] }));
                saveToFirebase('tickets', t);
              }} 
              onUpdate={(t) => {
                setData(prev => ({ ...prev, tickets: (prev.tickets || []).map(tick => tick.id === t.id ? t : tick) }));
                saveToFirebase('tickets', t);
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'projects' && (
            <ProjectsView 
              projects={data.projects || []} 
              currency={data.settings.currency} 
              onSave={(p) => {
                setData(prev => ({ ...prev, projects: [...(prev.projects || []), p] }));
                saveToFirebase('projects', p);
              }} 
              onUpdate={(p) => {
                setData(prev => ({ ...prev, projects: (prev.projects || []).map(proj => proj.id === p.id ? p : proj) }));
                saveToFirebase('projects', p);
              }} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'invoice-template' && (
            <InvoiceTemplateView 
              settings={data.settings} 
              onSaveTemplates={handleSaveTemplates}
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'system-customizer' && (
            <SystemCustomizerView 
              settings={data.settings} 
              onSaveMenuSettings={handleSaveMenuSettings}
              onSaveCustomFields={handleSaveCustomFields}
              onSaveCustomSections={handleSaveCustomSections}
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'milk-collection' && (
            <MilkCollectionView 
              data={data} 
              onUpdateData={setData} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {activeSection === 'audit-logs' && (
            <AuditLogView 
              logs={data.auditLogs || []} 
              onBack={() => setActiveSection('hub')} 
            />
          )}
          {data.settings.customSections?.map((section: CustomSection) => (
            activeSection === section.id && (
              <CustomView 
                key={section.id}
                section={section}
                data={data}
                onBack={() => setActiveSection('hub')}
                setActiveSection={setActiveSection}
              />
            )
          ))}
            </AnimatePresence>
          </div>
        </main>

      {/* Footer Navigation */}
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 border-t h-24 backdrop-blur-2xl z-50 flex justify-around items-center px-6 lg:hidden",
        "bg-black/80 border-white/5"
      )}>
        <FooterNavButton active={activeSection === 'hub'} icon={<LayoutGrid size={22} />} label="مێنو" onClick={() => setActiveSection('hub')} />
        <FooterNavButton active={activeSection === 'accountant-view'} icon={<Receipt size={22} />} label="محاسب" onClick={() => setActiveSection('accountant-view')} />
        <FooterNavButton active={activeSection === 'product-list'} icon={<List size={22} />} label="کۆگا" onClick={() => setActiveSection('product-list')} />
        <FooterNavButton active={activeSection === 'reports-hub'} icon={<FileText size={22} />} label="ڕاپۆرت" onClick={() => setActiveSection('reports-hub')} />
      </nav>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmState.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => onConfirmResult(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn(
                "relative w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl border",
                "bg-slate-900 border-white/10"
              )}
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <AlertCircle size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black tracking-tight">دڵنیایت؟</h3>
                  <p className="text-sm theme-muted font-bold leading-relaxed">{confirmState.message}</p>
                </div>
                <div className="flex gap-3 w-full pt-4">
                  <button 
                    onClick={() => onConfirmResult(false)}
                    className="flex-1 p-4 rounded-2xl theme-hover border theme-border font-bold text-sm transition-all active:scale-95"
                  >
                    نەخێر
                  </button>
                  <button 
                    onClick={() => onConfirmResult(true)}
                    className="flex-1 p-4 rounded-2xl bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                  >
                    بەڵێ
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  </div>
  );
}


export default App;

const CustomView: React.FC<{ section: CustomSection, data: ERPData, onBack: () => void, setActiveSection: (s: string) => void }> = ({ section, data, onBack, setActiveSection }) => {
  const handleAction = (action: CustomAction) => {
    if (action.type === 'save') {
      toast.success('زانیارییەکان بە سەرکەوتوویی پاشەکەوت کران');
    } else if (action.type === 'print') {
      window.print();
    } else if (action.type === 'delete') {
      toast.error('ئەم زانیارییە سڕایەوە');
    } else if (action.type === 'navigate' && action.target) {
      setActiveSection(action.target);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-black tracking-tight">{section.label}</h2>
            {section.description && <p className="text-[10px] font-bold theme-muted uppercase tracking-widest mt-1">{section.description}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
              <Database size={20} className="text-emerald-500" />
              زانیارییەکان
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.map(field => (
                <div key={field.id} className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{field.label}</label>
                  {field.type === 'select' ? (
                    <select className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none text-sm font-bold">
                      {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input 
                      type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none text-sm font-bold"
                      placeholder={`${field.label}...`}
                    />
                  )}
                </div>
              ))}
              {section.fields.length === 0 && (
                <div className="col-span-2 text-center py-12 text-slate-400 font-bold">هیچ خانەیەکی زیادە پێناسە نەکراوە</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
              <Command size={20} className="text-blue-500" />
              کردارەکان
            </h3>
            <div className="space-y-3">
              {section.actions.map(action => (
                <button 
                  key={action.id}
                  onClick={() => handleAction(action)}
                  className={cn(
                    "w-full p-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-95 shadow-sm",
                    action.type === 'save' ? "bg-emerald-500 text-white shadow-emerald-500/20" :
                    action.type === 'delete' ? "bg-red-500 text-white shadow-red-500/20" :
                    "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                  )}
                >
                  {action.label}
                </button>
              ))}
              {section.actions.length === 0 && (
                <div className="text-center py-8 text-slate-400 font-bold">هیچ کردارێک پێناسە نەکراوە</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FactoryDebtView({ debts, payments, currency, onSaveDebt, onSavePayment, onBack }: { debts: SupplierDebt[], payments: any[], currency: string, onSaveDebt: (d: SupplierDebt) => void, onSavePayment: (p: any) => void, onBack: () => void }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mode, setMode] = useState<'debt' | 'payment'>('debt');

  const handleSubmit = () => {
    if (!name || !amount) return toast.error("تکایە زانیارییەکان پڕ بکەرەوە");
    const val = parseFloat(amount);
    const formattedDate = new Date(date).toLocaleDateString('ku-IQ');
    if (mode === 'debt') {
      onSaveDebt({
        id: Date.now(),
        supplierName: name,
        amount: val,
        date: formattedDate
      });
    } else {
      onSavePayment({
        id: Date.now(),
        supplierName: name,
        amount: val,
        date: formattedDate
      });
    }
    setName('');
    setAmount('');
    toast.success("تۆمارکرا!");
  };

  const suppliers = Array.from(new Set([...(debts?.map(d => d.supplierName) || []), ...(payments?.map(p => p.supplierName) || [])]));
  const recentTransactions = [...(debts || []), ...(payments || [])].sort((a, b) => b.id - a.id).slice(0, 5);

  const totalDebt = (debts || []).reduce((sum, d) => sum + d.amount, 0);
  const totalPaid = (payments || []).reduce((sum, p) => sum + p.amount, 0);
  const totalOutstanding = totalDebt - totalPaid;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 pb-12">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-slate-600 dark:text-slate-400">قەرزی کارگە</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider">کۆی قەرزی ماوە</p>
          <h3 className="text-lg font-black text-red-500">{totalOutstanding.toLocaleString()} <span className="text-[10px] font-normal">{currency}</span></h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider">کۆی پارەی دراو</p>
          <h3 className="text-lg font-black text-emerald-500">{totalPaid.toLocaleString()} <span className="text-[10px] font-normal">{currency}</span></h3>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4 mb-4">
        <div className="flex gap-2 p-1 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <button 
            onClick={() => setMode('debt')}
            className={cn("flex-1 py-2 rounded-lg text-xs font-bold transition-all", mode === 'debt' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-400")}
          >زیادکردنی قەرز</button>
          <button 
            onClick={() => setMode('payment')}
            className={cn("flex-1 py-2 rounded-lg text-xs font-bold transition-all", mode === 'payment' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-400")}
          >دانەوەی قەرز</button>
        </div>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ناوی کارگە / دابەشکەر" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="بڕی پارە" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
        <button onClick={handleSubmit} className={cn("w-full text-white p-4 rounded-2xl font-bold transition-colors", mode === 'debt' ? "bg-slate-700 dark:bg-slate-800" : "bg-emerald-600 dark:bg-emerald-700")}>
          {mode === 'debt' ? 'زیادکردنی قەرز' : 'دانەوەی قەرز'}
        </button>
      </div>

      {recentTransactions.length > 0 && (
        <div className="space-y-2 mb-6">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2">دوایین مامەڵەکان</h3>
          {recentTransactions.map(t => (
            <div key={t.id} className="bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div className="text-right">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block">{t.supplierName}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">{t.date}</span>
              </div>
              <span className={cn("text-sm font-black", 'supplierName' in t && 'amount' in t ? (debts.some(d => d.id === t.id) ? "text-red-500" : "text-emerald-500") : "")}>
                {t.amount.toLocaleString()} {currency}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2">کۆی قەرزەکان بەپێی کارگە</h3>
        {suppliers?.map(s => {
          const sDebts = debts?.filter(d => d.supplierName === s) || [];
          const sPayments = payments?.filter(p => p.supplierName === s) || [];
          const totalD = sDebts.reduce((a, b) => a + b.amount, 0);
          const totalP = sPayments.reduce((a, b) => a + b.amount, 0);
          const balance = totalD - totalP;

          return (
            <div key={s} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div className="text-right">
                <b className="text-slate-700 dark:text-slate-200 block">{s}</b>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">کڕین: {totalD.toLocaleString()} | دراوە: {totalP.toLocaleString()}</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">ماوە</p>
                <b className={cn("text-lg", balance > 0 ? "text-red-500" : "text-emerald-500")}>{balance.toLocaleString()} {currency}</b>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function PaymentsView({ payments, currency, onBack }: { payments: Payment[], currency: string, onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-blue-400">وەسڵی کردراو (پارە وەرگیراوەکان)</h2>
      </div>
      <div className="space-y-2">
        {payments?.map(p => (
          <div key={p.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-blue-50 dark:border-blue-900/30 flex justify-between items-center">
            <div>
              <b className="text-slate-700 dark:text-slate-200 block">{p.customerName}</b>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">{p.date}</span>
            </div>
            <b className="text-blue-600 dark:text-blue-400">{p.amount.toLocaleString()} {currency}</b>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function CustStatementView({ sales, payments, currency, onPrint, onBack }: { sales: Sale[], payments: Payment[], currency: string, onPrint: (title: string, content: string) => void, onBack: () => void }) {
  const [search, setSearch] = useState('');
  const customerSales = (sales || []).filter(s => s.customerName === search);
  const customerPayments = (payments || []).filter(p => p.customerName === search);
  
  const totalSales = customerSales.reduce((a, b) => a + b.total, 0);
  const totalPaid = customerPayments.reduce((a, b) => a + b.amount, 0);
  
  // Calculate cash payments from sales (including initial payments for qist)
  const cashPaidInSales = customerSales.reduce((a, b) => a + (b.paidAmount || (b.paymentMethod === 'cash' ? b.total : 0)), 0);

  const balance = totalSales - cashPaidInSales - totalPaid;

  const printStatement = () => {
    const content = `
      <div style="margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px;">
        <p><strong>ناوی کڕیار:</strong> ${search}</p>
        <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 10px; margin-top: 10px;">
          <p><strong>کۆی کڕین:</strong> ${totalSales.toLocaleString()} ${currency}</p>
          <p><strong>کۆی دراوە:</strong> ${(cashPaidInSales + totalPaid).toLocaleString()} ${currency}</p>
          <p style="color: #ef4444; font-size: 18px;"><strong>ماوەی قەرز:</strong> ${balance.toLocaleString()} ${currency}</p>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>بەروار</th>
            <th>کاڵا / وەسڵ</th>
            <th style="text-align: center;">بڕ</th>
            <th style="text-align: left;">جۆر</th>
          </tr>
        </thead>
        <tbody>
          ${[...customerSales, ...customerPayments]
            .sort((a, b) => b.id - a.id)
            .map(item => `
              <tr>
                <td>${item.date}</td>
                <td>${'itemName' in item ? item.itemName : 'وەسڵی وەرگرتن'}</td>
                <td style="text-align: center;">${('total' in item ? item.total : item.amount).toLocaleString()}</td>
                <td style="text-align: left; color: ${'total' in item ? '#ef4444' : '#10b981'}; font-weight: bold;">
                  ${'total' in item ? 'کڕین' : 'پارەدان'}
                </td>
              </tr>
            `).join('')}
        </tbody>
      </table>
    `;
    onPrint(`کەشفی حیسابی کڕیار - ${search}`, content);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-slate-500 dark:text-slate-400">کەشفی حیسابی کڕیار</h2>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="ناوی تەواوی کڕیار بنووسە..." className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
        {search && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-2">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400"><span>کۆی کڕین:</span><b>{totalSales.toLocaleString()}</b></div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400"><span>نەختینە دراوە:</span><b>{cashPaidInSales.toLocaleString()}</b></div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400"><span>وەسڵی پارەدان:</span><b>{totalPaid.toLocaleString()}</b></div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-200 dark:border-slate-700"><span>ماوەی قەرز:</span><b className="text-red-600 dark:text-red-400">{balance.toLocaleString()} {currency}</b></div>
            </div>

            <button onClick={printStatement} className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 p-3 rounded-xl font-bold">
              <Printer size={18} /> پرنتکردنی کەشف
            </button>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400">جوڵەی حیساب:</h3>
              {[...customerSales, ...customerPayments]
                .sort((a, b) => b.id - a.id)
                .map((item, idx) => (
                  <div key={idx} className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="block font-bold">{'itemName' in item ? item.itemName : 'وەسڵی وەرگرتن'}</span>
                      <span className="text-[10px] text-slate-400">{item.date}</span>
                    </div>
                    <b className={'total' in item ? 'text-red-500' : 'text-green-500'}>
                      {'total' in item ? `-${item.total.toLocaleString()}` : `+${item.amount.toLocaleString()}`}
                    </b>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function DiscountsView({ products, currency, onBack }: { products: Product[], currency: string, onBack: () => void }) {
  const discounted = products.filter(p => p.discount && p.discount > 0);
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-rose-500 dark:text-rose-400">داشکانی کاڵاکان</h2>
      </div>
      <div className="space-y-2">
        {!discounted || discounted.length === 0 ? (
          <div className="text-center p-12 text-slate-400 dark:text-slate-600">هیچ داشکانێک نییە</div>
        ) : (
          discounted?.map(p => (
            <div key={p.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm flex justify-between items-center border border-slate-50 dark:border-slate-800">
              <b className="text-slate-700 dark:text-slate-200">{p.name}</b>
              <span className="text-rose-500 dark:text-rose-400 font-bold">-{p.discount?.toLocaleString()} {currency}</span>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function ExpiredView({ products, onBack }: { products: Product[], onBack: () => void }) {
  const today = new Date();
  const expired = products.filter(p => p.expiryDate && new Date(p.expiryDate) < today);
  
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-red-600 dark:text-red-400">کاڵا بەسەرچووەکان</h2>
      </div>
      <div className="space-y-2">
        {!expired || expired.length === 0 ? (
          <div className="text-center p-12 text-emerald-500 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl">هیچ کاڵایەکی بەسەرچوو نییە ✅</div>
        ) : (
          expired?.map(p => (
            <div key={p.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-l-4 border-red-600 shadow-sm flex justify-between items-center">
              <div>
                <b className="text-slate-700 dark:text-slate-200 block">{p.name}</b>
                <span className="text-[10px] text-red-500 dark:text-red-400 font-bold">بەسەرچووە لە: {p.expiryDate}</span>
              </div>
              <div className="text-xs font-bold text-slate-400 dark:text-slate-500">بڕ: {p.stock}</div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function QistRepView({ sales, payments, currency, onBack }: { sales: Sale[], payments: Payment[], currency: string, onBack: () => void }) {
  const qistSales = sales.filter(s => s.paymentMethod === 'qist');
  const totalQist = qistSales.reduce((a, b) => a + b.total, 0);
  const downPayments = qistSales.reduce((a, b) => a + (b.paidAmount || 0), 0);
  const totalPaid = payments.reduce((a, b) => a + b.amount, 0) + downPayments;
  const remaining = totalQist - totalPaid;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-indigo-400">ڕاپۆرتی قیستەکان</h2>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>کۆی قیستەکان:</span><b>{totalQist.toLocaleString()}</b></div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>کۆی وەرگیراو:</span><b>{totalPaid.toLocaleString()}</b></div>
        <div className="flex justify-between text-xl font-black text-indigo-600 dark:text-indigo-400 pt-4 border-t border-slate-100 dark:border-slate-800"><span>ماوەی گشتی:</span><b>{remaining.toLocaleString()} {currency}</b></div>
      </div>
    </motion.div>
  );
}

function CashRepView({ sales, expenses, payments, supplierPayments, salaryPayments, currency, onBack }: { sales: Sale[], expenses: Expense[], payments: Payment[], supplierPayments: any[], salaryPayments: any[], currency: string, onBack: () => void }) {
  const cashFromSales = sales.reduce((a, b) => a + (b.paidAmount || (b.paymentMethod === 'cash' ? b.total : 0)), 0);
  const totalPayments = payments.reduce((a, b) => a + b.amount, 0);
  const totalExp = expenses.reduce((a, b) => a + b.amount, 0);
  const totalSupplierPayments = supplierPayments?.reduce((a, b) => a + b.amount, 0) || 0;
  const totalSalaryPayments = salaryPayments?.reduce((a, b) => a + b.amount, 0) || 0;
  const netCash = (cashFromSales + totalPayments) - totalExp - totalSupplierPayments - totalSalaryPayments;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-teal-500 dark:text-teal-400">ڕاپۆرتی پارەی نەختینە</h2>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>نەختینەی فرۆش:</span><b>{cashFromSales.toLocaleString()}</b></div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>وەرگرتنی قەرز:</span><b>{totalPayments.toLocaleString()}</b></div>
        <div className="flex justify-between text-red-500 dark:text-red-400"><span>خەرجییەکان:</span><b>-{totalExp.toLocaleString()}</b></div>
        <div className="flex justify-between text-red-500 dark:text-red-400"><span>دانەوەی قەرزی کارگە:</span><b>-{totalSupplierPayments.toLocaleString()}</b></div>
        <div className="flex justify-between text-red-500 dark:text-red-400"><span>مووچەی دراو:</span><b>-{totalSalaryPayments.toLocaleString()}</b></div>
        <div className="flex justify-between text-xl font-black text-teal-600 dark:text-teal-400 pt-4 border-t border-slate-100 dark:border-slate-800"><span>پارەی بەردەست:</span><b>{netCash.toLocaleString()} {currency}</b></div>
      </div>
    </motion.div>
  );
}

function JardView({ products, onPrint, onBack }: { products: Product[], onPrint: (title: string, content: string) => void, onBack: () => void }) {
  const [search, setSearch] = useState('');
  
  const filtered = products?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.barcode.includes(search)
  ) || [];

  const handlePrintJard = () => {
    const content = `
      <div style="margin-bottom: 20px;">
        <p><strong>جۆری لیست:</strong> لیستی جەرد کردنی کۆگا</p>
        <p><strong>ڕێکەوت:</strong> ${new Date().toLocaleDateString('ku-IQ')}</p>
        <p><strong>کۆی کاڵاکان:</strong> ${filtered.length}</p>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f8fafc;">
            <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: right;">ناوی کاڵا</th>
            <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: center;">بڕی سیستەم</th>
            <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: center;">بڕی فیزیایی</th>
            <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: center;">تێبینی</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(p => `
            <tr>
              <td style="border: 1px solid #e2e8f0; padding: 12px;">${p.name}</td>
              <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: center; font-weight: bold;">${p.stock}</td>
              <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: center; width: 100px;">[ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</td>
              <td style="border: 1px solid #e2e8f0; padding: 12px; width: 150px;"></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="margin-top: 40px; display: flex; justify-content: space-between;">
        <p>واژووی بەرپرسی کۆگا: _________________</p>
        <p>واژووی لیژنەی جەرد: _________________</p>
      </div>
    `;
    onPrint('لیستی جەرد کردنی کۆگا', content);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-slate-700 dark:text-slate-300">جەرد کردنی کۆگا</h2>
        </div>
        <button 
          onClick={handlePrintJard}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-transform"
        >
          <Printer size={18} />
          پرنتکردنی لیستی جەرد
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="گەڕان بەپێی ناو یان بارکۆد..." 
            className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-400">هیچ کاڵایەک نەدۆزرایەوە</div>
          ) : (
            filtered.map(p => (
              <div key={p.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                <div className="space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-200 block">{p.name}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{p.barcode}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">بڕی سیستەم</span>
                  <b className="text-blue-600 dark:text-blue-400 text-lg">{p.stock}</b>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SuppliesView({ supplies, onSave, onBack }: { supplies: Supply[], onSave: (s: Supply) => void, onBack: () => void }) {
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');

  const handleSubmit = () => {
    if (!name || !qty) return toast.error("تکایە زانیارییەکان پڕ بکەرەوە");
    onSave({
      id: Date.now(),
      name,
      quantity: parseFloat(qty),
      date: new Date().toLocaleDateString(),
      source: 'market',
      destination: 'shop'
    });
    setName('');
    setQty('');
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-orange-400">پێداویستییەکانی دوکان</h2>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4 mb-4">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ناوی پێداویستی" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
        <input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="بڕ" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
        <button onClick={handleSubmit} className="w-full bg-orange-500 text-white p-4 rounded-2xl font-bold active:scale-95 transition-transform">زیادکردن</button>
      </div>
      <div className="space-y-2">
        {supplies?.map(s => (
          <div key={s.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{s.name}</span>
            <b className="text-slate-600 dark:text-slate-400">{s.quantity}</b>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function SettingsView({ settings, onBackup, onRestore, onExportExcel, onSave, onBack }: { settings: Settings, onBackup: () => void, onRestore: (e: React.ChangeEvent<HTMLInputElement>) => void, onExportExcel: () => void, onSave: (s: Settings) => void, onBack: () => void }) {
  const [name, setName] = useState(settings.storeName);
  const [curr, setCurr] = useState(settings.currency);
  const [theme, setTheme] = useState(settings.theme);
  const [lang, setLang] = useState(settings.language || 'ku');

  const handleSubmit = () => {
    onSave({ ...settings, storeName: name, currency: curr, theme: theme, language: lang as any });
    toast.success("ڕێکخستنەکان پاشەکەوت کران");
    onBack();
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 pb-12">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-slate-800 dark:text-slate-200">ڕێکخستنەکان</h2>
      </div>
      
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Command size={18} className="text-blue-500" /> زانیارییە گشتییەکان
        </h3>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">ناوی دوکان</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">دراو</label>
          <select value={curr} onChange={e => setCurr(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
            <option value="د.ع">دیناری عێراقی (د.ع)</option>
            <option value="IQD">دیناری عێراقی (IQD)</option>
            <option value="$">دۆلار ($)</option>
            <option value="تۆمان">تۆمان</option>
            <option value="لیرە">لیرە</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">زمان (Language)</label>
          <select value={lang} onChange={e => setLang(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
            <option value="ku">کوردی (Kurdish)</option>
            <option value="ar">العربية (Arabic)</option>
            <option value="en">English</option>
          </select>
        </div>
        <button onClick={handleSubmit} className="w-full bg-slate-800 dark:bg-slate-700 text-white p-4 rounded-2xl font-bold active:scale-95 transition-transform">پاشەکەوتکردن</button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Database size={18} className="text-emerald-500" /> بەڕێوەبردنی داتا و پاشەکەوت
        </h3>
        <p className="text-xs text-slate-500">لێرە دەتوانیت داتاکانی سیستەمەکە پاشەکەوت بکەیت یان هاوردەیان بکەیتەوە.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button onClick={onExportExcel} className="flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl font-bold text-sm">
            <Download size={18} /> Excel پاشەکەوت
          </button>
          <button onClick={onBackup} className="flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-4 rounded-2xl font-bold text-sm">
            <Database size={18} /> JSON پاشەکەوت
          </button>
          <label className="flex items-center justify-center gap-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 p-4 rounded-2xl font-bold text-sm cursor-pointer">
            <Upload size={18} /> JSON هاوردەکردن
            <input type="file" accept=".json" onChange={onRestore} className="hidden" />
          </label>
        </div>
      </div>
    </motion.div>
  );
}

function CategoryMgmtView({ categories, onSave, onBack }: { categories: string[], onSave: (c: string[]) => void, onBack: () => void }) {
  const [newCat, setNewCat] = useState('');

  const addCat = () => {
    if (!newCat) return;
    if (categories.includes(newCat)) return toast.error("ئەم بەشە پێشتر هەیە");
    onSave([...categories, newCat]);
    setNewCat('');
  };

  const removeCat = async (cat: string) => {
    if (await customConfirm(`ئایا دڵنیایت لە سڕینەوەی بەشی "${cat}"؟`)) {
      onSave(categories.filter(c => c !== cat));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-purple-600 dark:text-purple-400">بەڕێوەبردنی بەشەکان</h2>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex gap-2">
          <input type="text" value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="ناوی بەشی نوێ..." className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          <button onClick={addCat} className="bg-purple-600 text-white p-3 rounded-xl font-bold"><Plus /></button>
        </div>
        <div className="space-y-2">
          {categories.map(c => (
            <div key={c} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span className="font-bold text-slate-700 dark:text-slate-200">{c}</span>
              <button onClick={() => removeCat(c)} className="text-red-500 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function EmployeeManagementView({ employees, salaryPayments, currency, onSaveEmployee, onUpdateEmployee, onSaveSalary, onBack }: { employees: Employee[], salaryPayments: SalaryPayment[], currency: string, onSaveEmployee: (e: Employee) => void, onUpdateEmployee: (e: Employee) => void, onSaveSalary: (s: SalaryPayment) => void, onBack: () => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'manager' | 'cashier' | 'accountant'>('cashier');
  const [phone, setPhone] = useState('');
  const [salary, setSalary] = useState('');
  const [joinDate, setJoinDate] = useState(new Date().toISOString().split('T')[0]);

  const [payEmployeeId, setPayEmployeeId] = useState<number | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMonth, setPayMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [payNotes, setPayNotes] = useState('');

  const handleAddEmployee = () => {
    if (!name || !salary) return toast.error("تکایە ناو و مووچە پڕبکەرەوە");
    onSaveEmployee({
      id: Date.now(),
      name,
      role,
      phone,
      salary: parseFloat(salary),
      joinDate,
      status: 'active'
    });
    setShowAdd(false);
    setName('');
    setPhone('');
    setSalary('');
  };

  const handlePaySalary = () => {
    if (!payEmployeeId || !payAmount || !payMonth) return toast.error("تکایە زانیارییەکان پڕبکەرەوە");
    const employee = employees.find(e => e.id === payEmployeeId);
    onSaveSalary({
      id: Date.now(),
      employeeId: payEmployeeId,
      employeeName: employee?.name || 'نادیار',
      amount: parseFloat(payAmount),
      date: new Date().toLocaleDateString('ku-IQ'),
      month: payMonth,
      notes: payNotes
    });
    setPayEmployeeId(null);
    setPayAmount('');
    setPayNotes('');
    toast.success("مووچە بەسەرکەوتوویی درا");
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-teal-600 dark:text-teal-400">کارمەندان و مووچە</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-teal-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Plus size={18} /> کارمەندی نوێ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">زیادکردنی کارمەند</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ناوی کارمەند" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <select value={role} onChange={e => setRole(e.target.value as any)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
              <option value="cashier">کاشێر</option>
              <option value="manager">بەڕێوەبەر</option>
              <option value="accountant">ژمێریار</option>
              <option value="admin">ئەدمین</option>
            </select>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="ژمارەی مۆبایل" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="number" value={salary} onChange={e => setSalary(e.target.value)} placeholder="مووچەی مانگانە" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="date" value={joinDate} onChange={e => setJoinDate(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          </div>
          <button onClick={handleAddEmployee} className="w-full bg-teal-600 text-white p-3 rounded-xl font-bold">پاشەکەوتکردن</button>
        </div>
      )}

      {payEmployeeId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">پێدانی مووچە</h3>
              <button onClick={() => setPayEmployeeId(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X size={20} /></button>
            </div>
            <p className="text-sm text-slate-500">کارمەند: {employees.find(e => e.id === payEmployeeId)?.name}</p>
            <input type="month" value={payMonth} onChange={e => setPayMonth(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)} placeholder="بڕی پارە" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="text" value={payNotes} onChange={e => setPayNotes(e.target.value)} placeholder="تێبینی (ئارەزوومەندانە)" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <button onClick={handlePaySalary} className="w-full bg-teal-600 text-white p-3 rounded-xl font-bold">پێدانی مووچە</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {employees.map(emp => (
          <div key={emp.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{emp.name}</h3>
                <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">{emp.role}</span>
              </div>
              <p className="text-sm text-slate-500 mb-1">مۆبایل: {emp.phone || 'نەنووسراوە'}</p>
              <p className="text-sm text-slate-500 mb-4">مووچە: <span className="font-bold text-slate-700 dark:text-slate-300">{emp.salary.toLocaleString()} {currency}</span></p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setPayEmployeeId(emp.id); setPayAmount(emp.salary.toString()); }} className="flex-1 bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400 p-2 rounded-xl font-bold text-sm transition-colors">
                پێدانی مووچە
              </button>
              <button onClick={() => onUpdateEmployee({...emp, status: emp.status === 'active' ? 'inactive' : 'active'})} className={cn("px-4 py-2 rounded-xl font-bold text-sm transition-colors", emp.status === 'active' ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100")}>
                {emp.status === 'active' ? 'ڕاگرتن' : 'چالاککردن'}
              </button>
            </div>
          </div>
        ))}
        {employees.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">هیچ کارمەندێک تۆمار نەکراوە</div>
        )}
      </div>
    </motion.div>
  );
}



function CustomerLoyaltyView({ customers, sales, onSave, onUpdate, onBack }: { customers: Customer[], sales: Sale[], onSave: (c: Customer) => void, onUpdate: (c: Customer) => void, onBack: () => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleAddCustomer = () => {
    if (!name) return toast.error("تکایە ناوی کڕیار بنووسە");
    onSave({
      id: Date.now(),
      name,
      phone,
      points: 0,
      tier: 'bronze',
      debt: 0
    });
    setShowAdd(false);
    setName('');
    setPhone('');
  };

  // Calculate points based on sales history (e.g., 1 point per 1000 spent)
  const calculatePoints = (customerName: string) => {
    const customerSales = sales.filter(s => s.customerName === customerName);
    const totalSpent = customerSales.reduce((sum, s) => sum + s.total, 0);
    return Math.floor(totalSpent / 1000);
  };

  const getTier = (points: number) => {
    if (points >= 10000) return { name: 'پلاتینۆم', color: 'bg-slate-800 text-slate-200' };
    if (points >= 5000) return { name: 'زێڕ', color: 'bg-yellow-100 text-yellow-700' };
    if (points >= 1000) return { name: 'زیو', color: 'bg-slate-200 text-slate-700' };
    return { name: 'بڕۆنز', color: 'bg-orange-100 text-orange-800' };
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-yellow-600 dark:text-yellow-400">سیستەمی دڵسۆزی کڕیار</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-yellow-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Plus size={18} /> کڕیاری نوێ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">زیادکردنی کڕیار بۆ سیستەمی خاڵ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ناوی کڕیار" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="ژمارەی مۆبایل" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          </div>
          <button onClick={handleAddCustomer} className="w-full bg-yellow-500 text-white p-3 rounded-xl font-bold">پاشەکەوتکردن</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customers.map(c => {
          const calculatedPoints = calculatePoints(c.name);
          const tier = getTier(calculatedPoints);
          
          return (
            <div key={c.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-1">{c.name}</h3>
                <p className="text-xs text-slate-500 mb-2">{c.phone || 'بێ ژمارە'}</p>
                <span className={cn("text-xs px-2 py-1 rounded-full font-bold", tier.color)}>
                  ئاستی {tier.name}
                </span>
              </div>
              <div className="text-center bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-2xl min-w-[80px]">
                <p className="text-[10px] text-yellow-600 dark:text-yellow-500 font-bold mb-1">خاڵەکان</p>
                <p className="text-2xl font-black text-yellow-600 dark:text-yellow-400">{calculatedPoints}</p>
              </div>
            </div>
          );
        })}
        {customers.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">هیچ کڕیارێک تۆمار نەکراوە</div>
        )}
      </div>
    </motion.div>
  );
}

function ShiftManagementView({ data, onSave, onUpdate, onBack }: { data: ERPData, onSave: (s: Shift) => void, onUpdate: (s: Shift) => void, onBack: () => void }) {
  const [showOpen, setShowOpen] = useState(false);
  const [showClose, setShowClose] = useState(false);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [openingCash, setOpeningCash] = useState('');
  const [closingCashInput, setClosingCashInput] = useState('');

  const shifts = data.shifts || [];
  const activeShift = shifts.find(s => s.status === 'open');
  const currency = data.settings.currency;

  const handleOpenShift = () => {
    if (!employeeId || !openingCash) return;
    const employee = data.employees?.find(e => e.id === employeeId);
    onSave({
      id: Date.now(),
      employeeId,
      startTime: new Date().toISOString(),
      openingCash: parseFloat(openingCash),
      status: 'open',
      cashierName: employee?.name || 'نەناسراو'
    });
    setShowOpen(false);
    setEmployeeId(null);
    setOpeningCash('');
  };

  const calculateShiftStats = (shift: Shift) => {
    const startTime = new Date(shift.startTime).getTime();
    const endTime = shift.endTime ? new Date(shift.endTime).getTime() : Date.now();

    const shiftSales = data.sales.filter(s => s.id >= startTime && s.id <= endTime);
    const cashSales = shiftSales.reduce((sum, s) => sum + (s.paidAmount || (s.paymentMethod === 'cash' ? s.total : 0)), 0);
    const qistSales = shiftSales.filter(s => s.paymentMethod === 'qist').reduce((sum, s) => sum + s.total, 0);

    const shiftExpenses = data.expenses.filter(e => e.id >= startTime && e.id <= endTime);
    const totalExpenses = shiftExpenses.reduce((sum, e) => sum + e.amount, 0);

    const shiftReturns = (data.returns || []).filter(r => r.id >= startTime && r.id <= endTime);
    const totalReturns = shiftReturns.reduce((sum, r) => sum + r.totalRefund, 0);

    const shiftCustomerPayments = data.payments.filter(p => p.id >= startTime && p.id <= endTime);
    const totalCustomerPayments = shiftCustomerPayments.reduce((sum, p) => sum + p.amount, 0);

    const shiftSupplierPayments = (data.supplierPayments || []).filter(p => p.id >= startTime && p.id <= endTime);
    const totalSupplierPayments = shiftSupplierPayments.reduce((sum, p) => sum + p.amount, 0);

    const shiftSalaryPayments = (data.salaryPayments || []).filter(p => p.id >= startTime && p.id <= endTime);
    const totalSalaryPayments = shiftSalaryPayments.reduce((sum, p) => sum + p.amount, 0);

    const expectedCash = shift.openingCash + cashSales + totalCustomerPayments - totalExpenses - totalSupplierPayments - totalSalaryPayments;

    return {
      cashSales,
      qistSales,
      totalExpenses,
      totalReturns,
      totalCustomerPayments,
      totalSupplierPayments,
      totalSalaryPayments,
      expectedCash
    };
  };

  const handleCloseShift = () => {
    if (!activeShift) return;
    
    const closingCash = parseFloat(closingCashInput);
    if (isNaN(closingCash)) return;

    const stats = calculateShiftStats(activeShift);

    onUpdate({
      ...activeShift,
      endTime: new Date().toISOString(),
      closingCash,
      expectedCash: stats.expectedCash,
      status: 'closed'
    });
    setShowClose(false);
    setClosingCashInput('');
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-emerald-600 dark:text-emerald-400">سندوق و شەفت</h2>
        </div>
        {!activeShift && (
          <button onClick={() => setShowOpen(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
            <Plus size={18} /> کردنەوەی شەفت
          </button>
        )}
      </div>

      {activeShift && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-6 rounded-3xl space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-300">
                <Wallet size={24} />
              </div>
              <div>
                <h3 className="font-black text-emerald-800 dark:text-emerald-400 text-xl">شەفتی کراوە</h3>
                <p className="text-emerald-600 dark:text-emerald-500 font-bold">کاشێر: {activeShift.cashierName}</p>
              </div>
            </div>
            <div className="text-right bg-white dark:bg-slate-900 px-4 py-2 rounded-xl shadow-sm">
              <p className="text-xs text-slate-500 mb-1">کاتی دەستپێک</p>
              <p className="font-bold text-slate-800 dark:text-slate-200">{new Date(activeShift.startTime).toLocaleTimeString('ku-IQ')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl flex flex-col shadow-sm border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 text-sm font-bold mb-1">پارەی سەرەتا</span>
              <span className="font-black text-lg text-emerald-600">{activeShift.openingCash.toLocaleString()} {currency}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl flex flex-col shadow-sm border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 text-sm font-bold mb-1">فرۆشتنی نەقد</span>
              <span className="font-black text-lg text-blue-600">+{calculateShiftStats(activeShift).cashSales.toLocaleString()} {currency}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl flex flex-col shadow-sm border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 text-sm font-bold mb-1">قەرزی وەرگیراو</span>
              <span className="font-black text-lg text-emerald-600">+{calculateShiftStats(activeShift).totalCustomerPayments.toLocaleString()} {currency}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl flex flex-col shadow-sm border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 text-sm font-bold mb-1">خەرجییەکان</span>
              <span className="font-black text-lg text-red-500">-{calculateShiftStats(activeShift).totalExpenses.toLocaleString()} {currency}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl flex flex-col shadow-sm border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 text-sm font-bold mb-1">گەڕانەوەی کاڵا</span>
              <span className="font-black text-lg text-red-500">-{calculateShiftStats(activeShift).totalReturns.toLocaleString()} {currency}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl flex flex-col shadow-sm border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 text-sm font-bold mb-1">قەرزی دراو (کارگە)</span>
              <span className="font-black text-lg text-red-500">-{calculateShiftStats(activeShift).totalSupplierPayments.toLocaleString()} {currency}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl flex flex-col shadow-sm border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 text-sm font-bold mb-1">مووچەی دراو</span>
              <span className="font-black text-lg text-red-500">-{calculateShiftStats(activeShift).totalSalaryPayments.toLocaleString()} {currency}</span>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl flex flex-col shadow-sm border border-indigo-100 dark:border-indigo-800">
              <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold mb-1">پارەی پێشبینیکراو</span>
              <span className="font-black text-xl text-indigo-700 dark:text-indigo-300">{calculateShiftStats(activeShift).expectedCash.toLocaleString()} {currency}</span>
            </div>
          </div>

          <button onClick={() => setShowClose(true)} className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-2xl font-black text-lg transition-colors shadow-lg shadow-red-500/20">
            داخستنی شەفت و ژماردنی پارە
          </button>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-black text-xl text-slate-800 dark:text-slate-200">مێژووی شەفتەکان</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {shifts.filter(s => s.status === 'closed').sort((a, b) => b.id - a.id).map(s => {
            const diff = (s.closingCash || 0) - (s.expectedCash || 0);
            return (
              <div key={s.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300">
                      <Receipt size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-slate-800 dark:text-slate-100">{s.cashierName}</h4>
                      <p className="text-xs font-bold text-slate-500">{new Date(s.startTime).toLocaleString('ku-IQ')} - {s.endTime ? new Date(s.endTime).toLocaleTimeString('ku-IQ') : ''}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2", 
                    diff >= 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  )}>
                    {diff >= 0 ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {diff >= 0 ? 'زیادە/تەواو' : 'کەمتیهێناوە'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    <p className="text-slate-500 font-bold mb-1">سەرەتا</p>
                    <p className="font-black text-slate-700 dark:text-slate-300">{s.openingCash?.toLocaleString()} {currency}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    <p className="text-slate-500 font-bold mb-1">فرۆشتن</p>
                    <p className="font-black text-blue-600">+{calculateShiftStats(s).cashSales.toLocaleString()} {currency}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    <p className="text-slate-500 font-bold mb-1">خەرجی</p>
                    <p className="font-black text-red-500">-{calculateShiftStats(s).totalExpenses.toLocaleString()} {currency}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    <p className="text-slate-500 font-bold mb-1">پێشبینیکراو</p>
                    <p className="font-black text-indigo-600">{s.expectedCash?.toLocaleString()} {currency}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl">
                    <p className="text-slate-500 font-bold mb-1">کۆتایی سندوق (کاش)</p>
                    <p className="font-black text-xl text-slate-800 dark:text-slate-200">{s.closingCash?.toLocaleString()} <span className="text-xs">{currency}</span></p>
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl flex flex-col justify-center font-black",
                    diff >= 0 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                  )}>
                    <span className="text-sm mb-1 opacity-80">جیاوازی:</span>
                    <span className="text-xl" dir="ltr">{diff > 0 ? '+' : ''}{diff.toLocaleString()} {currency}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {shifts.filter(s => s.status === 'closed').length === 0 && (
          <div className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-3xl py-12 border border-dashed border-slate-200 dark:border-slate-700">
            <Wallet className="mx-auto text-slate-400 mb-4" size={48} opacity={0.5} />
            <p className="text-slate-500 font-bold">هیچ شەفتێکی داخراو نییە</p>
          </div>
        )}
      </div>

      {/* Open Shift Modal */}
      {showOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-black text-xl mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Plus className="text-emerald-500" /> کردنەوەی شەفتی نوێ
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">کارمەند (کاشێر)</label>
                <select value={employeeId || ''} onChange={e => setEmployeeId(Number(e.target.value))} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold">
                  <option value="">هەڵبژێرە...</option>
                  {data.employees?.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">بڕی پارەی ناو سندوق (سەرەتا)</label>
                <div className="relative">
                  <input type="number" value={openingCash} onChange={e => setOpeningCash(e.target.value)} placeholder="0" className="w-full p-4 pl-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-black text-lg" />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{currency}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowOpen(false)} className="flex-1 p-4 rounded-2xl font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors">
                  پاشگەزبوونەوە
                </button>
                <button onClick={handleOpenShift} disabled={!employeeId || !openingCash} className="flex-1 p-4 rounded-2xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  دەستپێکردن
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Close Shift Modal */}
      {showClose && activeShift && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h3 className="font-black text-2xl mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Calculator className="text-red-500" /> داخستنی شەفت
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">پوختەی داهات (نەقد)</h4>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400">پارەی سەرەتا:</span>
                  <span className="font-bold">{activeShift.openingCash.toLocaleString()} {currency}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400">فرۆشتنی نەقد:</span>
                  <span className="font-bold text-emerald-600">+{calculateShiftStats(activeShift).cashSales.toLocaleString()} {currency}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400">قەرزی وەرگیراو:</span>
                  <span className="font-bold text-emerald-600">+{calculateShiftStats(activeShift).totalCustomerPayments.toLocaleString()} {currency}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">پوختەی خەرجی (نەقد)</h4>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400">خەرجییەکان:</span>
                  <span className="font-bold text-red-500">-{calculateShiftStats(activeShift).totalExpenses.toLocaleString()} {currency}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400">گەڕانەوەی کاڵا:</span>
                  <span className="font-bold text-red-500">-{calculateShiftStats(activeShift).totalReturns.toLocaleString()} {currency}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400">قەرزی دراو (کارگە):</span>
                  <span className="font-bold text-red-500">-{calculateShiftStats(activeShift).totalSupplierPayments.toLocaleString()} {currency}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400">مووچەی دراو:</span>
                  <span className="font-bold text-red-500">-{calculateShiftStats(activeShift).totalSalaryPayments.toLocaleString()} {currency}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl mb-6 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-slate-700 dark:text-slate-300">کۆی پارەی پێشبینیکراو لە سندوق:</span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{calculateShiftStats(activeShift).expectedCash.toLocaleString()} {currency}</span>
              </div>
              
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">بڕی پارەی کاش (ئێستا لە سندوقدایە)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={closingCashInput} 
                    onChange={e => setClosingCashInput(e.target.value)} 
                    placeholder="0" 
                    className="w-full p-4 pl-16 bg-white dark:bg-slate-900 border-2 border-emerald-500/30 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-black text-2xl text-emerald-600" 
                    autoFocus
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{currency}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowClose(false)} className="flex-1 p-4 rounded-2xl font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors">
                پاشگەزبوونەوە
              </button>
              <button onClick={handleCloseShift} disabled={!closingCashInput} className="flex-[2] p-4 rounded-2xl font-black bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20">
                پەسەندکردن و داخستن
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}


function TasksView({ tasks, employees, onSave, onUpdate, onBack }: { tasks: Task[], employees: Employee[], onSave: (t: Task) => void, onUpdate: (t: Task) => void, onBack: () => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleAdd = () => {
    if (!title || !assignedTo) return toast.error("تکایە ناونیشان و کارمەند دیاری بکە");
    onSave({
      id: Date.now(),
      title,
      description,
      assignedTo: parseInt(assignedTo),
      dueDate,
      status: 'todo'
    });
    setShowAdd(false);
    setTitle('');
    setDescription('');
    setAssignedTo('');
    setDueDate('');
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-indigo-600 dark:text-indigo-400">ئەرکەکان</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Plus size={18} /> ئەرکی نوێ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">زیادکردنی ئەرک</h3>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="ناونیشانی ئەرک" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="وردەکاری" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none h-24" />
          <div className="grid grid-cols-2 gap-4">
            <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
              <option value="">دیاریکردنی کارمەند...</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          </div>
          <button onClick={handleAdd} className="w-full bg-indigo-600 text-white p-3 rounded-xl font-bold">پاشەکەوتکردن</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['todo', 'in-progress', 'done'].map(status => (
          <div key={status} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl">
            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 capitalize">
              {status === 'todo' ? 'بۆ کردن' : status === 'in-progress' ? 'لە جێبەجێکردندایە' : 'تەواوبووە'}
            </h3>
            <div className="space-y-3">
              {tasks.filter(t => t.status === status).map(t => (
                <div key={t.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-sm mb-1">{t.title}</h4>
                  <p className="text-xs text-slate-500 mb-3">{t.description}</p>
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-3">
                    <span>{employees.find(e => e.id === t.assignedTo)?.name}</span>
                    <span>{t.dueDate}</span>
                  </div>
                  <select 
                    value={t.status} 
                    onChange={e => onUpdate({...t, status: e.target.value as any})}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none"
                  >
                    <option value="todo">بۆ کردن</option>
                    <option value="in-progress">لە جێبەجێکردندایە</option>
                    <option value="done">تەواوبووە</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function AssetsView({ assets, currency, onSave, onUpdate, onBack }: { assets: Asset[], currency: string, onSave: (a: Asset) => void, onUpdate: (a: Asset) => void, onBack: () => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [currentValue, setCurrentValue] = useState('');

  const handleAdd = () => {
    if (!name || !purchasePrice) return toast.error("تکایە ناو و نرخی کڕین پڕبکەرەوە");
    onSave({
      id: Date.now(),
      name,
      category,
      purchaseDate,
      purchasePrice: parseFloat(purchasePrice),
      currentValue: parseFloat(currentValue || purchasePrice),
      status: 'active'
    });
    setShowAdd(false);
    setName('');
    setCategory('');
    setPurchasePrice('');
    setCurrentValue('');
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-emerald-600 dark:text-emerald-400">سەرمایەکان (Assets)</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Plus size={18} /> سەرمایەی نوێ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">زیادکردنی سەرمایە</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ناوی سەرمایە (بۆ نموونە: ئۆتۆمبێل، کۆمپیوتەر)" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="جۆر (ئامێر، مۆبیلیات، هتد)" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="number" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} placeholder="نرخی کڕین" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="number" value={currentValue} onChange={e => setCurrentValue(e.target.value)} placeholder="نرخی ئێستا (بۆ هەژمارکردنی دابەزینی نرخ)" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          </div>
          <button onClick={handleAdd} className="w-full bg-emerald-600 text-white p-3 rounded-xl font-bold">پاشەکەوتکردن</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assets.map(a => (
          <div key={a.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{a.name}</h3>
                <p className="text-xs text-slate-500">{a.category} • {a.purchaseDate}</p>
              </div>
              <select 
                value={a.status} 
                onChange={e => onUpdate({...a, status: e.target.value as any})}
                className={cn("text-xs px-2 py-1 rounded-full font-bold outline-none", 
                  a.status === 'active' ? "bg-emerald-100 text-emerald-700" : 
                  a.status === 'maintenance' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                )}
              >
                <option value="active">چالاک</option>
                <option value="maintenance">لە چاککردنەوەدایە</option>
                <option value="disposed">لەکارکەوتوو</option>
              </select>
            </div>
            <div className="flex justify-between mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div>
                <p className="text-[10px] text-slate-500 mb-1">نرخی کڕین</p>
                <p className="font-bold">{a.purchasePrice.toLocaleString()} {currency}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 mb-1">نرخی ئێستا</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">{a.currentValue.toLocaleString()} {currency}</p>
              </div>
            </div>
          </div>
        ))}
        {assets.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">هیچ سەرمایەیەک تۆمار نەکراوە</div>
        )}
      </div>
    </motion.div>
  );
}

function RecipesView({ recipes, products, onSave, onBack }: { recipes: Recipe[], products: Product[], onSave: (r: Recipe) => void, onBack: () => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [finishedProductId, setFinishedProductId] = useState('');
  const [items, setItems] = useState<RecipeItem[]>([]);
  
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [qty, setQty] = useState('');

  const handleAddIngredient = () => {
    if (!selectedIngredient || !qty) return;
    setItems([...items, { productId: parseInt(selectedIngredient), quantity: parseFloat(qty) }]);
    setSelectedIngredient('');
    setQty('');
  };

  const handleSave = () => {
    if (!name || !finishedProductId || items.length === 0) return toast.error("تکایە هەموو زانیارییەکان پڕبکەرەوە");
    onSave({
      id: Date.now(),
      name,
      finishedProductId: parseInt(finishedProductId),
      items
    });
    setShowAdd(false);
    setName('');
    setFinishedProductId('');
    setItems([]);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-orange-600 dark:text-orange-400">ڕەچەتەکانی بەرهەمهێنان (BOM)</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-orange-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Plus size={18} /> ڕەچەتەی نوێ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">دروستکردنی ڕەچەتە</h3>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ناوی ڕەچەتە" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          <select value={finishedProductId} onChange={e => setFinishedProductId(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
            <option value="">هەڵبژاردنی کاڵای کۆتایی...</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
            <h4 className="font-bold text-sm mb-2">پێکهاتەکان (کەرەستەی خاو)</h4>
            <div className="flex gap-2">
              <select value={selectedIngredient} onChange={e => setSelectedIngredient(e.target.value)} className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                <option value="">هەڵبژاردنی کەرەستە...</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="بڕ" className="w-24 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
              <button onClick={handleAddIngredient} className="bg-slate-800 text-white px-4 rounded-xl font-bold">زیادکردن</button>
            </div>
            
            <div className="mt-4 space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-lg text-sm">
                  <span>{products.find(p => p.id === item.productId)?.name}</span>
                  <span className="font-bold">{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleSave} className="w-full bg-orange-600 text-white p-3 rounded-xl font-bold mt-4">پاشەکەوتکردن</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipes.map(r => (
          <div key={r.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-1">{r.name}</h3>
            <p className="text-sm text-slate-500 mb-4">کاڵای کۆتایی: <span className="font-bold text-orange-600">{products.find(p => p.id === r.finishedProductId)?.name}</span></p>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 mb-2">پێکهاتەکان:</p>
              {r.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm border-b border-slate-50 dark:border-slate-800 pb-1">
                  <span>{products.find(p => p.id === item.productId)?.name}</span>
                  <span className="font-medium">{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {recipes.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">هیچ ڕەچەتەیەک تۆمار نەکراوە</div>
        )}
      </div>
    </motion.div>
  );
}

function ProductionView({ orders, recipes, products, currency, onSave, onUpdate, onBack }: { orders: ProductionOrder[], recipes: Recipe[], products: Product[], currency: string, onSave: (o: ProductionOrder) => void, onUpdate: (o: ProductionOrder, updatedProducts?: Product[]) => void, onBack: () => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [recipeId, setRecipeId] = useState('');
  const [qty, setQty] = useState('');

  const handleAdd = () => {
    if (!recipeId || !qty) return toast.error("تکایە ڕەچەتە و بڕ دیاری بکە");
    
    const recipe = recipes.find(r => r.id === parseInt(recipeId));
    if (!recipe) return;

    // Calculate cost based on ingredients
    let totalCost = 0;
    recipe.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        totalCost += (prod.cost * item.quantity) * parseInt(qty);
      }
    });

    onSave({
      id: Date.now(),
      recipeId: parseInt(recipeId),
      quantityProduced: parseInt(qty),
      date: new Date().toLocaleDateString('ku-IQ'),
      status: 'pending',
      cost: totalCost
    });
    setShowAdd(false);
    setRecipeId('');
    setQty('');
  };

  const handleComplete = async (order: ProductionOrder) => {
    if (await customConfirm("دڵنیایت لە تەواوبوونی ئەم بەرهەمهێنانە؟ کۆگای کەرەستەکان کەمدەکرێتەوە و کاڵای کۆتایی زیاد دەکرێت.")) {
      const recipe = recipes.find(r => r.id === order.recipeId);
      if (!recipe) return;

      let updatedProducts = [...products];
      
      // Deduct ingredients
      recipe.items.forEach(item => {
        updatedProducts = updatedProducts.map(p => 
          p.id === item.productId ? { ...p, stock: p.stock - (item.quantity * order.quantityProduced) } : p
        );
      });

      // Add finished product
      updatedProducts = updatedProducts.map(p => 
        p.id === recipe.finishedProductId ? { ...p, stock: p.stock + order.quantityProduced } : p
      );

      onUpdate({ ...order, status: 'completed' }, updatedProducts);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-blue-600 dark:text-blue-400">بەرهەمهێنان</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Plus size={18} /> داواکاری نوێ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">دروستکردنی داواکاری بەرهەمهێنان</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select value={recipeId} onChange={e => setRecipeId(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
              <option value="">هەڵبژاردنی ڕەچەتە...</option>
              {recipes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="بڕی بەرهەمهێنان" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          </div>
          <button onClick={handleAdd} className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold">پاشەکەوتکردن</button>
        </div>
      )}

      <div className="space-y-4">
        {orders.sort((a, b) => b.id - a.id).map(o => {
          const recipe = recipes.find(r => r.id === o.recipeId);
          return (
            <div key={o.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                    {recipe ? recipe.name : 'ڕەچەتەی نەناسراو'}
                  </h3>
                  <p className="text-sm text-slate-500">بڕ: {o.quantityProduced} • {o.date}</p>
                </div>
                <span className={cn("text-xs px-3 py-1 rounded-full font-bold", 
                  o.status === 'completed' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                )}>
                  {o.status === 'completed' ? 'تەواوبووە' : 'چاوەڕێکراو'}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-black text-slate-600 dark:text-slate-400">تێچوو: {o.cost.toLocaleString()} {currency}</span>
                {o.status === 'pending' && (
                  <button onClick={() => handleComplete(o)} className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-xl font-bold text-sm transition-colors">
                    تەواوکردن
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {orders.length === 0 && (
          <div className="text-center py-12 text-slate-400">هیچ داواکارییەکی بەرهەمهێنان نییە</div>
        )}
      </div>
    </motion.div>
  );
}

function VehiclesView({ vehicles, employees, onSave, onUpdate, onBack }: { vehicles: Vehicle[], employees: Employee[], onSave: (v: Vehicle) => void, onUpdate: (v: Vehicle) => void, onBack: () => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [driverId, setDriverId] = useState('');
  const [mileage, setMileage] = useState('');

  const handleAdd = () => {
    if (!name || !plateNumber) return toast.error("تکایە ناو و ژمارەی تابلۆ پڕبکەرەوە");
    onSave({
      id: Date.now(),
      name,
      plateNumber,
      driverId: driverId ? parseInt(driverId) : undefined,
      status: 'active',
      mileage: parseInt(mileage || '0')
    });
    setShowAdd(false);
    setName('');
    setPlateNumber('');
    setDriverId('');
    setMileage('');
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">ئۆتۆمبێلەکان</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-slate-800 dark:bg-slate-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Plus size={18} /> ئۆتۆمبێلی نوێ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">زیادکردنی ئۆتۆمبێل</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="جۆر و مۆدێل (نموونە: تۆیۆتا هیلۆکس)" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="text" value={plateNumber} onChange={e => setPlateNumber(e.target.value)} placeholder="ژمارەی تابلۆ" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <select value={driverId} onChange={e => setDriverId(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
              <option value="">دیاریکردنی شۆفێر...</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            <input type="number" value={mileage} onChange={e => setMileage(e.target.value)} placeholder="کیلۆمەتر (Mileage)" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          </div>
          <button onClick={handleAdd} className="w-full bg-slate-800 dark:bg-slate-700 text-white p-3 rounded-xl font-bold">پاشەکەوتکردن</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map(v => (
          <div key={v.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{v.name}</h3>
                <p className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg inline-block mt-1">{v.plateNumber}</p>
              </div>
              <select 
                value={v.status} 
                onChange={e => onUpdate({...v, status: e.target.value as any})}
                className={cn("text-xs px-2 py-1 rounded-full font-bold outline-none", 
                  v.status === 'active' ? "bg-emerald-100 text-emerald-700" : 
                  v.status === 'maintenance' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                )}
              >
                <option value="active">چالاک</option>
                <option value="maintenance">لە چاککردنەوەدایە</option>
                <option value="inactive">لەکارکەوتوو</option>
              </select>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>شۆفێر: <span className="font-bold text-slate-700 dark:text-slate-300">{employees.find(e => e.id === v.driverId)?.name || 'دیارینەکراوە'}</span></span>
              <span>{v.mileage.toLocaleString()} KM</span>
            </div>
          </div>
        ))}
        {vehicles.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">هیچ ئۆتۆمبێلێک تۆمار نەکراوە</div>
        )}
      </div>
    </motion.div>
  );
}

function DriversView({ drivers, vehicles, onSave, onUpdate, onBack }: { drivers: Driver[], vehicles: Vehicle[], onSave: (d: Driver) => void, onUpdate: (d: Driver) => void, onBack: () => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehicleId, setVehicleId] = useState<string>('');
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLicense, setEditLicense] = useState('');
  const [editVehicleId, setEditVehicleId] = useState<string>('');

  const handleAdd = () => {
    if (!name || !phone) return toast.error("تکایە ناو و ژمارەی تەلەفۆن پڕبکەرەوە");
    onSave({
      id: Date.now(),
      name,
      phone,
      licenseNumber,
      status: 'active',
      vehicleId: vehicleId ? Number(vehicleId) : undefined
    });
    setShowAdd(false);
    setName('');
    setPhone('');
    setLicenseNumber('');
    setVehicleId('');
  };

  const startEdit = (d: Driver) => {
    setEditingDriver(d);
    setEditName(d.name);
    setEditPhone(d.phone);
    setEditLicense(d.licenseNumber);
    setEditVehicleId(d.vehicleId?.toString() || '');
  };

  const handleUpdate = () => {
    if (!editingDriver) return;
    onUpdate({
      ...editingDriver,
      name: editName,
      phone: editPhone,
      licenseNumber: editLicense,
      vehicleId: editVehicleId ? Number(editVehicleId) : undefined
    });
    setEditingDriver(null);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">شۆفێرەکان</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-slate-800 dark:bg-slate-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Plus size={18} /> شۆفێری نوێ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">زیادکردنی شۆفێر</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ناوی شۆفێر" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="ژمارەی تەلەفۆن" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="text" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} placeholder="ژمارەی مۆڵەت" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <select value={vehicleId} onChange={e => setVehicleId(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
              <option value="">ئۆتۆمبێل هەڵبژێرە</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <button onClick={handleAdd} className="w-full bg-slate-800 dark:bg-slate-700 text-white p-3 rounded-xl font-bold">پاشەکەوتکردن</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drivers.map(d => {
          if (editingDriver?.id === d.id) {
            return (
              <div key={d.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="font-bold text-slate-700 dark:text-slate-300">دەستکاریکردنی {d.name}</h3>
                <div className="grid grid-cols-1 gap-4">
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} placeholder="ناوی شۆفێر" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                  <input type="text" value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="ژمارەی تەلەفۆن" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                  <input type="text" value={editLicense} onChange={e => setEditLicense(e.target.value)} placeholder="ژمارەی مۆڵەت" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                  <select value={editVehicleId} onChange={e => setEditVehicleId(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                    <option value="">ئۆتۆمبێل هەڵبژێرە</option>
                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleUpdate} className="flex-1 bg-emerald-600 text-white p-3 rounded-xl font-bold">نوێکردنەوە</button>
                  <button onClick={() => setEditingDriver(null)} className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 p-3 rounded-xl font-bold">هەڵوەشاندنەوە</button>
                </div>
              </div>
            );
          }
          const vehicle = vehicles.find(v => v.id === d.vehicleId);
          return (
            <div key={d.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{d.name}</h3>
                  <p className="text-sm text-slate-500">{d.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(d)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500"><Edit2 size={16} /></button>
                  <select 
                    value={d.status} 
                    onChange={e => onUpdate({...d, status: e.target.value as any})}
                    className={cn("text-xs px-2 py-1 rounded-full font-bold outline-none", 
                      d.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    )}
                  >
                    <option value="active">چالاک</option>
                    <option value="inactive">ناچالاک</option>
                  </select>
                </div>
              </div>
              <p className="text-sm text-slate-500">مۆڵەت: <span className="font-bold text-slate-700 dark:text-slate-300">{d.licenseNumber}</span></p>
              <p className="text-sm text-slate-500">ئۆتۆمبێل: <span className="font-bold text-slate-700 dark:text-slate-300">{vehicle?.name || 'بێ ئۆتۆمبێل'}</span></p>
            </div>
          );
        })}
        {drivers.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">هیچ شۆفێرێک تۆمار نەکراوە</div>
        )}
      </div>
    </motion.div>
  );
}

function CustomerManagementView({ customers, sales, payments, currency, onSave, onUpdate, onSavePayment, onViewDetails, onBack }: { customers: Customer[], sales: Sale[], payments: Payment[], currency: string, onSave: (c: Customer) => void, onUpdate: (c: Customer[]) => void, onSavePayment: (p: Payment, updatedCustomers: Customer[]) => void, onViewDetails: (c: Customer) => void, onBack: () => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [showPayment, setShowPayment] = useState<Customer | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAdd = () => {
    if (!name) return toast.error("تکایە ناوی کڕیار بنووسە");
    onSave({ id: Date.now(), name, phone, address, debt: 0, points: 0, tier: 'bronze' });
    setName(''); setPhone(''); setAddress(''); setShowAdd(false);
  };

  const handlePayment = () => {
    if (!showPayment || !paymentAmount) return;
    const amount = parseFloat(paymentAmount);
    const newPayment: Payment = {
      id: Date.now(),
      customerName: showPayment.name,
      amount,
      date: new Date().toLocaleDateString('ku-IQ'),
      note: paymentNote
    };

    const updatedCustomers = customers.map(c => 
      c.id === showPayment.id ? { ...c, debt: Math.max(0, (c.debt || 0) - amount) } : c
    );

    onSavePayment(newPayment, updatedCustomers);
    setShowPayment(null);
    setPaymentAmount('');
    setPaymentNote('');
    toast.success("پارەکە وەرگیرا و قەرزەکە کەمکرایەوە");
  };

  const filtered = customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone?.includes(searchTerm));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">بەڕێوەبردنی کڕیاران</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">تۆمارکردن و بەدواداچوونی حیسابی کڕیاران</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAdd(!showAdd)} className="bg-emerald-600 text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-emerald-200 dark:shadow-none flex items-center gap-2 hover:bg-emerald-700 transition-all">
            <Plus size={20} /> کڕیاری نوێ
          </button>
          <button onClick={onBack} className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-5 py-2.5 rounded-2xl font-bold border border-slate-200 dark:border-slate-700">گەڕانەوە</button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="گەڕان بەپێی ناو یان ژمارە مۆبایل..." className="w-full pr-12 pl-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500" />
        </div>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">زیادکردنی کڕیار</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ناوی کڕیار" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="ژمارە مۆبایل" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="ناونیشان" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          </div>
          <button onClick={handleAdd} className="w-full bg-emerald-600 text-white p-3 rounded-xl font-bold">پاشەکەوتکردن</button>
        </div>
      )}

      {showPayment && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-xl border dark:border-slate-800">
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-50">وەرگرتنی قەرز - {showPayment.name}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">بڕی پارە ({currency})</label>
                <input type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500" placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">تێبینی</label>
                <input type="text" value={paymentNote} onChange={e => setPaymentNote(e.target.value)} className="w-full p-3 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500" placeholder="..." />
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl">
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">قەرزی ماوە: {(showPayment.debt || 0).toLocaleString()} {currency}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handlePayment} className="flex-1 bg-emerald-600 text-white p-3 rounded-xl font-bold active:scale-95 transition-transform">پاشکەوتکردن</button>
                <button onClick={() => setShowPayment(null)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 p-3 rounded-xl font-bold active:scale-95 transition-transform">پاشگەزبوونەوە</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-xl">
                {c.name.charAt(0)}
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">کۆی قەرز</div>
                <div className={cn("text-lg font-black", (c.debt || 0) > 0 ? "text-red-500" : "text-emerald-500")}>
                  {(c.debt || 0).toLocaleString()} {currency}
                </div>
              </div>
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-1">{c.name}</h3>
            <div className="space-y-1 mb-4">
              <p className="text-sm text-slate-500 flex items-center gap-2"><Phone size={14} /> {c.phone || '---'}</p>
              <p className="text-sm text-slate-500 flex items-center gap-2"><MapPin size={14} /> {c.address || '---'}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowPayment(c)} className="flex-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 py-2 rounded-xl text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all">وەرگرتنی قەرز</button>
              <button onClick={() => onViewDetails(c)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-2 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">وردەکاری</button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function EmployeePerformanceReportView({ employees, salaryPayments, shifts, currency, onBack }: { employees: Employee[], salaryPayments: SalaryPayment[], shifts: Shift[], currency: string, onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
        <h2 className="font-bold text-lg text-indigo-600 dark:text-indigo-400">ڕاپۆرتی کارمەندان</h2>
      </div>
      <div className="space-y-4">
        {employees.map(emp => {
          const empSalary = salaryPayments.filter(s => s.employeeId === emp.id).reduce((sum, s) => sum + s.amount, 0);
          const empShifts = shifts.filter(s => s.employeeId === emp.id);
          return (
            <div key={emp.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{emp.name}</h3>
              <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                <div><p className="text-slate-500">کۆی مووچە</p><p className="font-bold">{empSalary.toLocaleString()} {currency}</p></div>
                <div><p className="text-slate-500">ژمارەی شەفت</p><p className="font-bold">{empShifts.length}</p></div>
                <div><p className="text-slate-500">ڕۆژی دەستپێک</p><p className="font-bold">{emp.joinDate}</p></div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function CampaignsView({ campaigns, currency, onSave, onUpdate, onBack }: { campaigns: Campaign[], currency: string, onSave: (c: Campaign) => void, onUpdate: (c: Campaign) => void, onBack: () => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [targetAudience, setTargetAudience] = useState('');

  const handleAdd = () => {
    if (!name || !budget) return toast.error("تکایە ناو و بودجە پڕبکەرەوە");
    onSave({
      id: Date.now(),
      name,
      startDate: startDate || new Date().toLocaleDateString('ku-IQ'),
      endDate: endDate || new Date().toLocaleDateString('ku-IQ'),
      budget: parseFloat(budget),
      spent: 0,
      status: 'active',
      targetAudience
    });
    setShowAdd(false);
    setName(''); setBudget(''); setTargetAudience('');
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-pink-600 dark:text-pink-400">کەمپەینەکان</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-pink-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Plus size={18} /> کەمپەینی نوێ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">زیادکردنی کەمپەین</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ناوی کەمپەین" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="بودجە" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="text" value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="کڕیارانی ئامانج" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none md:col-span-2" />
          </div>
          <button onClick={handleAdd} className="w-full bg-pink-600 text-white p-3 rounded-xl font-bold">پاشەکەوتکردن</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map(c => (
          <div key={c.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{c.name}</h3>
              <select value={c.status} onChange={e => onUpdate({...c, status: e.target.value as any})} className="text-xs px-2 py-1 rounded-full font-bold outline-none bg-pink-100 text-pink-700">
                <option value="active">چالاک</option>
                <option value="completed">تەواوبووە</option>
                <option value="paused">ڕاگیراوە</option>
              </select>
            </div>
            <p className="text-xs text-slate-500 mb-4">ئامانج: {c.targetAudience}</p>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">خەرجکراو: {c.spent.toLocaleString()} {currency}</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">بودجە: {c.budget.toLocaleString()} {currency}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
              <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${Math.min(100, (c.spent / c.budget) * 100)}%` }}></div>
            </div>
          </div>
        ))}
        {campaigns.length === 0 && <div className="col-span-full text-center py-12 text-slate-400">هیچ کەمپەینێک نییە</div>}
      </div>
    </motion.div>
  );
}

function SupportTicketsView({ tickets, customers, onSave, onUpdate, onBack }: { tickets: SupportTicket[], customers: Customer[], onSave: (t: SupportTicket) => void, onUpdate: (t: SupportTicket) => void, onBack: () => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleAdd = () => {
    if (!subject || !description) return toast.error("تکایە بابەت و وەسف پڕبکەرەوە");
    onSave({
      id: Date.now(),
      subject,
      description,
      customerId: customerId ? parseInt(customerId) : undefined,
      status: 'open',
      priority,
      createdAt: new Date().toISOString()
    });
    setShowAdd(false);
    setSubject(''); setDescription(''); setCustomerId('');
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-sky-600 dark:text-sky-400">تیکێتەکانی پشتیوانی</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-sky-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Plus size={18} /> تیکێتی نوێ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">دروستکردنی تیکێت</h3>
          <div className="grid grid-cols-1 gap-4">
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="بابەت" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="وەسفی کێشەکە" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <select value={customerId} onChange={e => setCustomerId(e.target.value)} className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                <option value="">هەڵبژاردنی کڕیار (ئارەزوومەندانە)</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={priority} onChange={e => setPriority(e.target.value as any)} className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                <option value="low">نزم</option>
                <option value="medium">مامناوەند</option>
                <option value="high">بەرز</option>
              </select>
            </div>
          </div>
          <button onClick={handleAdd} className="w-full bg-sky-600 text-white p-3 rounded-xl font-bold">ناردن</button>
        </div>
      )}

      <div className="space-y-4">
        {tickets.map(t => (
          <div key={t.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">{t.subject}</h3>
              <div className="flex gap-2">
                <span className={cn("text-[10px] px-2 py-1 rounded-full font-bold", 
                  t.priority === 'high' ? "bg-red-100 text-red-700" : 
                  t.priority === 'medium' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                )}>
                  {t.priority === 'high' ? 'بەرز' : t.priority === 'medium' ? 'مامناوەند' : 'نزم'}
                </span>
                <select value={t.status} onChange={e => onUpdate({...t, status: e.target.value as any})} className="text-[10px] px-2 py-1 rounded-full font-bold outline-none bg-sky-100 text-sky-700">
                  <option value="open">کراوە</option>
                  <option value="in-progress">لە کارکردندایە</option>
                  <option value="resolved">چارەسەرکراوە</option>
                  <option value="closed">داخراوە</option>
                </select>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-2">{t.description}</p>
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>کڕیار: {customers.find(c => c.id === t.customerId)?.name || 'گشتی'}</span>
              <span>{new Date(t.createdAt).toLocaleString('ku-IQ')}</span>
            </div>
          </div>
        ))}
        {tickets.length === 0 && <div className="text-center py-12 text-slate-400">هیچ تیکێتێک نییە</div>}
      </div>
    </motion.div>
  );
}

function ProjectsView({ projects, currency, onSave, onUpdate, onBack }: { projects: Project[], currency: string, onSave: (p: Project) => void, onUpdate: (p: Project) => void, onBack: () => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [budget, setBudget] = useState('');

  const handleAdd = () => {
    if (!name || !clientName || !budget) return toast.error("تکایە زانیارییەکان پڕبکەرەوە");
    onSave({
      id: Date.now(),
      name,
      clientName,
      startDate: startDate || new Date().toLocaleDateString('ku-IQ'),
      budget: parseFloat(budget),
      status: 'planning',
      spent: 0
    });
    setShowAdd(false);
    setName('');
    setClientName('');
    setStartDate('');
    setBudget('');
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft /></button>
          <h2 className="font-bold text-lg text-purple-600 dark:text-purple-400">پڕۆژەکان</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-purple-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Plus size={18} /> پڕۆژەی نوێ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">زیادکردنی پڕۆژە</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ناوی پڕۆژە" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="ناوی کڕیار / خاوەن کار" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
            <input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="بودجەی تەرخانکراو" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
          </div>
          <button onClick={handleAdd} className="w-full bg-purple-600 text-white p-3 rounded-xl font-bold">پاشەکەوتکردن</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map(p => {
          const progress = Math.min(100, Math.round((p.spent / p.budget) * 100));
          return (
            <div key={p.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{p.name}</h3>
                  <p className="text-sm text-slate-500">کڕیار: {p.clientName}</p>
                </div>
                <select 
                  value={p.status} 
                  onChange={e => onUpdate({...p, status: e.target.value as any})}
                  className={cn("text-xs px-2 py-1 rounded-full font-bold outline-none", 
                    p.status === 'completed' ? "bg-emerald-100 text-emerald-700" : 
                    p.status === 'in-progress' ? "bg-blue-100 text-blue-700" : 
                    p.status === 'planning' ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-700"
                  )}
                >
                  <option value="planning">پلاندانان</option>
                  <option value="in-progress">لە جێبەجێکردندایە</option>
                  <option value="on-hold">ڕاگیراوە</option>
                  <option value="completed">تەواوبووە</option>
                </select>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">خەرجکراو: {p.spent.toLocaleString()} {currency}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">بودجە: {p.budget.toLocaleString()} {currency}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className={cn("h-2 rounded-full", progress > 90 ? "bg-red-500" : "bg-purple-500")} style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
        {projects.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">هیچ پڕۆژەیەک تۆمار نەکراوە</div>
        )}
      </div>
    </motion.div>
  );
}