-- Create products_daily_analysis table for tracking daily product metrics
CREATE TABLE IF NOT EXISTS public.products_daily_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    analysis_date DATE NOT NULL DEFAULT CURRENT_DATE,
    daily_revenue NUMERIC DEFAULT 0,
    daily_sales_count INTEGER DEFAULT 0,
    daily_orders_containing_product INTEGER DEFAULT 0,
    daily_favorites INTEGER DEFAULT 0,
    daily_combo_added INTEGER DEFAULT 0,
    daily_price_ask INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, analysis_date)
);

-- Add RLS policies for products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Staff can view products from their company
CREATE POLICY "Staff can view company products" ON public.products
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM public.staff 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Staff with products permission can insert products
CREATE POLICY "Staff can insert company products" ON public.products
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT company_id FROM public.staff 
            WHERE user_id = auth.uid() 
            AND status = 'active'
            AND (permissions->>'products')::boolean = true
        )
    );

-- Staff with products permission can update products
CREATE POLICY "Staff can update company products" ON public.products
    FOR UPDATE USING (
        company_id IN (
            SELECT company_id FROM public.staff 
            WHERE user_id = auth.uid() 
            AND status = 'active'
            AND (permissions->>'products')::boolean = true
        )
    );

-- Staff with products permission can delete products
CREATE POLICY "Staff can delete company products" ON public.products
    FOR DELETE USING (
        company_id IN (
            SELECT company_id FROM public.staff 
            WHERE user_id = auth.uid() 
            AND status = 'active'
            AND (permissions->>'products')::boolean = true
        )
    );

-- Add RLS policies for products_daily_analysis table
ALTER TABLE public.products_daily_analysis ENABLE ROW LEVEL SECURITY;

-- Staff can view analytics from their company
CREATE POLICY "Staff can view company product analytics" ON public.products_daily_analysis
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM public.staff 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Staff with products permission can insert analytics
CREATE POLICY "Staff can insert company product analytics" ON public.products_daily_analysis
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT company_id FROM public.staff 
            WHERE user_id = auth.uid() 
            AND status = 'active'
            AND (permissions->>'products')::boolean = true
        )
    );

-- Staff with products permission can update analytics
CREATE POLICY "Staff can update company product analytics" ON public.products_daily_analysis
    FOR UPDATE USING (
        company_id IN (
            SELECT company_id FROM public.staff 
            WHERE user_id = auth.uid() 
            AND status = 'active'
            AND (permissions->>'products')::boolean = true
        )
    );

-- Create function to update daily analytics
CREATE OR REPLACE FUNCTION update_product_daily_analytics(
    p_product_id UUID,
    p_company_id UUID,
    p_revenue_increment NUMERIC DEFAULT 0,
    p_sales_increment INTEGER DEFAULT 0,
    p_orders_increment INTEGER DEFAULT 0,
    p_favorites_increment INTEGER DEFAULT 0,
    p_combo_increment INTEGER DEFAULT 0,
    p_price_ask_increment INTEGER DEFAULT 0
) RETURNS VOID AS $$
BEGIN
    INSERT INTO public.products_daily_analysis (
        product_id,
        company_id,
        analysis_date,
        daily_revenue,
        daily_sales_count,
        daily_orders_containing_product,
        daily_favorites,
        daily_combo_added,
        daily_price_ask
    ) VALUES (
        p_product_id,
        p_company_id,
        CURRENT_DATE,
        p_revenue_increment,
        p_sales_increment,
        p_orders_increment,
        p_favorites_increment,
        p_combo_increment,
        p_price_ask_increment
    )
    ON CONFLICT (product_id, analysis_date)
    DO UPDATE SET
        daily_revenue = products_daily_analysis.daily_revenue + p_revenue_increment,
        daily_sales_count = products_daily_analysis.daily_sales_count + p_sales_increment,
        daily_orders_containing_product = products_daily_analysis.daily_orders_containing_product + p_orders_increment,
        daily_favorites = products_daily_analysis.daily_favorites + p_favorites_increment,
        daily_combo_added = products_daily_analysis.daily_combo_added + p_combo_increment,
        daily_price_ask = products_daily_analysis.daily_price_ask + p_price_ask_increment,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_company_id ON public.products(company_id);
CREATE INDEX IF NOT EXISTS idx_products_daily_analysis_product_date ON public.products_daily_analysis(product_id, analysis_date);
CREATE INDEX IF NOT EXISTS idx_products_daily_analysis_company_date ON public.products_daily_analysis(company_id, analysis_date);
