"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useGlobal } from "@/lib/context/GlobalContext";
import { createSPAClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import {
  CreditCard,
  Check,
  Download,
  ExternalLink,
  Zap,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  pdfUrl: string;
}

interface UsageMetric {
  label: string;
  current: number;
  limit: number | null; // null = unlimited
  unit: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price_monthly: number;
  description: string | null;
  features: string[];
  stripe_price_id: string | null;
  product_key: string;
  sort_order: number;
}

interface UserSubscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan_id: string | null;
  status: "active" | "trialing" | "past_due" | "cancelled" | "incomplete";
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  plan?: SubscriptionPlan;
}

interface BillingData {
  subscription: UserSubscription | null;
  plans: SubscriptionPlan[];
  invoices: Invoice[];
  usage: UsageMetric[];
}

// ── Mock / fallback data ─────────────────────────────────────────────

const MOCK_USAGE: UsageMetric[] = [
  { label: "Active Feeds", current: 6, limit: 8, unit: "feeds" },
  { label: "Products Tracked", current: 187, limit: 500, unit: "products" },
  { label: "Content Generated", current: 42, limit: null, unit: "pieces" },
  { label: "API Calls", current: 12840, limit: 50000, unit: "calls" },
];

const MOCK_INVOICES: Invoice[] = [
  { id: "inv-006", date: "2026-03-01", amount: 149, status: "paid", pdfUrl: "#" },
  { id: "inv-005", date: "2026-02-01", amount: 149, status: "paid", pdfUrl: "#" },
  { id: "inv-004", date: "2026-01-01", amount: 149, status: "paid", pdfUrl: "#" },
  { id: "inv-003", date: "2025-12-01", amount: 49, status: "paid", pdfUrl: "#" },
  { id: "inv-002", date: "2025-11-01", amount: 49, status: "paid", pdfUrl: "#" },
  { id: "inv-001", date: "2025-10-01", amount: 0, status: "paid", pdfUrl: "#" },
];

// ── Plan data from env (fallback when no DB plans) ───────────────────

const PLAN_NAMES = (process.env.NEXT_PUBLIC_TIERS_NAMES || "Starter,Pro,Enterprise").split(",");
const PLAN_PRICES = (process.env.NEXT_PUBLIC_TIERS_PRICES || "49,149,399").split(",").map(Number);
const PLAN_DESCRIPTIONS = (process.env.NEXT_PUBLIC_TIERS_DESCRIPTIONS || ",,").split(",");
const PLAN_FEATURES = (process.env.NEXT_PUBLIC_TIERS_FEATURES || ",,")
  .split(",")
  .map((f) => f.split("|"));
const POPULAR_TIER = process.env.NEXT_PUBLIC_POPULAR_TIER || "Pro";

// ── Data fetching ────────────────────────────────────────────────────

async function getBillingData(userId: string): Promise<BillingData> {
  const supabase = createSPAClient();

  // Fetch subscription with joined plan
  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("*, plan:subscription_plans(*)")
    .eq("user_id", userId)
    .single();

  // Fetch available plans
  const { data: plans } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("product_key", "gw-combined")
    .order("sort_order", { ascending: true });

  // Fetch invoices
  const { data: rawInvoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  const invoices: Invoice[] = rawInvoices?.length
    ? rawInvoices.map((inv: Record<string, unknown>) => ({
        id: inv.stripe_invoice_id as string,
        date: inv.period_start as string,
        amount: inv.amount_paid as number,
        status: inv.status as Invoice["status"],
        pdfUrl: (inv.invoice_pdf as string) || "#",
      }))
    : MOCK_INVOICES;

  return {
    subscription: subscription || null,
    plans: plans || [],
    usage: MOCK_USAGE, // Usage metrics come from a different system — keep mock for now
    invoices,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
    case "trialing":
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Trial</Badge>;
    case "past_due":
      return <Badge className="bg-red-100 text-red-800 border-red-200">Past Due</Badge>;
    case "cancelled":
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Cancelled</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
  }
}

function getInvoiceStatusBadge(status: Invoice["status"]) {
  switch (status) {
    case "paid":
      return <Badge className="bg-green-50 text-green-700">Paid</Badge>;
    case "pending":
      return <Badge className="bg-yellow-50 text-yellow-700">Pending</Badge>;
    case "failed":
      return <Badge className="bg-red-50 text-red-700">Failed</Badge>;
  }
}

// ── Stripe actions ───────────────────────────────────────────────────

async function handleCheckout(priceId: string, userId: string, userEmail: string) {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId, userId, userEmail }),
  });

  const data = await res.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    console.error("Checkout error:", data.error);
  }
}

async function handlePortal(customerId: string) {
  const res = await fetch("/api/stripe/portal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId }),
  });

  const data = await res.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    console.error("Portal error:", data.error);
  }
}

// ── Plan Selection Component ─────────────────────────────────────────

interface PlanSelectionProps {
  plans: SubscriptionPlan[];
  currentPlanId: string | null;
  userId: string;
  userEmail: string;
  actionLoading: string | null;
  onAction: (planId: string) => void;
}

function PlanSelection({ plans, currentPlanId, userId, userEmail, actionLoading, onAction }: PlanSelectionProps) {
  // Use DB plans if available, otherwise fall back to env-based plans
  const hasDbPlans = plans.length > 0;

  if (hasDbPlans) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const isPopular = plan.sort_order === 2; // Middle tier
          const isLoading = actionLoading === plan.id;
          return (
            <Card
              key={plan.id}
              className={`relative ${isPopular ? "border-primary-500 border-2" : ""} ${isCurrent ? "bg-primary-50/30" : ""}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary-600 text-white">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">${plan.price_monthly}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-2">
                  {plan.features?.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.stripe_price_id ? (
                  <button
                    onClick={() => {
                      onAction(plan.id);
                      handleCheckout(plan.stripe_price_id!, userId, userEmail);
                    }}
                    disabled={isCurrent || isLoading}
                    className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      isCurrent
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-primary-600 text-white hover:bg-primary-700"
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    ) : isCurrent ? (
                      "Current Plan"
                    ) : (
                      "Get Started"
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-2 px-4 rounded-lg text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // Fallback: env-based plans (no Stripe integration)
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {PLAN_NAMES.map((name, idx) => {
        const isPopular = name === POPULAR_TIER;
        return (
          <Card
            key={name}
            className={`relative ${isPopular ? "border-primary-500 border-2" : ""}`}
          >
            {isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary-600 text-white">Most Popular</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription>{PLAN_DESCRIPTIONS[idx]}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">${PLAN_PRICES[idx]}</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-2">
                {PLAN_FEATURES[idx]?.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                disabled
                className="w-full py-2 px-4 rounded-lg text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
              >
                Coming Soon
              </button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

export default function BillingPage() {
  const { user, loading: userLoading } = useGlobal();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [changingPlan, setChangingPlan] = useState(false);

  const { data: billing, loading } = useAsyncData(
    useCallback(() => {
      if (!user) return Promise.resolve(null);
      return getBillingData(user.id);
    }, [user])
  );

  // If user has no subscription, show plan selection by default
  const hasSubscription = billing?.subscription && billing.subscription.status !== "cancelled";

  // Check for session_id in URL (returning from Stripe Checkout)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("session_id")) {
      // Remove the query param from URL without reload
      window.history.replaceState({}, "", "/app/billing");
    }
  }, []);

  if (userLoading || loading || !billing) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  // ── No subscription: show plan selection ────────────────────────────
  if (!hasSubscription) {
    return (
      <div className="space-y-6 p-6">
        <PageHeader
          title="Choose a Plan"
          description="Select the plan that best fits your needs to get started"
        />
        <PlanSelection
          plans={billing.plans}
          currentPlanId={null}
          userId={user!.id}
          userEmail={user!.email}
          actionLoading={actionLoading}
          onAction={setActionLoading}
        />
      </div>
    );
  }

  // ── Active subscription view ────────────────────────────────────────
  const sub = billing.subscription!;
  const planName = sub.plan?.name || "Unknown";
  const planPrice = sub.plan?.price_monthly ?? 0;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Billing"
        description="Manage your subscription, payment method, and invoices"
      />

      {/* Current Plan + Payment Method */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Current Plan</CardTitle>
              {getStatusBadge(sub.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{planName}</span>
              <span className="text-lg text-gray-500">${planPrice}/mo</span>
            </div>
            {sub.status === "trialing" && sub.current_period_end && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <AlertCircle className="h-4 w-4" />
                Trial ends {new Date(sub.current_period_end).toLocaleDateString()}
              </div>
            )}
            {sub.cancel_at_period_end && (
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <AlertCircle className="h-4 w-4" />
                Cancels at end of period
              </div>
            )}
            {sub.current_period_end && (
              <p className="text-sm text-gray-500">
                Next billing date:{" "}
                {new Date(sub.current_period_end).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
            <button
              onClick={() => setChangingPlan(!changingPlan)}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {changingPlan ? "Cancel" : "Change plan"}
            </button>
          </CardContent>
        </Card>

        {/* Payment Method / Manage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <CreditCard className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Managed by Stripe
                </p>
                <p className="text-sm text-gray-500">
                  Click below to update your payment details
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                if (sub.stripe_customer_id) {
                  handlePortal(sub.stripe_customer_id);
                }
              }}
              disabled={!sub.stripe_customer_id}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Manage subscription
              <ExternalLink className="h-3 w-3" />
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Plan Selection (conditionally shown) */}
      {changingPlan && (
        <PlanSelection
          plans={billing.plans}
          currentPlanId={sub.plan_id}
          userId={user!.id}
          userEmail={user!.email}
          actionLoading={actionLoading}
          onAction={setActionLoading}
        />
      )}

      {/* Usage */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary-600" />
            <CardTitle className="text-base font-semibold">Usage This Period</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {billing.usage.map((metric) => {
              const percentage = metric.limit
                ? Math.round((metric.current / metric.limit) * 100)
                : null;
              const isHigh = percentage !== null && percentage >= 80;
              return (
                <div key={metric.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{metric.label}</span>
                    {isHigh && <AlertCircle className="h-3.5 w-3.5 text-amber-500" />}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {metric.current.toLocaleString()}
                    {metric.limit && (
                      <span className="text-sm font-normal text-gray-400">
                        /{metric.limit.toLocaleString()}
                      </span>
                    )}
                    {!metric.limit && (
                      <span className="text-sm font-normal text-gray-400"> {metric.unit}</span>
                    )}
                  </p>
                  {metric.limit && (
                    <div className="h-1.5 w-full rounded-full bg-gray-100">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          isHigh ? "bg-amber-500" : "bg-primary-500"
                        }`}
                        style={{ width: `${Math.min(percentage!, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left font-medium text-gray-500">Date</th>
                  <th className="pb-3 text-left font-medium text-gray-500">Amount</th>
                  <th className="pb-3 text-left font-medium text-gray-500">Status</th>
                  <th className="pb-3 text-right font-medium text-gray-500">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {billing.invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b last:border-0">
                    <td className="py-3 text-gray-900">
                      {new Date(invoice.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 font-medium text-gray-900">
                      {invoice.amount === 0 ? "Free" : `$${invoice.amount.toFixed(2)}`}
                    </td>
                    <td className="py-3">{getInvoiceStatusBadge(invoice.status)}</td>
                    <td className="py-3 text-right">
                      {invoice.pdfUrl && invoice.pdfUrl !== "#" ? (
                        <a
                          href={invoice.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                        >
                          <Download className="h-3.5 w-3.5" />
                          PDF
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-sm text-gray-400">
                          <Download className="h-3.5 w-3.5" />
                          PDF
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
