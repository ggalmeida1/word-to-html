import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

interface User {
  id: string;
  email: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  api_key: string;
  created_at: string;
}

interface RateLimitCheck {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  message: string;
}

// Rate limits by plan (conversions per month)
const RATE_LIMITS = {
  free: 100,
  starter: 2000,
  pro: 10000,
  enterprise: 100000
};

export async function validateApiKey(supabase: SupabaseClient, apiKey: string): Promise<User | null> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('api_key', apiKey)
      .single();

    if (error || !user) {
      console.error('API key validation failed:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error validating API key:', error);
    return null;
  }
}

export async function checkRateLimit(
  supabase: SupabaseClient, 
  userId: string, 
  plan: string
): Promise<RateLimitCheck> {
  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Get usage for current month
    const { data: conversions, error } = await supabase
      .from('conversions')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', new Date(currentYear, currentMonth, 1).toISOString())
      .lt('created_at', new Date(currentYear, currentMonth + 1, 1).toISOString());

    if (error) {
      console.error('Error checking rate limit:', error);
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(currentYear, currentMonth + 1, 1),
        message: 'Error checking rate limit'
      };
    }

    const currentUsage = conversions?.length || 0;
    const limit = RATE_LIMITS[plan as keyof typeof RATE_LIMITS] || RATE_LIMITS.free;
    const remaining = Math.max(0, limit - currentUsage);
    const resetTime = new Date(currentYear, currentMonth + 1, 1);

    return {
      allowed: currentUsage < limit,
      remaining,
      resetTime,
      message: remaining === 0 
        ? `Monthly limit of ${limit} conversions reached. Resets on ${resetTime.toDateString()}`
        : `${remaining} conversions remaining this month`
    };

  } catch (error) {
    console.error('Error in rate limit check:', error);
    return {
      allowed: false,
      remaining: 0,
      resetTime: new Date(),
      message: 'Error checking rate limit'
    };
  }
}

export async function generateApiKey(): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'wth_'; // prefix for "word to html"
  
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

export async function createUser(
  supabase: SupabaseClient,
  email: string,
  plan: string = 'free'
): Promise<{ user: User | null, error: string | null }> {
  try {
    const apiKey = await generateApiKey();
    
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email,
        plan,
        api_key: apiKey
      })
      .select()
      .single();

    if (error) {
      return { user: null, error: error.message };
    }

    return { user, error: null };
  } catch (error) {
    return { user: null, error: 'Failed to create user' };
  }
}

export async function getUserUsage(
  supabase: SupabaseClient,
  userId: string
): Promise<{
  currentMonth: number;
  lastMonth: number;
  total: number;
  limit: number;
  plan: string;
}> {
  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Get user to check plan
    const { data: user } = await supabase
      .from('users')
      .select('plan')
      .eq('id', userId)
      .single();

    const plan = user?.plan || 'free';
    const limit = RATE_LIMITS[plan as keyof typeof RATE_LIMITS];

    // Get current month usage
    const { data: currentMonthConversions } = await supabase
      .from('conversions')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', new Date(currentYear, currentMonth, 1).toISOString())
      .lt('created_at', new Date(currentYear, currentMonth + 1, 1).toISOString());

    // Get last month usage
    const { data: lastMonthConversions } = await supabase
      .from('conversions')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', new Date(lastMonthYear, lastMonth, 1).toISOString())
      .lt('created_at', new Date(lastMonthYear, lastMonth + 1, 1).toISOString());

    // Get total usage
    const { data: totalConversions } = await supabase
      .from('conversions')
      .select('id')
      .eq('user_id', userId);

    return {
      currentMonth: currentMonthConversions?.length || 0,
      lastMonth: lastMonthConversions?.length || 0,
      total: totalConversions?.length || 0,
      limit,
      plan
    };

  } catch (error) {
    console.error('Error getting user usage:', error);
    return {
      currentMonth: 0,
      lastMonth: 0,
      total: 0,
      limit: RATE_LIMITS.free,
      plan: 'free'
    };
  }
} 