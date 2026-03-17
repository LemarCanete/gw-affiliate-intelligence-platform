"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FeedHealthBadge } from "./FeedHealthBadge";
import type { FeedStatus } from "@/lib/types/domain";

interface FeedCardProps {
  feed: FeedStatus;
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FeedCard({ feed }: FeedCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">{feed.name}</h3>
          <FeedHealthBadge health={feed.health} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500">Discovered</p>
            <p className="text-lg font-semibold text-gray-900">
              {feed.itemsDiscovered}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">This Week</p>
            <p className="text-lg font-semibold text-gray-900">
              {feed.itemsThisWeek}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Avg Score</p>
            <p className="text-lg font-semibold text-gray-900">
              {feed.avgScore.toFixed(1)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last: {formatTimestamp(feed.lastRun)}</span>
          <span>Next: {formatTimestamp(feed.nextRun)}</span>
        </div>

        {feed.health === "error" && feed.errorMessage && (
          <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">
            {feed.errorMessage}
          </p>
        )}

        {feed.health === "warning" && feed.errorMessage && (
          <p className="text-sm text-yellow-700 bg-yellow-50 rounded-md px-3 py-2">
            {feed.errorMessage}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
