"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const colorClass =
    score >= 4
      ? "bg-green-100 text-green-800 hover:bg-green-100"
      : score === 3
        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
        : "bg-red-100 text-red-800 hover:bg-red-100";

  return (
    <Badge className={cn("border-transparent", colorClass)}>
      {score}/5
    </Badge>
  );
}
