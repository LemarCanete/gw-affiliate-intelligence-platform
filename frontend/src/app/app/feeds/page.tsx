"use client";

import { useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FeedCard } from "@/components/dashboard/FeedCard";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { getFeeds } from "@/lib/mock-data/feeds";
import type { FeedStatus } from "@/lib/types/domain";

export default function FeedsPage() {
  const { data: feeds, loading } = useAsyncData<FeedStatus[]>(
    useCallback(() => getFeeds(), [])
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const feedList = feeds ?? [];
  const healthyCount = feedList.filter((f) => f.health === "healthy").length;
  const totalCount = feedList.length;
  const healthPercent = totalCount > 0 ? (healthyCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Intelligence Feeds"
        description="Monitor your 8 discovery feeds"
      />

      {/* Summary bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              {healthyCount}/{totalCount} feeds healthy
            </span>
            <Progress value={healthPercent} className="flex-1 h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Feed grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {feedList.map((feed) => (
          <FeedCard key={feed.id} feed={feed} />
        ))}
      </div>
    </div>
  );
}
