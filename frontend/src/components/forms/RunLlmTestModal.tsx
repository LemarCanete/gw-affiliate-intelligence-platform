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
import { apiPost } from "@/lib/api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  productId?: string;
  onSuccess?: () => void;
}

const ENGINES = ["ChatGPT", "Perplexity", "Gemini", "Copilot"] as const;

export function RunLlmTestModal({ open, onOpenChange, productName, productId, onSuccess }: Props) {
  const [selectedEngines, setSelectedEngines] = useState<Set<string>>(
    new Set(ENGINES)
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const presets = [
    `What is ${productName}?`,
    `Is ${productName} worth it?`,
    `${productName} vs competitors`,
    `Best AI tools 2026`,
  ];

  const handleToggleEngine = (engine: string) => {
    setSelectedEngines((prev) => {
      const next = new Set(prev);
      if (next.has(engine)) {
        next.delete(engine);
      } else {
        next.add(engine);
      }
      return next;
    });
  };

  const [error, setError] = useState("");
  const [results, setResults] = useState<{ engine: string; response_type: string }[]>([]);

  const handleSubmit = async () => {
    if (!query.trim() || selectedEngines.size === 0) return;
    setStatus("loading");
    setError("");

    try {
      if (productId) {
        const engines = Array.from(selectedEngines).map((e) => e.toLowerCase());
        const data = await apiPost("/api/llm/validate", {
          product_id: productId,
          engines,
          query: query.trim(),
        });
        setResults(data.results || []);
      }
      setStatus("success");
      setTimeout(() => {
        handleClose();
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Test failed");
      setStatus("idle");
    }
  };

  const handleClose = () => {
    setStatus("idle");
    setQuery("");
    setSelectedEngines(new Set(ENGINES));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Run LLM Gap Test</DialogTitle>
          <DialogDescription>
            Test how LLM engines respond to queries about {productName}.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
            <p className="text-sm font-medium text-gray-900">
              LLM tests completed for {results.length || selectedEngines.size} engine{(results.length || selectedEngines.size) !== 1 ? "s" : ""}
            </p>
            {results.length > 0 && (
              <div className="w-full space-y-1 mt-2">
                {results.map((r, i) => (
                  <div key={i} className="flex justify-between text-sm px-3 py-1.5 bg-gray-50 rounded">
                    <span className="capitalize font-medium">{r.engine}</span>
                    <span className="text-gray-600">{r.response_type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Engine checkboxes */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Engines
              </label>
              <div className="flex flex-wrap gap-3">
                {ENGINES.map((engine) => (
                  <label
                    key={engine}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEngines.has(engine)}
                      onChange={() => handleToggleEngine(engine)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      disabled={status === "loading"}
                    />
                    {engine}
                  </label>
                ))}
              </div>
            </div>

            {/* Query input */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Query <span className="text-red-500">*</span>
              </label>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`e.g. Is ${productName} worth it?`}
                disabled={status === "loading"}
              />
            </div>

            {/* Quick presets */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Quick Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setQuery(preset)}
                    disabled={status === "loading"}
                  >
                    {preset}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {status !== "success" && (
          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={status === "loading"}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!query.trim() || selectedEngines.size === 0 || status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                "Run Tests"
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
