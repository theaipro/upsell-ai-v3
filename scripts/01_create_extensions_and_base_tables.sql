-- Step 1: Create extensions and base tables with no dependencies

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for Companies (base table with no dependencies)
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

-- Table for Staff (depends only on companies)
CREATE TABLE staff (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id uuid NOT NULL,
    name text NOT NULL,
    email text UNIQUE,
    phone text,
    role text NOT NULL DEFAULT 'staff',
    permissions jsonb,
    invited_by uuid, -- Will add FK constraint later
    invited_at timestamptz,
    joined_at timestamptz,
    status text DEFAULT 'active',
    last_active timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Add self-referencing FK for staff.invited_by after table creation
ALTER TABLE staff ADD CONSTRAINT staff_invited_by_fkey 
    FOREIGN KEY (invited_by) REFERENCES staff(id) ON DELETE SET NULL;
