-- Fix RLS policies for categories table to allow proper CRUD operations

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view categories for their company" ON categories;
DROP POLICY IF EXISTS "Users can insert categories for their company" ON categories;
DROP POLICY IF EXISTS "Users can update categories for their company" ON categories;
DROP POLICY IF EXISTS "Users can delete categories for their company" ON categories;

-- Create proper RLS policies for categories
-- Allow users to view categories for their company
CREATE POLICY "Users can view categories for their company" ON categories
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- Allow users to insert categories for their company
CREATE POLICY "Users can insert categories for their company" ON categories
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT company_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- Allow users to update categories for their company
CREATE POLICY "Users can update categories for their company" ON categories
    FOR UPDATE USING (
        company_id IN (
            SELECT company_id FROM user_profiles WHERE id = auth.uid()
        )
    ) WITH CHECK (
        company_id IN (
            SELECT company_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- Allow users to delete categories for their company (if they have permission)
CREATE POLICY "Users can delete categories for their company" ON categories
    FOR DELETE USING (
        company_id IN (
            SELECT company_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- Ensure RLS is enabled
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
