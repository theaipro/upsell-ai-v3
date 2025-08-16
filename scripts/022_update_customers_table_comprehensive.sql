-- Update customers table to include all required fields
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS customer_id uuid DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS city character varying,
ADD COLUMN IF NOT EXISTS state character varying,
ADD COLUMN IF NOT EXISTS zip_code character varying,
ADD COLUMN IF NOT EXISTS marketing_consent boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS sms_consent boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS total_orders_lifetime integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_spent_lifetime numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_orders_month integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_spent_month numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS loyalty_tier character varying DEFAULT 'Bronze',
ADD COLUMN IF NOT EXISTS last_chat_summary text,
ADD COLUMN IF NOT EXISTS avg_days_between_orders integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS analysis_data jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS recent_orders_history jsonb DEFAULT '[]';

-- Rename existing columns to match specification
ALTER TABLE customers 
RENAME COLUMN total_spent TO total_spent_lifetime_old;
ALTER TABLE customers 
RENAME COLUMN total_orders TO total_orders_lifetime_old;
ALTER TABLE customers 
RENAME COLUMN average_order_value TO avg_order_value;
ALTER TABLE customers 
RENAME COLUMN analysis TO preferences_old;

-- Update data types and constraints
ALTER TABLE customers 
ALTER COLUMN tags SET DEFAULT '{}',
ALTER COLUMN preferences SET DEFAULT '{}',
ALTER COLUMN analysis_data SET DEFAULT '{}',
ALTER COLUMN recent_orders_history SET DEFAULT '[]';

-- Add foreign key constraint if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'customers_company_id_fkey'
    ) THEN
        ALTER TABLE customers 
        ADD CONSTRAINT customers_company_id_fkey 
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create or replace RLS policies
DROP POLICY IF EXISTS "Users can view customers from their company" ON customers;
DROP POLICY IF EXISTS "Users can insert customers for their company" ON customers;
DROP POLICY IF EXISTS "Users can update customers from their company" ON customers;
DROP POLICY IF EXISTS "Users can delete customers from their company" ON customers;

CREATE POLICY "Users can view customers from their company" ON customers
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can insert customers for their company" ON customers
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT company_id FROM user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update customers from their company" ON customers
    FOR UPDATE USING (
        company_id IN (
            SELECT company_id FROM user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can delete customers from their company" ON customers
    FOR DELETE USING (
        company_id IN (
            SELECT company_id FROM user_profiles 
            WHERE id = auth.uid()
        )
    );

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_company_id ON customers(company_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_loyalty_tier ON customers(loyalty_tier);
CREATE INDEX IF NOT EXISTS idx_customers_last_order_date ON customers(last_order_date);
