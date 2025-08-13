-- Step 1: Modify the staff table to allow for a null company_id.
-- This is necessary to allow users to sign up before they have created or joined a company.
ALTER TABLE public.staff
ALTER COLUMN company_id DROP NOT NULL;

-- Step 2: Create a function to automatically create a staff profile for a new user.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert a new row into the staff table, linking it to the new user.
  -- The user's full name is extracted from the raw_user_meta_data if available, otherwise it defaults to their email.
  -- The company_id is left NULL, to be filled in during the onboarding process.
  INSERT INTO public.staff (user_id, email, name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', new.email));
  RETURN new;
END;
$$;

-- Step 3: Create a trigger that fires the function after a new user is created in the auth.users table.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Step 4: Add a comment to the trigger for clarity
COMMENT ON TRIGGER on_auth_user_created ON auth.users
IS 'When a new user signs up, this trigger creates a corresponding record in the public.staff table.';
