"use client";

import React, { useState, useCallback } from "react";
import { useGlobal } from "@/lib/context/GlobalContext";
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

interface BillingData {
  currentPlan: string;
  status: "active" | "trialing" | "past_due" | "cancelled";
  trialEndsAt: string | null;
  currentPeriodEnd: string;
  paymentMethod: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  } | null;
  usage: UsageMetric[];
  invoices: Invoice[];
}

// ── Mock data ────────────────────────────────────────────────────────

async function getBillingData(): Promise<BillingData> {
  await new Promise((r) => setTimeout(r, 100));
  return {
    currentPlan: "Pro",
    status: "active",
    trialEndsAt: null,
    currentPeriodEnd: "2026-04-17",
    paymentMethod: {
      brand: "Visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2027,
    },
    usage: [
      { label: "Active Feeds", current: 6, limit: 8, unit: "feeds" },
      { label: "Products Tracked", current: 187, limit: 500, unit: "products" },
      { label: "Content Generated", current: 42, limit: null, unit: "pieces" },
      { label: "API Calls", current: 12840, limit: 50000, unit: "calls" },
    ],
    invoices: [
      { id: "inv-006", date: "2026-03-01", amount: 149, status: "paid", pdfUrl: "#" },
      { id: "inv-005", date: "2026-02-01", amount: 149, status: "paid", pdfUrl: "#" },
      { id: "inv-004", date: "2026-01-01", amount: 149, status: "paid", pdfUrl: "#" },
      { id: "inv-003", date: "2025-12-01", amount: 49, status: "paid", pdfUrl: "#" },
      { id: "inv-002", date: "2025-11-01", amount: 49, status: "paid", pdfUrl: "#" },
      { id: "inv-001", date: "2025-10-01", amount: 0, status: "paid", pdfUrl: "#" },
    ],
  };
}

// ── Plan data from env ───────────────────────────────────────────────

const PLAN_NAMES = (process.env.NEXT_PUBLIC_TIERS_NAMES || "Starter,Pro,Enterprise").split(",");
const PLAN_PRICES = (process.env.NEXT_PUBLIC_TIERS_PRICES || "49,149,399").split(",").map(Number);
const PLAN_DESCRIPTIONS = (process.env.NEXT_PUBLIC_TIERS_DESCRIPTIONS || ",,").split(",");
const PLAN_FEATURES = (process.env.NEXT_PUBLIC_TIERS_FEATURES || ",,")
  .split(",")
  .map((f) => f.split("|"));
const POPULAR_TIER = process.env.NEXT_PUBLIC_POPULAR_TIER || "Pro";

// ── Helpers ──────────────────────────────────────────────────────────

function getStatusBadge(status: BillingData["status"]) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
    case "trialing":
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Trial</Badge>;
    case "past_due":
      return <Badge className="bg-red-100 text-red-800 border-red-200">Past Due</Badge>;
    case "cancelled":
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Cancelled</Badge>;
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

// ── Page ─────────────────────────────────────────────────────────────

export default function BillingPage() {
  const { loading: userLoading } = useGlobal();
  const { data: billing, loading } = useAsyncData(
    useCallback(() => getBillingData(), [])
  );
  const [changingPlan, setChangingPlan] = useState(false);

  if (userLoading || loading || !billing) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

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
              {getStatusBadge(billing.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {billing.currentPlan}
              </span>
              <span className="text-lg text-gray-500">
                ${PLAN_PRICES[PLAN_NAMES.indexOf(billing.currentPlan)]}/mo
              </span>
            </div>
            {billing.trialEndsAt && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <AlertCircle className="h-4 w-4" />
                Trial ends {new Date(billing.trialEndsAt).toLocaleDateString()}
              </div>
            )}
            <p className="text-sm text-gray-500">
              Next billing date: {new Date(billing.currentPeriodEnd).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
            <button
              onClick={() => setChangingPlan(!changingPlan)}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {changingPlan ? "Cancel" : "Change plan"}
            </button>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {billing.paymentMethod ? (
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <CreditCard className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {billing.paymentMethod.brand} ending in {billing.paymentMethod.last4}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expires {billing.paymentMethod.expMonth}/{billing.paymentMethod.expYear}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No payment method on file</p>
            )}
            <button
              onClick={() => console.log("Open Stripe customer portal")}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Manage payment method
              <ExternalLink className="h-3 w-3" />
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Plan Selection (conditionally shown) */}
      {changingPlan && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLAN_NAMES.map((name, idx) => {
            const isCurrent = name === billing.currentPlan;
            const isPopular = name === POPULAR_TIER;
            return (
              <Card
                key={name}
                className={`relative ${isPopular ? "border-primary-500 border-2" : ""} ${isCurrent ? "bg-primary-50/30" : ""}`}
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
                    onClick={() => console.log(`Switch to ${name}`)}
                    disabled={isCurrent}
                    className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      isCurrent
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-primary-600 text-white hover:bg-primary-700"
                    }`}
                  >
                    {isCurrent ? "Current Plan" : idx > PLAN_NAMES.indexOf(billing.currentPlan) ? "Upgrade" : "Downgrade"}
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
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
                      <button
                        onClick={() => console.log(`Download ${invoice.id}`)}
                        className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                      >
                        <Download className="h-3.5 w-3.5" />
                        PDF
                      </button>
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
