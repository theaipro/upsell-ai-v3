-- Updated complete_user_onboarding function to include category creation
CREATE OR REPLACE FUNCTION public.complete_user_onboarding(
  company_name text,
  company_address text,
  company_phone text,
  company_email text,
  company_website text,
  company_industry text,
  company_size text,
  delivery_fee numeric,
  delivery_range numeric,
  min_order_value numeric,
  free_delivery_threshold numeric,
  staff_members jsonb DEFAULT '[]'::jsonb
)
RETURNS json AS $$
DECLARE
  current_user_id uuid;
  new_company_id uuid;
  user_email text;
  user_name text;
  staff_member jsonb;
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

  -- Create the company with all collected data
  INSERT INTO public.companies (
    name,
    address,
    phone,
    email,
    website,
    industry,
    size,
    description,
    delivery_fee,
    delivery_range,
    min_order_value,
    free_delivery_threshold,
    owner_id,
    created_at,
    updated_at
  ) VALUES (
    company_name,
    company_address,
    company_phone,
    company_email,
    company_website,
    company_industry,
    company_size,
    'Restaurant located at ' || company_address,
    delivery_fee,
    delivery_range,
    min_order_value,
    free_delivery_threshold,
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

  -- Add the user as owner in the staff table
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

  -- Add additional staff members if provided
  FOR staff_member IN SELECT * FROM jsonb_array_elements(staff_members)
  LOOP
    INSERT INTO public.staff (
      company_id,
      role,
      name,
      email,
      phone,
      status,
      permissions,
      created_at,
      updated_at
    ) VALUES (
      new_company_id,
      COALESCE(staff_member->>'role', 'staff'),
      staff_member->>'name',
      staff_member->>'email',
      staff_member->>'phone',
      'invited',
      '{"basic": true}'::jsonb,
      NOW(),
      NOW()
    );
  END LOOP;

  -- Create default categories for restaurant companies
  IF company_industry = 'Restaurant' OR company_industry = 'restaurant' THEN
    PERFORM create_default_restaurant_categories(new_company_id);
  END IF;

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
$$ LANGUAGE plpgsql SECURITY DEFINER;
