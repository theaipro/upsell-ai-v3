-- Drop all existing versions of the complete_user_onboarding function
DROP FUNCTION IF EXISTS public.complete_user_onboarding(text, text, text, text, text, text, text, integer, numeric, numeric, numeric, jsonb);
DROP FUNCTION IF EXISTS public.complete_user_onboarding(text, text, text, text, text, text, text, numeric, integer, numeric, numeric, jsonb);
DROP FUNCTION IF EXISTS public.complete_user_onboarding(text, text, text, text, text, text, text, numeric, numeric, integer, numeric, jsonb);
DROP FUNCTION IF EXISTS public.complete_user_onboarding(text, text, text, text, text, text, text, numeric, numeric, numeric, integer, jsonb);

-- Create a single clean version with consistent parameter order
CREATE OR REPLACE FUNCTION public.complete_user_onboarding(
  company_name text,
  company_address text,
  company_phone text,
  company_email text,
  company_website text,
  company_industry text,
  company_size text,
  delivery_range integer,
  delivery_fee numeric,
  min_order_value numeric,
  free_delivery_threshold numeric,
  staff_members jsonb
) RETURNS jsonb AS $$
DECLARE
  new_company_id uuid;
  user_id uuid;
  staff_member jsonb;
  result jsonb;
BEGIN
  -- Get the current user ID
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User not authenticated',
      'message', 'Please log in to complete onboarding'
    );
  END IF;

  BEGIN
    -- Insert company data
    INSERT INTO companies (
      name, address, phone, email, website, industry, size,
      delivery_range, delivery_fee, min_order_value, free_delivery_threshold,
      created_at, updated_at
    ) VALUES (
      company_name, company_address, company_phone, company_email, company_website,
      company_industry, company_size, delivery_range, delivery_fee, min_order_value,
      free_delivery_threshold, NOW(), NOW()
    ) RETURNING id INTO new_company_id;

    -- Update user profile with company association
    UPDATE user_profiles 
    SET company_id = new_company_id, updated_at = NOW()
    WHERE user_id = user_id;

    -- Add the user as owner in staff table
    INSERT INTO staff (
      company_id, user_id, name, email, phone, role, status, permissions, created_at
    ) 
    SELECT 
      new_company_id, 
      user_id,
      COALESCE(up.first_name || ' ' || up.last_name, up.first_name, 'Owner'),
      au.email,
      up.phone,
      'owner',
      'active',
      jsonb_build_array('all'),
      NOW()
    FROM auth.users au
    LEFT JOIN user_profiles up ON up.user_id = au.id
    WHERE au.id = user_id;

    -- Add staff members from the form
    FOR staff_member IN SELECT * FROM jsonb_array_elements(staff_members)
    LOOP
      INSERT INTO staff (
        company_id, name, email, phone, role, status, permissions, created_at
      ) VALUES (
        new_company_id,
        staff_member->>'name',
        staff_member->>'email',
        staff_member->>'phone',
        COALESCE(staff_member->>'role', 'staff'),
        'invited',
        jsonb_build_array('products', 'orders'),
        NOW()
      );
    END LOOP;

    -- Create default restaurant categories if industry is restaurant
    IF LOWER(company_industry) = 'restaurant' THEN
      PERFORM create_default_restaurant_categories(new_company_id);
    END IF;

    -- Update user metadata
    UPDATE auth.users 
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
        jsonb_build_object(
          'company_id', new_company_id,
          'onboarding_completed', true
        )
    WHERE id = user_id;

    result := jsonb_build_object(
      'success', true,
      'company_id', new_company_id,
      'message', 'Onboarding completed successfully'
    );

    RETURN result;

  EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLSTATE,
      'message', SQLERRM
    );
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.complete_user_onboarding TO authenticated;
