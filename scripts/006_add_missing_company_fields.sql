-- Add missing fields to companies table
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS delivery_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) DEFAULT 5.00,
ADD COLUMN IF NOT EXISTS delivery_range INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS min_order_value DECIMAL(10,2) DEFAULT 15.00,
ADD COLUMN IF NOT EXISTS free_delivery_threshold DECIMAL(10,2) DEFAULT 30.00,
ADD COLUMN IF NOT EXISTS operating_hours JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS primary_color VARCHAR(7) DEFAULT '#3B82F6',
ADD COLUMN IF NOT EXISTS secondary_color VARCHAR(7) DEFAULT '#1F2937',
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(5,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS service_fee DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS auto_accept_orders BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS order_prep_time INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS max_daily_orders INTEGER,
ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{}';

-- Set default operating hours for existing companies
UPDATE companies 
SET operating_hours = '{
  "monday": {"open": "09:00", "close": "22:00", "closed": false},
  "tuesday": {"open": "09:00", "close": "22:00", "closed": false},
  "wednesday": {"open": "09:00", "close": "22:00", "closed": false},
  "thursday": {"open": "09:00", "close": "22:00", "closed": false},
  "friday": {"open": "09:00", "close": "22:00", "closed": false},
  "saturday": {"open": "09:00", "close": "22:00", "closed": false},
  "sunday": {"open": "09:00", "close": "22:00", "closed": false}
}'::jsonb
WHERE operating_hours = '{}'::jsonb OR operating_hours IS NULL;
