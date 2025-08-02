-- Step 4: Create AI-related tables

-- Table for AI Conversations
CREATE TABLE ai_conversations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
    order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
    channel text,
    customer_phone text,
    customer_email text,
    customer_name text,
    status text,
    total_messages integer DEFAULT 0,
    customer_satisfaction_score integer,
    ai_confidence_score numeric,
    escalated_to_human boolean DEFAULT false,
    escalation_reason text,
    outcome text,
    order_value numeric,
    last_message text,
    tags text[],
    started_at timestamptz DEFAULT now(),
    ended_at timestamptz,
    updated_at timestamptz DEFAULT now()
);

-- Table for AI Messages
CREATE TABLE ai_messages (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id uuid NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    sender_type text,
    sender_id text,
    content text NOT NULL,
    message_type text,
    ai_intent text,
    ai_confidence numeric,
    ai_entities jsonb,
    suggested_products uuid[],
    upsell_successful boolean,
    created_at timestamptz DEFAULT now()
);

-- Table for AI Tools
CREATE TABLE ai_tools (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    category text,
    is_enabled boolean DEFAULT true,
    is_connected boolean DEFAULT false,
    connection_status text,
    settings jsonb,
    permissions text[],
    last_sync timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table for AI Behavior Settings
CREATE TABLE ai_behavior_settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    category text,
    name text NOT NULL,
    setting_key text NOT NULL,
    value text,
    setting_type text,
    options jsonb,
    min_value numeric,
    max_value numeric,
    step_value numeric,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table for AI Test Scenarios
CREATE TABLE ai_test_scenarios (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    category text,
    test_messages text[],
    expected_outcome text,
    last_run timestamptz,
    success_rate numeric,
    total_runs integer DEFAULT 0,
    successful_runs integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table for AI Channels
CREATE TABLE ai_channels (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    channel_type text,
    is_enabled boolean DEFAULT true,
    is_connected boolean DEFAULT false,
    connection_status text,
    settings jsonb,
    total_conversations integer DEFAULT 0,
    conversion_rate numeric,
    avg_response_time numeric,
    customer_satisfaction numeric,
    last_activity timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table for Daily AI Analytics
CREATE TABLE ai_analytics_daily (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    analytics_date date NOT NULL,
    total_conversations integer DEFAULT 0,
    completed_conversations integer DEFAULT 0,
    abandoned_conversations integer DEFAULT 0,
    escalated_conversations integer DEFAULT 0,
    total_order_value numeric DEFAULT 0,
    orders_from_ai integer DEFAULT 0,
    upsell_attempts integer DEFAULT 0,
    successful_upsells integer DEFAULT 0,
    upsell_revenue numeric DEFAULT 0,
    avg_response_time numeric,
    avg_confidence_score numeric,
    avg_customer_satisfaction numeric,
    channel_breakdown jsonb,
    created_at timestamptz DEFAULT now()
);

-- Table for AI Settings
CREATE TABLE ai_settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    auto_backup boolean DEFAULT true,
    data_retention text,
    enable_logging boolean DEFAULT true,
    maintenance_mode boolean DEFAULT false,
    timezone text,
    currency text,
    language text,
    auto_update_menu boolean DEFAULT true,
    smart_notifications boolean DEFAULT true,
    enable_rate_limiting boolean DEFAULT true,
    encrypt_customer_data boolean DEFAULT true,
    two_factor_authentication boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
