import { createSPAClient } from "@/lib/supabase/client";
import type { RefreshAlert } from "@/lib/mock-data/refresh";

export type { RefreshAlert, RefreshSeverity, RefreshTriggerType } from "@/lib/mock-data/refresh";

export async function getRefreshAlerts(): Promise<RefreshAlert[]> {
  const supabase = createSPAClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const { getRefreshAlerts: getMock } = await import("@/lib/mock-data/refresh");
    return getMock();
  }

  const { data, error } = await supabase
    .from("refresh_alerts")
    .select("*")
    .eq("user_id", user.id)
    .order("detected_at", { ascending: false });

  if (error || !data || data.length === 0) {
    const { getRefreshAlerts: getMock } = await import("@/lib/mock-data/refresh");
    return getMock();
  }

  return data.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    productId: row.product_id as string,
    productName: (row.product_name as string) ?? "",
    triggerType: row.trigger_type as RefreshAlert["triggerType"],
    severity: row.severity as RefreshAlert["severity"],
    title: row.title as string,
    description: (row.description as string) ?? "",
    detectedAt: (row.detected_at as string) ?? "",
    status: row.status as RefreshAlert["status"],
    actionRequired: (row.action_required as string) ?? "",
    contentUrl: (row.content_url as string) ?? null,
    metrics: row.metric_label
      ? {
          label: row.metric_label as string,
          before: (row.metric_before as string) ?? "",
          after: (row.metric_after as string) ?? "",
        }
      : null,
  }));
}

export async function updateAlertStatus(
  alertId: string,
  status: string
): Promise<boolean> {
  const supabase = createSPAClient();
  const { error } = await supabase
    .from("refresh_alerts")
    .update({
      status,
      resolved_at:
        status === "resolved" ? new Date().toISOString() : null,
    })
    .eq("id", alertId);
  return !error;
}
