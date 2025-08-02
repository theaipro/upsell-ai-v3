-- Step 5: Create billing, subscription, and miscellaneous tables

-- Table for Billing Subscriptions
CREATE TABLE subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
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

-- Table for Payment Methods
CREATE TABLE payment_methods (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    type text,
    brand text,
    last_four text,
    exp_month integer,
    exp_year integer,
    is_default boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table for Invoices
CREATE TABLE invoices (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
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

-- Table for API Keys
CREATE TABLE api_keys (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id uuid NOT NULL,
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

-- Table for Product Subscriptions (distinct from billing subscriptions)
CREATE TABLE product_subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
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

-- Table for Offers
CREATE TABLE offers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
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

-- Table for Notifications
CREATE TABLE notifications (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id uuid NOT NULL,
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

-- Table for Notification Preferences
CREATE TABLE notification_preferences (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
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

-- Table for Active Sessions
CREATE TABLE active_sessions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id uuid NOT NULL,
    device text,
    location text,
    ip_address inet,
    last_active timestamptz,
    is_current boolean,
    created_at timestamptz DEFAULT now()
);
