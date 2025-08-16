-- Add missing contact fields to staff table for invited users
ALTER TABLE staff 
ADD COLUMN IF NOT EXISTS name VARCHAR(255),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS invitation_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS invited_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS invitation_expires_at TIMESTAMP WITH TIME ZONE;

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);
CREATE INDEX IF NOT EXISTS idx_staff_invitation_token ON staff(invitation_token);

-- Create function to sync staff info from user_profiles when user registers
CREATE OR REPLACE FUNCTION sync_staff_from_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Update staff record with user profile info when user_id is set
  IF NEW.user_id IS NOT NULL AND OLD.user_id IS NULL THEN
    UPDATE staff 
    SET 
      name = COALESCE(
        (SELECT CONCAT(first_name, ' ', last_name) FROM user_profiles WHERE id = NEW.user_id),
        NEW.name
      ),
      email = COALESCE(
        (SELECT email FROM user_profiles WHERE id = NEW.user_id),
        NEW.email
      ),
      phone = COALESCE(
        (SELECT phone FROM user_profiles WHERE id = NEW.user_id),
        NEW.phone
      ),
      status = 'active'
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to sync staff info when user registers
DROP TRIGGER IF EXISTS sync_staff_user_info ON staff;
CREATE TRIGGER sync_staff_user_info
  AFTER UPDATE ON staff
  FOR EACH ROW
  EXECUTE FUNCTION sync_staff_from_user_profile();

-- Update existing staff records to sync with user_profiles
UPDATE staff 
SET 
  name = COALESCE(
    staff.name,
    CONCAT(up.first_name, ' ', up.last_name)
  ),
  email = COALESCE(staff.email, up.email),
  phone = COALESCE(staff.phone, up.phone)
FROM user_profiles up 
WHERE staff.user_id = up.id 
AND staff.user_id IS NOT NULL;
