import { Category, Product, User, Order, Expense } from '../types';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'وجبات رئيسية', icon: 'Utensils' },
  { id: 'cat2', name: 'مشروبات', icon: 'Coffee' },
  { id: 'cat3', name: 'مقبلات', icon: 'Salad' },
  { id: 'cat4', name: 'حلويات', icon: 'IceCream' },
  { id: 'cat5', name: 'إضافات', icon: 'PlusCircle' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'كشري مصري مخصوص',
    nameEn: 'Special Egyptian Koshary',
    price: 45,
    categoryId: 'cat1',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    description: 'طبق كشري مصري أصيل مع الصلصة والدقة',
  },
  {
    id: 'p2',
    name: 'شيش طاووق وجبة',
    nameEn: 'Shish Taouk Meal',
    price: 120,
    categoryId: 'cat1',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p3',
    name: 'كوكاكولا',
    nameEn: 'Coca Cola',
    price: 15,
    categoryId: 'cat2',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p4',
    name: 'عصير مانجو فريش',
    nameEn: 'Fresh Mango Juice',
    price: 35,
    categoryId: 'cat2',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p5',
    name: 'سلطة خضراء',
    nameEn: 'Green Salad',
    price: 20,
    categoryId: 'cat3',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p6',
    name: 'شوربة عدس',
    nameEn: 'Lentil Soup',
    price: 30,
    categoryId: 'cat3',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p7',
    name: 'أم علي',
    nameEn: 'Om Ali',
    price: 55,
    categoryId: 'cat4',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p8',
    name: 'أرز بلبن',
    nameEn: 'Rice Pudding',
    price: 25,
    categoryId: 'cat4',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p9',
    name: 'صوص ثومية إضافي',
    nameEn: 'Extra Garlic Sauce',
    price: 10,
    categoryId: 'cat5',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p10',
    name: 'خبز محمص',
    nameEn: 'Toasted Bread',
    price: 5,
    categoryId: 'cat5',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p11',
    name: 'فتة لحم',
    nameEn: 'Meat Fatta',
    price: 150,
    categoryId: 'cat1',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p12',
    name: 'مكرونة بشاميل',
    nameEn: 'Bechamel Pasta',
    price: 75,
    categoryId: 'cat1',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p13',
    name: 'حواوشي مخصوص',
    nameEn: 'Special Hawawshi',
    price: 60,
    categoryId: 'cat1',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p14',
    name: 'مياه معدنية',
    nameEn: 'Mineral Water',
    price: 10,
    categoryId: 'cat2',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p15',
    name: 'شاي أحمر',
    nameEn: 'Red Tea',
    price: 12,
    categoryId: 'cat2',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p16',
    name: 'كبة شامي (٣ قطع)',
    nameEn: 'Kibbeh (3 pcs)',
    price: 45,
    categoryId: 'cat3',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p17',
    name: 'ورق عنب',
    nameEn: 'Vine Leaves',
    price: 40,
    categoryId: 'cat3',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p18',
    name: 'بسبوسة بالمكسرات',
    nameEn: 'Basbousa with Nuts',
    price: 40,
    categoryId: 'cat4',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p19',
    name: 'كنافة بالكريمة',
    nameEn: 'Kunafa with Cream',
    price: 50,
    categoryId: 'cat4',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p20',
    name: 'بطاطس مقلية',
    nameEn: 'French Fries',
    price: 25,
    categoryId: 'cat5',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'أحمد (المالك)', pin: '0000', role: 'admin', isActive: true },
  { id: 'u2', name: 'سارة (المديرة)', pin: '1111', role: 'manager', isActive: true },
  { id: 'u3', name: 'محمد (كاشير)', pin: '2222', role: 'cashier', isActive: true },
  { id: 'u4', name: 'ليلى (كاشير)', pin: '3333', role: 'cashier', isActive: true },
];

// Helper to generate random orders for the last 30 days
const generateMockOrders = (): Order[] => {
  const orders: Order[] = [];
  const now = new Date();
  
  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(Math.floor(Math.random() * 12) + 11); // 11 AM to 11 PM
    
    const subtotal = Math.floor(Math.random() * 500) + 50;
    const discount = Math.random() > 0.8 ? 20 : 0;
    
    orders.push({
      id: `o${i}`,
      orderNumber: `ORD-${1000 + i}`,
      tableNumber: Math.floor(Math.random() * 20) + 1,
      cashierId: 'u3',
      cashierName: 'محمد (كاشير)',
      items: [
        { productId: 'p1', productName: 'كشري مصري مخصوص', quantity: 2, unitPrice: 45, total: 90 }
      ],
      subtotal,
      discount,
      discountType: 'fixed',
      total: subtotal - discount,
      paymentMethod: ['cash', 'card', 'wallet'][Math.floor(Math.random() * 3)] as any,
      status: 'completed',
      createdAt: date.toISOString(),
      completedAt: date.toISOString(),
    });
  }
  return orders;
};

export const MOCK_ORDERS = generateMockOrders();

export const MOCK_EXPENSES: Expense[] = [
  { id: 'e1', name: 'إيجار المحل - مارس', amount: 5000, category: 'rent', date: '2026-03-01T10:00:00Z', createdBy: 'u1' },
  { id: 'e2', name: 'فاتورة الكهرباء', amount: 1200, category: 'other', date: '2026-03-05T10:00:00Z', createdBy: 'u1' },
  { id: 'e3', name: 'خضروات ولحوم أسبوعية', amount: 3500, category: 'ingredients', date: '2026-03-10T10:00:00Z', createdBy: 'u2' },
  { id: 'e4', name: 'رواتب الموظفين', amount: 8000, category: 'salaries', date: '2026-03-15T10:00:00Z', createdBy: 'u1' },
  { id: 'e5', name: 'صيانة ماكينة القهوة', amount: 450, category: 'maintenance', date: '2026-03-18T10:00:00Z', createdBy: 'u2' },
];
