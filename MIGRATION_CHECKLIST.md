# Migration Checklist: `demo-data.ts` to Supabase

This checklist outlines the features that need to be migrated from the `lib/demo-data.ts` file to your Supabase backend. Once all items are checked, you can safely delete the `demo-data.ts` file.

## Core Features

### 1. Products

- [ ] **Product Categories**
  - [ ] Migrate `ProductCategory` interface
  - [ ] Migrate `demoProductCategories` data
- [ ] **Products**
  - [ ] Migrate `Product` interface
  - [ ] Migrate `demoProducts` data
- [ ] **Product Subscriptions**
  - [ ] Migrate `ProductSubscription` interface
  - [ ] Migrate `demoProductSubscriptions` data
- [ ] **Offers**
  - [ ] Migrate `Offer` interface
  - [ ] Migrate `demoOffers` data

### 2. Authentication
- [ ] **User Sign-up & Sign-in**
  - [ ] Replace mock `login` function with Supabase Auth
  - [ ] Replace mock `signup` function with Supabase Auth
  - [ ] Implement Supabase session management
- [ ] **User Profile**
  - [ ] Create a `profiles` table for user data
  - [ ] Link profiles to `auth.users`
- [ ] **Onboarding Flow**
  - [ ] Replace mock `verifyEmail` function
  - [ ] Replace mock `createCompany` function

### 3. Customers

- [ ] **Customers**
  - [ ] Migrate `Customer` interface
  - [ ] Migrate `demoCustomers` data

### 3. Orders

- [ ] **Order Statuses**
  - [ ] Migrate `OrderStatus` interface
  - [ ] Migrate `demoOrderStatuses` data
- [ ] **Orders**
  - [ ] Migrate `OrderItem` interface
  - [ ] Migrate `Order` interface
  - [ ] Migrate `demoOrders` data

## AI Features

### 4. AI Core

- [ ] **AI Conversations**
  - [ ] Migrate `AIConversation` interface
  - [ ] Migrate `demoAIConversations` data
- [ ] **AI Messages**
  - [ ] Migrate `AIMessage` interface
- [ ] **AI Tools**
  - [ ] Migrate `AITool` interface
  - [ ] Migrate `demoAITools` data
- [ ] **AI Channels**
  - [ ] Migrate `AIChannel` interface
  - [ ] Migrate `demoAIChannels` data
- [ ] **AI Analytics**
  - [ ] Migrate `AIAnalyticsDaily` interface
  - [ ] Migrate `demoAIAnalyticsData` data

### 5. AI Configuration

- [ ] **AI Behavior Settings**
  - [ ] Migrate `AIBehaviorSetting` interface
  - [ ] Migrate `demoAIBehaviorValues` data
- [ ] **AI Upselling Settings**
  - [ ] Migrate `demoUpsellingValues` data
- [ ] **AI Advanced Settings**
  - [ ] Migrate `demoAdvancedBehaviorValues` data
- [ ] **AI Test Scenarios**
  - [ ] Migrate `AITestScenario` interface
  - [ ] Migrate `demoAITestScenarios` data

## User & Company Settings

### 6. User Profile

- [ ] **Staff**
  - [ ] Migrate `Staff` interface
  - [ ] Migrate `demoStaff` data
- [ ] **API Keys**
  - [ ] Migrate `ApiKey` interface
  - [ ] Migrate `demoApiKeys` data
- [ ] **Appearance Settings**
  - [ ] Migrate `AppearanceSettings` interface
  - [ ] Migrate `demoAppearanceSettings` data
- [ ] **Active Sessions**
  - [ ] Migrate `ActiveSession` interface
  - [ ] Migrate `demoActiveSessions` data

### 7. Notifications

- [ ] **Notification Preferences**
  - [ ] Migrate `NotificationPreference` interface
  - [ ] Migrate `demoNotificationPreferences` data
- [ ] **Notifications**
  - [ ] Migrate `Notification` interface
  - [ ] Migrate `demoNotifications` data

### 8. Billing

- [ ] **Subscriptions**
  - [ ] Migrate `Subscription` interface
- [ ] **Payment Methods**
  - [ ] Migrate `PaymentMethod` interface
  - [ ] Migrate `demoPaymentMethods` data
- [ ] **Invoices**
  - [ ] Migrate `Invoice` interface
  - [ ] Migrate `demoInvoices` data

### 9. Company

- [ ] **Company Information**
  - [ ] Migrate `Company` interface
  - [ ] Migrate `demoCompany` data
- [ ] **General Settings**
  - [ ] Migrate `AISettings` interface
  - [ ] Migrate `demoAISettings` data
- [ ] **Channels**
  - [ ] Migrate `Channel` interface
  - [ ] Migrate `demoChannels` data
- [ ] **Greeting Templates**
  - [ ] Migrate `demoGreetingTemplates` data
- [ ] **Upsell Mode**
  - [ ] Migrate `demoUpsellMode` data

## Helper Functions

The following helper functions will need to be replaced with Supabase client queries.

- [ ] `generateMonthlyData`
- [ ] `getCustomerById`
- [ ] `getProductById`
- [ ] `getOrderById`
- [ ] `getConversationById`
- [ ] `getOrdersByCustomerId`
- [ ] `getConversationsByCustomerId`
- [ ] `getConversationByOrderId`
- [ ] `getAIToolById`
- [ ] `getAIBehaviorSettingById`
- [ ] `getAITestScenarioById`
- [ ] `getAIChannelById`
- [ ] `getCustomerOrderStats`
- [ ] `getCustomerAIStats`
- [ ] `getDashboardStats`
- [ ] `getProductStats`
- [ ] `getAIAnalyticsStats`
- [ ] `getChannelStats`
- [ ] `menuItems` (replace with a query)
