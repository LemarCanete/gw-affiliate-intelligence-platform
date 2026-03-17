"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrendIndicatorProps {
  value: number;
}

export function TrendIndicator({ value }: TrendIndicatorProps) {
  if (value > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600 mt-1">
        <TrendingUp className="h-4 w-4" />
        +{value.toFixed(1)}%
      </span>
    );
  }

  if (value < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-red-600 mt-1">
        <TrendingDown className="h-4 w-4" />
        {value.toFixed(1)}%
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 mt-1">
      <Minus className="h-4 w-4" />
      0.0%
    </span>
  );
}
