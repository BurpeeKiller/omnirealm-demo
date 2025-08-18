-- Création du schéma omnifit s'il n'existe pas
CREATE SCHEMA IF NOT EXISTS omnifit;

-- Table pour les abonnements
CREATE TABLE IF NOT EXISTS omnifit.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  status TEXT DEFAULT 'free' CHECK (status IN ('free', 'trialing', 'active', 'canceled', 'past_due', 'incomplete')),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'premium_monthly', 'premium_yearly')),
  current_period_end TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON omnifit.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON omnifit.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON omnifit.subscriptions(status);

-- Table pour l'historique des paiements
CREATE TABLE IF NOT EXISTS omnifit.payment_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_invoice_id TEXT,
  amount INTEGER NOT NULL, -- Montant en centimes
  currency TEXT DEFAULT 'eur',
  status TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour l'historique
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON omnifit.payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_created_at ON omnifit.payment_history(created_at DESC);

-- Table pour les features/limites
CREATE TABLE IF NOT EXISTS omnifit.user_features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  max_exercises INTEGER DEFAULT 3, -- Limite gratuite
  has_ai_coach BOOLEAN DEFAULT false,
  has_advanced_stats BOOLEAN DEFAULT false,
  has_custom_programs BOOLEAN DEFAULT false,
  has_priority_support BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION omnifit.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON omnifit.subscriptions
  FOR EACH ROW EXECUTE FUNCTION omnifit.update_updated_at_column();

CREATE TRIGGER update_user_features_updated_at BEFORE UPDATE ON omnifit.user_features
  FOR EACH ROW EXECUTE FUNCTION omnifit.update_updated_at_column();

-- Function pour mettre à jour les features selon le plan
CREATE OR REPLACE FUNCTION omnifit.update_user_features_from_subscription()
RETURNS TRIGGER AS $$
BEGIN
  -- Si l'utilisateur devient premium
  IF NEW.status = 'active' AND NEW.plan IN ('premium_monthly', 'premium_yearly') THEN
    INSERT INTO omnifit.user_features (
      user_id,
      max_exercises,
      has_ai_coach,
      has_advanced_stats,
      has_custom_programs,
      has_priority_support
    ) VALUES (
      NEW.user_id,
      999, -- Illimité
      true,
      true,
      true,
      true
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
      max_exercises = 999,
      has_ai_coach = true,
      has_advanced_stats = true,
      has_custom_programs = true,
      has_priority_support = true,
      updated_at = NOW();
  
  -- Si l'utilisateur est en essai
  ELSIF NEW.status = 'trialing' THEN
    INSERT INTO omnifit.user_features (
      user_id,
      max_exercises,
      has_ai_coach,
      has_advanced_stats,
      has_custom_programs,
      has_priority_support
    ) VALUES (
      NEW.user_id,
      999, -- Illimité pendant l'essai
      true,
      true,
      true,
      true
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
      max_exercises = 999,
      has_ai_coach = true,
      has_advanced_stats = true,
      has_custom_programs = true,
      has_priority_support = true,
      updated_at = NOW();
  
  -- Si l'utilisateur redevient gratuit
  ELSIF NEW.status IN ('canceled', 'past_due', 'incomplete') OR NEW.plan = 'free' THEN
    INSERT INTO omnifit.user_features (
      user_id,
      max_exercises,
      has_ai_coach,
      has_advanced_stats,
      has_custom_programs,
      has_priority_support
    ) VALUES (
      NEW.user_id,
      3, -- Limite gratuite
      false,
      false,
      false,
      false
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
      max_exercises = 3,
      has_ai_coach = false,
      has_advanced_stats = false,
      has_custom_programs = false,
      has_priority_support = false,
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour synchroniser les features avec les subscriptions
CREATE TRIGGER sync_user_features_on_subscription_change
  AFTER INSERT OR UPDATE ON omnifit.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION omnifit.update_user_features_from_subscription();

-- RLS (Row Level Security)
ALTER TABLE omnifit.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE omnifit.payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE omnifit.user_features ENABLE ROW LEVEL SECURITY;

-- Policies pour subscriptions
CREATE POLICY "Users can view own subscription" ON omnifit.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions" ON omnifit.subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- Policies pour payment_history
CREATE POLICY "Users can view own payment history" ON omnifit.payment_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage payment history" ON omnifit.payment_history
  FOR ALL USING (auth.role() = 'service_role');

-- Policies pour user_features
CREATE POLICY "Users can view own features" ON omnifit.user_features
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage features" ON omnifit.user_features
  FOR ALL USING (auth.role() = 'service_role');

-- Fonction helper pour vérifier si un utilisateur est premium
CREATE OR REPLACE FUNCTION omnifit.is_user_premium(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_premium BOOLEAN;
BEGIN
  SELECT 
    CASE 
      WHEN s.status IN ('active', 'trialing') AND s.plan != 'free' THEN true
      ELSE false
    END INTO v_is_premium
  FROM omnifit.subscriptions s
  WHERE s.user_id = p_user_id
  LIMIT 1;
  
  RETURN COALESCE(v_is_premium, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant nécessaires
GRANT USAGE ON SCHEMA omnifit TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA omnifit TO anon, authenticated;
GRANT EXECUTE ON FUNCTION omnifit.is_user_premium TO anon, authenticated;