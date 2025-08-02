-- Step 2: Create lookup/status tables that depend on companies

-- Table for Customer Statuses
CREATE TABLE customer_statuses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    color text,
    created_at timestamptz DEFAULT now()
);

-- Table for Loyalty Tiers
CREATE TABLE loyalty_tiers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    color text,
    created_at timestamptz DEFAULT now()
);

-- Table for Product Categories
CREATE TABLE product_categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    image_url text,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table for Order Statuses
CREATE TABLE order_statuses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
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

-- Table for Payment Statuses
CREATE TABLE payment_statuses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    color text,
    created_at timestamptz DEFAULT now()
);
