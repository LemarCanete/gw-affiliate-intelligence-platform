"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createProduct } from "@/lib/data/products";

const CATEGORIES = [
  "Education - Study Tools",
  "Education - Note Taking",
  "Education - Assessment",
  "Education - Grading",
  "Education - Lesson Planning",
  "Education - LMS",
  "Education - Flashcards",
  "Education - Writing",
  "Education - Research",
  "Education - Exam Prep",
  "Education - Coding",
  "Education - Course Creation",
  "Education - Tutoring",
  "Education - Classroom Management",
  "Education - Content Conversion",
  "Productivity - Focus",
  "Productivity - Presentations",
  "Productivity - Meetings",
  "Productivity - Task Management",
  "Productivity - Planning",
  "Productivity - Habits",
  "Productivity - Documentation",
  "Productivity - Email",
  "Productivity - Calendar",
  "Productivity - Learning",
];

const INTENTS = ["informational", "comparison", "review", "how-to"];

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddProductModal({ open, onOpenChange, onSuccess }: AddProductModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [intent, setIntent] = useState("");
  const [affiliateNetwork, setAffiliateNetwork] = useState("");
  const [commissionRate, setCommissionRate] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleReset = () => {
    setName("");
    setUrl("");
    setDescription("");
    setCategory("");
    setIntent("");
    setAffiliateNetwork("");
    setCommissionRate("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    setSaving(true);
    const productId = await createProduct({
      name: name.trim(),
      description: description.trim() || undefined,
      productUrl: url.trim(),
      category: category || undefined,
      intent: (intent as "informational" | "comparison" | "review" | "how-to") || undefined,
      affiliateNetwork: affiliateNetwork.trim() || undefined,
      affiliateCommission: commissionRate.trim() || undefined,
    });
    setSaving(false);

    if (productId) {
      setSuccessMessage(`"${name}" has been added successfully.`);
      handleReset();
      setTimeout(() => {
        setSuccessMessage("");
        onOpenChange(false);
        onSuccess?.();
      }, 1500);
    } else {
      setSuccessMessage("Failed to add product. Please try again.");
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setSuccessMessage("");
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Manually add a new affiliate product to track. Required fields are
            marked with an asterisk.
          </DialogDescription>
        </DialogHeader>

        {successMessage && (
          <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="product-name"
                className="text-sm font-medium leading-none"
              >
                Product Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="product-name"
                placeholder="e.g. Notion AI"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="product-url"
                className="text-sm font-medium leading-none"
              >
                Product URL <span className="text-red-500">*</span>
              </label>
              <Input
                id="product-url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="product-description"
              className="text-sm font-medium leading-none"
            >
              Description
            </label>
            <Textarea
              id="product-description"
              placeholder="Brief description of the product..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Primary Intent
              </label>
              <Select value={intent} onValueChange={setIntent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select intent" />
                </SelectTrigger>
                <SelectContent>
                  {INTENTS.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i.charAt(0).toUpperCase() + i.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="affiliate-network"
                className="text-sm font-medium leading-none"
              >
                Affiliate Network
              </label>
              <Input
                id="affiliate-network"
                placeholder="e.g. Impact, ShareASale"
                value={affiliateNetwork}
                onChange={(e) => setAffiliateNetwork(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="commission-rate"
                className="text-sm font-medium leading-none"
              >
                Commission Rate
              </label>
              <Input
                id="commission-rate"
                placeholder="e.g. 30% recurring"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary-600 text-white hover:bg-primary-700"
              disabled={!name.trim() || !url.trim() || !!successMessage || saving}
            >
              {saving ? "Saving..." : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
