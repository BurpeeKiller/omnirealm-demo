import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Get subscription details
    const { data: subscription, error: subError } = await supabaseClient
      .from('omnifit.subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (subError && subError.code !== 'PGRST116') { // PGRST116 = no rows
      console.error('Subscription query error:', subError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch subscription' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Get user features
    const { data: features } = await supabaseClient
      .from('omnifit.user_features')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const isPremium = subscription?.status === 'active' || subscription?.status === 'trialing'
    const plan = subscription?.plan || 'free'

    return new Response(
      JSON.stringify({
        isPremium,
        plan,
        subscription: subscription || null,
        features: features || {
          max_exercises: 3,
          has_ai_coach: false,
          has_advanced_stats: false,
          has_custom_programs: false,
          has_priority_support: false,
        },
        canTrial: !subscription || subscription.status === 'canceled',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Verify subscription error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
