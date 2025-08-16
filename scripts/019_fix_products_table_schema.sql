-- Fix products table to include all missing fields for nutritional info and tags

-- Add missing columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS protein INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS carbs INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS fat INTEGER DEFAULT 0;

-- Update RLS policies to ensure they work with new columns
DROP POLICY IF EXISTS "Staff can view company products" ON products;
DROP POLICY IF EXISTS "Staff can insert company products" ON products;
DROP POLICY IF EXISTS "Staff can update company products" ON products;
DROP POLICY IF EXISTS "Staff can delete company products" ON products;

-- Recreate RLS policies
CREATE POLICY "Staff can view company products" ON products
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM staff 
            WHERE user_id = auth.uid() 
            AND status = 'active'
            AND (permissions->>'products')::boolean = true
        )
    );

CREATE POLICY "Staff can insert company products" ON products
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT company_id FROM staff 
            WHERE user_id = auth.uid() 
            AND status = 'active'
            AND (permissions->>'products')::boolean = true
        )
    );

CREATE POLICY "Staff can update company products" ON products
    FOR UPDATE USING (
        company_id IN (
            SELECT company_id FROM staff 
            WHERE user_id = auth.uid() 
            AND status = 'active'
            AND (permissions->>'products')::boolean = true
        )
    );

CREATE POLICY "Staff can delete company products" ON products
    FOR DELETE USING (
        company_id IN (
            SELECT company_id FROM staff 
            WHERE user_id = auth.uid() 
            AND status = 'active'
            AND (permissions->>'products')::boolean = true
        )
    );
