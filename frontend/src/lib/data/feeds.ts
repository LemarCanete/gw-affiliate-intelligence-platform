import { createSPAClient } from "@/lib/supabase/client";
import type { FeedStatus } from "@/lib/types/domain";

export async function getFeeds(): Promise<FeedStatus[]> {
  const supabase = createSPAClient();
  const { data, error } = await supabase.from("feeds").select("*");

  if (error || !data || data.length === 0) {
    const { getFeeds: getMock } = await import("@/lib/mock-data/feeds");
    return getMock();
  }

  return data.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    type: row.type as FeedStatus["type"],
    name: row.name as string,
    health: row.health as FeedStatus["health"],
    itemsDiscovered: (row.items_discovered as number) ?? 0,
    itemsThisWeek: (row.items_this_week as number) ?? 0,
    avgScore: Number(row.avg_score) || 0,
    lastRun: (row.last_run as string) ?? "",
    nextRun: (row.next_run as string) ?? "",
    errorMessage: (row.error_message as string) ?? null,
  }));
}
