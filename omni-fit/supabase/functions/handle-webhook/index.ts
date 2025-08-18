import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''

// Create Supabase admin client
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  try {
    // Get the signature from headers
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return new Response('No signature', { status: 400 })
    }

    // Get raw body
    const body = await req.text()

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response('Invalid signature', { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Webhook handler failed', { status: 500 })
  }
})

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (!session.customer || !session.subscription) return

  const customerId = session.customer as string
  const subscriptionId = session.subscription as string

  // Get full subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  
  // Get user ID from customer
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
  const userId = customer.metadata.supabase_user_id

  if (!userId) {
    console.error('No user ID in customer metadata')
    return
  }

  // Update subscription in database
  const { error } = await supabaseAdmin
    .from('omnifit.subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      stripe_price_id: subscription.items.data[0].price.id,
      status: subscription.status,
      plan: getPlanFromPriceId(subscription.items.data[0].price.id),
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
      metadata: {
        stripe_product_id: subscription.items.data[0].price.product,
      },
    })

  if (error) {
    console.error('Error updating subscription:', error)
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  
  // Get customer
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
  const userId = customer.metadata.supabase_user_id

  if (!userId) return

  // Update subscription
  const { error } = await supabaseAdmin
    .from('omnifit.subscriptions')
    .update({
      status: subscription.status,
      plan: getPlanFromPriceId(subscription.items.data[0].price.id),
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('Error updating subscription:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Update status to canceled
  const { error } = await supabaseAdmin
    .from('omnifit.subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('Error canceling subscription:', error)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return

  // Update subscription status
  const { error } = await supabaseAdmin
    .from('omnifit.subscriptions')
    .update({
      status: 'past_due',
    })
    .eq('stripe_subscription_id', invoice.subscription)

  if (error) {
    console.error('Error updating subscription status:', error)
  }
}

function getPlanFromPriceId(priceId: string): string {
  // Map your Stripe price IDs to plan names
  const priceMap: Record<string, string> = {
    [Deno.env.get('STRIPE_PRICE_PREMIUM_MONTHLY') || '']: 'premium',
    [Deno.env.get('STRIPE_PRICE_PREMIUM_YEARLY') || '']: 'premium_yearly',
  }
  
  return priceMap[priceId] || 'free'
}