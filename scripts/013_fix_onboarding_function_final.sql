-- Fix the complete_user_onboarding function to use correct column names
-- Drop the existing function and create a corrected version

-- Drop existing function
DROP FUNCTION IF EXISTS public.complete_user_onboarding(text, text, text, text, text);

-- Create corrected function that uses 'status' instead of 'is_active'
CREATE OR REPLACE FUNCTION public.complete_user_onboarding(
  company_name text,
  company_industry text,
  company_size text,
  company_website text DEFAULT NULL,
  company_description text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
  new_company_id uuid;
  user_email text;
  user_name text;
  result json;
BEGIN
  -- Get the current authenticated user
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- Get user details from auth.users and user_profiles
  SELECT email INTO user_email FROM auth.users WHERE id = current_user_id;
  SELECT COALESCE(full_name, first_name || ' ' || last_name, email) INTO user_name 
  FROM public.user_profiles WHERE id = current_user_id;

  -- Check if user already has a company
  SELECT company_id INTO new_company_id 
  FROM public.user_profiles 
  WHERE id = current_user_id;
  
  IF new_company_id IS NOT NULL THEN
    RAISE EXCEPTION 'User already has a company';
  END IF;

  -- Create the company
  INSERT INTO public.companies (
    name,
    industry,
    size,
    website,
    description,
    owner_id,
    created_at,
    updated_at
  ) VALUES (
    company_name,
    company_industry,
    company_size,
    company_website,
    company_description,
    current_user_id,
    NOW(),
    NOW()
  ) RETURNING id INTO new_company_id;

  -- Update user profile with company_id and mark onboarding as complete
  UPDATE public.user_profiles 
  SET 
    company_id = new_company_id,
    onboarding_completed = true,
    updated_at = NOW()
  WHERE id = current_user_id;

  -- Add the user as owner in the staff table with correct column names
  INSERT INTO public.staff (
    user_id,
    company_id,
    role,
    name,
    email,
    status,
    permissions,
    created_at,
    updated_at
  ) VALUES (
    current_user_id,
    new_company_id,
    'owner',
    COALESCE(user_name, user_email),
    user_email,
    'active',
    '{"all": true}'::jsonb,
    NOW(),
    NOW()
  );

  -- Update user metadata in auth.users
  UPDATE auth.users 
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    json_build_object('onboarding_completed', true, 'company_id', new_company_id)::jsonb
  WHERE id = current_user_id;

  -- Return success result
  result := json_build_object(
    'success', true,
    'company_id', new_company_id,
    'message', 'Onboarding completed successfully'
  );

  RETURN result;

EXCEPTION
  WHEN OTHERS THEN
    -- Return error result
    result := json_build_object(
      'success', false,
      'error', SQLERRM,
      'message', 'Failed to complete onboarding'
    );
    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.complete_user_onboarding(text, text, text, text, text) TO authenticated;
