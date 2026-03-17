"use client";

import React, { useCallback, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getModerationQueue } from "@/lib/mock-data/admin";
import type { ModerationItem } from "@/lib/mock-data/admin";

const STATUSES = ["all", "pending", "approved", "rejected"] as const;

const statusBadge: Record<ModerationItem["status"], { className: string }> = {
  pending: { className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  approved: { className: "bg-green-100 text-green-700 border-green-200" },
  rejected: { className: "bg-red-100 text-red-700 border-red-200" },
};

const contentTypeBadge = "bg-blue-50 text-blue-700 border-blue-200";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminModerationPage() {
  const fetchQueue = useCallback(() => getModerationQueue(), []);
  const { data: queue } = useAsyncData<ModerationItem[]>(fetchQueue);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionResults, setActionResults] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    if (!queue) return [];
    if (statusFilter === "all") return queue;
    return queue.filter((item) => item.status === statusFilter);
  }, [queue, statusFilter]);

  const handleAction = (action: "approve" | "reject", item: ModerationItem) => {
    console.log(`Moderation action: ${action}`, item);
    setActionResults((prev) => ({ ...prev, [item.id]: action === "approve" ? "Approved" : "Rejected" }));
    setTimeout(() => {
      setActionResults((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Content Moderation" description="Review and approve AI-generated content before publishing" />

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Moderation Cards */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isMuted = item.status === "approved" || item.status === "rejected";
          const result = actionResults[item.id];
          return (
            <Card key={item.id} className={isMuted ? "opacity-60" : ""}>
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                      <Badge className={contentTypeBadge}>{item.contentType}</Badge>
                      <Badge className={statusBadge[item.status].className}>{item.status}</Badge>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-gray-500 mb-3">
                  <span>Product: <span className="font-medium text-gray-700">{item.productName}</span></span>
                  <span>By: <span className="font-medium text-gray-700">{item.submittedBy}</span></span>
                  <span>{item.wordCount.toLocaleString()} words</span>
                  <span>{formatDate(item.submittedAt)}</span>
                </div>

                {/* Actions */}
                {item.status === "pending" && !result && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction("approve", item)}
                      className="px-3 py-1.5 text-xs font-medium rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction("reject", item)}
                      className="px-3 py-1.5 text-xs font-medium rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
                {result && (
                  <span className={`text-xs font-medium ${result === "Approved" ? "text-green-600" : "text-red-600"}`}>
                    {result} successfully.
                  </span>
                )}
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            No items match the current filter.
          </div>
        )}
      </div>
    </div>
  );
}
