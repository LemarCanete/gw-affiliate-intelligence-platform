"use client";

import { useCallback } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { getWorkflows } from "@/lib/mock-data/workflows";
import type { Workflow, WorkflowRun } from "@/lib/mock-data/workflows";
import {
  Clock,
  Zap,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Loader2,
  Timer,
  Activity,
} from "lucide-react";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function formatRelativeTime(isoString: string): string {
  const now = new Date("2026-03-17T12:00:00Z");
  const date = new Date(isoString);
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) return "just now";
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60)
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24)
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
}

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function RunStatusIcon({ status }: { status: WorkflowRun["status"] }) {
  switch (status) {
    case "success":
      return <CheckCircle className="h-3.5 w-3.5 text-green-500" />;
    case "failed":
      return <XCircle className="h-3.5 w-3.5 text-red-500" />;
    case "running":
      return <Loader2 className="h-3.5 w-3.5 text-blue-500 animate-spin" />;
  }
}

function statusBadgeClass(status: Workflow["status"]): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700 border-green-200";
    case "paused":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "error":
      return "bg-red-100 text-red-700 border-red-200";
  }
}

function successRateColor(rate: number): string {
  if (rate >= 95) return "text-green-600";
  if (rate >= 85) return "text-yellow-600";
  return "text-red-600";
}

function runDotColor(status: WorkflowRun["status"]): string {
  switch (status) {
    case "success":
      return "bg-green-500";
    case "failed":
      return "bg-red-500";
    case "running":
      return "bg-blue-500";
  }
}

interface WorkflowCardProps {
  workflow: Workflow;
}

function WorkflowCard({ workflow }: WorkflowCardProps) {
  const handleTrigger = () => {
    console.log(`Triggering workflow: ${workflow.name} (${workflow.id})`);
  };

  const handleTogglePause = () => {
    const action = workflow.status === "paused" ? "Resuming" : "Pausing";
    console.log(`${action} workflow: ${workflow.name} (${workflow.id})`);
  };

  const displayRuns = workflow.recentRuns.slice(0, 8);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {workflow.name}
          </h3>
          <Badge className={statusBadgeClass(workflow.status)}>
            {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mt-1">{workflow.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Trigger + Schedule */}
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            {workflow.trigger === "cron" ? (
              <Clock className="h-3 w-3" />
            ) : (
              <Zap className="h-3 w-3" />
            )}
            {workflow.trigger === "cron" ? "Cron" : "Webhook"}
          </Badge>
          <span className="text-sm text-gray-500">
            {workflow.schedule ?? "Triggered on demand"}
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500">Total Runs</p>
            <p className="text-lg font-semibold text-gray-900">
              {workflow.totalRuns}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Success Rate</p>
            <p
              className={`text-lg font-semibold ${successRateColor(workflow.successRate)}`}
            >
              {workflow.successRate}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Avg Duration</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatDuration(workflow.avgDuration)}
            </p>
          </div>
        </div>

        {/* Last run */}
        {workflow.lastRun && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <RunStatusIcon status={workflow.lastRun.status} />
            <span>
              Last run {formatRelativeTime(workflow.lastRun.startedAt)}
            </span>
            <span className="text-gray-400">|</span>
            <span>{workflow.lastRun.itemsProcessed} items processed</span>
            {workflow.lastRun.errors > 0 && (
              <>
                <span className="text-gray-400">|</span>
                <span className="text-red-500">
                  {workflow.lastRun.errors} error
                  {workflow.lastRun.errors !== 1 ? "s" : ""}
                </span>
              </>
            )}
          </div>
        )}

        {/* Next run */}
        {workflow.nextRun && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Timer className="h-3.5 w-3.5" />
            <span>Next run: {formatDateTime(workflow.nextRun)}</span>
          </div>
        )}

        {/* Recent runs dots */}
        <div>
          <p className="text-xs text-gray-500 mb-1.5">Recent Runs</p>
          <div className="flex items-center gap-1.5">
            {displayRuns.map((run) => (
              <div
                key={run.id}
                title={`${run.status} - ${formatRelativeTime(run.startedAt)}`}
                className={`h-3 w-6 rounded-sm ${runDotColor(run.status)}`}
              />
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-1">
          {workflow.trigger === "webhook" ? (
            <Button variant="outline" size="sm" onClick={handleTrigger}>
              <Play className="h-4 w-4 mr-1.5" />
              Trigger Now
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleTogglePause}>
              {workflow.status === "paused" ? (
                <>
                  <Play className="h-4 w-4 mr-1.5" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4 mr-1.5" />
                  Pause
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function WorkflowsPage() {
  const { data: workflows, loading } = useAsyncData<Workflow[]>(
    useCallback(() => getWorkflows(), [])
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const allWorkflows = workflows ?? [];
  const activeCount = allWorkflows.filter((w) => w.status === "active").length;
  const overallSuccessRate =
    allWorkflows.length > 0
      ? Math.round(
          allWorkflows.reduce((sum, w) => sum + w.successRate, 0) /
            allWorkflows.length
        )
      : 0;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Workflows"
        description="Monitor your n8n automation pipelines"
      />

      {/* Summary bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary-500" />
              <span className="text-sm font-medium text-gray-900">
                {activeCount}/{allWorkflows.length} workflows active
              </span>
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Overall success rate:
              </span>
              <span
                className={`text-sm font-semibold ${successRateColor(overallSuccessRate)}`}
              >
                {overallSuccessRate}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {allWorkflows.map((workflow) => (
          <WorkflowCard key={workflow.id} workflow={workflow} />
        ))}
      </div>
    </div>
  );
}
