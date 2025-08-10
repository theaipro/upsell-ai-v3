-- Step 8: Create onboarding and default data setup

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_company_id uuid;
  user_email text;
  user_name text;
BEGIN
  -- Extract email and name from the new user record
  -- The exact attribute might be different depending on your Supabase setup,
  -- common ones are raw_user_meta_data or similar.
  user_email := NEW.email;
  user_name := NEW.raw_user_meta_data->>'full_name'; -- Adjust if you use a different field

  -- Create a new company for the user
  INSERT INTO companies (name)
  VALUES (user_name || '''s Company') -- Or some other default naming convention
  RETURNING id INTO new_company_id;

  -- Create a staff entry for the user
  INSERT INTO staff (user_id, company_id, name, email, role)
  VALUES (NEW.id, new_company_id, user_name, user_email, 'admin');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on new user signup
CREATE TRIGGER on_new_user
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- Function to create default records for a new company
CREATE OR REPLACE FUNCTION create_default_records()
RETURNS TRIGGER AS $$
BEGIN
  -- This function will be populated later with default data for:
  -- - customer_statuses
  -- - loyalty_tiers
  -- - product_categories
  -- - order_statuses
  -- - payment_statuses
  -- For now, it does nothing.
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default records when a new company is made
CREATE TRIGGER on_new_company
AFTER INSERT ON companies
FOR EACH ROW
EXECUTE FUNCTION create_default_records();
