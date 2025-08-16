-- Update the onboarding function to properly create staff member
CREATE OR REPLACE FUNCTION complete_user_onboarding(
  company_name VARCHAR,
  company_industry VARCHAR DEFAULT 'Restaurant',
  company_size VARCHAR DEFAULT 'Small',
  company_website VARCHAR DEFAULT NULL,
  company_description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_company_id UUID;
  user_id UUID;
BEGIN
  -- Get the current user ID
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- Create the company
  INSERT INTO companies (
    name,
    industry,
    size,
    website,
    description,
    owner_id
  ) VALUES (
    company_name,
    company_industry,
    company_size,
    company_website,
    company_description,
    user_id
  ) RETURNING id INTO new_company_id;

  -- Update user profile with company_id and mark onboarding as completed
  UPDATE user_profiles 
  SET 
    company_id = new_company_id,
    onboarding_completed = true,
    role = 'owner',
    updated_at = NOW()
  WHERE id = user_id;

  -- Create staff record for the owner
  INSERT INTO staff (
    user_id,
    company_id,
    role,
    status,
    permissions,
    invited_by
  ) VALUES (
    user_id,
    new_company_id,
    'owner',
    'active',
    '{"all": true}'::jsonb,
    user_id
  );

  RETURN new_company_id;
END;
$$;
