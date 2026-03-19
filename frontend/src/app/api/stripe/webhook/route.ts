export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabaseAdmin = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.PRIVATE_SUPABASE_SERVICE_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.PRIVATE_SUPABASE_SERVICE_KEY)
  : null;

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? '';

// ── Helpers ──────────────────────────────────────────────────────────

function getSubscriptionPeriod(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0];
  return {
    current_period_start: item
      ? new Date(item.current_period_start * 1000).toISOString()
      : new Date().toISOString(),
    current_period_end: item
      ? new Date(item.current_period_end * 1000).toISOString()
      : new Date().toISOString(),
  };
}

function getSubscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const subDetails = invoice.parent?.subscription_details;
  if (!subDetails) return null;
  return typeof subDetails.subscription === 'string'
    ? subDetails.subscription
    : subDetails.subscription?.id ?? null;
}

// ── Event handlers ───────────────────────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId || !subscriptionId) return;

  // Fetch full subscription details from Stripe
  const subscription = await stripe!.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price.id;
  const productId = subscription.items.data[0]?.price.product as string;
  const period = getSubscriptionPeriod(subscription);

  // Look up the plan in our subscription_plans table
  const { data: plan } = await supabaseAdmin!
    .from('subscription_plans')
    .select('id')
    .eq('stripe_price_id', priceId)
    .single();

  await supabaseAdmin!.from('user_subscriptions').upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      stripe_price_id: priceId,
      stripe_product_id: productId,
      plan_id: plan?.id || null,
      status: subscription.status,
      current_period_start: period.current_period_start,
      current_period_end: period.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const priceId = subscription.items.data[0]?.price.id;
  const period = getSubscriptionPeriod(subscription);

  // Look up the plan
  const { data: plan } = await supabaseAdmin!
    .from('subscription_plans')
    .select('id')
    .eq('stripe_price_id', priceId)
    .single();

  await supabaseAdmin!
    .from('user_subscriptions')
    .update({
      status: subscription.status,
      stripe_price_id: priceId,
      plan_id: plan?.id || null,
      current_period_start: period.current_period_start,
      current_period_end: period.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await supabaseAdmin!
    .from('user_subscriptions')
    .update({
      status: 'cancelled',
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = getSubscriptionIdFromInvoice(invoice);
  if (!subscriptionId) return;

  // Find the user from user_subscriptions
  const { data: sub } = await supabaseAdmin!
    .from('user_subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (!sub) return;

  await supabaseAdmin!.from('invoices').upsert(
    {
      stripe_invoice_id: invoice.id,
      user_id: sub.user_id,
      stripe_subscription_id: subscriptionId,
      amount_paid: (invoice.amount_paid || 0) / 100,
      currency: invoice.currency,
      status: 'paid',
      invoice_url: invoice.hosted_invoice_url || null,
      invoice_pdf: invoice.invoice_pdf || null,
      period_start: new Date(invoice.period_start * 1000).toISOString(),
      period_end: new Date(invoice.period_end * 1000).toISOString(),
      created_at: new Date().toISOString(),
    },
    { onConflict: 'stripe_invoice_id' }
  );
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = getSubscriptionIdFromInvoice(invoice);
  if (!subscriptionId) return;

  await supabaseAdmin!
    .from('user_subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);
}

// ── Webhook endpoint ─────────────────────────────────────────────────

export async function POST(request: Request) {
  if (!stripe || !supabaseAdmin) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        // Unhandled event type — ignore
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
