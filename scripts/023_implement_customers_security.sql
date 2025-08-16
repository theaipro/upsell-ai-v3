-- Enable Row Level Security on customers table
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can only access their company customers" ON customers;
DROP POLICY IF EXISTS "Users can only insert customers for their company" ON customers;
DROP POLICY IF EXISTS "Users can only update their company customers" ON customers;
DROP POLICY IF EXISTS "Users can only delete their company customers" ON customers;

-- Create RLS policies for customers table
-- SELECT policy: Users can only view customers from their own company
CREATE POLICY "Users can only access their company customers" ON customers
FOR SELECT USING (
  company_id IN (
    SELECT company_id 
    FROM user_profiles 
    WHERE id = auth.uid() 
    AND company_id IS NOT NULL
  )
);

-- INSERT policy: Users can only create customers for their own company
CREATE POLICY "Users can only insert customers for their company" ON customers
FOR INSERT WITH CHECK (
  company_id IN (
    SELECT company_id 
    FROM user_profiles 
    WHERE id = auth.uid() 
    AND company_id IS NOT NULL
  )
);

-- UPDATE policy: Users can only update customers from their own company
CREATE POLICY "Users can only update their company customers" ON customers
FOR UPDATE USING (
  company_id IN (
    SELECT company_id 
    FROM user_profiles 
    WHERE id = auth.uid() 
    AND company_id IS NOT NULL
  )
) WITH CHECK (
  company_id IN (
    SELECT company_id 
    FROM user_profiles 
    WHERE id = auth.uid() 
    AND company_id IS NOT NULL
  )
);

-- DELETE policy: Users can only delete customers from their own company
CREATE POLICY "Users can only delete their company customers" ON customers
FOR DELETE USING (
  company_id IN (
    SELECT company_id 
    FROM user_profiles 
    WHERE id = auth.uid() 
    AND company_id IS NOT NULL
  )
);

-- Create a secure function to get current user's company_id
CREATE OR REPLACE FUNCTION get_current_user_company_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT company_id 
  FROM user_profiles 
  WHERE id = auth.uid() 
  AND company_id IS NOT NULL
  LIMIT 1;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_current_user_company_id() TO authenticated;
