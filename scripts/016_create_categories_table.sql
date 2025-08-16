-- Create categories table with proper RLS policies
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_company_id ON public.categories(company_id);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON public.categories(company_id, sort_order);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
CREATE POLICY "Users can view categories from their company" ON public.categories
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM public.user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Staff can manage categories from their company" ON public.categories
    FOR ALL USING (
        company_id IN (
            SELECT s.company_id FROM public.staff s
            JOIN public.user_profiles up ON s.user_id = up.id
            WHERE up.id = auth.uid()
            AND s.status = 'active'
            AND (s.permissions->>'products')::boolean = true
        )
    );

-- Function to create default restaurant categories
CREATE OR REPLACE FUNCTION create_default_restaurant_categories(p_company_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Insert default restaurant categories
    INSERT INTO public.categories (company_id, name, description, sort_order) VALUES
    (p_company_id, 'Appetizers', 'Start your meal with our delicious appetizers', 1),
    (p_company_id, 'Main Courses', 'Our signature main dishes and entrees', 2),
    (p_company_id, 'Salads', 'Fresh and healthy salad options', 3),
    (p_company_id, 'Soups', 'Warm and comforting soup selections', 4),
    (p_company_id, 'Desserts', 'Sweet treats to end your meal', 5),
    (p_company_id, 'Beverages', 'Refreshing drinks and beverages', 6),
    (p_company_id, 'Specials', 'Chef specials and seasonal items', 7);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update products table to use category_id instead of category string
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id);

-- Create index for category_id
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);

-- Function to migrate existing category strings to category_id
CREATE OR REPLACE FUNCTION migrate_product_categories()
RETURNS VOID AS $$
DECLARE
    product_record RECORD;
    category_id UUID;
BEGIN
    -- Loop through products that have category string but no category_id
    FOR product_record IN 
        SELECT id, company_id, category 
        FROM public.products 
        WHERE category IS NOT NULL AND category_id IS NULL
    LOOP
        -- Try to find matching category
        SELECT id INTO category_id
        FROM public.categories
        WHERE company_id = product_record.company_id
        AND LOWER(name) = LOWER(product_record.category)
        LIMIT 1;
        
        -- If no matching category found, create one
        IF category_id IS NULL THEN
            INSERT INTO public.categories (company_id, name, sort_order)
            VALUES (product_record.company_id, product_record.category, 99)
            RETURNING id INTO category_id;
        END IF;
        
        -- Update product with category_id
        UPDATE public.products
        SET category_id = category_id
        WHERE id = product_record.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
