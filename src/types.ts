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
}

export interface Sale {
  id: number;
  receiptId?: string; // To group items in one receipt
  customerName: string;
  driverName?: string; // Added driverName
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

export interface Settings {
  storeName: string;
  currency: string;
  theme: 'light' | 'dark' | 'system';
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
  status: 'تەندروست' | 'نەخۆش' | 'چارەسەر';
  purchaseDate?: string;
  purchasePrice?: number;
  motherId?: string;
  fatherId?: string;
  caretakerId?: number;
  milkerId?: number;
  cleanerId?: number;
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

export interface User {
  id: number;
  name: string;
  code: string;
  role: 'admin' | 'accountant' | 'driver' | 'shop' | 'factory' | 'livestock';
  allowedSections: string[];
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

export interface ERPData {
  users?: User[];
  shopRequests?: ShopRequest[];
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
  settings: Settings;
}
