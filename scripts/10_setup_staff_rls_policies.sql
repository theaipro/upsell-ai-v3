-- Step 1: Enable Row Level Security on the 'staff' table.
-- This is the master switch that makes all policies on this table active.
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Step 2: Create a helper function to get the company_id for the currently authenticated user.
-- This function makes it easy to reference the user's company in our policies.
-- It's defined as STABLE because it returns the same result within a single transaction.
CREATE OR REPLACE FUNCTION get_my_company_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT company_id
  FROM public.staff
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

-- Step 3: Create the SELECT policy.
-- This policy allows users to view records from the 'staff' table only if the record's
-- company_id matches their own company_id.
CREATE POLICY "Allow users to view staff from their own company"
ON public.staff
FOR SELECT
USING (company_id = get_my_company_id());

-- Step 4: Create the UPDATE policy.
-- This allows users with the 'owner' or 'admin' role to update records within their own company.
-- It prevents regular staff from modifying other staff members' details.
CREATE POLICY "Allow owners and admins to update staff in their company"
ON public.staff
FOR UPDATE
USING (company_id = get_my_company_id())
WITH CHECK ((
  company_id = get_my_company_id()
) AND (
  (SELECT role FROM public.staff WHERE user_id = auth.uid()) IN ('owner', 'admin')
));

-- Step 5: Create the INSERT policy.
-- This allows owners/admins to add new staff members to their own company.
CREATE POLICY "Allow owners and admins to add staff to their company"
ON public.staff
FOR INSERT
WITH CHECK ((
  company_id = get_my_company_id()
) AND (
  (SELECT role FROM public.staff WHERE user_id = auth.uid()) IN ('owner', 'admin')
));

-- Step 6: Create the DELETE policy.
-- This allows owners/admins to remove staff members from their company.
-- It also includes a safeguard to prevent a user from deleting their own record.
CREATE POLICY "Allow owners and admins to delete staff from their company"
ON public.staff
FOR DELETE
USING ((
  company_id = get_my_company_id()
) AND (
  (SELECT role FROM public.staff WHERE user_id = auth.uid()) IN ('owner', 'admin')
) AND (
  user_id != auth.uid() -- Prevent self-deletion
));

-- Add comments for clarity
COMMENT ON POLICY "Allow users to view staff from their own company" ON public.staff IS 'Ensures users can only see staff members belonging to their own company.';
COMMENT ON POLICY "Allow owners and admins to update staff in their company" ON public.staff IS 'Allows admin/owner roles to update staff records within their company.';
COMMENT ON POLICY "Allow owners and admins to add staff to their company" ON public.staff IS 'Allows admin/owner roles to insert new staff records for their company.';
COMMENT ON POLICY "Allow owners and admins to delete staff from their company" ON public.staff IS 'Allows admin/owner roles to delete staff records from their company, but not themselves.';
