"use client";

import { cn } from "@/lib/utils";
import type { FeedHealth } from "@/lib/types/domain";

interface FeedHealthBadgeProps {
  health: FeedHealth;
}

const HEALTH_CONFIG: Record<FeedHealth, { label: string; dotClass: string; textClass: string }> = {
  healthy: {
    label: "Healthy",
    dotClass: "bg-green-500",
    textClass: "text-green-700",
  },
  warning: {
    label: "Warning",
    dotClass: "bg-yellow-500",
    textClass: "text-yellow-700",
  },
  error: {
    label: "Error",
    dotClass: "bg-red-500",
    textClass: "text-red-700",
  },
};

export function FeedHealthBadge({ health }: FeedHealthBadgeProps) {
  const config = HEALTH_CONFIG[health];

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", config.textClass)}>
      <span className={cn("h-2 w-2 rounded-full animate-pulse", config.dotClass)} />
      {config.label}
    </span>
  );
}
