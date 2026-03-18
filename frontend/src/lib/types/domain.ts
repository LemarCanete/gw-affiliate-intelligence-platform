// ── Enums / Union Types ──────────────────────────────────────────────

export type PublishStatus =
  | 'draft'
  | 'scheduled'
  | 'publishing'
  | 'published'
  | 'failed';

export type ContentFormat =
  | 'seo-article'
  | 'youtube-script'
  | 'pinterest-pin'
  | 'social-post'
  | 'reddit-draft'
  | 'email';

export type Platform =
  | 'blog'
  | 'youtube'
  | 'pinterest'
  | 'social'
  | 'reddit'
  | 'email';

export type FeedType =
  | 'serp-gap'
  | 'gsc-miner'
  | 'kgr-weakspot'
  | 'pseo-engine'
  | 'ai-proxy'
  | 'reddit-miner'
  | 'youtube-comments'
  | 'yt-blog-overlap';

export type FeedHealth = 'healthy' | 'warning' | 'error';

export type GapStatus = 'double-gap' | 'google-only' | 'llm-only' | 'closing' | 'saturated';

export type GapVerdict = 'auto-queue' | 'human-review' | 'discard';

export type ContentIntent = 'informational' | 'comparison' | 'review' | 'how-to';

export interface LlmTestResult {
  engine: 'chatgpt' | 'perplexity' | 'gemini' | 'copilot';
  query: string;
  responseType: 'no-info' | 'vague' | 'generic' | 'detailed' | 'cites-sources';
  citedSources: string[];
  testedAt: string;
}

export interface ContentBrief {
  id: string;
  productId: string;
  targetQuery: string;
  intent: ContentIntent;
  llmCurrentAnswer: string;
  googleLandscape: string;
  affiliateLink: string;
  wordCount: number;
  structureOutline: string[];
  status: 'draft' | 'approved' | 'in-production' | 'published';
  createdAt: string;
}

// ── Domain Models ────────────────────────────────────────────────────

export interface ProductScore {
  productNewness: 0 | 1;      // 1 = launched < 90 days
  llmGapStrength: 0 | 1;      // 1 = LLM gives weak/no answer
  buyingIntent: 0 | 1;        // 1 = query has buying intent
  affiliateAvailable: 0 | 1;  // 1 = affiliate program exists
  googleGapStrength: 0 | 1;   // 1 = Google results are thin
  total: number;               // sum 0-5
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  score: ProductScore;
  status: PublishStatus;
  revenue: number;
  serpPosition: number | null;
  geoScore: number; // 0-100
  source: FeedType;
  verdict: GapVerdict;
  gapStatus: GapStatus;
  intent: ContentIntent;
  launchedAt: string;
  llmTestResults: LlmTestResult[];
  contentBriefs: ContentBrief[];
  affiliateProgram: {
    network: string;
    commission: string;
    cookieDuration: string;
    paymentTerms: string;
  };
  contentAssets: ContentAsset[];
  discoveredAt: string;
  lastUpdated: string;
}

export interface ContentAsset {
  id: string;
  productId: string;
  format: ContentFormat;
  title: string;
  intent: ContentIntent;
  status: PublishStatus;
  platform: Platform;
  url: string | null;
  publishedAt: string | null;
  views: number;
  clicks: number;
  revenue: number;
}

export interface FeedStatus {
  id: string;
  type: FeedType;
  name: string;
  health: FeedHealth;
  itemsDiscovered: number;
  itemsThisWeek: number;
  avgScore: number;
  lastRun: string;
  nextRun: string;
  errorMessage: string | null;
}

export interface OverviewKpis {
  totalRevenue: number;
  revenueChange: number; // percentage
  activeProducts: number;
  productsChange: number;
  pipelineItems: number;
  pipelineChange: number;
  feedsHealthy: number;
  feedsTotal: number;
}

export interface Alert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

export interface WeeklyReport {
  id: string;
  period: string; // e.g., "Mar 3 - Mar 9, 2026"
  weekNumber: number;
  type: 'weekly' | 'monthly';
  totalRevenue: number;
  revenueChange: number;
  topProduct: string;
  productsScored: number;
  contentPublished: number;
  summary: string;
  generatedAt: string;
}

// ── Chart / Analytics Types ──────────────────────────────────────────

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface RevenueByPlatform {
  date: string;
  blog: number;
  youtube: number;
  pinterest: number;
  social: number;
  email: number;
}

export interface RevenueByFormat {
  format: string;
  revenue: number;
  percentage: number;
}

export interface GapWindowPoint {
  date: string;
  gapWindows: number;
  captured: number;
}

export interface RoiPoint {
  product: string;
  cost: number;
  revenue: number;
  roi: number;
}

export interface ScoringWeightHistory {
  date: string;
  productNewness: number;
  llmGapStrength: number;
  buyingIntent: number;
  affiliateAvailable: number;
  googleGapStrength: number;
}

