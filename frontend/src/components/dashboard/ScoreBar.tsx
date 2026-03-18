"use client";

import type { ProductScore } from "@/lib/types/domain";
import { Check, X } from "lucide-react";

interface ScoreBarProps {
  score: ProductScore;
}

const CRITERIA: { key: keyof Omit<ProductScore, "total">; label: string; passLabel: string; failLabel: string }[] = [
  { key: "productNewness", label: "Product < 90 days", passLabel: "Yes", failLabel: "No" },
  { key: "llmGapStrength", label: "LLM gap confirmed", passLabel: "Yes", failLabel: "No" },
  { key: "buyingIntent", label: "Buying intent", passLabel: "Yes", failLabel: "No" },
  { key: "affiliateAvailable", label: "Affiliate program", passLabel: "Yes", failLabel: "No" },
  { key: "googleGapStrength", label: "Google gap", passLabel: "Yes", failLabel: "No" },
];

export function ScoreBar({ score }: ScoreBarProps) {
  return (
    <div className="space-y-3">
      {CRITERIA.map(({ key, label, passLabel, failLabel }) => {
        const passed = score[key] === 1;

        return (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{label}</span>
            <div className="flex items-center gap-1.5">
              {passed ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">{passLabel}</span>
                </>
              ) : (
                <>
                  <X className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600">{failLabel}</span>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
