-- This function creates a new company and a staff record for the user who created it.
-- It's designed to be called from the client-side application.
-- It runs in a single transaction, so if any step fails, the entire operation is rolled back.
CREATE OR REPLACE FUNCTION public.create_company_for_user(
  company_name text,
  company_address text,
  company_phone text,
  company_email text,
  company_delivery_range numeric,
  company_delivery_fee numeric,
  company_min_order_value numeric,
  company_free_delivery_threshold numeric,
  admin_name text
)
RETURNS uuid -- Returns the new company's ID
LANGUAGE plpgsql
SECURITY DEFINER -- Allows the function to run with the permissions of the user who defined it, not the caller.
SET search_path = public
AS $$
DECLARE
  new_company_id uuid;
  current_user_id uuid := auth.uid(); -- Get the user ID of the person calling this function
  current_user_email text := (SELECT email FROM auth.users WHERE id = current_user_id);
BEGIN
  -- Step 1: Insert the new company and get its ID
  INSERT INTO public.companies (
    name, address, phone, email, delivery_range, delivery_fee, min_order_value, free_delivery_threshold
  ) VALUES (
    company_name, company_address, company_phone, company_email, company_delivery_range, company_delivery_fee, company_min_order_value, company_free_delivery_threshold
  ) RETURNING id INTO new_company_id;

  -- Step 2: Update the staff record for the user who created the company.
  -- We assume a staff record was already created by the on_auth_user_created trigger.
  UPDATE public.staff
  SET
    company_id = new_company_id,
    name = admin_name,
    role = 'owner', -- Or 'admin', depending on your role system
    status = 'active',
    joined_at = now()
  WHERE
    user_id = current_user_id;

  -- Step 3: Return the ID of the newly created company
  RETURN new_company_id;
END;
$$;

-- Add a comment to the function for clarity
COMMENT ON FUNCTION public.create_company_for_user(text, text, text, text, numeric, numeric, numeric, numeric, text)
IS 'Creates a new company and updates the creator''s staff profile in a single transaction.';
