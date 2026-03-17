"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PublishStatus } from "@/lib/types/domain";

interface StatusBadgeProps {
  status: PublishStatus;
}

const STATUS_CONFIG: Record<PublishStatus, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  publishing: {
    label: "Publishing",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 animate-pulse",
  },
  published: {
    label: "Published",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  failed: {
    label: "Failed",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge className={cn("border-transparent", config.className)}>
      {config.label}
    </Badge>
  );
}
