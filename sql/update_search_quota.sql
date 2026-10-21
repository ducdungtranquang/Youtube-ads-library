-- ==============================================================================
-- Migration: Add search limit and tracking columns to user_profiles
-- ==============================================================================

-- 1. Ensure user_profiles table has quota tracking columns
ALTER TABLE IF EXISTS public.user_profiles
ADD COLUMN IF NOT EXISTS daily_search_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_search_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free';

-- 2. Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_search 
ON public.user_profiles(last_search_date);

-- 3. Stored Procedure for atomic search count increment and plan quota check
CREATE OR REPLACE FUNCTION increment_user_search(
  target_user_id UUID,
  feature_type TEXT DEFAULT 'yt'
)
RETURNS JSONB AS $$
DECLARE
  today_date DATE := CURRENT_DATE;
  current_profile RECORD;
  new_count INTEGER;
  user_plan TEXT;
  max_limit INTEGER;
BEGIN
  -- Get user profile
  SELECT * INTO current_profile FROM public.user_profiles WHERE id = target_user_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Profile not found');
  END IF;

  user_plan := LOWER(COALESCE(current_profile.subscription_plan, current_profile.subscription_status, 'free'));
  
  -- Determine limit: Free = 5, Personal = 25, Business/Company = -1 (Unlimited)
  IF user_plan IN ('business', 'company') THEN
    max_limit := -1; -- unlimited
  ELSIF user_plan = 'personal' THEN
    max_limit := 25;
  ELSE
    max_limit := 5;
  END IF;

  -- Reset count if new day
  IF current_profile.last_search_date IS NULL OR current_profile.last_search_date < today_date THEN
    UPDATE public.user_profiles
    SET 
      daily_search_count = 1,
      last_search_date = today_date,
      updated_at = NOW()
    WHERE id = target_user_id;

    RETURN jsonb_build_object(
      'success', true, 
      'used', 1, 
      'limit', max_limit, 
      'remaining', CASE WHEN max_limit = -1 THEN -1 ELSE max_limit - 1 END,
      'plan', user_plan
    );
  END IF;

  -- Check limit
  IF max_limit <> -1 AND current_profile.daily_search_count >= max_limit THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'Daily search limit reached', 
      'used', current_profile.daily_search_count,
      'limit', max_limit,
      'remaining', 0,
      'plan', user_plan
    );
  END IF;

  -- Increment daily search count
  UPDATE public.user_profiles
  SET 
    daily_search_count = daily_search_count + 1,
    updated_at = NOW()
  WHERE id = target_user_id
  RETURNING daily_search_count INTO new_count;

  RETURN jsonb_build_object(
    'success', true, 
    'used', new_count, 
    'limit', max_limit, 
    'remaining', CASE WHEN max_limit = -1 THEN -1 ELSE max_limit - new_count END,
    'plan', user_plan
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
