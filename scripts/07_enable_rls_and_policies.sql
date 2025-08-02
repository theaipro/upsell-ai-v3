-- Step 7: Enable RLS and create all policies

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_behavior_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_test_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_upsells ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Users can view their own company" ON companies FOR SELECT 
    USING (id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Owners can update their own company" ON companies FOR UPDATE 
    USING (id = (SELECT company_id FROM staff WHERE user_id = auth.uid() AND role = 'owner'));

-- Staff policies
CREATE POLICY "Users can view their own staff entry" ON staff FOR SELECT 
    USING (user_id = auth.uid());
CREATE POLICY "Managers can view all staff in their company" ON staff FOR SELECT 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid() AND role IN ('manager', 'owner')));
CREATE POLICY "Owners can insert new staff" ON staff FOR INSERT 
    WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid() AND role = 'owner'));
CREATE POLICY "Owners can update staff" ON staff FOR UPDATE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid() AND role = 'owner'));
CREATE POLICY "Owners can delete staff" ON staff FOR DELETE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid() AND role = 'owner'));

-- Customer Statuses policies
CREATE POLICY "Users can view customer statuses in their own company" ON customer_statuses FOR SELECT 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert customer statuses in their own company" ON customer_statuses FOR INSERT 
    WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update customer statuses in their own company" ON customer_statuses FOR UPDATE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete customer statuses in their own company" ON customer_statuses FOR DELETE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Loyalty Tiers policies
CREATE POLICY "Users can view loyalty tiers in their own company" ON loyalty_tiers FOR SELECT 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert loyalty tiers in their own company" ON loyalty_tiers FOR INSERT 
    WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update loyalty tiers in their own company" ON loyalty_tiers FOR UPDATE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete loyalty tiers in their own company" ON loyalty_tiers FOR DELETE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Product Categories policies
CREATE POLICY "Users can view product categories in their own company" ON product_categories FOR SELECT 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert product categories in their own company" ON product_categories FOR INSERT 
    WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update product categories in their own company" ON product_categories FOR UPDATE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete product categories in their own company" ON product_categories FOR DELETE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Order Statuses policies
CREATE POLICY "Users can view order statuses in their own company" ON order_statuses FOR SELECT 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert order statuses in their own company" ON order_statuses FOR INSERT 
    WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update order statuses in their own company" ON order_statuses FOR UPDATE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete order statuses in their own company" ON order_statuses FOR DELETE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Payment Statuses policies
CREATE POLICY "Users can view payment statuses in their own company" ON payment_statuses FOR SELECT 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert payment statuses in their own company" ON payment_statuses FOR INSERT 
    WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update payment statuses in their own company" ON payment_statuses FOR UPDATE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete payment statuses in their own company" ON payment_statuses FOR DELETE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Customers policies
CREATE POLICY "Users can view customers in their own company" ON customers FOR SELECT 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert customers in their own company" ON customers FOR INSERT 
    WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update customers in their own company" ON customers FOR UPDATE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete customers in their own company" ON customers FOR DELETE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Products policies
CREATE POLICY "Users can view products in their own company" ON products FOR SELECT 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert products in their own company" ON products FOR INSERT 
    WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update products in their own company" ON products FOR UPDATE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete products in their own company" ON products FOR DELETE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Orders policies
CREATE POLICY "Users can view orders in their own company" ON orders FOR SELECT 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert orders in their own company" ON orders FOR INSERT 
    WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update orders in their own company" ON orders FOR UPDATE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete orders in their own company" ON orders FOR DELETE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Order Items policies
CREATE POLICY "Users can view order items in their own company" ON order_items FOR SELECT 
    USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid())));
CREATE POLICY "Users can insert order items in their own company" ON order_items FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid())));
CREATE POLICY "Users can update order items in their own company" ON order_items FOR UPDATE 
    USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid())));
CREATE POLICY "Users can delete order items in their own company" ON order_items FOR DELETE 
    USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid())));

-- AI Conversations policies
CREATE POLICY "Users can view AI conversations in their own company" ON ai_conversations FOR SELECT 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert AI conversations in their own company" ON ai_conversations FOR INSERT 
    WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update AI conversations in their own company" ON ai_conversations FOR UPDATE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete AI conversations in their own company" ON ai_conversations FOR DELETE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- AI Messages policies
CREATE POLICY "Users can view AI messages in their own company" ON ai_messages FOR SELECT 
    USING (EXISTS (SELECT 1 FROM ai_conversations WHERE ai_conversations.id = ai_messages.conversation_id AND ai_conversations.company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid())));
CREATE POLICY "Users can insert AI messages in their own company" ON ai_messages FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM ai_conversations WHERE ai_conversations.id = ai_messages.conversation_id AND ai_conversations.company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid())));
CREATE POLICY "Users can update AI messages in their own company" ON ai_messages FOR UPDATE 
    USING (EXISTS (SELECT 1 FROM ai_conversations WHERE ai_conversations.id = ai_messages.conversation_id AND ai_conversations.company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid())));
CREATE POLICY "Users can delete AI messages in their own company" ON ai_messages FOR DELETE 
    USING (EXISTS (SELECT 1 FROM ai_conversations WHERE ai_conversations.id = ai_messages.conversation_id AND ai_conversations.company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid())));

-- AI Tools policies
CREATE POLICY "Users can view AI tools in their own company" ON ai_tools FOR SELECT 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert AI tools in their own company" ON ai_tools FOR INSERT 
    WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update AI tools in their own company" ON ai_tools FOR UPDATE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete AI tools in their own company" ON ai_tools FOR DELETE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- AI Behavior Settings policies
CREATE POLICY "Users can view AI behavior settings in their own company" ON ai_behavior_settings FOR SELECT 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert AI behavior settings in their own company" ON ai_behavior_settings FOR INSERT 
    WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update AI behavior settings in their own company" ON ai_behavior_settings FOR UPDATE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete AI behavior settings in their own company" ON ai_behavior_settings FOR DELETE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- AI Test Scenarios policies
CREATE POLICY "Users can view AI test scenarios in their own company" ON ai_test_scenarios FOR SELECT 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert AI test scenarios in their own company" ON ai_test_scenarios FOR INSERT 
    WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update AI test scenarios in their own company" ON ai_test_scenarios FOR UPDATE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete AI test scenarios in their own company" ON ai_test_scenarios FOR DELETE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- AI Channels policies
CREATE POLICY "Users can view AI channels in their own company" ON ai_channels FOR SELECT 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert AI channels in their own company" ON ai_channels FOR INSERT 
    WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update AI channels in their own company" ON ai_channels FOR UPDATE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete AI channels in their own company" ON ai_channels FOR DELETE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- Daily AI Analytics policies
CREATE POLICY "Users can view daily AI analytics in their own company" ON ai_analytics_daily FOR SELECT 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert daily AI analytics in their own company" ON ai_analytics_daily FOR INSERT 
    WITH CHECK (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can update daily AI analytics in their own company" ON ai_analytics_daily FOR UPDATE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete daily AI analytics in their own company" ON ai_analytics_daily FOR DELETE 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));

-- AI Settings policies
CREATE POLICY "Users can view AI settings in their own company" ON ai_settings FOR SELECT 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Owners can manage AI settings" ON ai_settings FOR ALL 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid() AND role = 'owner'));

-- Subscriptions policies
CREATE POLICY "Users can view subscriptions for their own company" ON subscriptions FOR SELECT 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Owners can manage subscriptions" ON subscriptions FOR ALL 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid() AND role = 'owner'));

-- Payment Methods policies
CREATE POLICY "Users can view payment methods for their own company" ON payment_methods FOR SELECT 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Owners can manage payment methods" ON payment_methods FOR ALL 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid() AND role = 'owner'));

-- Invoices policies
CREATE POLICY "Users can view invoices for their own company" ON invoices FOR SELECT 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid()));
CREATE POLICY "Owners can manage invoices" ON invoices FOR ALL 
    USING (company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid() AND role = 'owner'));

-- API Keys policies
CREATE POLICY "Users can view their own API keys" ON api_keys FOR SELECT 
    USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own API keys" ON api_keys FOR INSERT 
    WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own API keys" ON api_keys FOR UPDATE 
    USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own API keys" ON api_keys FOR DELETE 
    USING (user_id = auth.uid());

-- Product Subscriptions policies
CREATE POLICY "All users can view product subscriptions" ON product_subscriptions FOR SELECT 
    USING (true);
CREATE POLICY "Admins can manage product subscriptions" ON product_subscriptions FOR ALL 
    USING ((SELECT role FROM staff WHERE user_id = auth.uid()) IN ('manager', 'owner'));

-- Offers policies
CREATE POLICY "All users can view offers" ON offers FOR SELECT 
    USING (true);
CREATE POLICY "Admins can manage offers" ON offers FOR ALL 
    USING ((SELECT role FROM staff WHERE user_id = auth.uid()) IN ('manager', 'owner'));

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT 
    USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own notifications" ON notifications FOR INSERT 
    WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE 
    USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own notifications" ON notifications FOR DELETE 
    USING (user_id = auth.uid());

-- Notification Preferences policies
CREATE POLICY "Users can manage their own notification preferences" ON notification_preferences FOR ALL 
    USING (user_id = auth.uid());

-- Active Sessions policies
CREATE POLICY "Users can view their own active sessions" ON active_sessions FOR SELECT 
    USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own active sessions" ON active_sessions FOR DELETE 
    USING (user_id = auth.uid());

-- Product Upsells policies
CREATE POLICY "Users can view product upsells in their own company" ON product_upsells FOR SELECT 
    USING (EXISTS (SELECT 1 FROM products WHERE products.id = product_upsells.product_id AND products.company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid())));
CREATE POLICY "Users can insert product upsells in their own company" ON product_upsells FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM products WHERE products.id = product_upsells.product_id AND products.company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid())));
CREATE POLICY "Users can delete product upsells in their own company" ON product_upsells FOR DELETE 
    USING (EXISTS (SELECT 1 FROM products WHERE products.id = product_upsells.product_id AND products.company_id = (SELECT company_id FROM staff WHERE user_id = auth.uid())));
