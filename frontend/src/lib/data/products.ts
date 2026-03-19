import { createSPAClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/types";
import type {
  Product,
  ProductScore,
  ContentAsset,
  ContentBrief,
  LlmTestResult,
  GapStatus,
  GapVerdict,
  ContentIntent,
  FeedType,
  PublishStatus,
} from "@/lib/types/domain";

// ── DB Row Types ─────────────────────────────────────────────────────

type ProductRow = Tables<"products">;
type ScoreRow = Tables<"product_scores">;
type LlmRow = Tables<"llm_test_results">;
type AssetRow = Tables<"content_assets">;
type BriefRow = Tables<"content_briefs">;

// ── Helpers ──────────────────────────────────────────────────────────

function deriveVerdict(total: number): GapVerdict {
  if (total >= 4) return "auto-queue";
  if (total === 3) return "human-review";
  return "discard";
}

function deriveGapStatus(llmGap: number, googleGap: number): GapStatus {
  if (llmGap === 1 && googleGap === 1) return "double-gap";
  if (googleGap === 1) return "google-only";
  if (llmGap === 1) return "llm-only";
  return "closing";
}

function mapProduct(
  row: ProductRow,
  score: ScoreRow | null,
  llmTests: LlmRow[],
  assets: AssetRow[],
  briefs: BriefRow[]
): Product {
  const productScore: ProductScore = score
    ? {
        productNewness: (score.product_newness as 0 | 1) ?? 0,
        llmGapStrength: (score.llm_gap_strength as 0 | 1) ?? 0,
        buyingIntent: (score.buying_intent as 0 | 1) ?? 0,
        affiliateAvailable: (score.affiliate_available as 0 | 1) ?? 0,
        googleGapStrength: (score.google_gap_strength as 0 | 1) ?? 0,
        total: score.total ?? 0,
      }
    : { productNewness: 0, llmGapStrength: 0, buyingIntent: 0, affiliateAvailable: 0, googleGapStrength: 0, total: 0 };

  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    category: row.category ?? "",
    score: productScore,
    status: (row.status as PublishStatus) ?? "draft",
    revenue: Number(row.revenue) || 0,
    serpPosition: row.serp_position ?? null,
    geoScore: row.geo_score ?? 0,
    source: (row.source as FeedType) ?? "serp-gap",
    verdict: (row.verdict as GapVerdict) ?? deriveVerdict(productScore.total),
    gapStatus: (row.gap_status as GapStatus) ?? deriveGapStatus(productScore.llmGapStrength, productScore.googleGapStrength),
    intent: (row.intent as ContentIntent) ?? "review",
    launchedAt: row.launched_at ?? row.created_at ?? new Date().toISOString(),
    llmTestResults: llmTests.map((t) => ({
      engine: t.engine as LlmTestResult["engine"],
      query: t.query,
      responseType: (t.response_type as LlmTestResult["responseType"]) ?? "vague",
      citedSources: t.cited_sources ?? [],
      testedAt: t.tested_at ?? new Date().toISOString(),
    })),
    affiliateProgram: {
      network: row.affiliate_network ?? "",
      commission: row.affiliate_commission ?? "",
      cookieDuration: row.affiliate_cookie_duration ?? "",
      paymentTerms: row.affiliate_payment_terms ?? "",
    },
    contentAssets: assets.map((a) => ({
      id: a.id,
      productId: a.product_id,
      format: a.format as ContentAsset["format"],
      title: a.title,
      intent: (a.intent as ContentIntent) ?? "review",
      status: (a.status as PublishStatus) ?? "draft",
      platform: a.platform as ContentAsset["platform"],
      url: a.url ?? null,
      publishedAt: a.published_at ?? null,
      views: a.views ?? 0,
      clicks: a.clicks ?? 0,
      revenue: Number(a.revenue) || 0,
    })),
    contentBriefs: briefs.map((b) => ({
      id: b.id,
      productId: b.product_id,
      targetQuery: b.target_query,
      intent: b.intent as ContentIntent,
      llmCurrentAnswer: b.llm_current_answer ?? "",
      googleLandscape: b.google_landscape ?? "",
      affiliateLink: b.affiliate_link ?? "",
      wordCount: b.word_count ?? 2000,
      structureOutline: b.structure_outline ?? [],
      status: b.status as ContentBrief["status"],
      createdAt: b.created_at ?? new Date().toISOString(),
    })),
    discoveredAt: row.discovered_at ?? row.created_at ?? new Date().toISOString(),
    lastUpdated: row.last_updated ?? row.created_at ?? new Date().toISOString(),
  };
}

// ── Data Access Functions ────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const supabase = createSPAClient();

  const { data: rows, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !rows || rows.length === 0) {
    const { getProducts: getMockProducts } = await import("@/lib/mock-data/products");
    return getMockProducts();
  }

  const productIds = rows.map((r) => r.id);

  const [scoresRes, llmRes, assetsRes, briefsRes] = await Promise.all([
    supabase.from("product_scores").select("*").in("product_id", productIds),
    supabase.from("llm_test_results").select("*").in("product_id", productIds),
    supabase.from("content_assets").select("*").in("product_id", productIds),
    supabase.from("content_briefs").select("*").in("product_id", productIds),
  ]);

  const scoresMap = new Map((scoresRes.data ?? []).map((s) => [s.product_id, s]));
  const llmMap = new Map<string, LlmRow[]>();
  const assetsMap = new Map<string, AssetRow[]>();
  const briefsMap = new Map<string, BriefRow[]>();

  for (const t of llmRes.data ?? []) {
    if (!llmMap.has(t.product_id)) llmMap.set(t.product_id, []);
    llmMap.get(t.product_id)!.push(t);
  }
  for (const a of assetsRes.data ?? []) {
    if (!assetsMap.has(a.product_id)) assetsMap.set(a.product_id, []);
    assetsMap.get(a.product_id)!.push(a);
  }
  for (const b of briefsRes.data ?? []) {
    if (!briefsMap.has(b.product_id)) briefsMap.set(b.product_id, []);
    briefsMap.get(b.product_id)!.push(b);
  }

  return rows.map((row) =>
    mapProduct(
      row,
      scoresMap.get(row.id) ?? null,
      llmMap.get(row.id) ?? [],
      assetsMap.get(row.id) ?? [],
      briefsMap.get(row.id) ?? []
    )
  );
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const supabase = createSPAClient();

  const { data: row, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !row) {
    const { getProductById: getMockProduct } = await import("@/lib/mock-data/products");
    return getMockProduct(id);
  }

  const [scoreRes, llmRes, assetsRes, briefsRes] = await Promise.all([
    supabase.from("product_scores").select("*").eq("product_id", id).maybeSingle(),
    supabase.from("llm_test_results").select("*").eq("product_id", id),
    supabase.from("content_assets").select("*").eq("product_id", id),
    supabase.from("content_briefs").select("*").eq("product_id", id),
  ]);

  return mapProduct(
    row,
    scoreRes.data ?? null,
    llmRes.data ?? [],
    assetsRes.data ?? [],
    briefsRes.data ?? []
  );
}

// ── Write Operations ─────────────────────────────────────────────────

export interface CreateProductInput {
  name: string;
  description?: string;
  productUrl?: string;
  category?: string;
  intent?: ContentIntent;
  affiliateNetwork?: string;
  affiliateCommission?: string;
  launchedAt?: string;
}

export async function createProduct(input: CreateProductInput): Promise<string | null> {
  const supabase = createSPAClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("products")
    .insert({
      user_id: user.id,
      name: input.name,
      description: input.description ?? null,
      product_url: input.productUrl ?? null,
      category: input.category ?? null,
      intent: (input.intent as ContentIntent) ?? "review",
      affiliate_network: input.affiliateNetwork ?? null,
      affiliate_commission: input.affiliateCommission ?? null,
      launched_at: input.launchedAt ?? null,
      status: "draft",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating product:", error);
    return null;
  }

  return data.id;
}

export interface ScoreProductInput {
  productId: string;
  productNewness: 0 | 1;
  llmGapStrength: 0 | 1;
  buyingIntent: 0 | 1;
  affiliateAvailable: 0 | 1;
  googleGapStrength: 0 | 1;
  notes?: string;
}

export async function scoreProduct(input: ScoreProductInput): Promise<boolean> {
  const supabase = createSPAClient();

  const total = input.productNewness + input.llmGapStrength + input.buyingIntent + input.affiliateAvailable + input.googleGapStrength;
  const verdict = deriveVerdict(total);
  const gapStatus = deriveGapStatus(input.llmGapStrength, input.googleGapStrength);

  const { error: scoreError } = await supabase
    .from("product_scores")
    .upsert({
      product_id: input.productId,
      product_newness: input.productNewness,
      llm_gap_strength: input.llmGapStrength,
      buying_intent: input.buyingIntent,
      affiliate_available: input.affiliateAvailable,
      google_gap_strength: input.googleGapStrength,
      notes: input.notes ?? null,
    }, { onConflict: "product_id" });

  if (scoreError) {
    console.error("Error scoring product:", scoreError);
    return false;
  }

  const { error: updateError } = await supabase
    .from("products")
    .update({ verdict, gap_status: gapStatus, last_updated: new Date().toISOString() })
    .eq("id", input.productId);

  if (updateError) {
    console.error("Error updating product verdict:", updateError);
    return false;
  }

  return true;
}

export interface SaveLlmTestInput {
  productId: string;
  engine: LlmTestResult["engine"];
  query: string;
  rawResponse?: string;
  responseType: LlmTestResult["responseType"];
  citedSources?: string[];
}

export async function saveLlmTestResult(input: SaveLlmTestInput): Promise<boolean> {
  const supabase = createSPAClient();

  const { error } = await supabase.from("llm_test_results").insert({
    product_id: input.productId,
    engine: input.engine,
    query: input.query,
    raw_response: input.rawResponse ?? null,
    response_type: input.responseType,
    cited_sources: input.citedSources ?? [],
  });

  if (error) {
    console.error("Error saving LLM test:", error);
    return false;
  }

  return true;
}
