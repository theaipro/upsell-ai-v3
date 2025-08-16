-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name character varying NOT NULL,
    description text,
    price numeric NOT NULL DEFAULT 0,
    billing_cycle character varying NOT NULL DEFAULT 'monthly',
    features text[] DEFAULT '{}',
    popular boolean DEFAULT false,
    active boolean DEFAULT true,
    category character varying,
    trial_days integer,
    setup_fee numeric,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create offers table
CREATE TABLE IF NOT EXISTS public.offers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name character varying NOT NULL,
    description text,
    type character varying NOT NULL DEFAULT 'discount',
    value character varying NOT NULL,
    code character varying,
    start_date date NOT NULL,
    end_date date NOT NULL,
    active boolean DEFAULT true,
    applies_to character varying DEFAULT 'all',
    applies_to_value character varying,
    min_order_value numeric DEFAULT 0,
    buy_products jsonb DEFAULT '[]',
    get_products jsonb DEFAULT '[]',
    buy_quantity integer DEFAULT 1,
    get_quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create subscriptions daily analysis table
CREATE TABLE IF NOT EXISTS public.subscriptions_daily_analysis (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    subscription_id uuid NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    analysis_date date NOT NULL,
    daily_revenue numeric DEFAULT 0,
    daily_subscriptions_count integer DEFAULT 0,
    daily_cancellations integer DEFAULT 0,
    daily_renewals integer DEFAULT 0,
    daily_trials_started integer DEFAULT 0,
    daily_trials_converted integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(subscription_id, analysis_date)
);

-- Create offers daily analysis table
CREATE TABLE IF NOT EXISTS public.offers_daily_analysis (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    offer_id uuid NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    analysis_date date NOT NULL,
    daily_revenue numeric DEFAULT 0,
    daily_uses_count integer DEFAULT 0,
    daily_orders_with_offer integer DEFAULT 0,
    daily_discount_amount numeric DEFAULT 0,
    daily_new_customers integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(offer_id, analysis_date)
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions_daily_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers_daily_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view subscriptions from their company" ON public.subscriptions
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM public.user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can insert subscriptions for their company" ON public.subscriptions
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT company_id FROM public.user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update subscriptions from their company" ON public.subscriptions
    FOR UPDATE USING (
        company_id IN (
            SELECT company_id FROM public.user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can delete subscriptions from their company" ON public.subscriptions
    FOR DELETE USING (
        company_id IN (
            SELECT company_id FROM public.user_profiles 
            WHERE id = auth.uid()
        )
    );

-- Create RLS policies for offers
CREATE POLICY "Users can view offers from their company" ON public.offers
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM public.user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can insert offers for their company" ON public.offers
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT company_id FROM public.user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update offers from their company" ON public.offers
    FOR UPDATE USING (
        company_id IN (
            SELECT company_id FROM public.user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can delete offers from their company" ON public.offers
    FOR DELETE USING (
        company_id IN (
            SELECT company_id FROM public.user_profiles 
            WHERE id = auth.uid()
        )
    );

-- Create RLS policies for subscriptions daily analysis
CREATE POLICY "Users can view subscription analytics from their company" ON public.subscriptions_daily_analysis
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM public.user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can insert subscription analytics for their company" ON public.subscriptions_daily_analysis
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT company_id FROM public.user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update subscription analytics from their company" ON public.subscriptions_daily_analysis
    FOR UPDATE USING (
        company_id IN (
            SELECT company_id FROM public.user_profiles 
            WHERE id = auth.uid()
        )
    );

-- Create RLS policies for offers daily analysis
CREATE POLICY "Users can view offer analytics from their company" ON public.offers_daily_analysis
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM public.user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can insert offer analytics for their company" ON public.offers_daily_analysis
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT company_id FROM public.user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update offer analytics from their company" ON public.offers_daily_analysis
    FOR UPDATE USING (
        company_id IN (
            SELECT company_id FROM public.user_profiles 
            WHERE id = auth.uid()
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS subscriptions_company_id_idx ON public.subscriptions(company_id);
CREATE INDEX IF NOT EXISTS offers_company_id_idx ON public.offers(company_id);
CREATE INDEX IF NOT EXISTS subscriptions_daily_analysis_date_idx ON public.subscriptions_daily_analysis(analysis_date);
CREATE INDEX IF NOT EXISTS offers_daily_analysis_date_idx ON public.offers_daily_analysis(analysis_date);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON public.offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_daily_analysis_updated_at BEFORE UPDATE ON public.subscriptions_daily_analysis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offers_daily_analysis_updated_at BEFORE UPDATE ON public.offers_daily_analysis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
