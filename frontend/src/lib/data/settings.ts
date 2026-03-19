import { createSPAClient } from "@/lib/supabase/client";

export async function getUserSettings(): Promise<Record<string, unknown> | null> {
  const supabase = createSPAClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export async function saveUserSettings(
  settings: Record<string, unknown>
): Promise<boolean> {
  const supabase = createSPAClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("user_settings")
    .upsert(
      {
        user_id: user.id,
        ...settings,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  return !error;
}
