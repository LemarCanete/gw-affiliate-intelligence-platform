"use client";
import React, { useCallback } from "react";
import { useGlobal } from "@/lib/context/GlobalContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ScoreBadge } from "@/components/dashboard/ScoreBadge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ChartCard } from "@/components/dashboard/ChartCard";
import {
  DollarSign,
  Package,
  Layers,
  Activity,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import {
  getOverviewKpis,
  getAlerts,
  getRevenueTrend,
  getTopProducts,
  getFeedActivity,
} from "@/lib/mock-data/overview";
import type { Product, Alert } from "@/lib/types/domain";

const alertIcons: Record<Alert["type"], React.ElementType> = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
};

const alertColors: Record<Alert["type"], string> = {
  success: "text-green-600",
  warning: "text-yellow-600",
  error: "text-red-600",
  info: "text-blue-600",
};

export default function OverviewPage() {
  const { loading: userLoading } = useGlobal();
  const { data: kpis, loading: kpisLoading } = useAsyncData(
    useCallback(() => getOverviewKpis(), [])
  );
  const { data: alerts } = useAsyncData(
    useCallback(() => getAlerts(), [])
  );
  const { data: revenueTrend } = useAsyncData(
    useCallback(() => getRevenueTrend(), [])
  );
  const { data: topProducts } = useAsyncData(
    useCallback(() => getTopProducts(), [])
  );
  const { data: feedActivity } = useAsyncData(
    useCallback(() => getFeedActivity(), [])
  );

  if (userLoading || kpisLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Overview"
        description="Your affiliate intelligence dashboard at a glance"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Revenue"
          value={`$${(kpis?.totalRevenue ?? 0).toLocaleString()}`}
          change={kpis?.revenueChange}
          icon={DollarSign}
        />
        <KpiCard
          title="Active Products"
          value={kpis?.activeProducts ?? 0}
          change={kpis?.productsChange}
          icon={Package}
        />
        <KpiCard
          title="Pipeline Items"
          value={kpis?.pipelineItems ?? 0}
          change={kpis?.pipelineChange}
          icon={Layers}
        />
        <KpiCard
          title="Feeds Healthy"
          value={`${kpis?.feedsHealthy ?? 0}/${kpis?.feedsTotal ?? 0}`}
          icon={Activity}
        />
      </div>

      {/* Revenue Chart + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Revenue Trend" description="Last 30 days">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(value: number) => [`$${value}`, "Revenue"]}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(alerts ?? []).slice(0, 5).map((alert) => {
              const IconComp = alertIcons[alert.type];
              return (
                <div key={alert.id} className="flex gap-3 items-start">
                  <IconComp className={`h-4 w-4 mt-0.5 shrink-0 ${alertColors[alert.type]}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{alert.title}</p>
                    <p className="text-xs text-gray-500">{alert.message}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top 5 Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 font-medium text-gray-500">Product</th>
                  <th className="pb-2 font-medium text-gray-500">Score</th>
                  <th className="pb-2 font-medium text-gray-500">Status</th>
                  <th className="pb-2 font-medium text-gray-500 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {(topProducts ?? []).map((product: Product) => (
                  <tr key={product.id} className="border-b last:border-0">
                    <td className="py-2 font-medium text-gray-900">{product.name}</td>
                    <td className="py-2"><ScoreBadge score={product.score.total} /></td>
                    <td className="py-2"><StatusBadge status={product.status} /></td>
                    <td className="py-2 text-right text-gray-900">${product.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Feed Activity */}
      <ChartCard title="Feed Activity" description="Items discovered per feed this week">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={feedActivity ?? []} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="feed"
              tick={{ fontSize: 12 }}
              width={150}
            />
            <Tooltip />
            <Bar dataKey="items" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
