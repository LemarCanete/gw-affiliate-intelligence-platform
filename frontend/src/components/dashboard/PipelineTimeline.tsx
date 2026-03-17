"use client";

import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  MinusCircle,
  AlertTriangle,
  RotateCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PipelineStep, PipelineStepStatus } from "@/lib/mock-data/pipeline";

// ── Helpers ──────────────────────────────────────────────────────────

interface StatusConfig {
  icon: React.ReactNode;
  lineColor: string;
  dotColor: string;
  textColor: string;
  label: string;
}

function getStatusConfig(status: PipelineStepStatus): StatusConfig {
  switch (status) {
    case "completed":
      return {
        icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
        lineColor: "bg-green-300",
        dotColor: "bg-green-600",
        textColor: "text-green-700",
        label: "Completed",
      };
    case "running":
      return {
        icon: <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />,
        lineColor: "bg-blue-300",
        dotColor: "bg-blue-600",
        textColor: "text-blue-700",
        label: "Running",
      };
    case "failed":
      return {
        icon: <XCircle className="h-5 w-5 text-red-600" />,
        lineColor: "bg-red-300",
        dotColor: "bg-red-600",
        textColor: "text-red-700",
        label: "Failed",
      };
    case "pending":
      return {
        icon: <Clock className="h-5 w-5 text-gray-400" />,
        lineColor: "bg-gray-200",
        dotColor: "bg-gray-400",
        textColor: "text-gray-500",
        label: "Pending",
      };
    case "skipped":
      return {
        icon: <MinusCircle className="h-5 w-5 text-gray-300" />,
        lineColor: "bg-gray-200 border border-dashed border-gray-300",
        dotColor: "bg-gray-300",
        textColor: "text-gray-400",
        label: "Skipped",
      };
  }
}

function formatDuration(start: string | null, end: string | null): string | null {
  if (!start || !end) return null;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

// ── Component ────────────────────────────────────────────────────────

interface PipelineTimelineProps {
  steps: PipelineStep[];
}

export function PipelineTimeline({ steps }: PipelineTimelineProps) {
  return (
    <div className="relative pl-2">
      {steps.map((step, index) => {
        const config = getStatusConfig(step.status);
        const duration = formatDuration(step.startedAt, step.completedAt);
        const isLast = index === steps.length - 1;

        return (
          <div key={step.step} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Vertical connecting line */}
            {!isLast && (
              <div
                className={cn(
                  "absolute left-[9px] top-[28px] w-0.5 bottom-0",
                  config.lineColor,
                )}
              />
            )}

            {/* Status icon */}
            <div className="relative z-10 flex-shrink-0 mt-0.5">
              {config.icon}
            </div>

            {/* Step content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("text-sm font-medium", config.textColor)}>
                  Step {step.step}: {step.name}
                </span>

                {step.blocking && (
                  <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100 text-[10px] px-1.5 py-0">
                    BLOCKING
                  </Badge>
                )}

                <Badge
                  className={cn(
                    "border-transparent text-[10px] px-1.5 py-0",
                    step.status === "completed" && "bg-green-100 text-green-700 hover:bg-green-100",
                    step.status === "running" && "bg-blue-100 text-blue-700 hover:bg-blue-100",
                    step.status === "failed" && "bg-red-100 text-red-700 hover:bg-red-100",
                    step.status === "pending" && "bg-gray-100 text-gray-500 hover:bg-gray-100",
                    step.status === "skipped" && "bg-gray-50 text-gray-400 hover:bg-gray-50",
                  )}
                >
                  {config.label}
                </Badge>

                {duration && (
                  <span className="text-xs text-muted-foreground">{duration}</span>
                )}

                {step.retries > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                    <RotateCw className="h-3 w-3" />
                    {step.retries} {step.retries === 1 ? "retry" : "retries"}
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-0.5">
                {step.platform}
              </p>

              {step.errorMessage && (
                <div className="mt-1.5 flex items-start gap-1.5 rounded-md bg-red-50 border border-red-200 px-3 py-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-red-700">{step.errorMessage}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
