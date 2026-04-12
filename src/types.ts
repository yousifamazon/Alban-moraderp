export interface Product {
  id: number;
  name: string;
  barcode: string;
  category: string;
  cost: number;
  price: number;
  stock: number;
  minStock: number;
  expiryDate?: string;
  discount?: number;
  unit: string;
  warehouseId?: number;
  [key: string]: any; // Allow custom fields
}

export interface Sale {
  id: number;
  receiptId?: string;
  customerName: string;
  driverName?: string;
  itemName: string;
  itemCost: number;
  quantity: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'qist';
  date: string;
  paidAmount?: number;
  category?: string;
  source?: 'pos' | 'driver' | 'shop';
  note?: string;
  [key: string]: any; // Allow custom fields
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
}

export interface Waste {
  id: number;
  itemName: string;
  quantity: number;
  cost: number;
  note: string;
  date: string;
}

export interface Payment {
  id: number;
  customerName: string;
  amount: number;
  date: string;
  note?: string;
}

export interface SupplierDebt {
  id: number;
  supplierName: string;
  amount: number;
  date: string;
  note?: string;
}

export interface SupplierPayment {
  id: number;
  supplierName: string;
  amount: number;
  date: string;
  note?: string;
}

export interface Supply {
  id: number;
  name: string;
  quantity: number;
  date: string;
  destination: 'factory' | 'shop' | 'livestock';
  source: 'market' | 'company' | 'driver' | 'taxi';
  cost?: number;
}

export interface VisualInvoiceSection {
  id: string;
  type: 'header' | 'customer' | 'items' | 'totals' | 'footer' | 'text' | 'image';
  isVisible: boolean;
  styles: {
    fontSize?: string;
    fontWeight?: string;
    textAlign?: 'right' | 'left' | 'center';
    backgroundColor?: string;
    color?: string;
    padding?: string;
    borderBottom?: string;
  };
  content?: {
    title?: string;
    subtitle?: string;
    logoUrl?: string;
    labels?: Record<string, string>;
  };
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  content: string;
  visualConfig?: VisualInvoiceSection[];
}

export interface CustomMenuSetting {
  id: string;
  label: string;
  isVisible: boolean;
  icon?: string;
  category?: string;
}

export interface CustomAction {
  id: string;
  label: string;
  type: 'navigate' | 'print' | 'save' | 'delete' | 'custom';
  target?: string;
  icon?: string;
}

export interface CustomSection {
  id: string;
  label: string;
  icon: string;
  category: string;
  isVisible: boolean;
  isCustom: boolean;
  fields: CustomField[];
  actions: CustomAction[];
  description?: string;
}

export interface CustomField {
  id: string;
  entity: 'product' | 'sale' | 'customer' | 'supplier';
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: string[]; // For select type
  isVisible: boolean;
  required: boolean;
}

export interface Settings {
  storeName: string;
  currency: string;
  theme: 'light' | 'dark' | 'system';
  language: 'ku' | 'ar' | 'en';
  invoiceTemplate?: string; // Legacy
  invoiceTemplates?: InvoiceTemplate[];
  activeInvoiceTemplateId?: string;
  menuSettings?: CustomMenuSetting[];
  customFields?: CustomField[];
  customSections?: CustomSection[];
}

export interface Supplier {
  id: number;
  name: string;
  phone: string;
  address: string;
  paymentTerms: string;
}

export interface ReturnItem {
  productId: number;
  itemName: string;
  quantity: number;
  refundAmount: number;
}

export interface Return {
  id: number;
  receiptId: string;
  customerName: string;
  date: string;
  items: ReturnItem[];
  totalRefund: number;
  reason: string;
}

export interface Shift {
  id: number;
  employeeId: number;
  startTime: string;
  endTime?: string;
  openingCash: number;
  closingCash?: number;
  expectedCash?: number;
  status: 'open' | 'closed';
  cashierName: string;
}

export interface Employee {
  id: number;
  name: string;
  role: 'admin' | 'manager' | 'cashier' | 'accountant';
  phone: string;
  salary: number;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface SalaryPayment {
  id: number;
  employeeId: number;
  employeeName: string;
  amount: number;
  date: string;
  month: string;
  notes?: string;
}

export interface PurchaseOrderItem {
  productId: number;
  itemName: string;
  quantity: number;
  unitCost: number;
  total: number;
}

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  supplierName: string;
  date: string;
  expectedDate?: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: 'pending' | 'received' | 'cancelled';
  notes?: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  address?: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  debt: number;
  creditLimit?: number;
}

export interface FeedLog {
  id: number;
  animalId: number;
  date: string;
  feedType: string;
  amount: number; // kg
  cost: number;
}

export interface VaccinationLog {
  id: number;
  animalId: number;
  date: string;
  vaccineName: string;
  nextDueDate?: string;
  notes?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: number; // employeeId
  dueDate: string;
  status: 'todo' | 'in-progress' | 'done';
}

export interface Asset {
  id: number;
  name: string;
  category: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  status: 'active' | 'maintenance' | 'disposed';
}

export interface RecipeItem {
  productId: number;
  itemName: string;
  quantity: number;
}

export interface Recipe {
  id: number;
  finishedProductId: number;
  name: string;
  items: RecipeItem[];
}

export interface ProductionOrder {
  id: number;
  recipeId: number;
  quantityProduced: number;
  date: string;
  status: 'pending' | 'completed';
  cost: number;
}

export interface Vehicle {
  id: number;
  name: string;
  plateNumber: string;
  driverId?: number;
  status: 'active' | 'maintenance' | 'inactive';
  mileage: number;
}

export interface Project {
  id: number;
  name: string;
  clientName: string;
  startDate: string;
  endDate?: string;
  budget: number;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  spent: number;
}

export interface Driver {
  id: number;
  name: string;
  phone: string;
  licenseNumber: string;
  status: 'active' | 'inactive';
  vehicleId?: number;
}

export interface SupportTicket {
  id: number;
  customerId?: number;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface Campaign {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  status: 'active' | 'completed' | 'paused';
  targetAudience: string;
}

export interface Animal {
  id: number;
  name: string;
  tagNumber: string;
  type: string;
  breed?: string;
  gender?: 'نێر' | 'مێ';
  birthDate: string;
  weight: number;
  status: 'تەندروست' | 'نەخۆش' | 'چارەسەر' | 'مردوو' | 'فرۆشراو';
  purchaseDate?: string;
  purchasePrice?: number;
  motherId?: string;
  fatherId?: string;
  caretakerId?: number;
  milkerId?: number;
  cleanerId?: number;
  deathDate?: string;
  deathReason?: string;
  saleDate?: string;
  salePrice?: number;
}

export interface MilkingRecord {
  id: number;
  animalId: number;
  amount: number; // liters
  date: string;
  shift: 'بەیانی' | 'ئێوارە';
  milkerId?: number;
}

export interface HealthRecord {
  id: number;
  animalId: number;
  diagnosis: string;
  treatment: string;
  date: string;
  status: 'تەندروست' | 'نەخۆش' | 'چارەسەر';
}

export interface DraftOrderItem {
  productId: number;
  itemName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface DraftOrder {
  id: number;
  driverName: string;
  customerName: string;
  items: DraftOrderItem[];
  totalAmount: number;
  date: string;
  status: 'pending' | 'converted';
  paymentMethod?: 'cash' | 'qist';
  paidAmount?: number;
}

export interface UserPermissions {
  canEditPrice: boolean;
  canDeleteSale: boolean;
  canGiveDiscount: boolean;
  canViewProfit: boolean;
  canManageUsers: boolean;
}

export interface User {
  id: number;
  name: string;
  code: string;
  role: 'admin' | 'accountant' | 'driver' | 'shop' | 'factory' | 'livestock';
  allowedSections: string[];
  email?: string;
  permissions?: UserPermissions;
}

export interface Warehouse {
  id: number;
  name: string;
  location: string;
}

export interface ShopRequestItem {
  productId: number;
  itemName: string;
  quantity: number;
}

export interface ShopRequest {
  id: number;
  shopName: string;
  items: ShopRequestItem[];
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Alert {
  id: number;
  type: 'low-stock' | 'debt-due' | 'expiry' | 'maintenance' | 'system';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  severity: 'info' | 'warning' | 'error';
  link?: string;
}

export interface RewardRedemption {
  id: number;
  customerId: number;
  pointsUsed: number;
  rewardDescription: string;
  date: string;
}

export interface Farmer {
  id: number;
  name: string;
  phone: string;
  address?: string;
  milkPrice: number;
}

export interface MilkCollection {
  id: number;
  farmerId: number;
  farmerName: string;
  quantity: number;
  pricePerLiter: number;
  totalPrice: number;
  date: string;
  status: 'collected' | 'delivered';
  note?: string;
}

export interface AuditLog {
  id: number;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string | number;
  details: string;
  date: string;
}

export interface ERPData {
  auditLogs?: AuditLog[];
  warehouses?: Warehouse[];
  users?: User[];
  shopRequests?: ShopRequest[];
  farmers?: Farmer[];
  milkCollections?: MilkCollection[];
  products: Product[];
  sales: Sale[];
  expenses: Expense[];
  waste: Waste[];
  payments: Payment[];
  supplierDebts: SupplierDebt[];
  supplierPayments: SupplierPayment[];
  supplies: Supply[];
  suppliers: Supplier[];
  categories: string[];
  returns: Return[];
  shifts: Shift[];
  employees?: Employee[];
  salaryPayments?: SalaryPayment[];
  purchaseOrders?: PurchaseOrder[];
  customers?: Customer[];
  tasks?: Task[];
  assets?: Asset[];
  recipes?: Recipe[];
  productionOrders?: ProductionOrder[];
  vehicles?: Vehicle[];
  projects?: Project[];
  drivers?: Driver[];
  tickets?: SupportTicket[];
  campaigns?: Campaign[];
  animals?: Animal[];
  milkingRecords?: MilkingRecord[];
  healthRecords?: HealthRecord[];
  feedLogs?: FeedLog[];
  vaccinationLogs?: VaccinationLog[];
  draftOrders?: DraftOrder[];
  alerts?: Alert[];
  rewardRedemptions?: RewardRedemption[];
  settings: Settings;
}
