import { Category, Product, User, Order, Expense } from '../types';

/**
 * Mock categories for the POS system
 */
export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'وجبات رئيسية', icon: 'Utensils' },
  { id: 'cat2', name: 'مشروبات', icon: 'Coffee' },
  { id: 'cat3', name: 'مقبلات', icon: 'Salad' },
  { id: 'cat4', name: 'حلويات', icon: 'IceCream' },
  { id: 'cat5', name: 'إضافات', icon: 'PlusCircle' },
];

/**
 * Mock products for the POS system (20+ products)
 */
export const MOCK_PRODUCTS: Product[] = [
  // ✅ LOGIC FIX: 20+ products across 5 categories
  { id: 'p1', name: 'كشري مصري مخصوص', nameEn: 'Special Egyptian Koshary', price: 45, categoryId: 'cat1', isAvailable: true, createdAt: new Date(), description: 'طبق كشري مصري أصيل مع الصلصة والدقة' },
  { id: 'p2', name: 'شيش طاووق وجبة', nameEn: 'Shish Taouk Meal', price: 120, categoryId: 'cat1', isAvailable: true, createdAt: new Date() },
  { id: 'p3', name: 'كوكاكولا', nameEn: 'Coca Cola', price: 15, categoryId: 'cat2', isAvailable: true, createdAt: new Date() },
  { id: 'p4', name: 'عصير مانجو فريش', nameEn: 'Fresh Mango Juice', price: 35, categoryId: 'cat2', isAvailable: true, createdAt: new Date() },
  { id: 'p5', name: 'سلطة خضراء', nameEn: 'Green Salad', price: 20, categoryId: 'cat3', isAvailable: true, createdAt: new Date() },
  { id: 'p6', name: 'شوربة عدس', nameEn: 'Lentil Soup', price: 30, categoryId: 'cat3', isAvailable: true, createdAt: new Date() },
  { id: 'p7', name: 'أم علي', nameEn: 'Om Ali', price: 55, categoryId: 'cat4', isAvailable: true, createdAt: new Date() },
  { id: 'p8', name: 'أرز بلبن', nameEn: 'Rice Pudding', price: 25, categoryId: 'cat4', isAvailable: true, createdAt: new Date() },
  { id: 'p9', name: 'صوص ثومية إضافي', nameEn: 'Extra Garlic Sauce', price: 10, categoryId: 'cat5', isAvailable: true, createdAt: new Date() },
  { id: 'p10', name: 'خبز محمص', nameEn: 'Toasted Bread', price: 5, categoryId: 'cat5', isAvailable: true, createdAt: new Date() },
  { id: 'p11', name: 'فتة لحم', nameEn: 'Meat Fatta', price: 150, categoryId: 'cat1', isAvailable: true, createdAt: new Date() },
  { id: 'p12', name: 'مكرونة بشاميل', nameEn: 'Bechamel Pasta', price: 75, categoryId: 'cat1', isAvailable: true, createdAt: new Date() },
  { id: 'p13', name: 'حواوشي مخصوص', nameEn: 'Special Hawawshi', price: 60, categoryId: 'cat1', isAvailable: true, createdAt: new Date() },
  { id: 'p14', name: 'مياه معدنية', nameEn: 'Mineral Water', price: 10, categoryId: 'cat2', isAvailable: true, createdAt: new Date() },
  { id: 'p15', name: 'شاي أحمر', nameEn: 'Red Tea', price: 12, categoryId: 'cat2', isAvailable: true, createdAt: new Date() },
  { id: 'p16', name: 'كبة شامي (٣ قطع)', nameEn: 'Kibbeh (3 pcs)', price: 45, categoryId: 'cat3', isAvailable: true, createdAt: new Date() },
  { id: 'p17', name: 'ورق عنب', nameEn: 'Vine Leaves', price: 40, categoryId: 'cat3', isAvailable: true, createdAt: new Date() },
  { id: 'p18', name: 'بسبوسة بالمكسرات', nameEn: 'Basbousa with Nuts', price: 40, categoryId: 'cat4', isAvailable: true, createdAt: new Date() },
  { id: 'p19', name: 'كنافة بالكريمة', nameEn: 'Kunafa with Cream', price: 50, categoryId: 'cat4', isAvailable: true, createdAt: new Date() },
  { id: 'p20', name: 'بطاطس مقلية', nameEn: 'French Fries', price: 25, categoryId: 'cat5', isAvailable: true, createdAt: new Date() },
  { id: 'p21', name: 'كفتة مشوية وجبة', nameEn: 'Grilled Kofta Meal', price: 110, categoryId: 'cat1', isAvailable: true, createdAt: new Date() },
  { id: 'p22', name: 'قهوة تركي', nameEn: 'Turkish Coffee', price: 20, categoryId: 'cat2', isAvailable: true, createdAt: new Date() },
  { id: 'p23', name: 'مخلل مشكل', nameEn: 'Mixed Pickles', price: 15, categoryId: 'cat3', isAvailable: true, createdAt: new Date() },
  { id: 'p24', name: 'رز بالخلطة', nameEn: 'Mixed Rice', price: 35, categoryId: 'cat5', isAvailable: true, createdAt: new Date() },
];

/**
 * Mock users for the POS system
 */
export const MOCK_USERS: User[] = [
  // ✅ LOGIC FIX: 4 users with specific roles and PINs
  { id: 'u1', name: 'أحمد (المالك)', pin: '0000', role: 'admin', isActive: true },
  { id: 'u2', name: 'سارة (المديرة)', pin: '1111', role: 'manager', isActive: true },
  { id: 'u3', name: 'محمد (كاشير)', pin: '2222', role: 'cashier', isActive: true },
  { id: 'u4', name: 'ليلى (كاشير)', pin: '3333', role: 'cashier', isActive: true },
];

/**
 * Generates mock orders for the last 30 days
 * @returns Array of mock orders
 */
const generateMockOrders = (): Order[] => {
  const orders: Order[] = [];
  const now = new Date();
  
  // ✅ LOGIC FIX: 50+ orders across last 30 days
  for (let i = 0; i < 60; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(Math.floor(Math.random() * 12) + 11); // 11 AM to 11 PM
    date.setMinutes(Math.floor(Math.random() * 60));
    
    const subtotal = Math.floor(Math.random() * 500) + 50;
    const discount = Math.random() > 0.8 ? 20 : 0;
    
    orders.push({
      id: `o${i}`,
      orderNumber: `${1000 + i}`, // Will be formatted by ordersStore
      tableNumber: Math.floor(Math.random() * 20) + 1,
      orderType: 'takeaway',
      deliveryFees: 0,
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
      createdAt: date, // ✅ LOGIC FIX: Proper Date objects
      completedAt: date,
    });
  }
  return orders;
};

export const MOCK_ORDERS = generateMockOrders();

/**
 * Mock expenses for the POS system
 */
export const MOCK_EXPENSES: Expense[] = [
  // ✅ LOGIC FIX: 15+ expenses across last 30 days
  { id: 'e1', name: 'إيجار المحل - مارس', amount: 5000, category: 'rent', date: new Date(2026, 2, 1), createdBy: 'u1' },
  { id: 'e2', name: 'فاتورة الكهرباء', amount: 1200, category: 'other', date: new Date(2026, 2, 5), createdBy: 'u1' },
  { id: 'e3', name: 'خضروات ولحوم أسبوعية', amount: 3500, category: 'ingredients', date: new Date(2026, 2, 10), createdBy: 'u2' },
  { id: 'e4', name: 'رواتب الموظفين', amount: 8000, category: 'salaries', date: new Date(2026, 2, 15), createdBy: 'u1' },
  { id: 'e5', name: 'صيانة ماكينة القهوة', amount: 450, category: 'maintenance', date: new Date(2026, 2, 18), createdBy: 'u2' },
  { id: 'e6', name: 'فاتورة مياه', amount: 300, category: 'other', date: new Date(2026, 2, 2), createdBy: 'u1' },
  { id: 'e7', name: 'منظفات للمحل', amount: 250, category: 'other', date: new Date(2026, 2, 7), createdBy: 'u2' },
  { id: 'e8', name: 'تجديد رخصة المحل', amount: 2000, category: 'other', date: new Date(2026, 2, 12), createdBy: 'u1' },
  { id: 'e9', name: 'خضروات طازجة', amount: 1500, category: 'ingredients', date: new Date(2026, 2, 17), createdBy: 'u2' },
  { id: 'e10', name: 'لحوم ودواجن', amount: 4000, category: 'ingredients', date: new Date(2026, 2, 20), createdBy: 'u1' },
  { id: 'e11', name: 'أدوات تغليف', amount: 600, category: 'other', date: new Date(2026, 2, 22), createdBy: 'u2' },
  { id: 'e12', name: 'صيانة تكييف', amount: 800, category: 'maintenance', date: new Date(2026, 2, 25), createdBy: 'u1' },
  { id: 'e13', name: 'زيوت وسمن', amount: 1200, category: 'ingredients', date: new Date(2026, 2, 28), createdBy: 'u2' },
  { id: 'e14', name: 'فاتورة إنترنت', amount: 400, category: 'other', date: new Date(2026, 2, 3), createdBy: 'u1' },
  { id: 'e15', name: 'أدوات نظافة', amount: 150, category: 'other', date: new Date(2026, 2, 8), createdBy: 'u2' },
];
