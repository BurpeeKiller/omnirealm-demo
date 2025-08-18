-- OmniFit Database Schema - Version corrigée avec schéma dédié
-- Version: 2.0.0
-- Date: 2025-08-15

-- Utiliser le schéma omnifit existant
SET search_path TO omnifit, public;

-- Enable UUID extension dans le schéma omnifit
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA omnifit;

-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS omnifit.user_stats CASCADE;
DROP TABLE IF EXISTS omnifit.subscriptions CASCADE;

-- Create subscriptions table dans le schéma omnifit
CREATE TABLE omnifit.subscriptions (
  id UUID PRIMARY KEY DEFAULT omnifit.uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  plan TEXT NOT NULL CHECK (plan IN ('free', 'premium', 'premium_yearly')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_stats table pour la synchronisation
CREATE TABLE omnifit.user_stats (
  id UUID PRIMARY KEY DEFAULT omnifit.uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  exercises_data JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  stats JSONB DEFAULT '{}',
  achievements JSONB DEFAULT '[]',
  last_sync TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_subscriptions_user_id ON omnifit.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON omnifit.subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_customer_id ON omnifit.subscriptions(stripe_customer_id);
CREATE INDEX idx_user_stats_user_id ON omnifit.user_stats(user_id);
CREATE INDEX idx_user_stats_last_sync ON omnifit.user_stats(last_sync);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION omnifit.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON omnifit.subscriptions
  FOR EACH ROW EXECUTE FUNCTION omnifit.update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON omnifit.user_stats
  FOR EACH ROW EXECUTE FUNCTION omnifit.update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE omnifit.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE omnifit.user_stats ENABLE ROW LEVEL SECURITY;

-- Policies for subscriptions
CREATE POLICY "Users can view their own subscription" ON omnifit.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions" ON omnifit.subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- Policies for user_stats
CREATE POLICY "Users can view their own stats" ON omnifit.user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON omnifit.user_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" ON omnifit.user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all stats" ON omnifit.user_stats
  FOR ALL USING (auth.role() = 'service_role');

-- Create a function to get user subscription status
CREATE OR REPLACE FUNCTION omnifit.get_user_subscription(user_uuid UUID)
RETURNS TABLE (
  is_premium BOOLEAN,
  plan TEXT,
  status TEXT,
  expires_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN s.plan IN ('premium', 'premium_yearly') AND s.status = 'active' THEN true
      ELSE false
    END AS is_premium,
    s.plan,
    s.status,
    s.current_period_end as expires_at
  FROM omnifit.subscriptions s
  WHERE s.user_id = user_uuid
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to initialize user with free plan
CREATE OR REPLACE FUNCTION omnifit.init_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a free subscription for new users
  INSERT INTO omnifit.subscriptions (user_id, status, plan)
  VALUES (NEW.id, 'active', 'free');
  
  -- Initialize user stats
  INSERT INTO omnifit.user_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create subscription on user signup
CREATE TRIGGER on_auth_user_created_omnifit
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION omnifit.init_user_subscription();

-- Useful views dans le schéma omnifit
CREATE OR REPLACE VIEW omnifit.active_premium_users AS
SELECT 
  u.id,
  u.email,
  s.plan,
  s.current_period_end,
  s.stripe_customer_id
FROM auth.users u
JOIN omnifit.subscriptions s ON u.id = s.user_id
WHERE s.status = 'active' 
  AND s.plan IN ('premium', 'premium_yearly');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA omnifit TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA omnifit TO authenticated;
GRANT SELECT ON omnifit.active_premium_users TO authenticated;
GRANT EXECUTE ON FUNCTION omnifit.get_user_subscription TO anon, authenticated;

-- Autoriser l'utilisation des séquences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA omnifit TO authenticated;