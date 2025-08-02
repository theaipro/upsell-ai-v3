// Centralized demo data hub to ensure consistency across all components and match Supabase schema

export interface Customer {
  id: string
  company_id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip_code: string
  status: "active" | "inactive" | "vip"
  join_date: Date
  last_order_date?: Date
  total_orders: number
  total_spent: number
  average_order_value: number
  notes: string
  tags: string[]
  avatar?: string
  preferences?: {
    dietary_restrictions: string[]
    preferred_contact_method: "email" | "sms" | "phone" | "app"
    delivery_instructions: string
  }
  loyalty_points?: number
  loyalty_tier?: "bronze" | "silver" | "gold" | "platinum"
  birthday?: Date
  referral_source?: string
  marketing_consent?: boolean
  sms_consent?: boolean
  analysis?: {
    ltv: number
    predicted_clv: number
    churn_risk: number
    avg_days_between_orders: number
    favorite_items: string[]
    favorite_categories: string[]
    most_active_day: string
    most_active_time: string
  }
}

export interface OrderStatus {
  id: string
  company_id: string
  name: string
  color: string
  step: number
  level: number
  icon: string
  allowed_transitions: string[]
  is_default: boolean
  is_active: boolean
}

export interface OrderItem {
  id: string
  order_id: string
  product_id?: string
  name: string
  description?: string
  quantity: number
  unit_price: number
  total_price: number
  notes?: string
  customizations?: Record<string, any>
}

export interface Order {
  id: string
  company_id: string
  customer_id: string
  order_number: string
  status: string
  order_type: "delivery" | "pickup" | "dine_in"
  customer_name: string
  customer_email?: string
  customer_phone: string
  delivery_address: string
  delivery_instructions?: string
  items: OrderItem[]
  subtotal: number
  tax_amount: number
  tip_amount: number
  discount_amount: number
  total_amount: number
  payment_method?: string
  payment_status: "pending" | "paid" | "failed" | "refunded"
  payment_intent_id?: string
  assigned_to?: string
  special_instructions?: string
  notes?: string
  tags: string[]
  estimated_prep_time?: number
  estimated_delivery_time?: Date
  completed_at?: Date
  created_at: Date
}

export interface ProductCategory {
  id: string
  company_id: string
  name: string
  description?: string
  image_url?: string
  sort_order: number
  is_active: boolean
}

export interface Product {
  id: string
  company_id: string
  category_id: string
  name: string
  description?: string
  image_url?: string
  price: number
  cost?: number
  is_available: boolean
  is_featured: boolean
  track_inventory: boolean
  stock_quantity?: number
  low_stock_threshold?: number
  calories?: number
  allergens?: string[]
  dietary_tags?: string[]
  tags?: string[]
  ingredients?: string[]
  nutritionalInfo?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  customization_options?: Record<string, any>
  ai_upsell_items?: string[]
  ai_recommendation_score?: number
  total_orders: number
  total_revenue: number
  sort_order: number
  monthly_data: {
    revenue: { date: Date; value: number }[]
    orders: { date: Date; value: number }[]
  }
}

export interface AIConversation {
  id: string
  company_id: string
  customer_id: string
  order_id?: string
  channel: "web" | "phone" | "sms" | "whatsapp" | "facebook" | "instagram"
  customer_phone: string
  customer_email?: string
  customer_name: string
  status: "active" | "completed" | "escalated" | "abandoned"
  total_messages: number
  customer_satisfaction_score?: number
  ai_confidence_score?: number
  escalated_to_human?: boolean
  escalation_reason?: string
  outcome: "order_placed" | "no_order" | "escalated"
  order_value: number
  last_message: string
  tags: string[]
  started_at: Date
  ended_at?: Date
}

export interface AIMessage {
  id: string
  conversation_id: string
  sender_type: "customer" | "ai" | "human"
  sender_id?: string
  content: string
  message_type: "text" | "image" | "audio" | "file"
  ai_intent?: string
  ai_confidence?: number
  ai_entities?: Record<string, any>
  suggested_products?: string[]
  upsell_successful?: boolean
  created_at: Date
}

export interface AITool {
  id: string
  company_id: string
  name: string
  description: string
  category: "menu" | "inventory" | "customer" | "store" | "external"
  is_enabled: boolean
  is_connected: boolean
  connection_status: "connected" | "disconnected" | "error" | "pending"
  settings: Record<string, any>
  permissions: string[]
  last_sync?: Date
}

export interface AIBehaviorSetting {
  id: string
  company_id: string
  category: "personality" | "responses" | "upselling" | "advanced"
  name: string
  setting_key: string
  value: any
  setting_type: "string" | "number" | "boolean" | "select" | "slider"
  options?: any[]
  min_value?: number
  max_value?: number
  step_value?: number
}

export interface AITestScenario {
  id: string
  company_id: string
  name: string
  description: string
  category: "ordering" | "upselling" | "complaints" | "customization"
  test_messages: string[]
  expected_outcome: string
  last_run?: Date
  success_rate?: number
  total_runs: number
  successful_runs: number
}

export interface AIChannel {
  id: string
  company_id: string
  name: string
  channel_type: "whatsapp" | "facebook" | "instagram" | "web" | "sms" | "phone"
  is_enabled: boolean
  is_connected: boolean
  connection_status: "connected" | "disconnected" | "error" | "pending"
  settings: Record<string, any>
  total_conversations: number
  conversion_rate: number
  avg_response_time: number
  customer_satisfaction: number
  last_activity?: Date
}

export interface AIAnalyticsDaily {
  id: string
  company_id: string
  analytics_date: Date
  total_conversations: number
  completed_conversations: number
  abandoned_conversations: number
  escalated_conversations: number
  total_order_value: number
  orders_from_ai: number
  upsell_attempts: number
  successful_upsells: number
  upsell_revenue: number
  avg_response_time: number
  avg_confidence_score: number
  avg_customer_satisfaction: number
  channel_breakdown: Record<string, any>
}

export interface NotificationPreference {
  id: string
  user_id: string
  company_id: string
  email_new_orders: boolean
  email_order_updates: boolean
  sms_urgent_orders: boolean
  push_new_orders: boolean
  quiet_hours_enabled: boolean
  quiet_hours_start: string
  quiet_hours_end: string
}

export interface Notification {
  id: string
  company_id: string
  user_id: string
  title: string
  message: string
  type: "order" | "customer" | "system" | "ai" | "billing" | "staff"
  priority: "low" | "normal" | "high" | "urgent"
  order_id?: string
  customer_id?: string
  conversation_id?: string
  is_read: boolean
  read_at?: Date
  delivery_method: string[]
  delivered_at?: Date
  action_url?: string
  created_at: Date
}

export interface Staff {
  id: string
  company_id: string
  user_id: string
  name: string
  email: string
  phone: string
  role: "owner" | "manager" | "head_chef" | "chef" | "server" | "delivery" | "staff"
  permissions: {
    dashboard: boolean
    orders: boolean
    customers: boolean
    products: boolean
    settings: boolean
    aiManagement: boolean
    billing: boolean
  }
  invited_by?: string
  invited_at: Date
  joined_at?: Date
  status: "pending" | "active" | "inactive"
  last_active?: Date
}

export interface ApiKey {
  id: string
  company_id: string
  user_id: string
  name: string
  key_hash: string
  key_prefix: string
  scopes: string[]
  rate_limit_per_minute: number
  monthly_request_limit: number
  current_month_usage: number
  is_active: boolean
  last_used_at?: Date
  expires_at?: Date
}

export interface Subscription {
  id: string
  company_id: string
  plan_name: string
  plan_price: number
  billing_cycle: "monthly" | "yearly"
  status: "active" | "cancelled" | "past_due"
  stripe_subscription_id: string
  current_period_start: Date
  current_period_end: Date
  trial_end?: Date
}

export interface PaymentMethod {
  id: string
  company_id: string
  type: "card" | "bank_account"
  brand: string
  last_four: string
  exp_month: number
  exp_year: number
  is_default: boolean
}

export interface Invoice {
  id: string
  company_id: string
  subscription_id: string
  invoice_number: string
  amount: number
  status: "draft" | "open" | "paid" | "void"
  invoice_date: Date
  due_date: Date
  paid_at?: Date
}

// Renamed from Subscription to avoid conflict with billing subscriptions
export interface ProductSubscription {
  id: string
  name: string
  description: string
  price: number
  billingCycle: "weekly" | "monthly" | "quarterly" | "yearly"
  features: string[]
  popular: boolean
  active: boolean
  trialDays?: number
  setupFee?: number
  category: string
}

// Offer interface for products page
export interface Offer {
  id: string
  name: string
  description: string
  type: "discount" | "freeItem" | "freeDelivery" | "coupon" | "buyXGetY"
  value: string
  code?: string
  startDate: string
  endDate: string
  active: boolean
  appliesTo: "all" | "category" | "specific"
  appliesToValue?: string
  minOrderValue?: number
  buyProducts?: { productId: string; quantity: number }[]
  getProducts?: { productId: string; quantity: number }[]
  buyQuantity?: number
  getQuantity?: number
}

// Centralized product categories
export const demoProductCategories: ProductCategory[] = [
  {
    id: "cat_1",
    company_id: "comp_1",
    name: "Pizza",
    description: "Handcrafted pizzas with fresh ingredients",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "cat_2",
    company_id: "comp_1",
    name: "Salads",
    description: "Fresh and healthy salad options",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "cat_3",
    company_id: "comp_1",
    name: "Burgers",
    description: "Gourmet burgers with premium ingredients",
    sort_order: 3,
    is_active: true,
  },
  {
    id: "cat_4",
    company_id: "comp_1",
    name: "Pasta",
    description: "Traditional Italian pasta dishes",
    sort_order: 4,
    is_active: true,
  },
  {
    id: "cat_5",
    company_id: "comp_1",
    name: "Beverages",
    description: "Refreshing drinks and specialty coffees",
    sort_order: 5,
    is_active: true,
  },
  {
    id: "cat_6",
    company_id: "comp_1",
    name: "Desserts",
    description: "Sweet treats and desserts",
    sort_order: 6,
    is_active: true,
  },
  {
    id: "cat_7",
    company_id: "comp_1",
    name: "Main",
    description: "Main course dishes",
    sort_order: 7,
    is_active: true,
  },
  {
    id: "cat_8",
    company_id: "comp_1",
    name: "Side",
    description: "Side dishes",
    sort_order: 8,
    is_active: true,
  },
  {
    id: "cat_9",
    company_id: "comp_1",
    name: "Mexican",
    description: "Mexican cuisine",
    sort_order: 9,
    is_active: true,
  },
]

// Helper function to generate monthly data
const generateMonthlyData = (total_revenue: number, total_orders: number) => {
  const revenueData: { date: Date; value: number }[] = []
  const ordersData: { date: Date; value: number }[] = []
  const daysInMonth = 30
  const today = new Date()

  let remainingRevenue = total_revenue
  let remainingOrders = total_orders

  for (let i = 0; i < daysInMonth; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)

    const revenue = i === daysInMonth - 1 ? remainingRevenue : Math.random() * (remainingRevenue / (daysInMonth - i))
    const orders = i === daysInMonth - 1 ? remainingOrders : Math.floor(Math.random() * (remainingOrders / (daysInMonth - i)))

    revenueData.push({ date, value: revenue })
    ordersData.push({ date, value: orders })

    remainingRevenue -= revenue
    remainingOrders -= orders
  }

  return {
    revenue: revenueData.reverse(),
    orders: ordersData.reverse(),
  }
}

// Centralized products data matching Supabase schema
export const demoProducts: Product[] = [
  {
    id: "prod_1",
    company_id: "comp_1",
    category_id: "cat_1",
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 18.99,
    cost: 8.5,
    is_available: true,
    is_featured: true,
    track_inventory: false,
    allergens: ["Gluten", "Dairy"],
    dietary_tags: ["Vegetarian"],
    tags: ["classic", "popular"],
    ingredients: ["dough", "tomato sauce", "mozzarella", "basil"],
    nutritionalInfo: {},
    total_orders: 156,
    total_revenue: 2963.44,
    sort_order: 1,
    ai_upsell_items: ["prod_6", "prod_7"], // Cappuccino, Chocolate Brownie
    ai_recommendation_score: 0.95,
    monthly_data: generateMonthlyData(2963.44, 156),
  },
  {
    id: "prod_2",
    company_id: "comp_1",
    category_id: "cat_1",
    name: "Pepperoni Pizza",
    description: "Classic pepperoni pizza with mozzarella cheese",
    price: 20.99,
    cost: 9.25,
    is_available: true,
    is_featured: false,
    track_inventory: false,
    allergens: ["Gluten", "Dairy"],
    dietary_tags: [],
    tags: ["classic", "meat"],
    ingredients: ["dough", "tomato sauce", "mozzarella", "pepperoni"],
    nutritionalInfo: {},
    total_orders: 134,
    total_revenue: 2812.66,
    sort_order: 2,
    ai_upsell_items: ["prod_5", "prod_6"], // Beverages
    ai_recommendation_score: 0.88,
    monthly_data: generateMonthlyData(2812.66, 134),
  },
  {
    id: "prod_3",
    company_id: "comp_1",
    category_id: "cat_2",
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan",
    price: 12.99,
    cost: 5.75,
    is_available: true,
    is_featured: false,
    track_inventory: false,
    allergens: ["Dairy", "Eggs"],
    dietary_tags: ["Vegetarian"],
    tags: ["light", "healthy"],
    ingredients: ["romaine lettuce", "caesar dressing", "croutons", "parmesan"],
    nutritionalInfo: { calories: 320, protein: 10, carbs: 15, fat: 25 },
    total_orders: 89,
    total_revenue: 1156.11,
    sort_order: 1,
    ai_upsell_items: ["prod_4"], // Chicken Burger
    ai_recommendation_score: 0.75,
    monthly_data: generateMonthlyData(1156.11, 89),
  },
  {
    id: "prod_4",
    company_id: "comp_1",
    category_id: "cat_3",
    name: "Chicken Burger",
    description: "Grilled chicken breast with lettuce, tomato, and mayo",
    price: 15.5,
    cost: 7.25,
    is_available: true,
    is_featured: false,
    track_inventory: false,
    allergens: ["Gluten", "Eggs"],
    dietary_tags: [],
    tags: ["grilled", "sandwich"],
    ingredients: ["chicken breast", "bun", "lettuce", "tomato", "mayo"],
    nutritionalInfo: { calories: 650, protein: 40, carbs: 50, fat: 30 },
    total_orders: 98,
    total_revenue: 1519.0,
    sort_order: 1,
    ai_upsell_items: ["prod_6"], // Fries
    ai_recommendation_score: 0.82,
    monthly_data: generateMonthlyData(1519.0, 98),
  },
  {
    id: "prod_5",
    company_id: "comp_1",
    category_id: "cat_4",
    name: "Pasta Carbonara",
    description: "Traditional Italian pasta with eggs, cheese, and pancetta",
    price: 16.99,
    cost: 7.5,
    is_available: true,
    is_featured: false,
    track_inventory: false,
    allergens: ["Gluten", "Dairy", "Eggs"],
    dietary_tags: [],
    tags: ["italian", "creamy"],
    ingredients: ["pasta", "eggs", "pecorino cheese", "pancetta"],
    nutritionalInfo: { calories: 720, protein: 25, carbs: 80, fat: 35 },
    total_orders: 67,
    total_revenue: 1138.33,
    sort_order: 1,
    ai_upsell_items: ["prod_6", "prod_7"], // Garlic bread, wine
    ai_recommendation_score: 0.79,
    monthly_data: generateMonthlyData(1138.33, 67),
  },
  {
    id: "prod_6",
    company_id: "comp_1",
    category_id: "cat_5",
    name: "Cappuccino",
    description: "Espresso with steamed milk and foam",
    price: 4.5,
    cost: 1.25,
    is_available: true,
    is_featured: false,
    track_inventory: false,
    allergens: ["Dairy"],
    dietary_tags: ["Vegetarian"],
    tags: ["coffee", "hot"],
    ingredients: ["espresso", "steamed milk", "milk foam"],
    nutritionalInfo: { calories: 120, protein: 8, carbs: 12, fat: 4 },
    total_orders: 245,
    total_revenue: 1102.5,
    sort_order: 1,
    ai_upsell_items: ["prod_7"], // Desserts
    ai_recommendation_score: 0.92,
    monthly_data: generateMonthlyData(1102.5, 245),
  },
  {
    id: "prod_7",
    company_id: "comp_1",
    category_id: "cat_6",
    name: "Chocolate Brownie",
    description: "Rich chocolate brownie with walnuts",
    price: 5.99,
    cost: 2.25,
    is_available: true,
    is_featured: true,
    track_inventory: false,
    allergens: ["Gluten", "Dairy", "Nuts"],
    dietary_tags: ["Vegetarian"],
    tags: ["dessert", "chocolatey"],
    ingredients: ["chocolate", "flour", "sugar", "butter", "eggs", "walnuts"],
    nutritionalInfo: { calories: 450, protein: 5, carbs: 50, fat: 25 },
    total_orders: 78,
    total_revenue: 467.22,
    sort_order: 1,
    ai_upsell_items: ["prod_6"], // Coffee
    ai_recommendation_score: 0.85,
    monthly_data: generateMonthlyData(467.22, 78),
  },
  {
    id: "prod_8",
    company_id: "comp_1",
    category_id: "cat_7",
    name: "Fish & Chips",
    description: "Beer battered fish with crispy fries",
    price: 19.0,
    cost: 8.5,
    is_available: true,
    is_featured: false,
    track_inventory: false,
    allergens: ["Gluten", "Fish"],
    dietary_tags: [],
    tags: ["seafood", "fried"],
    ingredients: ["cod", "flour", "beer", "potatoes"],
    nutritionalInfo: { calories: 950, protein: 35, carbs: 100, fat: 45 },
    total_orders: 55,
    total_revenue: 1045.0,
    sort_order: 1,
    ai_upsell_items: ["prod_9"],
    ai_recommendation_score: 0.8,
    monthly_data: generateMonthlyData(1045.0, 55),
  },
  {
    id: "prod_9",
    company_id: "comp_1",
    category_id: "cat_8",
    name: "Coleslaw",
    description: "Fresh cabbage slaw",
    price: 4.5,
    cost: 1.5,
    is_available: true,
    is_featured: false,
    track_inventory: false,
    allergens: ["Eggs"],
    dietary_tags: ["Vegetarian"],
    tags: ["side", "fresh"],
    ingredients: ["cabbage", "carrots", "mayonnaise"],
    nutritionalInfo: { calories: 150, protein: 1, carbs: 10, fat: 12 },
    total_orders: 110,
    total_revenue: 495.0,
    sort_order: 1,
    ai_upsell_items: [],
    ai_recommendation_score: 0.7,
    monthly_data: generateMonthlyData(495.0, 110),
  },
  {
    id: "prod_10",
    company_id: "comp_1",
    category_id: "cat_7",
    name: "Sushi Platter",
    description: "Assorted fresh sushi rolls",
    price: 45.0,
    cost: 20.0,
    is_available: true,
    is_featured: true,
    track_inventory: false,
    allergens: ["Fish", "Soy"],
    dietary_tags: [],
    tags: ["japanese", "fresh", "seafood"],
    ingredients: ["rice", "nori", "tuna", "salmon", "avocado"],
    nutritionalInfo: { calories: 1200, protein: 50, carbs: 150, fat: 40 },
    total_orders: 30,
    total_revenue: 1350.0,
    sort_order: 2,
    ai_upsell_items: ["prod_6"],
    ai_recommendation_score: 0.85,
    monthly_data: generateMonthlyData(1350.0, 30),
  },
  {
    id: "prod_11",
    company_id: "comp_1",
    category_id: "cat_7",
    name: "Thai Curry",
    description: "Spicy Thai curry with vegetables",
    price: 22.0,
    cost: 10.0,
    is_available: true,
    is_featured: false,
    track_inventory: false,
    allergens: [],
    dietary_tags: ["Vegan", "Spicy"],
    tags: ["thai", "spicy", "vegan"],
    ingredients: ["coconut milk", "curry paste", "vegetables", "tofu"],
    nutritionalInfo: { calories: 800, protein: 20, carbs: 60, fat: 55 },
    total_orders: 40,
    total_revenue: 880.0,
    sort_order: 3,
    ai_upsell_items: ["prod_6"],
    ai_recommendation_score: 0.82,
    monthly_data: generateMonthlyData(880.0, 40),
  },
  {
    id: "prod_12",
    company_id: "comp_1",
    category_id: "cat_7",
    name: "Ribeye Steak",
    description: "Premium ribeye steak cooked to perfection",
    price: 32.0,
    cost: 15.0,
    is_available: true,
    is_featured: true,
    track_inventory: false,
    allergens: [],
    dietary_tags: [],
    tags: ["premium", "beef"],
    ingredients: ["ribeye steak", "salt", "pepper", "butter"],
    nutritionalInfo: { calories: 1100, protein: 70, carbs: 0, fat: 90 },
    total_orders: 25,
    total_revenue: 800.0,
    sort_order: 4,
    ai_upsell_items: ["prod_13"],
    ai_recommendation_score: 0.9,
    monthly_data: generateMonthlyData(800.0, 25),
  },
  {
    id: "prod_13",
    company_id: "comp_1",
    category_id: "cat_8",
    name: "Mashed Potatoes",
    description: "Creamy mashed potatoes",
    price: 8.0,
    cost: 3.0,
    is_available: true,
    is_featured: false,
    track_inventory: false,
    allergens: ["Dairy"],
    dietary_tags: ["Vegetarian"],
    tags: ["side", "comfort food"],
    ingredients: ["potatoes", "butter", "milk", "salt"],
    nutritionalInfo: { calories: 350, protein: 5, carbs: 40, fat: 20 },
    total_orders: 80,
    total_revenue: 640.0,
    sort_order: 2,
    ai_upsell_items: [],
    ai_recommendation_score: 0.75,
    monthly_data: generateMonthlyData(640.0, 80),
  },
  {
    id: "prod_14",
    company_id: "comp_1",
    category_id: "cat_9",
    name: "Chicken Tacos",
    description: "Grilled chicken tacos with fresh toppings",
    price: 4.0,
    cost: 1.8,
    is_available: true,
    is_featured: false,
    track_inventory: false,
    allergens: ["Gluten"],
    dietary_tags: [],
    tags: ["mexican", "street food"],
    ingredients: ["corn tortilla", "chicken", "salsa", "cilantro", "onion"],
    nutritionalInfo: { calories: 250, protein: 20, carbs: 25, fat: 10 },
    total_orders: 150,
    total_revenue: 600.0,
    sort_order: 1,
    ai_upsell_items: ["prod_15"],
    ai_recommendation_score: 0.88,
    monthly_data: generateMonthlyData(600.0, 150),
  },
  {
    id: "prod_15",
    company_id: "comp_1",
    category_id: "cat_8",
    name: "Guacamole",
    description: "Fresh avocado guacamole",
    price: 4.0,
    cost: 2.0,
    is_available: true,
    is_featured: false,
    track_inventory: false,
    allergens: [],
    dietary_tags: ["Vegan", "Vegetarian"],
    tags: ["mexican", "dip", "fresh"],
    ingredients: ["avocado", "lime", "onion", "cilantro", "jalapeno"],
    nutritionalInfo: { calories: 200, protein: 2, carbs: 10, fat: 18 },
    total_orders: 120,
    total_revenue: 480.0,
    sort_order: 3,
    ai_upsell_items: [],
    ai_recommendation_score: 0.85,
    monthly_data: generateMonthlyData(480.0, 120),
  },
]

// Demo product subscriptions for products page
export const demoProductSubscriptions: ProductSubscription[] = [
  {
    id: "sub_1",
    name: "Premium Coffee Club",
    description: "Monthly delivery of premium coffee beans from around the world",
    price: 29.99,
    billingCycle: "monthly",
    features: ["Premium beans", "Free shipping", "Tasting notes", "Exclusive blends"],
    popular: true,
    active: true,
    trialDays: 7,
    category: "Beverage",
  },
  {
    id: "sub_2",
    name: "Weekly Meal Plan",
    description: "Fresh ingredients and recipes delivered weekly",
    price: 89.99,
    billingCycle: "weekly",
    features: ["Fresh ingredients", "Recipe cards", "Nutritional info", "Dietary options"],
    popular: false,
    active: true,
    setupFee: 9.99,
    category: "Meal Kit",
  },
  {
    id: "sub_3",
    name: "VIP Dining Experience",
    description: "Quarterly exclusive dining events and priority reservations",
    price: 199.99,
    billingCycle: "quarterly",
    features: ["Exclusive events", "Priority booking", "Chef meet & greet", "Wine pairings"],
    popular: true,
    active: true,
    category: "Experience",
  },
]

// Demo offers for products page
export const demoOffers: Offer[] = [
  {
    id: "offer_1",
    name: "Summer Special",
    description: "20% off all orders over $30",
    type: "discount",
    value: "20",
    code: "SUMMER20",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    active: true,
    appliesTo: "all",
    minOrderValue: 30,
  },
  {
    id: "offer_2",
    name: "Free Delivery",
    description: "Free delivery on all orders over $25",
    type: "freeDelivery",
    value: "0",
    startDate: "2024-05-15",
    endDate: "2024-12-31",
    active: true,
    appliesTo: "all",
    minOrderValue: 25,
  },
  {
    id: "offer_3",
    name: "Buy 1 Get 1 Free",
    description: "Buy one pizza, get one free",
    type: "freeItem",
    value: "1",
    code: "BOGOF",
    startDate: "2024-07-01",
    endDate: "2024-07-31",
    active: false,
    appliesTo: "category",
    appliesToValue: "Pizza",
  },
]

// Centralized customers data matching Supabase schema
export const demoCustomers: Customer[] = [
  {
    id: "cust_1",
    company_id: "comp_1",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St",
    city: "Downtown",
    state: "NY",
    zip_code: "10001",
    status: "vip",
    join_date: new Date("2023-01-15"),
    last_order_date: new Date("2024-01-20"),
    total_orders: 47,
    total_spent: 1247.85,
    average_order_value: 26.55,
    notes: "Prefers extra cheese on pizzas. Always tips well.",
    tags: ["VIP", "Regular", "Pizza Lover"],
    loyalty_points: 2450,
    loyalty_tier: "gold",
    birthday: new Date("1985-06-15"),
    referral_source: "Google Ads",
    marketing_consent: true,
    sms_consent: true,
    preferences: {
      dietary_restrictions: ["Vegetarian"],
      preferred_contact_method: "email",
      delivery_instructions: "Ring doorbell twice, leave at door",
    },
    analysis: {
      ltv: 1247.85,
      predicted_clv: 2500,
      churn_risk: 0.1,
      avg_days_between_orders: 14,
      favorite_items: ["Margherita Pizza", "Caesar Salad"],
      favorite_categories: ["Pizza", "Salads"],
      most_active_day: "Friday",
      most_active_time: "Evening",
    },
  },
  {
    id: "cust_2",
    company_id: "comp_1",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1 (555) 234-5678",
    address: "456 Oak Ave",
    city: "Uptown",
    state: "NY",
    zip_code: "10002",
    status: "active",
    join_date: new Date("2023-03-22"),
    last_order_date: new Date("2024-01-18"),
    total_orders: 23,
    total_spent: 567.32,
    average_order_value: 24.67,
    notes: "Allergic to nuts. Prefers pickup orders.",
    tags: ["Regular", "Pickup", "Allergy"],
    loyalty_points: 1134,
    loyalty_tier: "silver",
    birthday: new Date("1990-09-22"),
    referral_source: "Friend Referral",
    marketing_consent: true,
    sms_consent: false,
    preferences: {
      dietary_restrictions: ["Nut Allergy"],
      preferred_contact_method: "sms",
      delivery_instructions: "Call upon arrival",
    },
  },
  {
    id: "cust_3",
    company_id: "comp_1",
    name: "Mike Johnson",
    email: "mike.johnson@email.com",
    phone: "+1 (555) 345-6789",
    address: "789 Pine St",
    city: "Midtown",
    state: "NY",
    zip_code: "10003",
    status: "active",
    join_date: new Date("2023-07-10"),
    last_order_date: new Date("2024-01-19"),
    total_orders: 15,
    total_spent: 342.18,
    average_order_value: 22.81,
    notes: "Usually orders late at night. Works night shifts.",
    tags: ["Night Owl", "Pasta Lover"],
    loyalty_points: 684,
    loyalty_tier: "bronze",
    birthday: new Date("1988-12-03"),
    referral_source: "Social Media",
    marketing_consent: false,
    sms_consent: false,
    preferences: {
      dietary_restrictions: [],
      preferred_contact_method: "app",
      delivery_instructions: "Leave at door, don't ring bell",
    },
  },
  {
    id: "cust_4",
    company_id: "comp_1",
    name: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    phone: "+1 (555) 456-7890",
    address: "321 Elm St",
    city: "Southside",
    state: "NY",
    zip_code: "10004",
    status: "vip",
    join_date: new Date("2022-11-05"),
    last_order_date: new Date("2024-01-21"),
    total_orders: 89,
    total_spent: 2156.74,
    average_order_value: 24.23,
    notes: "Long-time customer. Celebrates special occasions here.",
    tags: ["VIP", "Loyal", "Special Occasions"],
    loyalty_points: 4313,
    loyalty_tier: "platinum",
    birthday: new Date("1982-04-18"),
    referral_source: "Walk-in",
    marketing_consent: true,
    sms_consent: true,
    preferences: {
      dietary_restrictions: ["Gluten-Free Options"],
      preferred_contact_method: "phone",
      delivery_instructions: "Hand to customer only",
    },
  },
  {
    id: "cust_5",
    company_id: "comp_1",
    name: "Alex Brown",
    email: "alex.brown@email.com",
    phone: "+1 (555) 567-8901",
    address: "654 Maple Dr",
    city: "Westside",
    state: "NY",
    zip_code: "10005",
    status: "inactive",
    join_date: new Date("2023-05-18"),
    last_order_date: new Date("2023-12-15"),
    total_orders: 8,
    total_spent: 187.45,
    average_order_value: 23.43,
    notes: "Moved to different area. Might return.",
    tags: ["Inactive", "Moved"],
    loyalty_points: 375,
    loyalty_tier: "bronze",
    birthday: new Date("1995-08-27"),
    referral_source: "Online Search",
    marketing_consent: false,
    sms_consent: false,
    preferences: {
      dietary_restrictions: ["Pescatarian"],
      preferred_contact_method: "email",
      delivery_instructions: "Buzz apartment 4B",
    },
  },
  {
    id: "cust_6",
    company_id: "comp_1",
    name: "Emma Davis",
    email: "emma.davis@email.com",
    phone: "+1 (555) 678-9012",
    address: "987 Cedar Ln",
    city: "Eastside",
    state: "NY",
    zip_code: "10006",
    status: "active",
    join_date: new Date("2023-09-14"),
    last_order_date: new Date("2024-01-19"),
    total_orders: 19,
    total_spent: 456.78,
    average_order_value: 24.04,
    notes: "Loves spicy food. Regular lunch customer.",
    tags: ["Spicy", "Lunch Regular"],
    loyalty_points: 913,
    loyalty_tier: "silver",
    birthday: new Date("1992-11-08"),
    referral_source: "Yelp",
    marketing_consent: true,
    sms_consent: true,
    preferences: {
      dietary_restrictions: ["Vegan"],
      preferred_contact_method: "app",
      delivery_instructions: "Leave with concierge",
    },
  },
  {
    id: "cust_7",
    company_id: "comp_1",
    name: "David Lee",
    email: "david.lee@email.com",
    phone: "+1 (555) 789-0123",
    address: "246 Birch St",
    city: "Northside",
    state: "NY",
    zip_code: "10007",
    status: "vip",
    join_date: new Date("2022-08-30"),
    last_order_date: new Date("2024-01-21"),
    total_orders: 67,
    total_spent: 1789.23,
    average_order_value: 26.71,
    notes: "Business dinners. Prefers premium options.",
    tags: ["VIP", "Business", "Premium"],
    loyalty_points: 3578,
    loyalty_tier: "gold",
    birthday: new Date("1978-03-25"),
    referral_source: "Business Partner",
    marketing_consent: true,
    sms_consent: false,
    preferences: {
      dietary_restrictions: [],
      preferred_contact_method: "phone",
      delivery_instructions: "Call 15 minutes before arrival",
    },
  },
  {
    id: "cust_8",
    company_id: "comp_1",
    name: "Lisa Garcia",
    email: "lisa.garcia@email.com",
    phone: "+1 (555) 890-1234",
    address: "135 Willow Ave",
    city: "Westside",
    state: "NY",
    zip_code: "10008",
    status: "active",
    join_date: new Date("2023-12-01"),
    last_order_date: new Date("2024-01-20"),
    total_orders: 11,
    total_spent: 267.89,
    average_order_value: 24.35,
    notes: "New customer. Family orders on weekends.",
    tags: ["New", "Family", "Weekend"],
    loyalty_points: 536,
    loyalty_tier: "bronze",
    birthday: new Date("1987-07-12"),
    referral_source: "Instagram",
    marketing_consent: true,
    sms_consent: true,
    preferences: {
      dietary_restrictions: ["Lactose Intolerant"],
      preferred_contact_method: "sms",
      delivery_instructions: "Ring doorbell once",
    },
  },
  {
    id: "cust_9",
    company_id: "comp_1",
    name: "Robert Taylor",
    email: "robert.taylor@email.com",
    phone: "+1 (555) 901-2345",
    address: "468 Oak Ridge Dr",
    city: "Southside",
    state: "NY",
    zip_code: "10009",
    status: "active",
    join_date: new Date("2023-06-20"),
    last_order_date: new Date("2024-01-19"),
    total_orders: 25,
    total_spent: 623.45,
    average_order_value: 24.94,
    notes: "Loves BBQ. Orders for office parties.",
    tags: ["BBQ Lover", "Office Orders"],
    loyalty_points: 1247,
    loyalty_tier: "silver",
    birthday: new Date("1980-10-14"),
    referral_source: "Coworker",
    marketing_consent: true,
    sms_consent: false,
    preferences: {
      dietary_restrictions: [],
      preferred_contact_method: "email",
      delivery_instructions: "Deliver to reception desk",
    },
  },
  {
    id: "cust_10",
    company_id: "comp_1",
    name: "Maria Rodriguez",
    email: "maria.rodriguez@email.com",
    phone: "+1 (555) 012-3456",
    address: "789 Sunset Blvd",
    city: "Westside",
    state: "NY",
    zip_code: "10010",
    status: "vip",
    join_date: new Date("2022-04-12"),
    last_order_date: new Date("2024-01-21"),
    total_orders: 78,
    total_spent: 1956.32,
    average_order_value: 25.08,
    notes: "Celebrates birthdays and anniversaries here. Loves Spanish cuisine.",
    tags: ["VIP", "Spanish Food", "Celebrations"],
    loyalty_points: 3912,
    loyalty_tier: "platinum",
    birthday: new Date("1975-02-28"),
    referral_source: "Yelp",
    marketing_consent: true,
    sms_consent: true,
    preferences: {
      dietary_restrictions: ["Shellfish Allergy"],
      preferred_contact_method: "phone",
      delivery_instructions: "Call when arriving",
    },
    analysis: {
      ltv: 1956.32,
      predicted_clv: 4000,
      churn_risk: 0.05,
      avg_days_between_orders: 10,
      favorite_items: ["Paella", "Sangria"],
      favorite_categories: ["Main", "Beverages"],
      most_active_day: "Saturday",
      most_active_time: "Dinner",
    },
  },
]

// Centralized orders data
export const demoOrders: Order[] = [
  {
    id: "order_1001",
    company_id: "comp_1",
    order_number: "ORD-1001",
    customer_id: "cust_1",
    customer_name: "John Doe",
    customer_email: "john.doe@email.com",
    customer_phone: "+1 (555) 123-4567",
    delivery_address: "123 Main St, Downtown, NY 10001",
    delivery_instructions: "Ring doorbell twice, leave at door",
    items: [
      {
        id: "item_1",
        order_id: "order_1001",
        name: "Margherita Pizza",
        description: "Classic pizza with tomato sauce, mozzarella, and basil",
        quantity: 1,
        unit_price: 18.99,
        total_price: 18.99,
        notes: "Extra cheese",
        product_id: "prod_1",
      },
      {
        id: "item_2",
        order_id: "order_1001",
        name: "Caesar Salad",
        description: "Fresh romaine lettuce with Caesar dressing",
        quantity: 1,
        unit_price: 12.99,
        total_price: 12.99,
        product_id: "prod_3",
      },
    ],
    subtotal: 31.98,
    tax_amount: 2.88,
    tip_amount: 5.0,
    discount_amount: 0,
    total_amount: 39.86,
    status: "new",
    created_at: new Date(Date.now() - 2 * 60 * 1000),
    order_type: "delivery",
    tags: ["VIP", "Delivery"],
    notes: "Ring doorbell twice",
    estimated_prep_time: 25,
    payment_method: "Credit Card",
    payment_status: "paid",
  },
  {
    id: "order_1002",
    company_id: "comp_1",
    order_number: "ORD-1002",
    customer_id: "cust_2",
    customer_name: "Jane Smith",
    customer_email: "jane.smith@email.com",
    customer_phone: "+1 (555) 234-5678",
    delivery_address: "456 Oak Ave, Uptown, NY 10002",
    delivery_instructions: "Call upon arrival",
    items: [
      {
        id: "item_3",
        order_id: "order_1002",
        name: "Chicken Burger",
        description: "Grilled chicken breast with lettuce and tomato",
        quantity: 2,
        unit_price: 15.5,
        total_price: 31.0,
        notes: "No pickles",
        product_id: "prod_4",
      },
    ],
    subtotal: 31.0,
    tax_amount: 2.79,
    tip_amount: 4.0,
    discount_amount: 0,
    total_amount: 37.79,
    status: "preparing",
    created_at: new Date(Date.now() - 5 * 60 * 1000),
    order_type: "pickup",
    tags: ["Pickup", "Regular"],
    notes: "Customer will arrive at 7 PM",
    estimated_prep_time: 15,
    payment_method: "Debit Card",
    payment_status: "paid",
  },
  {
    id: "order_1003",
    company_id: "comp_1",
    order_number: "ORD-1003",
    customer_id: "cust_3",
    customer_name: "Mike Johnson",
    customer_email: "mike.johnson@email.com",
    customer_phone: "+1 (555) 345-6789",
    delivery_address: "789 Pine St, Midtown, NY 10003",
    delivery_instructions: "Leave at door, don't ring bell",
    items: [
      {
        id: "item_4",
        order_id: "order_1003",
        name: "Pasta Carbonara",
        description: "Traditional Italian pasta with eggs and cheese",
        quantity: 1,
        unit_price: 16.99,
        total_price: 16.99,
        notes: "Extra parmesan",
        product_id: "prod_5",
      },
    ],
    subtotal: 16.99,
    tax_amount: 1.53,
    tip_amount: 3.0,
    discount_amount: 0,
    total_amount: 21.52,
    status: "preparing",
    created_at: new Date(Date.now() - 8 * 60 * 1000),
    order_type: "delivery",
    tags: ["Delivery", "Regular"],
    notes: "Leave at door",
    estimated_prep_time: 20,
    payment_method: "Digital Wallet",
    payment_status: "paid",
  },
  {
    id: "order_1004",
    company_id: "comp_1",
    order_number: "ORD-1004",
    customer_id: "cust_4",
    customer_name: "Sarah Wilson",
    customer_email: "sarah.wilson@email.com",
    customer_phone: "+1 (555) 456-7890",
    delivery_address: "321 Elm St, Southside, NY 10004",
    delivery_instructions: "Hand to customer only",
    items: [
      {
        id: "item_5",
        order_id: "order_1004",
        name: "Fish & Chips",
        description: "Beer battered fish with crispy fries",
        quantity: 1,
        unit_price: 19.0,
        total_price: 19.0,
        product_id: "prod_8",
      },
      {
        id: "item_6",
        order_id: "order_1004",
        name: "Coleslaw",
        description: "Fresh cabbage slaw",
        quantity: 1,
        unit_price: 4.5,
        total_price: 4.5,
        product_id: "prod_9",
      },
    ],
    subtotal: 23.5,
    tax_amount: 2.12,
    tip_amount: 4.0,
    discount_amount: 0,
    total_amount: 29.62,
    status: "delivered",
    created_at: new Date(Date.now() - 15 * 60 * 1000),
    order_type: "pickup",
    tags: ["VIP", "Pickup"],
    notes: "Frequent customer",
    completed_at: new Date("2024-01-21T14:45:00Z"),
    payment_method: "Credit Card",
    payment_status: "paid",
  },
  {
    id: "order_1005",
    company_id: "comp_1",
    order_number: "ORD-1005",
    customer_id: "cust_5",
    customer_name: "Alex Brown",
    customer_email: "alex.brown@email.com",
    customer_phone: "+1 (555) 567-8901",
    delivery_address: "654 Maple Dr, Westside, NY 10005",
    delivery_instructions: "Buzz apartment 4B",
    items: [
      {
        id: "item_7",
        order_id: "order_1005",
        name: "Sushi Platter",
        description: "Assorted fresh sushi rolls",
        quantity: 1,
        unit_price: 45.0,
        total_price: 45.0,
        product_id: "prod_10",
      },
    ],
    subtotal: 45.0,
    tax_amount: 4.05,
    tip_amount: 0,
    discount_amount: 0,
    total_amount: 49.05,
    status: "cancelled",
    created_at: new Date(Date.now() - 60 * 60 * 1000),
    order_type: "delivery",
    tags: ["Delivery", "Cancelled"],
    notes: "Customer cancelled due to delay",
    payment_method: "Credit Card",
    payment_status: "refunded",
  },
  {
    id: "order_1006",
    company_id: "comp_1",
    order_number: "ORD-1006",
    customer_id: "cust_6",
    customer_name: "Emma Davis",
    customer_email: "emma.davis@email.com",
    customer_phone: "+1 (555) 678-9012",
    delivery_address: "987 Cedar Ln, Eastside, NY 10006",
    delivery_instructions: "Leave with concierge",
    items: [
      {
        id: "item_8",
        order_id: "order_1006",
        name: "Thai Curry",
        description: "Spicy Thai curry with vegetables",
        quantity: 1,
        unit_price: 22.0,
        total_price: 22.0,
        notes: "Extra spicy",
        product_id: "prod_11",
      },
    ],
    subtotal: 22.0,
    tax_amount: 1.98,
    tip_amount: 3.5,
    discount_amount: 0,
    total_amount: 27.48,
    status: "ready",
    created_at: new Date(Date.now() - 10 * 60 * 1000),
    order_type: "delivery",
    tags: ["Spicy", "Delivery"],
    notes: "Loves spicy food",
    estimated_prep_time: 18,
    payment_method: "Digital Wallet",
    payment_status: "paid",
  },
  {
    id: "order_1007",
    company_id: "comp_1",
    order_number: "ORD-1007",
    customer_id: "cust_7",
    customer_name: "David Lee",
    customer_email: "david.lee@email.com",
    customer_phone: "+1 (555) 789-0123",
    delivery_address: "246 Birch St, Northside, NY 10007",
    delivery_instructions: "Call 15 minutes before arrival",
    items: [
      {
        id: "item_9",
        order_id: "order_1007",
        name: "Ribeye Steak",
        description: "Premium ribeye steak cooked to perfection",
        quantity: 1,
        unit_price: 32.0,
        total_price: 32.0,
        notes: "Medium rare",
        product_id: "prod_12",
      },
      {
        id: "item_10",
        order_id: "order_1007",
        name: "Mashed Potatoes",
        description: "Creamy mashed potatoes",
        quantity: 1,
        unit_price: 8.0,
        total_price: 8.0,
        product_id: "prod_13",
      },
    ],
    subtotal: 40.0,
    tax_amount: 3.6,
    tip_amount: 8.0,
    discount_amount: 0,
    total_amount: 51.6,
    status: "on-the-way",
    created_at: new Date(Date.now() - 20 * 60 * 1000),
    order_type: "delivery",
    tags: ["VIP", "Business"],
    notes: "Business dinner order",
    estimated_prep_time: 30,
    payment_method: "Corporate Card",
    payment_status: "paid",
  },
  {
    id: "order_1008",
    company_id: "comp_1",
    order_number: "ORD-1008",
    customer_id: "cust_8",
    customer_name: "Lisa Garcia",
    customer_email: "lisa.garcia@email.com",
    customer_phone: "+1 (555) 890-1234",
    delivery_address: "135 Willow Ave, Westside, NY 10008",
    delivery_instructions: "Ring doorbell once",
    items: [
      {
        id: "item_11",
        order_id: "order_1008",
        name: "Chicken Tacos",
        description: "Grilled chicken tacos with fresh toppings",
        quantity: 3,
        unit_price: 4.0,
        total_price: 12.0,
        product_id: "prod_14",
      },
      {
        id: "item_12",
        order_id: "order_1008",
        name: "Guacamole",
        description: "Fresh avocado guacamole",
        quantity: 1,
        unit_price: 4.0,
        total_price: 4.0,
        product_id: "prod_15",
      },
    ],
    subtotal: 16.0,
    tax_amount: 1.44,
    tip_amount: 2.5,
    discount_amount: 0,
    total_amount: 19.94,
    status: "new",
    created_at: new Date(Date.now() - 1 * 60 * 1000),
    order_type: "delivery",
    tags: ["Family", "Weekend"],
    notes: "Family order for weekend",
    estimated_prep_time: 20,
    payment_method: "Debit Card",
    payment_status: "paid",
  },
]

// AI Tools Demo Data
export const demoAITools: AITool[] = [
  {
    id: "tool_menu",
    company_id: "comp_1",
    name: "Menu Data",
    description: "Access to menu items, prices, and descriptions",
    category: "menu",
    is_enabled: true,
    is_connected: true,
    connection_status: "connected",
    last_sync: new Date("2024-01-21T15:30:00Z"),
    settings: {
      includeMenuItems: true,
      includePrices: true,
      includeAllergens: true,
      includeRecommendations: true,
    },
    permissions: ["read_menu", "suggest_items", "check_availability"],
  },
  {
    id: "tool_inventory",
    company_id: "comp_1",
    name: "Inventory & Availability",
    description: "Real-time inventory status and stock levels",
    category: "inventory",
    is_enabled: true,
    is_connected: true,
    connection_status: "connected",
    last_sync: new Date("2024-01-21T15:25:00Z"),
    settings: {
      realTimeSync: true,
      lowStockAlerts: true,
      syncInterval: 5, // minutes
    },
    permissions: ["read_inventory", "check_stock", "alert_low_stock"],
  },
  {
    id: "tool_customer",
    company_id: "comp_1",
    name: "Customer Data",
    description: "Customer profiles, order history, and preferences",
    category: "customer",
    is_enabled: true,
    is_connected: true,
    connection_status: "connected",
    last_sync: new Date("2024-01-21T15:20:00Z"),
    settings: {
      includeOrderHistory: true,
      includePreferences: true,
      includeLoyaltyPoints: true,
    },
    permissions: ["read_customers", "read_orders", "read_preferences"],
  },
  {
    id: "tool_store",
    company_id: "comp_1",
    name: "Store Information",
    description: "Operating hours, location, and store policies",
    category: "store",
    is_enabled: true,
    is_connected: true,
    connection_status: "connected",
    last_sync: new Date("2024-01-21T15:15:00Z"),
    settings: {
      includeHours: true,
      includeLocation: true,
      includeEvents: true,
    },
    permissions: ["read_store_info", "check_hours", "read_events"],
  },
  {
    id: "tool_payment",
    company_id: "comp_1",
    name: "Payment Processing",
    description: "Generate payment links and process transactions",
    category: "external",
    is_enabled: true,
    is_connected: true,
    connection_status: "connected",
    last_sync: new Date("2024-01-21T15:10:00Z"),
    settings: {
      provider: "stripe",
      generateLinks: true,
      processPayments: true,
    },
    permissions: ["create_payment_links", "process_payments"],
  },
  {
    id: "tool_weather",
    company_id: "comp_1",
    name: "Weather Data",
    description: "Local weather information for recommendations",
    category: "external",
    is_enabled: true,
    is_connected: true,
    connection_status: "connected",
    last_sync: new Date("2024-01-21T15:05:00Z"),
    settings: {
      provider: "openweather",
      includeTemperature: true,
      includeConditions: true,
    },
    permissions: ["read_weather"],
  },
]

export const demoAIBehaviorValues = {
  personality_type: "friendly",
  response_speed: 2,
  creativity_level: 7,
  enable_emojis: true,
  upsell_frequency: 5,
  context_memory: 20,
  enable_personalization: true,
  enable_small_talk: true,
  custom_personality_description: "",
}

export const demoUpsellingValues = {
  upsell_frequency: 5,
  after_item_selection: true,
  during_customization: true,
  before_checkout: true,
  based_on_order_value: false,
  complementary_items: true,
  size_upgrades: true,
  add_ons_extras: true,
  combo_deals: false,
}

export const demoAdvancedBehaviorValues = {
  context_memory: 20,
  max_response_length: "medium",
  fallback_behavior: "transfer",
  handle_complaints: true,
  process_refunds: false,
  collect_feedback: true,
  learning_mode: true,
}

// AI Test Scenarios Demo Data
export const demoAITestScenarios: AITestScenario[] = [
  {
    id: "scenario_new_customer",
    company_id: "comp_1",
    name: "New Customer Order",
    description: "Test basic ordering flow for first-time customer",
    category: "ordering",
    test_messages: [
      "Hi, I'd like to order a pizza",
      "What sizes do you have?",
      "I'll take a large margherita",
      "That's all, thanks",
    ],
    expected_outcome: "Order placed successfully with upsell attempt",
    last_run: new Date("2024-01-21T14:30:00Z"),
    success_rate: 92,
    total_runs: 100,
    successful_runs: 92,
  },
  {
    id: "scenario_upselling",
    company_id: "comp_1",
    name: "Upselling Test",
    description: "Test AI's ability to suggest additional items",
    category: "upselling",
    test_messages: ["I want a medium pepperoni pizza", "Just the pizza", "No thanks, just the pizza"],
    expected_outcome: "Polite upsell attempts without being pushy",
    last_run: new Date("2024-01-21T13:45:00Z"),
    success_rate: 78,
    total_runs: 50,
    successful_runs: 39,
  },
  {
    id: "scenario_customization",
    company_id: "comp_1",
    name: "Complex Customization",
    description: "Test handling of detailed customization requests",
    category: "customization",
    test_messages: [
      "I want a large pizza with half pepperoni, half mushrooms",
      "Can you make the pepperoni side extra cheese?",
      "And light sauce on the mushroom side",
    ],
    expected_outcome: "Accurate order with all customizations captured",
    last_run: new Date("2024-01-21T12:15:00Z"),
    success_rate: 85,
    total_runs: 40,
    successful_runs: 34,
  },
  {
    id: "scenario_complaint",
    company_id: "comp_1",
    name: "Complaint Handling",
    description: "Test AI's response to customer complaints",
    category: "complaints",
    test_messages: ["My last order was cold when it arrived", "This is the second time this happened", "I want a refund"],
    expected_outcome: "Empathetic response with resolution offered",
    last_run: new Date("2024-01-21T11:30:00Z"),
    success_rate: 88,
    total_runs: 25,
    successful_runs: 22,
  },
]

// AI Channels Demo Data
export const demoAIChannels: AIChannel[] = [
  {
    id: "channel_whatsapp",
    company_id: "comp_1",
    name: "WhatsApp",
    channel_type: "whatsapp",
    is_enabled: true,
    is_connected: true,
    connection_status: "connected",
    settings: {
      phoneNumber: "+1234567890",
      businessAccountId: "123456789",
      webhookUrl: "https://api.restaurant.com/webhooks/whatsapp",
    },
    total_conversations: 156,
    conversion_rate: 73.2,
    avg_response_time: 1.2,
    customer_satisfaction: 4.6,
    last_activity: new Date("2024-01-21T15:30:00Z"),
  },
  {
    id: "channel_facebook",
    company_id: "comp_1",
    name: "Facebook Messenger",
    channel_type: "facebook",
    is_enabled: true,
    is_connected: true,
    connection_status: "connected",
    settings: {
      pageId: "987654321",
      appId: "123456789",
      webhookUrl: "https://api.restaurant.com/webhooks/facebook",
    },
    total_conversations: 89,
    conversion_rate: 68.5,
    avg_response_time: 1.8,
    customer_satisfaction: 4.4,
    last_activity: new Date("2024-01-21T15:25:00Z"),
  },
  {
    id: "channel_instagram",
    company_id: "comp_1",
    name: "Instagram DM",
    channel_type: "instagram",
    is_enabled: false,
    is_connected: false,
    connection_status: "disconnected",
    settings: {
      accountId: "",
      accessToken: "",
    },
    total_conversations: 0,
    conversion_rate: 0,
    avg_response_time: 0,
    customer_satisfaction: 0,
  },
  {
    id: "channel_web",
    company_id: "comp_1",
    name: "Web Widget",
    channel_type: "web",
    is_enabled: true,
    is_connected: true,
    connection_status: "connected",
    settings: {
      widgetColor: "#6366F1",
      position: "bottom-right",
      greeting: "Hi! How can I help you today?",
    },
    total_conversations: 234,
    conversion_rate: 81.2,
    avg_response_time: 0.8,
    customer_satisfaction: 4.7,
    last_activity: new Date("2024-01-21T15:32:00Z"),
  },
]

// AI Analytics Demo Data
export const demoAIAnalyticsData: AIAnalyticsDaily[] = [
  {
    id: "analytics_1",
    company_id: "comp_1",
    analytics_date: new Date("2024-01-15"),
    total_conversations: 45,
    completed_conversations: 38,
    abandoned_conversations: 7,
    escalated_conversations: 2,
    total_order_value: 1247.85,
    orders_from_ai: 35,
    upsell_attempts: 28,
    successful_upsells: 19,
    upsell_revenue: 250.5,
    avg_response_time: 1.2,
    avg_confidence_score: 0.91,
    avg_customer_satisfaction: 4.5,
    channel_breakdown: { web: 20, whatsapp: 25 },
  },
  {
    id: "analytics_2",
    company_id: "comp_1",
    analytics_date: new Date("2024-01-16"),
    total_conversations: 52,
    completed_conversations: 44,
    abandoned_conversations: 8,
    escalated_conversations: 1,
    total_order_value: 1389.42,
    orders_from_ai: 40,
    upsell_attempts: 32,
    successful_upsells: 23,
    upsell_revenue: 310.2,
    avg_response_time: 1.1,
    avg_confidence_score: 0.92,
    avg_customer_satisfaction: 4.6,
    channel_breakdown: { web: 25, whatsapp: 27 },
  },
]

// Centralized AI conversations data - all linked to real customers and orders
export const demoAIConversations: AIConversation[] = [
  {
    id: "conv_001",
    company_id: "comp_1",
    customer_id: "cust_1",
    order_id: "order_1001",
    customer_name: "John Doe",
    customer_phone: "+1 (555) 123-4567",
    customer_email: "john.doe@email.com",
    channel: "whatsapp",
    status: "completed",
    started_at: new Date("2024-01-15T14:30:00Z"),
    ended_at: new Date("2024-01-15T14:35:00Z"),
    total_messages: 12,
    outcome: "order_placed",
    order_value: 39.86,
    last_message: "Thank you! Your order will be ready in 25-30 minutes.",
    tags: ["upsell_success", "vip_customer"],
    customer_satisfaction_score: 5,
    ai_confidence_score: 0.95,
    escalated_to_human: false,
  },
  {
    id: "conv_002",
    company_id: "comp_1",
    customer_id: "cust_2",
    order_id: "order_1002",
    customer_name: "Jane Smith",
    customer_phone: "+1 (555) 234-5678",
    customer_email: "jane.smith@email.com",
    channel: "facebook",
    status: "completed",
    started_at: new Date("2024-01-15T13:45:00Z"),
    ended_at: new Date("2024-01-15T13:52:00Z"),
    total_messages: 18,
    outcome: "order_placed",
    order_value: 37.79,
    last_message: "Perfect! I'll have your order ready for pickup at 7 PM.",
    tags: ["returning_customer", "pickup_order"],
    customer_satisfaction_score: 4,
    ai_confidence_score: 0.88,
    escalated_to_human: false,
  },
  {
    id: "conv_003",
    company_id: "comp_1",
    customer_id: "cust_3",
    order_id: "order_1003",
    customer_name: "Mike Johnson",
    customer_phone: "+1 (555) 345-6789",
    customer_email: "mike.johnson@email.com",
    channel: "web",
    status: "completed",
    started_at: new Date("2024-01-15T12:20:00Z"),
    ended_at: new Date("2024-01-15T12:28:00Z"),
    total_messages: 8,
    outcome: "order_placed",
    order_value: 21.52,
    last_message: "Your pasta carbonara with extra parmesan is being prepared!",
    tags: ["night_shift_worker", "pasta_lover"],
    customer_satisfaction_score: 5,
    ai_confidence_score: 0.92,
    escalated_to_human: false,
  },
  {
    id: "conv_004",
    company_id: "comp_1",
    customer_id: "cust_5",
    customer_name: "Alex Brown",
    customer_phone: "+1 (555) 567-8901",
    customer_email: "alex.brown@email.com",
    channel: "web",
    status: "abandoned",
    started_at: new Date("2024-01-15T11:20:00Z"),
    total_messages: 3,
    outcome: "no_order",
    order_value: 0,
    last_message: "Let me check our sushi options for you...",
    tags: ["abandoned", "menu_inquiry"],
    ai_confidence_score: 0.65,
    escalated_to_human: false,
  },
  {
    id: "conv_005",
    company_id: "comp_1",
    customer_id: "cust_6",
    order_id: "order_1006",
    customer_name: "Emma Davis",
    customer_phone: "+1 (555) 678-9012",
    customer_email: "emma.davis@email.com",
    channel: "whatsapp",
    status: "completed",
    started_at: new Date("2024-01-15T10:15:00Z"),
    ended_at: new Date("2024-01-15T10:22:00Z"),
    total_messages: 14,
    outcome: "order_placed",
    order_value: 27.48,
    last_message: "Your extra spicy Thai curry is on the way!",
    tags: ["spicy_food_lover", "lunch_regular"],
    customer_satisfaction_score: 5,
    ai_confidence_score: 0.91,
    escalated_to_human: false,
  },
  {
    id: "conv_006",
    company_id: "comp_1",
    customer_id: "cust_7",
    order_id: "order_1007",
    customer_name: "David Lee",
    customer_phone: "+1 (555) 789-0123",
    customer_email: "david.lee@email.com",
    channel: "whatsapp",
    status: "completed",
    started_at: new Date("2024-01-15T09:30:00Z"),
    ended_at: new Date("2024-01-15T09:38:00Z"),
    total_messages: 16,
    outcome: "order_placed",
    order_value: 51.6,
    last_message: "Your business dinner order is being prepared with care.",
    tags: ["vip_customer", "business_order"],
    customer_satisfaction_score: 5,
    ai_confidence_score: 0.96,
    escalated_to_human: false,
  },
  {
    id: "conv_007",
    company_id: "comp_1",
    customer_id: "cust_8",
    order_id: "order_1008",
    customer_name: "Lisa Garcia",
    customer_phone: "+1 (555) 890-1234",
    customer_email: "lisa.garcia@email.com",
    channel: "facebook",
    status: "completed",
    started_at: new Date("2024-01-15T14:45:00Z"),
    ended_at: new Date("2024-01-15T14:50:00Z"),
    total_messages: 10,
    outcome: "order_placed",
    order_value: 19.94,
    last_message: "Great choice for a family weekend meal!",
    tags: ["family_order", "weekend_customer"],
    customer_satisfaction_score: 4,
    ai_confidence_score: 0.87,
    escalated_to_human: false,
  },
  {
    id: "conv_008",
    company_id: "comp_1",
    customer_id: "cust_9",
    customer_name: "Robert Taylor",
    customer_phone: "+1 (555) 901-2345",
    customer_email: "robert.taylor@email.com",
    channel: "instagram",
    status: "escalated",
    started_at: new Date("2024-01-15T16:00:00Z"),
    ended_at: new Date("2024-01-15T16:15:00Z"),
    total_messages: 22,
    outcome: "escalated",
    order_value: 0,
    last_message: "Let me connect you with a human agent to help resolve this issue.",
    tags: ["complaint", "escalated"],
    customer_satisfaction_score: 2,
    ai_confidence_score: 0.45,
    escalated_to_human: true,
    escalation_reason: "Complex complaint requiring human intervention",
  },
  {
    id: "conv_009",
    company_id: "comp_1",
    customer_id: "cust_10",
    customer_name: "Maria Rodriguez",
    customer_phone: "+1 (555) 012-3456",
    customer_email: "maria.rodriguez@email.com",
    channel: "web",
    status: "active",
    started_at: new Date("2024-01-21T15:30:00Z"),
    total_messages: 5,
    outcome: "no_order",
    order_value: 0,
    last_message: "I'm looking at our Spanish cuisine options for you...",
    tags: ["spanish_food", "active_conversation"],
    ai_confidence_score: 0.82,
    escalated_to_human: false,
  },
]

// Demo staff data matching Supabase schema
export const demoStaff: Staff[] = [
  {
    id: "staff_1",
    company_id: "comp_1",
    user_id: "user_1",
    name: "John Manager",
    email: "john.manager@restaurant.com",
    phone: "+1 (555) 123-4567",
    role: "manager",
    permissions: {
      dashboard: true,
      orders: true,
      customers: true,
      products: true,
      settings: true,
      aiManagement: true,
      billing: false,
    },
    status: "active",
    invited_at: new Date("2023-01-15T09:00:00Z"),
    joined_at: new Date("2023-01-15T09:00:00Z"),
    last_active: new Date("2024-01-21T15:30:00Z"),
  },
  {
    id: "staff_2",
    company_id: "comp_1",
    user_id: "user_2",
    name: "Sarah Chef",
    email: "sarah.chef@restaurant.com",
    phone: "+1 (555) 234-5678",
    role: "head_chef",
    permissions: {
      dashboard: true,
      orders: true,
      customers: false,
      products: true,
      settings: false,
      aiManagement: false,
      billing: false,
    },
    status: "active",
    invited_at: new Date("2023-02-01T08:00:00Z"),
    joined_at: new Date("2023-02-01T08:00:00Z"),
    last_active: new Date("2024-01-21T14:45:00Z"),
  },
  {
    id: "staff_3",
    company_id: "comp_1",
    user_id: "user_3",
    name: "Mike Server",
    email: "mike.server@restaurant.com",
    phone: "+1 (555) 345-6789",
    role: "server",
    permissions: {
      dashboard: true,
      orders: true,
      customers: true,
      products: false,
      settings: false,
      aiManagement: false,
      billing: false,
    },
    status: "active",
    invited_at: new Date("2023-03-15T10:00:00Z"),
    joined_at: new Date("2023-03-15T10:00:00Z"),
    last_active: new Date("2024-01-21T16:00:00Z"),
  },
]

// Demo notifications
export const demoNotifications: Notification[] = [
  {
    id: "1",
    company_id: "comp_1",
    user_id: "user_1",
    title: "New Order Received",
    message: "Order #1007 from John Smith - $45.99",
    type: "order",
    priority: "high",
    is_read: false,
    delivery_method: ["push", "email"],
    action_url: "/orders",
    order_id: "order_1007",
    created_at: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: "2",
    company_id: "comp_1",
    user_id: "user_2",
    title: "Order Ready for Pickup",
    message: "Order #1005 is ready for customer pickup",
    type: "order",
    priority: "normal",
    is_read: false,
    delivery_method: ["push"],
    action_url: "/orders",
    order_id: "order_1005",
    created_at: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: "3",
    company_id: "comp_1",
    user_id: "user_1",
    title: "AI Upsell Success",
    message: "AI successfully upsold dessert to customer - +$8.99",
    type: "ai",
    priority: "low",
    is_read: false,
    delivery_method: ["email"],
    action_url: "/ai-management",
    created_at: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: "4",
    company_id: "comp_1",
    user_id: "user_1",
    title: "VIP Customer Order",
    message: "Sarah Wilson (VIP) placed a new order",
    type: "customer",
    priority: "high",
    is_read: true,
    read_at: new Date(Date.now() - 14 * 60 * 1000),
    delivery_method: ["push", "email"],
    action_url: "/customers",
    customer_id: "cust_4",
    created_at: new Date(Date.now() - 15 * 60 * 1000),
  },
]

// Demo Order Statuses
export const demoOrderStatuses: OrderStatus[] = [
  {
    id: "status_1",
    company_id: "comp_1",
    name: "New",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    step: 1,
    level: 1,
    icon: "clock",
    allowed_transitions: ["preparing", "rejected"],
    is_default: true,
    is_active: true,
  },
  {
    id: "status_2",
    company_id: "comp_1",
    name: "Preparing",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    step: 2,
    level: 1,
    icon: "chef-hat",
    allowed_transitions: ["ready", "cancelled"],
    is_default: false,
    is_active: true,
  },
]

// Helper function to get customer by ID
export const getCustomerById = (id: string): Customer | undefined => {
  return demoCustomers.find((customer) => customer.id === id)
}

// Helper function to get product by ID
export const getProductById = (id: string): Product | undefined => {
  return demoProducts.find((product) => product.id === id)
}

// Helper function to get order by ID
export const getOrderById = (id: string): Order | undefined => {
  return demoOrders.find((order) => order.id === id)
}

// Helper function to get conversation by ID
export const getConversationById = (conversationId: string): AIConversation | undefined => {
  return demoAIConversations.find((conv) => conv.id === conversationId)
}

// Helper function to get orders by customer ID
export const getOrdersByCustomerId = (customerId: string): Order[] => {
  return demoOrders.filter((order) => order.customer_id === customerId)
}

// Helper function to get conversations by customer ID
export const getConversationsByCustomerId = (customerId: string): AIConversation[] => {
  return demoAIConversations.filter((conv) => conv.customer_id === customerId)
}

// Helper function to get conversation by order ID
export const getConversationByOrderId = (orderId: string): AIConversation | undefined => {
  return demoAIConversations.find((conv) => conv.order_id === orderId)
}

// Helper function to get AI tool by ID
export const getAIToolById = (id: string): AITool | undefined => {
  return demoAITools.find((tool) => tool.id === id)
}

// Helper function to get AI behavior setting by ID
export const getAIBehaviorSettingById = (id: string): AIBehaviorSetting | undefined => {
  return demoAIBehaviorSettings.find((setting) => setting.id === id)
}

// Helper function to get AI test scenario by ID
export const getAITestScenarioById = (id: string): AITestScenario | undefined => {
  return demoAITestScenarios.find((scenario) => scenario.id === id)
}

// Helper function to get AI channel by ID
export const getAIChannelById = (id: string): AIChannel | undefined => {
  return demoAIChannels.find((channel) => channel.id === id)
}

// Analytics helper functions
export const getCustomerOrderStats = (customerId: string) => {
  const orders = getOrdersByCustomerId(customerId)
  const completedOrders = orders.filter((order) => order.status === "delivered")

  return {
    totalOrders: orders.length,
    completedOrders: completedOrders.length,
    totalSpent: completedOrders.reduce((sum, order) => sum + order.total_amount, 0),
    averageOrderValue:
      completedOrders.length > 0
        ? completedOrders.reduce((sum, order) => sum + order.total_amount, 0) / completedOrders.length
        : 0,
    lastOrderDate: orders.length > 0 ? orders[0].created_at : null,
  }
}

export const getCustomerAIStats = (customerId: string) => {
  const conversations = getConversationsByCustomerId(customerId)
  const completedConversations = conversations.filter((conv) => conv.status === "completed")

  return {
    totalConversations: conversations.length,
    completedConversations: completedConversations.length,
    totalOrderValue: completedConversations.reduce((sum, conv) => sum + conv.order_value, 0),
    conversionRate:
      conversations.length > 0
        ? (completedConversations.filter((conv) => conv.outcome === "order_placed").length / conversations.length) * 100
        : 0,
  }
}

// Dashboard analytics functions
export const getDashboardStats = () => {
  const totalOrders = demoOrders.length
  const totalRevenue = demoOrders.reduce((sum, order) => sum + order.total_amount, 0)
  const activeCustomers = demoCustomers.filter((c) => c.status === "active" || c.status === "vip").length
  const completedConversations = demoAIConversations.filter((c) => c.status === "completed").length
  const conversionRate = completedConversations > 0 ? (completedConversations / demoAIConversations.length) * 100 : 0

  return {
    totalOrders,
    totalRevenue,
    activeCustomers,
    conversionRate,
    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
  }
}

// Product analytics functions
export const getProductStats = () => {
  const totalProducts = demoProducts.length
  const availableProducts = demoProducts.filter((p) => p.is_available).length
  const featuredProducts = demoProducts.filter((p) => p.is_featured).length
  const totalRevenue = demoProducts.reduce((sum, product) => sum + product.total_revenue, 0)

  return {
    totalProducts,
    availableProducts,
    featuredProducts,
    totalRevenue,
  }
}

// AI Analytics functions
export const getAIAnalyticsStats = () => {
  const totalConversations = demoAIConversations.length
  const completedConversations = demoAIConversations.filter((c) => c.status === "completed").length
  const totalOrderValue = demoAIConversations.reduce((sum, conv) => sum + conv.order_value, 0)
  const avgConfidence =
    demoAIConversations.reduce((sum, conv) => sum + (conv.ai_confidence_score || 0), 0) / totalConversations
  const avgSatisfaction =
    demoAIConversations
      .filter((c) => c.customer_satisfaction_score)
      .reduce((sum, conv) => sum + (conv.customer_satisfaction_score || 0), 0) /
    demoAIConversations.filter((c) => c.customer_satisfaction_score).length

  return {
    totalConversations,
    completedConversations,
    totalOrderValue,
    conversionRate: totalConversations > 0 ? (completedConversations / totalConversations) * 100 : 0,
    avgConfidence: avgConfidence * 100,
    avgSatisfaction,
    escalationRate: (demoAIConversations.filter((c) => c.escalated_to_human).length / totalConversations) * 100,
  }
}

// Channel analytics functions
export const getChannelStats = () => {
  const channelData = demoAIChannels.map((channel) => ({
    name: channel.name,
    conversations: channel.total_conversations,
    conversionRate: channel.conversion_rate,
    avgResponseTime: channel.avg_response_time,
    customerSatisfaction: channel.customer_satisfaction,
    isConnected: channel.is_connected,
  }))

  return channelData
}

// Menu items for consistent ordering (derived from products)
export const menuItems = demoProducts.map((product) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  category: product.category_id,
  description: product.description,
}))

export const demoApiKeys: ApiKey[] = [
  {
    id: "key_1",
    company_id: "comp_1",
    user_id: "user_1",
    name: "Production API Key",
    key_hash: "...",
    key_prefix: "up_prod_",
    scopes: ["read", "write"],
    rate_limit_per_minute: 100,
    monthly_request_limit: 50000,
    current_month_usage: 12543,
    is_active: true,
    last_used_at: new Date(),
    expires_at: undefined,
  },
  {
    id: "key_2",
    company_id: "comp_1",
    user_id: "user_1",
    name: "Development API Key",
    key_hash: "...",
    key_prefix: "up_dev_",
    scopes: ["read"],
    rate_limit_per_minute: 60,
    monthly_request_limit: 10000,
    current_month_usage: 1234,
    is_active: true,
    last_used_at: new Date(Date.now() - 86400000),
    expires_at: undefined,
  },
]

export interface AppearanceSettings {
  theme: "light" | "dark" | "system"
  compact_mode: boolean
  font_size: number
  animations: boolean
  high_contrast: boolean
  color_scheme: "blue" | "green" | "purple" | "orange" | "red" | "teal"
}

export const demoAppearanceSettings: AppearanceSettings = {
  theme: "system",
  compact_mode: false,
  font_size: 14,
  animations: true,
  high_contrast: false,
  color_scheme: "blue",
}

export const demoInvoices: Invoice[] = [
  {
    id: "INV-001",
    company_id: "comp_1",
    subscription_id: "sub_1",
    invoice_number: "INV-001",
    amount: 49.0,
    status: "paid",
    invoice_date: new Date("2023-07-01"),
    due_date: new Date("2023-07-15"),
    paid_at: new Date("2023-07-05"),
  },
  {
    id: "INV-002",
    company_id: "comp_1",
    subscription_id: "sub_1",
    invoice_number: "INV-002",
    amount: 49.0,
    status: "paid",
    invoice_date: new Date("2023-08-01"),
    due_date: new Date("2023-08-15"),
    paid_at: new Date("2023-08-05"),
  },
]

export const demoPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_1",
    company_id: "comp_1",
    type: "card",
    brand: "Visa",
    last_four: "4242",
    exp_month: 4,
    exp_year: 2025,
    is_default: true,
  },
  {
    id: "pm_2",
    company_id: "comp_1",
    type: "card",
    brand: "Mastercard",
    last_four: "5555",
    exp_month: 8,
    exp_year: 2024,
    is_default: false,
  },
]

export const demoNotificationPreferences: NotificationPreference[] = [
  {
    id: "pref_1",
    user_id: "user_1",
    company_id: "comp_1",
    email_new_orders: true,
    email_order_updates: true,
    sms_urgent_orders: false,
    push_new_orders: true,
    quiet_hours_enabled: true,
    quiet_hours_start: "22:00",
    quiet_hours_end: "08:00",
  },
]

export interface Company {
  id: string
  name: string
  address: string
  phone: string
  email: string
  website: string
  logo_url: string
  delivery_enabled: boolean
  delivery_range: number
  delivery_fee: number
  min_order_value: number
  free_delivery_threshold: number
  operating_hours: any
  ai_assistant_name: string
  ai_auto_upselling: boolean
  ai_smart_recommendations: boolean
}

export const demoCompany: Company = {
  id: "comp_1",
  name: "Tasty Restaurant Inc.",
  address: "123 Main Street\nSan Francisco, CA 94105\nUnited States",
  phone: "+1 (555) 123-4567",
  email: "contact@tastyrestaurant.com",
  website: "https://www.tastyrestaurant.com",
  logo_url: "/placeholder-logo.svg",
  delivery_enabled: true,
  delivery_range: 5,
  delivery_fee: 5,
  min_order_value: 15,
  free_delivery_threshold: 30,
  operating_hours: {
    monday: { open: "09:00", close: "22:00", enabled: true },
    tuesday: { open: "09:00", close: "22:00", enabled: true },
    wednesday: { open: "09:00", close: "22:00", enabled: true },
    thursday: { open: "09:00", close: "22:00", enabled: true },
    friday: { open: "09:00", close: "22:00", enabled: true },
    saturday: { open: "09:00", close: "22:00", enabled: true },
    sunday: { open: "09:00", close: "22:00", enabled: true },
  },
  ai_assistant_name: "UpsellBot",
  ai_auto_upselling: true,
  ai_smart_recommendations: true,
}

export interface ActiveSession {
  id: string
  company_id: string
  user_id: string
  device: string
  location: string
  ip_address: string
  last_active: Date
  is_current: boolean
}

export const demoActiveSessions: ActiveSession[] = [
  {
    id: "session_1",
    company_id: "comp_1",
    user_id: "user_1",
    device: "Chrome on MacOS",
    location: "San Francisco, CA",
    ip_address: "123.45.67.89",
    last_active: new Date(),
    is_current: true,
  },
  {
    id: "session_2",
    company_id: "comp_1",
    user_id: "user_1",
    device: "Safari on iPhone",
    location: "San Francisco, CA",
    ip_address: "987.65.43.21",
    last_active: new Date(Date.now() - 2 * 60 * 60 * 1000),
    is_current: false,
  },
  {
    id: "session_3",
    company_id: "comp_1",
    user_id: "user_1",
    device: "Firefox on Windows",
    location: "New York, NY",
    ip_address: "456.78.90.12",
    last_active: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    is_current: false,
  },
]

export interface AISettings {
  autoBackup: boolean
  dataRetention: string
  enableLogging: boolean
  maintenanceMode: boolean
  timezone: string
  currency: string
  language: string
  autoUpdateMenu: boolean
  smartNotifications: boolean
  enableRateLimiting: boolean
  encryptCustomerData: boolean
  twoFactorAuthentication: boolean
}

export const demoAISettings: AISettings = {
  autoBackup: true,
  dataRetention: "90",
  enableLogging: true,
  maintenanceMode: false,
  timezone: "america/new_york",
  currency: "usd",
  language: "en",
  autoUpdateMenu: true,
  smartNotifications: true,
  enableRateLimiting: true,
  encryptCustomerData: true,
  twoFactorAuthentication: false,
}

export interface Channel {
  name: string
  status: string
  icon: string
}

export const demoChannels: Channel[] = [
  { name: "WhatsApp", status: "connected", icon: "💬" },
  { name: "Facebook Messenger", status: "connected", icon: "📱" },
  { name: "Instagram DM", status: "disconnected", icon: "📷" },
  { name: "Web Widget", status: "connected", icon: "🌐" },
]

export const demoGreetingTemplates: string[] = [
  "Hi there! 👋 Welcome to [Restaurant Name]! I'm here to help you with your order. What can I get started for you today?",
  "Hello! Thanks for choosing [Restaurant Name]. I'm your AI assistant and I'm excited to help you find something delicious. What are you in the mood for?",
  "Welcome! I'm the AI assistant for [Restaurant Name]. I can help you browse our menu, customize your order, and even suggest some popular items. How can I help?",
]

export const demoUpsellMode: "smart" | "manual" | "advanced" = "smart"
