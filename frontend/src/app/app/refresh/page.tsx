"use client";

import { useCallback, useState, useMemo } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import {
  getRefreshAlerts,
  type RefreshAlert,
  type RefreshSeverity,
  type RefreshTriggerType,
} from "@/lib/mock-data/refresh";

// ── Constants ───────────────────────────────────────────────────────

const TRIGGER_LABELS: Record<RefreshTriggerType, string> = {
  "serp-drop": "SERP Drop",
  "product-update": "Product Update",
  "content-stale": "Content Stale",
  "competitor-new": "New Competitor",
  "geo-citation-lost": "GEO Citation Lost",
  "conversion-drop": "Conversion Drop",
};

const SEVERITY_CONFIG: Record<RefreshSeverity, { label: string; className: string; stripe: string }> = {
  high: {
    label: "High",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
    stripe: "bg-red-500",
  },
  medium: {
    label: "Medium",
    className: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    stripe: "bg-amber-500",
  },
  low: {
    label: "Low",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    stripe: "bg-blue-500",
  },
};

const STATUS_CONFIG: Record<RefreshAlert["status"], { label: string; className: string; pulse: boolean }> = {
  new: {
    label: "New",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    pulse: true,
  },
  acknowledged: {
    label: "Acknowledged",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    pulse: false,
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    pulse: false,
  },
  resolved: {
    label: "Resolved",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
    pulse: false,
  },
  dismissed: {
    label: "Dismissed",
    className: "bg-gray-100 text-gray-600 hover:bg-gray-100",
    pulse: false,
  },
};

// ── Helpers ─────────────────────────────────────────────────────────

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

// ── Summary Cards ───────────────────────────────────────────────────

interface SummaryCardsProps {
  alerts: RefreshAlert[];
}

function SummaryCards({ alerts }: SummaryCardsProps) {
  const activeAlerts = alerts.filter(
    (a) => a.status === "new" || a.status === "acknowledged" || a.status === "in-progress"
  );
  const highCount = activeAlerts.filter((a) => a.severity === "high").length;
  const mediumCount = activeAlerts.filter((a) => a.severity === "medium").length;
  const resolvedCount = alerts.filter((a) => a.status === "resolved").length;

  const cards = [
    {
      title: "Total Active Alerts",
      value: activeAlerts.length,
      icon: AlertTriangle,
      valueClass: "text-gray-900",
      iconBg: "bg-primary-50",
      iconClass: "text-primary-600",
    },
    {
      title: "High Severity",
      value: highCount,
      icon: ShieldAlert,
      valueClass: "text-red-600",
      iconBg: "bg-red-50",
      iconClass: "text-red-600",
    },
    {
      title: "Medium Severity",
      value: mediumCount,
      icon: Clock,
      valueClass: "text-amber-600",
      iconBg: "bg-amber-50",
      iconClass: "text-amber-600",
    },
    {
      title: "Resolved This Week",
      value: resolvedCount,
      icon: ShieldCheck,
      valueClass: "text-green-600",
      iconBg: "bg-green-50",
      iconClass: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className={`text-2xl font-bold mt-1 ${card.valueClass}`}>{card.value}</p>
              </div>
              <div className={`p-3 rounded-full ${card.iconBg}`}>
                <card.icon className={`h-6 w-6 ${card.iconClass}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ── Alert Card ──────────────────────────────────────────────────────

interface AlertCardProps {
  alert: RefreshAlert;
}

function AlertCard({ alert }: AlertCardProps) {
  const severityCfg = SEVERITY_CONFIG[alert.severity];
  const statusCfg = STATUS_CONFIG[alert.status];
  const isMuted = alert.status === "resolved" || alert.status === "dismissed";

  const handleAcknowledge = () => console.log("Acknowledge alert:", alert.id);
  const handleStartFix = () => console.log("Start fix for alert:", alert.id);
  const handleResolve = () => console.log("Mark resolved:", alert.id);
  const handleDismiss = () => console.log("Dismiss alert:", alert.id);

  return (
    <Card className={`overflow-hidden transition-all ${isMuted ? "opacity-60" : ""}`}>
      <div className="flex">
        {/* Severity stripe */}
        <div className={`w-1.5 shrink-0 ${severityCfg.stripe}`} />

        <CardContent className="p-5 flex-1 space-y-3">
          {/* Header row */}
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900 mr-auto">{alert.title}</h3>
            <Badge className={`border-transparent ${severityCfg.className}`}>
              {severityCfg.label}
            </Badge>
            <Badge className={`border-transparent ${statusCfg.className}`}>
              <span className="flex items-center gap-1.5">
                {statusCfg.pulse && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                  </span>
                )}
                {statusCfg.label}
              </span>
            </Badge>
            <Badge className="border-transparent bg-gray-100 text-gray-700 hover:bg-gray-100">
              {TRIGGER_LABELS[alert.triggerType]}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">{alert.description}</p>

          {/* Metrics */}
          {alert.metrics && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-500 font-medium">{alert.metrics.label}:</span>
              <span className="font-mono text-gray-700">{alert.metrics.before}</span>
              <ArrowRight className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="font-mono text-gray-900 font-semibold">{alert.metrics.after}</span>
            </div>
          )}

          {/* Action required */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-900">
              <span className="font-semibold">Action required: </span>
              {alert.actionRequired}
            </p>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <span className="text-xs text-gray-400">Detected {timeAgo(alert.detectedAt)}</span>
            <div className="flex items-center gap-2">
              {alert.status === "new" && (
                <>
                  <Button variant="outline" size="sm" onClick={handleAcknowledge}>
                    Acknowledge
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDismiss}>
                    Dismiss
                  </Button>
                </>
              )}
              {alert.status === "acknowledged" && (
                <>
                  <Button size="sm" className="bg-primary-600 text-white hover:bg-primary-700" onClick={handleStartFix}>
                    Start Fix
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDismiss}>
                    Dismiss
                  </Button>
                </>
              )}
              {alert.status === "in-progress" && (
                <Button size="sm" className="bg-green-600 text-white hover:bg-green-700" onClick={handleResolve}>
                  Mark Resolved
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

// ── Filter Bar ──────────────────────────────────────────────────────

interface FilterBarProps {
  severity: string;
  onSeverityChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  triggerType: string;
  onTriggerTypeChange: (v: string) => void;
}

function FilterBar({
  severity,
  onSeverityChange,
  status,
  onStatusChange,
  triggerType,
  onTriggerTypeChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={severity} onValueChange={onSeverityChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Severity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Severities</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[170px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="acknowledged">Acknowledged</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="dismissed">Dismissed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={triggerType} onValueChange={onTriggerTypeChange}>
        <SelectTrigger className="w-[190px]">
          <SelectValue placeholder="Trigger Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Triggers</SelectItem>
          <SelectItem value="serp-drop">SERP Drop</SelectItem>
          <SelectItem value="product-update">Product Update</SelectItem>
          <SelectItem value="content-stale">Content Stale</SelectItem>
          <SelectItem value="competitor-new">New Competitor</SelectItem>
          <SelectItem value="geo-citation-lost">GEO Citation Lost</SelectItem>
          <SelectItem value="conversion-drop">Conversion Drop</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

export default function RefreshPage() {
  const fetcher = useCallback(() => getRefreshAlerts(), []);
  const { data: alerts, loading } = useAsyncData(fetcher);

  const [severity, setSeverity] = useState("all");
  const [status, setStatus] = useState("all");
  const [triggerType, setTriggerType] = useState("all");

  const filtered = useMemo(() => {
    if (!alerts) return [];
    return alerts.filter((a) => {
      if (severity !== "all" && a.severity !== severity) return false;
      if (status !== "all" && a.status !== status) return false;
      if (triggerType !== "all" && a.triggerType !== triggerType) return false;
      return true;
    });
  }, [alerts, severity, status, triggerType]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Refresh"
        description="Monitor triggers that require content updates"
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <>
          <SummaryCards alerts={alerts || []} />

          <FilterBar
            severity={severity}
            onSeverityChange={setSeverity}
            status={status}
            onStatusChange={setStatus}
            triggerType={triggerType}
            onTriggerTypeChange={setTriggerType}
          />

          <div className="space-y-4">
            {filtered.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <ShieldCheck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No alerts match the current filters.</p>
                </CardContent>
              </Card>
            ) : (
              filtered.map((alert) => <AlertCard key={alert.id} alert={alert} />)
            )}
          </div>
        </>
      )}
    </div>
  );
}
