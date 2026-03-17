"use client";

import React, { useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import {
  DollarSign,
  Users,
  ClipboardList,
  Activity,
} from "lucide-react";
import {
  getSubscriptionMetrics,
  getApiHealth,
  getErrorLogs,
  getModerationQueue,
} from "@/lib/mock-data/admin";
import type {
  SubscriptionMetrics,
  ApiHealthCheck,
  ErrorLogEntry,
  ModerationItem,
} from "@/lib/mock-data/admin";

const statusDotColor: Record<ApiHealthCheck["status"], string> = {
  operational: "bg-green-500",
  degraded: "bg-yellow-500",
  down: "bg-red-500",
};

const severityBadge: Record<ErrorLogEntry["severity"], { label: string; className: string }> = {
  error: { label: "Error", className: "bg-red-100 text-red-700 border-red-200" },
  warning: { label: "Warning", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  info: { label: "Info", className: "bg-blue-100 text-blue-700 border-blue-200" },
};

function formatRelativeTime(iso: string): string {
  const diff = new Date("2026-03-17T10:30:00").getTime() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AdminDashboardPage() {
  const fetchMetrics = useCallback(() => getSubscriptionMetrics(), []);
  const fetchHealth = useCallback(() => getApiHealth(), []);
  const fetchErrors = useCallback(() => getErrorLogs(), []);
  const fetchModeration = useCallback(() => getModerationQueue(), []);

  const { data: metrics } = useAsyncData<SubscriptionMetrics>(fetchMetrics);
  const { data: health } = useAsyncData<ApiHealthCheck[]>(fetchHealth);
  const { data: errors } = useAsyncData<ErrorLogEntry[]>(fetchErrors);
  const { data: moderation } = useAsyncData<ModerationItem[]>(fetchModeration);

  const pendingCount = moderation?.filter((m) => m.status === "pending").length ?? 0;
  const operationalCount = health?.filter((h) => h.status === "operational").length ?? 0;
  const totalApis = health?.length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <PageHeader title="Admin Panel" description="System administration and monitoring" />
        <Badge className="bg-red-100 text-red-700 border-red-200 ml-2">Admin</Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="MRR"
          value={metrics ? `$${metrics.mrr.toLocaleString()}` : "--"}
          change={metrics?.mrrChange}
          icon={DollarSign}
        />
        <KpiCard
          title="Active Users"
          value={metrics?.activeUsers ?? "--"}
          icon={Users}
        />
        <KpiCard
          title="Moderation Queue"
          value={`${pendingCount} pending`}
          icon={ClipboardList}
        />
        <KpiCard
          title="System Health"
          value={`${operationalCount}/${totalApis} operational`}
          icon={Activity}
        />
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Health Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">API Health Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {health?.map((api) => (
              <div key={api.name} className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusDotColor[api.status]}`} />
                <span className="text-sm font-medium text-gray-900 w-36 shrink-0">{api.name}</span>
                <span className="text-xs text-gray-500 w-16 shrink-0">
                  {api.status === "down" ? "-- ms" : `${api.latency} ms`}
                </span>
                {api.rateLimit ? (
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          api.rateLimit.used / api.rateLimit.total > 0.9
                            ? "bg-red-500"
                            : api.rateLimit.used / api.rateLimit.total > 0.7
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${(api.rateLimit.used / api.rateLimit.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-20 text-right shrink-0">
                      {api.rateLimit.used}/{api.rateLimit.total}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 flex-1">No rate limit</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Error Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Error Logs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {errors?.slice(0, 5).map((entry) => {
              const badge = severityBadge[entry.severity];
              return (
                <div key={entry.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={badge.className}>{badge.label}</Badge>
                    <span className="text-xs font-medium text-gray-600">{entry.source}</span>
                    <span className="text-xs text-gray-400 ml-auto">{formatRelativeTime(entry.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{entry.message}</p>
                  {entry.count > 1 && (
                    <span className="text-xs text-gray-400 mt-1 inline-block">Occurred {entry.count} times</span>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recent Signups */}
      {metrics?.recentSignups && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium text-gray-500">Email</th>
                  <th className="text-left py-2 font-medium text-gray-500">Plan</th>
                  <th className="text-left py-2 font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {metrics.recentSignups.map((signup) => (
                  <tr key={signup.email} className="border-b border-gray-50">
                    <td className="py-2 text-gray-900">{signup.email}</td>
                    <td className="py-2">
                      <Badge
                        className={
                          signup.plan === "Enterprise"
                            ? "bg-purple-100 text-purple-700 border-purple-200"
                            : signup.plan === "Pro"
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        }
                      >
                        {signup.plan}
                      </Badge>
                    </td>
                    <td className="py-2 text-gray-500">{signup.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
