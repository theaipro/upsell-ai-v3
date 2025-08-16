-- Updated function to match simplified company schema
CREATE OR REPLACE FUNCTION complete_user_onboarding(
  company_name TEXT,
  company_industry TEXT DEFAULT NULL,
  company_size TEXT DEFAULT NULL,
  company_website TEXT DEFAULT NULL,
  company_description TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_company_id UUID;
  user_id UUID;
BEGIN
  -- Get the current user ID
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Create the company
  INSERT INTO companies (
    owner_id,
    name,
    industry,
    size,
    website,
    description
  ) VALUES (
    user_id,
    company_name,
    company_industry,
    company_size,
    company_website,
    company_description
  ) RETURNING id INTO new_company_id;

  -- Update user profile with company_id and mark onboarding as completed
  UPDATE user_profiles 
  SET 
    company_id = new_company_id,
    onboarding_completed = true,
    updated_at = NOW()
  WHERE id = user_id;

  -- Create staff record for the owner with simplified schema
  INSERT INTO staff (
    user_id,
    company_id,
    role,
    status,
    permissions
  ) VALUES (
    user_id,
    new_company_id,
    'owner',
    'active',
    '{"all": true}'::jsonb
  );

  RETURN new_company_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user needs onboarding
CREATE OR REPLACE FUNCTION user_needs_onboarding(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = user_id AND onboarding_completed = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated function to match simplified company schema
CREATE OR REPLACE FUNCTION get_user_company(user_id UUID DEFAULT auth.uid())
RETURNS TABLE (
  id UUID,
  name TEXT,
  industry TEXT,
  size TEXT,
  website TEXT,
  description TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.industry,
    c.size,
    c.website,
    c.description
  FROM companies c
  INNER JOIN user_profiles up ON c.id = up.company_id
  WHERE up.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
