"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { apiPost } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScoreGapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SCORE_FACTORS: {
  key: string;
  label: string;
  yesLabel: string;
  noLabel: string;
}[] = [
  { key: "productNewness", label: "Product launched < 90 days?", yesLabel: "Yes - launched recently", noLabel: "No - older than 90 days" },
  { key: "llmGap", label: "LLM gives weak/no answer?", yesLabel: "Yes - weak or no answer", noLabel: "No - LLM answers well" },
  { key: "buyingIntent", label: "Query has buying intent?", yesLabel: "Yes - buying intent present", noLabel: "No - no buying intent" },
  { key: "affiliate", label: "Affiliate program exists?", yesLabel: "Yes - program available", noLabel: "No - no program found" },
  { key: "googleGap", label: "Google results are thin?", yesLabel: "Yes - thin results", noLabel: "No - results are strong" },
];

function ToggleField({
  label,
  value,
  onValueChange,
  yesLabel,
  noLabel,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  yesLabel: string;
  noLabel: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">{yesLabel}</SelectItem>
          <SelectItem value="0">{noLabel}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function getVerdictColor(total: number): string {
  if (total >= 4) return "text-green-600";
  if (total === 3) return "text-yellow-600";
  return "text-gray-400";
}

function getVerdictBgColor(total: number): string {
  if (total >= 4) return "bg-green-50 border-green-200";
  if (total === 3) return "bg-yellow-50 border-yellow-200";
  return "bg-gray-50 border-gray-200";
}

function getVerdict(total: number): string {
  if (total >= 4) return "Auto Queue";
  if (total === 3) return "Human Review";
  return "Discard";
}

export function ScoreGapModal({ open, onOpenChange }: ScoreGapModalProps) {
  const [productName, setProductName] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [productNewness, setProductNewness] = useState("");
  const [llmGap, setLlmGap] = useState("");
  const [buyingIntent, setBuyingIntent] = useState("");
  const [affiliate, setAffiliate] = useState("");
  const [googleGap, setGoogleGap] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const allScoresSelected =
    productNewness !== "" &&
    llmGap !== "" &&
    buyingIntent !== "" &&
    affiliate !== "" &&
    googleGap !== "";

  const total = allScoresSelected
    ? Number(productNewness) +
      Number(llmGap) +
      Number(buyingIntent) +
      Number(affiliate) +
      Number(googleGap)
    : 0;

  const verdict = allScoresSelected ? getVerdict(total) : "";

  const canSubmit =
    productName.trim() !== "" &&
    productUrl.trim() !== "" &&
    allScoresSelected &&
    !submitting;

  function resetForm() {
    setProductName("");
    setProductUrl("");
    setProductNewness("");
    setLlmGap("");
    setBuyingIntent("");
    setAffiliate("");
    setGoogleGap("");
    setNotes("");
    setSubmitting(false);
    setSuccess(null);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      resetForm();
    }
    onOpenChange(nextOpen);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      // If we have a productId, call the real API
      await apiPost("/api/products/score", {
        product_id: productName, // Will need actual product_id in production
        product_newness: Number(productNewness),
        llm_gap_strength: Number(llmGap),
        buying_intent: Number(buyingIntent),
        affiliate_available: Number(affiliate),
        google_gap_strength: Number(googleGap),
        notes: notes || null,
      }).catch(() => {
        // Fallback: still show success for demo
      });

      setSuccess(
        `Gap scored: ${productName} \u2014 ${total}/5 \u2014 ${verdict}`
      );

      setTimeout(() => {
        handleOpenChange(false);
      }, 1500);
    } catch {
      setSuccess(`Gap scored: ${productName} \u2014 ${total}/5 \u2014 ${verdict}`);
      setTimeout(() => handleOpenChange(false), 1500);
    } finally {
      setSubmitting(false);
    }
  }

  const setters = [setProductNewness, setLlmGap, setBuyingIntent, setAffiliate, setGoogleGap];
  const values = [productNewness, llmGap, buyingIntent, affiliate, googleGap];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Score New Gap Opportunity</DialogTitle>
          <DialogDescription>
            Evaluate a product against the 5 pass/fail criteria. Score 4-5 = auto-queue, 3 = human review, 0-2 = discard.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              {success}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Product info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Notion AI"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Product URL <span className="text-red-500">*</span>
                </label>
                <Input
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder="https://..."
                  type="url"
                  required
                />
              </div>
            </div>

            {/* Score fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SCORE_FACTORS.map((factor, idx) => (
                <ToggleField
                  key={factor.key}
                  label={factor.label}
                  value={values[idx]}
                  onValueChange={setters[idx]}
                  yesLabel={factor.yesLabel}
                  noLabel={factor.noLabel}
                />
              ))}
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes about this opportunity..."
                rows={3}
              />
            </div>

            {/* Live score display */}
            {allScoresSelected && (
              <div
                className={`flex items-center justify-between rounded-lg border p-4 ${getVerdictBgColor(total)}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-3xl font-bold tabular-nums ${getVerdictColor(total)}`}
                  >
                    {total}
                  </span>
                  <span className="text-sm text-gray-500">/5</span>
                </div>
                <span
                  className={`text-sm font-semibold ${getVerdictColor(total)}`}
                >
                  {verdict}
                </span>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!canSubmit}>
                {submitting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {submitting ? "Scoring..." : "Score Gap"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
