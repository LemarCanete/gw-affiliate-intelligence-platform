"use client";

import { cn } from "@/lib/utils";
import type { ProductScore } from "@/lib/types/domain";

interface ScoreBarProps {
  score: ProductScore;
}

const CRITERIA: { key: keyof Omit<ProductScore, "total">; label: string }[] = [
  { key: "productNewness", label: "Product Newness" },
  { key: "llmGapStrength", label: "LLM Gap Strength" },
  { key: "buyingIntent", label: "Buying Intent" },
  { key: "affiliateAvailable", label: "Affiliate Available" },
  { key: "googleGapStrength", label: "Google Gap Strength" },
];

function getBarColor(value: number): string {
  if (value >= 4) return "bg-green-500";
  if (value >= 3) return "bg-yellow-500";
  return "bg-red-500";
}

export function ScoreBar({ score }: ScoreBarProps) {
  return (
    <div className="space-y-3">
      {CRITERIA.map(({ key, label }) => {
        const value = score[key];
        const widthPercent = (value / 5) * 100;

        return (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">{label}</span>
              <span className="text-sm font-semibold text-gray-900">{value}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div
                className={cn("h-2 rounded-full transition-all", getBarColor(value))}
                style={{ width: `${widthPercent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
