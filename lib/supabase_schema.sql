-- Supabase Schema for the Application

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for Companies
CREATE TABLE companies (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    address text,
    phone text,
    email text,
    website text,
    logo_url text,
    delivery_enabled boolean DEFAULT false,
    delivery_range numeric,
    delivery_fee numeric,
    min_order_value numeric,
    free_delivery_threshold numeric,
    operating_hours jsonb,
    ai_assistant_name text,
    ai_auto_upselling boolean DEFAULT true,
    ai_smart_recommendations boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS Policies for Companies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own company" ON companies FOR SELECT USING (id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Owners can update their own company" ON companies FOR UPDATE USING (id = (SELECT company_id FROM staff WHERE user_id = auth.uid() AND role = 'owner'));

-- Table for Customer Statuses
CREATE TABLE customer_statuses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    color text,
    created_at timestamptz DEFAULT now()
);

-- RLS Policies for Customer Statuses
ALTER TABLE customer_statuses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view customer statuses in their own company" ON customer_statuses FOR SELECT USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert customer statuses in their own company" ON customer_statuses FOR INSERT WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update customer statuses in their own company" ON customer_statuses FOR UPDATE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete customer statuses in their own company" ON customer_statuses FOR DELETE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Table for Loyalty Tiers
CREATE TABLE loyalty_tiers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    color text,
    created_at timestamptz DEFAULT now()
);

-- RLS Policies for Loyalty Tiers
ALTER TABLE loyalty_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view loyalty tiers in their own company" ON loyalty_tiers FOR SELECT USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert loyalty tiers in their own company" ON loyalty_tiers FOR INSERT WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update loyalty tiers in their own company" ON loyalty_tiers FOR UPDATE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete loyalty tiers in their own company" ON loyalty_tiers FOR DELETE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Table for Customers
CREATE TABLE customers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text UNIQUE,
    phone text,
    address text,
    city text,
    state text,
    zip_code text,
    status_id uuid REFERENCES customer_statuses(id) ON DELETE SET NULL,
    join_date timestamptz DEFAULT now(),
    last_order_date timestamptz,
    total_orders integer DEFAULT 0,
    total_spent numeric DEFAULT 0,
    average_order_value numeric DEFAULT 0,
    notes text,
    tags text[],
    avatar text,
    preferences jsonb,
    loyalty_points integer DEFAULT 0,
    loyalty_tier_id uuid REFERENCES loyalty_tiers(id) ON DELETE SET NULL,
    birthday date,
    referral_source text,
    marketing_consent boolean DEFAULT false,
    sms_consent boolean DEFAULT false,
    analysis jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS Policies for Customers
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view customers in their own company" ON customers FOR SELECT USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert customers in their own company" ON customers FOR INSERT WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update customers in their own company" ON customers FOR UPDATE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete customers in their own company" ON customers FOR DELETE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Table for Product Categories
CREATE TABLE product_categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    image_url text,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS Policies for Product Categories
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view product categories in their own company" ON product_categories FOR SELECT USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert product categories in their own company" ON product_categories FOR INSERT WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update product categories in their own company" ON product_categories FOR UPDATE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete product categories in their own company" ON product_categories FOR DELETE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Table for Products
CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    category_id uuid REFERENCES product_categories(id) ON DELETE SET NULL,
    name text NOT NULL,
    description text,
    image_url text,
    price numeric NOT NULL,
    cost numeric,
    is_available boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    track_inventory boolean DEFAULT false,
    stock_quantity integer,
    low_stock_threshold integer,
    calories integer,
    allergens text[],
    dietary_tags text[],
    tags text[],
    ingredients text[],
    nutritional_info jsonb,
    customization_options jsonb,
    ai_recommendation_score numeric,
    total_orders integer DEFAULT 0,
    total_revenue numeric DEFAULT 0,
    sort_order integer DEFAULT 0,
    monthly_data jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS Policies for Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view products in their own company" ON products FOR SELECT USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert products in their own company" ON products FOR INSERT WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update products in their own company" ON products FOR UPDATE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete products in their own company" ON products FOR DELETE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Join Table for Product Upsells
CREATE TABLE product_upsells (
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    upsell_product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, upsell_product_id)
);

-- RLS Policies for Product Upsells
ALTER TABLE product_upsells ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view product upsells in their own company" ON product_upsells FOR SELECT USING (EXISTS (SELECT 1 FROM products WHERE products.id = product_upsells.product_id AND products.company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid())));
CREATE POLICY "Users can insert product upsells in their own company" ON product_upsells FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM products WHERE products.id = product_upsells.product_id AND products.company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid())));
CREATE POLICY "Users can delete product upsells in their own company" ON product_upsells FOR DELETE USING (EXISTS (SELECT 1 FROM products WHERE products.id = product_upsells.product_id AND products.company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid())));

-- Table for Order Statuses
CREATE TABLE order_statuses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    color text,
    step integer,
    level integer,
    icon text,
    allowed_transitions text[],
    is_default boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS Policies for Order Statuses
ALTER TABLE order_statuses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view order statuses in their own company" ON order_statuses FOR SELECT USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert order statuses in their own company" ON order_statuses FOR INSERT WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update order statuses in their own company" ON order_statuses FOR UPDATE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete order statuses in their own company" ON order_statuses FOR DELETE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Table for Payment Statuses
CREATE TABLE payment_statuses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    color text,
    created_at timestamptz DEFAULT now()
);

-- RLS Policies for Payment Statuses
ALTER TABLE payment_statuses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view payment statuses in their own company" ON payment_statuses FOR SELECT USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert payment statuses in their own company" ON payment_statuses FOR INSERT WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update payment statuses in their own company" ON payment_statuses FOR UPDATE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete payment statuses in their own company" ON payment_statuses FOR DELETE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Table for Staff
CREATE TABLE staff (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    -- This would typically reference a user management table (e.g., auth.users)
    user_id uuid NOT NULL,
    name text NOT NULL,
    email text UNIQUE,
    phone text,
    role text,
    permissions jsonb,
    invited_by uuid REFERENCES staff(id) ON DELETE SET NULL,
    invited_at timestamptz,
    joined_at timestamptz,
    status text,
    last_active timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS Policies for Staff
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own staff entry" ON staff FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Managers can view all staff in their company" ON staff FOR SELECT USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid() AND role IN ('manager', 'owner')));
CREATE POLICY "Owners can insert new staff" ON staff FOR INSERT WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid() AND role = 'owner'));
CREATE POLICY "Owners can update staff" ON staff FOR UPDATE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid() AND role = 'owner'));
CREATE POLICY "Owners can delete staff" ON staff FOR DELETE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid() AND role = 'owner'));

-- Table for Orders
CREATE TABLE orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
    order_number text NOT NULL,
    status_id uuid REFERENCES order_statuses(id),
    order_type text,
    customer_name text,
    customer_email text,
    customer_phone text,
    delivery_address text,
    delivery_instructions text,
    subtotal numeric NOT NULL,
    tax_amount numeric DEFAULT 0,
    tip_amount numeric DEFAULT 0,
    discount_amount numeric DEFAULT 0,
    total_amount numeric NOT NULL,
    payment_method text,
    payment_status_id uuid REFERENCES payment_statuses(id),
    payment_intent_id text,
    assigned_to uuid REFERENCES staff(id) ON DELETE SET NULL,
    special_instructions text,
    notes text,
    tags text[],
    estimated_prep_time integer,
    estimated_delivery_time timestamptz,
    completed_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS Policies for Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view orders in their own company" ON orders FOR SELECT USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert orders in their own company" ON orders FOR INSERT WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update orders in their own company" ON orders FOR UPDATE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete orders in their own company" ON orders FOR DELETE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Table for Order Items
CREATE TABLE order_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
    product_id uuid REFERENCES products(id) ON DELETE SET NULL,
    name text NOT NULL,
    description text,
    quantity integer NOT NULL,
    unit_price numeric NOT NULL,
    total_price numeric NOT NULL,
    notes text,
    customizations jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS Policies for Order Items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view order items in their own company" ON order_items FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid())));
CREATE POLICY "Users can insert order items in their own company" ON order_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid())));
CREATE POLICY "Users can update order items in their own company" ON order_items FOR UPDATE USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid())));
CREATE POLICY "Users can delete order items in their own company" ON order_items FOR DELETE USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid())));

-- Table for AI Conversations
CREATE TABLE ai_conversations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
    order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
    channel text,
    customer_phone text,
    customer_email text,
    customer_name text,
    status text,
    total_messages integer DEFAULT 0,
    customer_satisfaction_score integer,
    ai_confidence_score numeric,
    escalated_to_human boolean DEFAULT false,
    escalation_reason text,
    outcome text,
    order_value numeric,
    last_message text,
    tags text[],
    started_at timestamptz DEFAULT now(),
    ended_at timestamptz,
    updated_at timestamptz DEFAULT now()
);

-- RLS Policies for AI Conversations
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view AI conversations in their own company" ON ai_conversations FOR SELECT USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert AI conversations in their own company" ON ai_conversations FOR INSERT WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update AI conversations in their own company" ON ai_conversations FOR UPDATE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete AI conversations in their own company" ON ai_conversations FOR DELETE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Table for AI Messages
CREATE TABLE ai_messages (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id uuid REFERENCES ai_conversations(id) ON DELETE CASCADE,
    sender_type text,
    sender_id text,
    content text NOT NULL,
    message_type text,
    ai_intent text,
    ai_confidence numeric,
    ai_entities jsonb,
    suggested_products uuid[],
    upsell_successful boolean,
    created_at timestamptz DEFAULT now()
);

-- RLS Policies for AI Messages
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view AI messages in their own company" ON ai_messages FOR SELECT USING (EXISTS (SELECT 1 FROM ai_conversations WHERE ai_conversations.id = ai_messages.conversation_id AND ai_conversations.company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid())));
CREATE POLICY "Users can insert AI messages in their own company" ON ai_messages FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM ai_conversations WHERE ai_conversations.id = ai_messages.conversation_id AND ai_conversations.company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid())));
CREATE POLICY "Users can update AI messages in their own company" ON ai_messages FOR UPDATE USING (EXISTS (SELECT 1 FROM ai_conversations WHERE ai_conversations.id = ai_messages.conversation_id AND ai_conversations.company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid())));
CREATE POLICY "Users can delete AI messages in their own company" ON ai_messages FOR DELETE USING (EXISTS (SELECT 1 FROM ai_conversations WHERE ai_conversations.id = ai_messages.conversation_id AND ai_conversations.company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid())));

-- Table for AI Tools
CREATE TABLE ai_tools (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    category text,
    is_enabled boolean DEFAULT true,
    is_connected boolean DEFAULT false,
    connection_status text,
    settings jsonb,
    permissions text[],
    last_sync timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS Policies for AI Tools
ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view AI tools in their own company" ON ai_tools FOR SELECT USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert AI tools in their own company" ON ai_tools FOR INSERT WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update AI tools in their own company" ON ai_tools FOR UPDATE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete AI tools in their own company" ON ai_tools FOR DELETE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Table for AI Behavior Settings
CREATE TABLE ai_behavior_settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    category text,
    name text NOT NULL,
    setting_key text NOT NULL,
    value text,
    setting_type text,
    options jsonb,
    min_value numeric,
    max_value numeric,
    step_value numeric,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS Policies for AI Behavior Settings
ALTER TABLE ai_behavior_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view AI behavior settings in their own company" ON ai_behavior_settings FOR SELECT USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert AI behavior settings in their own company" ON ai_behavior_settings FOR INSERT WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update AI behavior settings in their own company" ON ai_behavior_settings FOR UPDATE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete AI behavior settings in their own company" ON ai_behavior_settings FOR DELETE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Table for AI Test Scenarios
CREATE TABLE ai_test_scenarios (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    category text,
    test_messages text[],
    expected_outcome text,
    last_run timestamptz,
    success_rate numeric,
    total_runs integer DEFAULT 0,
    successful_runs integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS Policies for AI Test Scenarios
ALTER TABLE ai_test_scenarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view AI test scenarios in their own company" ON ai_test_scenarios FOR SELECT USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert AI test scenarios in their own company" ON ai_test_scenarios FOR INSERT WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update AI test scenarios in their own company" ON ai_test_scenarios FOR UPDATE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete AI test scenarios in their own company" ON ai_test_scenarios FOR DELETE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Table for AI Channels
CREATE TABLE ai_channels (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    channel_type text,
    is_enabled boolean DEFAULT true,
    is_connected boolean DEFAULT false,
    connection_status text,
    settings jsonb,
    total_conversations integer DEFAULT 0,
    conversion_rate numeric,
    avg_response_time numeric,
    customer_satisfaction numeric,
    last_activity timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS Policies for AI Channels
ALTER TABLE ai_channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view AI channels in their own company" ON ai_channels FOR SELECT USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert AI channels in their own company" ON ai_channels FOR INSERT WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update AI channels in their own company" ON ai_channels FOR UPDATE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete AI channels in their own company" ON ai_channels FOR DELETE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Table for Daily AI Analytics
CREATE TABLE ai_analytics_daily (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    analytics_date date NOT NULL,
    total_conversations integer DEFAULT 0,
    completed_conversations integer DEFAULT 0,
    abandoned_conversations integer DEFAULT 0,
    escalated_conversations integer DEFAULT 0,
    total_order_value numeric DEFAULT 0,
    orders_from_ai integer DEFAULT 0,
    upsell_attempts integer DEFAULT 0,
    successful_upsells integer DEFAULT 0,
    upsell_revenue numeric DEFAULT 0,
    avg_response_time numeric,
    avg_confidence_score numeric,
    avg_customer_satisfaction numeric,
    channel_breakdown jsonb,
    created_at timestamptz DEFAULT now()
);

-- RLS Policies for Daily AI Analytics
ALTER TABLE ai_analytics_daily ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view daily AI analytics in their own company" ON ai_analytics_daily FOR SELECT USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert daily AI analytics in their own company" ON ai_analytics_daily FOR INSERT WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update daily AI analytics in their own company" ON ai_analytics_daily FOR UPDATE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete daily AI analytics in their own company" ON ai_analytics_daily FOR DELETE USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Table for API Keys
CREATE TABLE api_keys (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    user_id uuid, -- This would typically reference a user management table (e.g., auth.users)
    name text NOT NULL,
    key_hash text NOT NULL,
    key_prefix text NOT NULL,
    scopes text[],
    rate_limit_per_minute integer,
    monthly_request_limit integer,
    current_month_usage integer DEFAULT 0,
    is_active boolean DEFAULT true,
    last_used_at timestamptz,
    expires_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- RLS Policies for API Keys
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own API keys" ON api_keys FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own API keys" ON api_keys FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own API keys" ON api_keys FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own API keys" ON api_keys FOR DELETE USING (user_id = auth.uid());

-- Table for Billing Subscriptions
CREATE TABLE subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    plan_name text,
    plan_price numeric,
    billing_cycle text,
    status text,
    stripe_subscription_id text,
    current_period_start timestamptz,
    current_period_end timestamptz,
    trial_end timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS Policies for Subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view subscriptions for their own company" ON subscriptions FOR SELECT USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Owners can manage subscriptions" ON subscriptions FOR ALL USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid() AND role = 'owner'));

-- Table for Payment Methods
CREATE TABLE payment_methods (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    type text,
    brand text,
    last_four text,
    exp_month integer,
    exp_year integer,
    is_default boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS Policies for Payment Methods
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view payment methods for their own company" ON payment_methods FOR SELECT USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Owners can manage payment methods" ON payment_methods FOR ALL USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid() AND role = 'owner'));

-- Table for Invoices
CREATE TABLE invoices (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
    invoice_number text NOT NULL,
    amount numeric NOT NULL,
    status text,
    invoice_date date,
    due_date date,
    paid_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS Policies for Invoices
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view invoices for their own company" ON invoices FOR SELECT USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Owners can manage invoices" ON invoices FOR ALL USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid() AND role = 'owner'));

-- Table for Product Subscriptions (distinct from billing subscriptions)
CREATE TABLE product_subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    price numeric,
    billing_cycle text,
    features text[],
    popular boolean DEFAULT false,
    active boolean DEFAULT true,
    trial_days integer,
    setup_fee numeric,
    category text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS Policies for Product Subscriptions
ALTER TABLE product_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All users can view product subscriptions" ON product_subscriptions FOR SELECT USING (true);
CREATE POLICY "Admins can manage product subscriptions" ON product_subscriptions FOR ALL USING ((SELECT role FROM staff WHERE user_id = auth.uid()) IN ('manager', 'owner'));

-- Table for Offers
CREATE TABLE offers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    type text,
    value text,
    code text,
    start_date date,
    end_date date,
    active boolean DEFAULT true,
    applies_to text,
    applies_to_value text,
    min_order_value numeric,
    buy_products jsonb,
    get_products jsonb,
    buy_quantity integer,
    get_quantity integer,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS Policies for Offers
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All users can view offers" ON offers FOR SELECT USING (true);
CREATE POLICY "Admins can manage offers" ON offers FOR ALL USING ((SELECT role FROM staff WHERE user_id = auth.uid()) IN ('manager', 'owner'));

-- Table for Notifications
CREATE TABLE notifications (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    user_id uuid, -- This would typically reference a user management table (e.g., auth.users)
    title text NOT NULL,
    message text,
    type text,
    priority text,
    order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
    customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
    conversation_id uuid REFERENCES ai_conversations(id) ON DELETE SET NULL,
    is_read boolean DEFAULT false,
    read_at timestamptz,
    delivery_method text[],
    delivered_at timestamptz,
    action_url text,
    created_at timestamptz DEFAULT now()
);

-- RLS Policies for Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own notifications" ON notifications FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own notifications" ON notifications FOR DELETE USING (user_id = auth.uid());

-- Table for Notification Preferences
CREATE TABLE notification_preferences (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL, -- This would typically reference a user management table (e.g., auth.users)
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    email_new_orders boolean DEFAULT true,
    email_order_updates boolean DEFAULT true,
    sms_urgent_orders boolean DEFAULT false,
    push_new_orders boolean DEFAULT true,
    quiet_hours_enabled boolean DEFAULT false,
    quiet_hours_start text,
    quiet_hours_end text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS Policies for Notification Preferences
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own notification preferences" ON notification_preferences FOR ALL USING (user_id = auth.uid());

-- Table for Active Sessions
CREATE TABLE active_sessions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    user_id uuid, -- This would typically reference a user management table (e.g., auth.users)
    device text,
    location text,
    ip_address inet,
    last_active timestamptz,
    is_current boolean,
    created_at timestamptz DEFAULT now()
);

-- RLS Policies for Active Sessions
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own active sessions" ON active_sessions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own active sessions" ON active_sessions FOR DELETE USING (user_id = auth.uid());

-- Table for AI Settings
CREATE TABLE ai_settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    auto_backup boolean DEFAULT true,
    data_retention text,
    enable_logging boolean DEFAULT true,
    maintenance_mode boolean DEFAULT false,
    timezone text,
    currency text,
    language text,
    auto_update_menu boolean DEFAULT true,
    smart_notifications boolean DEFAULT true,
    enable_rate_limiting boolean DEFAULT true,
    encrypt_customer_data boolean DEFAULT true,
    two_factor_authentication boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS Policies for AI Settings
ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view AI settings in their own company" ON ai_settings FOR SELECT USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Owners can manage AI settings" ON ai_settings FOR ALL USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid() AND role = 'owner'));
