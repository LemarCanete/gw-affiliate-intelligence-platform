"use client";

import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
}

const INTENTS = ["informational", "comparison", "review", "how-to"] as const;

const PLACEHOLDER_OUTLINE = `Introduction
What is ${"{Product}"}
Key Features
Pros & Cons
Pricing
Verdict`;

export function CreateBriefModal({ open, onOpenChange, productName }: Props) {
  const [targetQuery, setTargetQuery] = useState("");
  const [intent, setIntent] = useState<string>("informational");
  const [wordCount, setWordCount] = useState(2000);
  const [affiliateLink, setAffiliateLink] = useState("");
  const [outline, setOutline] = useState("");
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = () => {
    if (!targetQuery.trim()) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        handleClose();
      }, 1500);
    }, 1500);
  };

  const handleClose = () => {
    setStatus("idle");
    setTargetQuery("");
    setIntent("informational");
    setWordCount(2000);
    setAffiliateLink("");
    setOutline("");
    setAutoGenerate(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Content Brief</DialogTitle>
          <DialogDescription>
            Create a content brief for {productName}.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <CheckCircle className="h-10 w-10 text-green-500" />
            <p className="text-sm font-medium text-gray-900">
              Brief created successfully
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Target Query */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Target Query <span className="text-red-500">*</span>
              </label>
              <Input
                value={targetQuery}
                onChange={(e) => setTargetQuery(e.target.value)}
                placeholder={`e.g. Best alternatives to ${productName}`}
                disabled={status === "loading"}
              />
            </div>

            {/* Intent */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Intent
              </label>
              <Select value={intent} onValueChange={setIntent} disabled={status === "loading"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select intent" />
                </SelectTrigger>
                <SelectContent>
                  {INTENTS.map((i) => (
                    <SelectItem key={i} value={i}>
                      <span className="capitalize">{i}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Target Word Count */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Target Word Count
              </label>
              <Input
                type="number"
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                min={500}
                max={10000}
                disabled={status === "loading"}
              />
            </div>

            {/* Affiliate Link */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Affiliate Link
                <span className="text-xs text-gray-400 ml-1">(optional)</span>
              </label>
              <Input
                value={affiliateLink}
                onChange={(e) => setAffiliateLink(e.target.value)}
                placeholder="https://..."
                disabled={status === "loading"}
              />
            </div>

            {/* Auto-generate toggle */}
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={autoGenerate}
                onChange={(e) => setAutoGenerate(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                disabled={status === "loading"}
              />
              <span className="font-medium text-gray-700">Auto-generate with AI</span>
            </label>

            {autoGenerate && (
              <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                AI will generate the structure based on intent and query.
              </p>
            )}

            {/* Structure Outline */}
            {!autoGenerate && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Structure Outline
                </label>
                <Textarea
                  value={outline}
                  onChange={(e) => setOutline(e.target.value)}
                  placeholder={PLACEHOLDER_OUTLINE}
                  rows={6}
                  disabled={status === "loading"}
                />
              </div>
            )}
          </div>
        )}

        {status !== "success" && (
          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={status === "loading"}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!targetQuery.trim() || status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Brief"
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
