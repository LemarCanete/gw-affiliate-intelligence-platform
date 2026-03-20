"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FeedCard } from "@/components/dashboard/FeedCard";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { useGlobal } from "@/lib/context/GlobalContext";
import { getFeeds } from "@/lib/data/feeds";
import { apiPost } from "@/lib/api";
import { Loader2, Radar, RefreshCw } from "lucide-react";
import type { FeedStatus } from "@/lib/types/domain";

export default function FeedsPage() {
  const { user } = useGlobal();
  const { data: feeds, loading, refetch } = useAsyncData<FeedStatus[]>(
    useCallback(() => getFeeds(), [])
  );
  const [scanning, setScanning] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const handleScan = async (source: "producthunt" | "appsump") => {
    if (!user?.id) return;
    setScanning(source);
    setScanResult(null);
    try {
      const data = await apiPost(`/api/feeds/scan/${source}`, {
        feed_type: "serp-gap",
        user_id: user.id,
      });
      setScanResult(`Found ${data.discovered} new products from ${source === "producthunt" ? "Product Hunt" : "AppSumo"}`);
      refetch();
    } catch (err) {
      setScanResult(`Scan failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setScanning(null);
    }
  };

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
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleScan("producthunt")}
            disabled={scanning !== null}
          >
            {scanning === "producthunt" ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Radar className="h-4 w-4 mr-2" />
            )}
            Scan Product Hunt
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleScan("appsump")}
            disabled={scanning !== null}
          >
            {scanning === "appsump" ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Scan AppSumo
          </Button>
        </div>
      </PageHeader>

      {scanResult && (
        <div className={`rounded-md px-4 py-3 text-sm ${
          scanResult.startsWith("Found")
            ? "bg-green-50 border border-green-200 text-green-800"
            : "bg-red-50 border border-red-200 text-red-800"
        }`}>
          {scanResult}
        </div>
      )}

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
