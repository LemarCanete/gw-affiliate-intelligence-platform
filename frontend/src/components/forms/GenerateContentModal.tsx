"use client";

import { useState, useEffect, useRef } from "react";
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
import { Progress } from "@/components/ui/progress";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
}

interface ContentFormat {
  id: string;
  label: string;
  description: string;
  estimatedWords: string;
}

const FORMATS: ContentFormat[] = [
  {
    id: "seo-article",
    label: "SEO Article",
    description: "Long-form optimised article for blog",
    estimatedWords: "~2,000 words",
  },
  {
    id: "youtube-script",
    label: "YouTube Script",
    description: "Video script with intro, body, CTA",
    estimatedWords: "~1,500 words",
  },
  {
    id: "pinterest-pins",
    label: "Pinterest Pins",
    description: "Pin descriptions and board copy",
    estimatedWords: "~300 words",
  },
  {
    id: "social-posts",
    label: "Social Posts",
    description: "Twitter/LinkedIn/Facebook posts",
    estimatedWords: "~500 words",
  },
  {
    id: "reddit-draft",
    label: "Reddit Draft",
    description: "Authentic discussion post (manual publish)",
    estimatedWords: "~400 words",
  },
  {
    id: "email-sequence",
    label: "Email Sequence",
    description: "3-email nurture sequence",
    estimatedWords: "~900 words",
  },
];

type Quality = "draft" | "standard" | "premium";

const QUALITY_OPTIONS: { value: Quality; label: string; description: string }[] = [
  { value: "draft", label: "Draft", description: "Fast, ~2 min" },
  { value: "standard", label: "Standard", description: "Balanced, ~5 min" },
  { value: "premium", label: "Premium", description: "Thorough, ~10 min" },
];

const PROGRESS_STEPS = [
  "Generating SEO article...",
  "Generating YouTube script...",
  "Generating social posts...",
  "Complete!",
];

export function GenerateContentModal({ open, onOpenChange, productName }: Props) {
  const [selectedFormats, setSelectedFormats] = useState<Set<string>>(
    new Set(FORMATS.map((f) => f.id))
  );
  const [quality, setQuality] = useState<Quality>("standard");
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleToggleFormat = (id: string) => {
    setSelectedFormats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    if (selectedFormats.size === 0) return;
    setStatus("generating");
    setProgress(0);
    setProgressText(PROGRESS_STEPS[0]);

    let elapsed = 0;
    const interval = 100;
    const totalDuration = 3000;

    timerRef.current = setInterval(() => {
      elapsed += interval;
      const pct = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(pct);

      const stepIndex = Math.min(
        Math.floor((elapsed / totalDuration) * PROGRESS_STEPS.length),
        PROGRESS_STEPS.length - 1
      );
      setProgressText(PROGRESS_STEPS[stepIndex]);

      if (elapsed >= totalDuration) {
        if (timerRef.current) clearInterval(timerRef.current);
        const assetCount = selectedFormats.size;
        setProgressText(`Complete! ${assetCount} assets created.`);
        setStatus("done");
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    }, interval);
  };

  const handleClose = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus("idle");
    setProgress(0);
    setProgressText("");
    setSelectedFormats(new Set(FORMATS.map((f) => f.id)));
    setQuality("standard");
    onOpenChange(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const isWorking = status === "generating" || status === "done";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Content for {productName}</DialogTitle>
          <DialogDescription>
            Select content formats and quality level to generate.
          </DialogDescription>
        </DialogHeader>

        {isWorking ? (
          <div className="space-y-4 py-4">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
              {status === "done" ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
              )}
              <span className="font-medium">{progressText}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Content format checkboxes */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Content Formats
              </label>
              <div className="space-y-3">
                {FORMATS.map((format) => (
                  <label
                    key={format.id}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFormats.has(format.id)}
                      onChange={() => handleToggleFormat(format.id)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {format.label}
                        </span>
                        <span className="text-xs text-gray-400">
                          {format.estimatedWords}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{format.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Quality radio group */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Quality
              </label>
              <div className="grid grid-cols-3 gap-2">
                {QUALITY_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex flex-col items-center gap-1 rounded-lg border p-3 cursor-pointer transition-colors ${
                      quality === opt.value
                        ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="quality"
                      value={opt.value}
                      checked={quality === opt.value}
                      onChange={() => setQuality(opt.value)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {opt.label}
                    </span>
                    <span className="text-xs text-gray-500">{opt.description}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {!isWorking && (
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={selectedFormats.size === 0}>
              Generate {selectedFormats.size} Format
              {selectedFormats.size !== 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
