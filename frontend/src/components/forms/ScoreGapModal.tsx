"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
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

const PRODUCT_NEWNESS_OPTIONS = [
  { value: "1", label: "1 - Older than 180d" },
  { value: "2", label: "2 - 90-180 days" },
  { value: "3", label: "3 - 60-90 days" },
  { value: "4", label: "4 - 30-60 days" },
  { value: "5", label: "5 - Under 30 days" },
];

const LLM_GAP_OPTIONS = [
  { value: "1", label: "1 - Confident answers" },
  { value: "2", label: "2 - Detailed" },
  { value: "3", label: "3 - Generic" },
  { value: "4", label: "4 - Vague" },
  { value: "5", label: "5 - No info" },
];

const BUYING_INTENT_OPTIONS = [
  { value: "1", label: "1 - Branded" },
  { value: "2", label: "2 - Navigational" },
  { value: "3", label: "3 - Informational" },
  { value: "4", label: "4 - How-to" },
  { value: "5", label: "5 - Comparison/Review" },
];

const AFFILIATE_OPTIONS = [
  { value: "1", label: "1 - None" },
  { value: "2", label: "2 - Under 10%" },
  { value: "3", label: "3 - 10-20%" },
  { value: "4", label: "4 - 20-30%" },
  { value: "5", label: "5 - 30%+ recurring" },
];

const GOOGLE_GAP_OPTIONS = [
  { value: "1", label: "1 - Saturated" },
  { value: "2", label: "2 - Some competition" },
  { value: "3", label: "3 - Thin DA90+" },
  { value: "4", label: "4 - Only forums" },
  { value: "5", label: "5 - No content" },
];

function ScoreField({
  label,
  value,
  onValueChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder || "Select..."} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function getVerdictColor(total: number): string {
  if (total >= 22) return "text-green-600";
  if (total >= 18) return "text-blue-600";
  if (total >= 14) return "text-yellow-600";
  return "text-gray-400";
}

function getVerdictBgColor(total: number): string {
  if (total >= 22) return "bg-green-50 border-green-200";
  if (total >= 18) return "bg-blue-50 border-blue-200";
  if (total >= 14) return "bg-yellow-50 border-yellow-200";
  return "bg-gray-50 border-gray-200";
}

function getVerdict(total: number): string {
  if (total >= 22) return "Write Immediately";
  if (total >= 18) return "Worth Pursuing";
  if (total >= 14) return "Monitor";
  return "Skip";
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
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSuccess(
      `Gap scored: ${productName} \u2014 ${total}/25 \u2014 ${verdict}`
    );

    setTimeout(() => {
      handleOpenChange(false);
    }, 1500);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Score New Gap Opportunity</DialogTitle>
          <DialogDescription>
            Evaluate a product against the 5-point gap scoring criteria.
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
              <ScoreField
                label="Product Newness (1-5)"
                value={productNewness}
                onValueChange={setProductNewness}
                options={PRODUCT_NEWNESS_OPTIONS}
                placeholder="Select newness..."
              />
              <ScoreField
                label="LLM Gap Strength (1-5)"
                value={llmGap}
                onValueChange={setLlmGap}
                options={LLM_GAP_OPTIONS}
                placeholder="Select LLM gap..."
              />
              <ScoreField
                label="Buying Intent (1-5)"
                value={buyingIntent}
                onValueChange={setBuyingIntent}
                options={BUYING_INTENT_OPTIONS}
                placeholder="Select intent..."
              />
              <ScoreField
                label="Affiliate Available (1-5)"
                value={affiliate}
                onValueChange={setAffiliate}
                options={AFFILIATE_OPTIONS}
                placeholder="Select affiliate..."
              />
              <ScoreField
                label="Google Gap Strength (1-5)"
                value={googleGap}
                onValueChange={setGoogleGap}
                options={GOOGLE_GAP_OPTIONS}
                placeholder="Select Google gap..."
              />
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
                  <span className="text-sm text-gray-500">/25</span>
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
