"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Eye,
  MousePointerClick,
  BarChart3,
  Bot,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Minus,
  Check,
  X,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Clock,
  ShieldAlert,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  UserPlus,
  MessageSquareWarning,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ChartCard } from "@/components/dashboard/ChartCard";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ── Chart Colors ────────────────────────────────────────────────────

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

// ── Types ───────────────────────────────────────────────────────────

type RankingStatus = "ranking" | "indexing" | "not-found";
type CitationStatus = "cited" | "not-cited" | "partial";
type AlertSeverity = "high" | "medium" | "low";
type AlertTrigger = "serp-drop" | "content-stale" | "citation-lost" | "new-competitor";
type SortDirection = "asc" | "desc";

interface RankingEntry {
  keyword: string;
  url: string;
  position: number;
  change: number;
  impressions: number;
  clicks: number;
  ctr: number;
  bestPosition: number;
  contentScore: number | null;
  status: RankingStatus;
  previousClicks: number;
  previousImpressions: number;
  previousPosition: number;
}

interface CitationEntry {
  article: string;
  targetKeyword: string;
  chatgpt: CitationStatus;
  perplexity: CitationStatus;
  gemini: CitationStatus;
  aiOverview: CitationStatus;
  lastChecked: string;
}

interface AiOverviewEntry {
  query: string;
  article: string;
  featured: boolean;
  overviewPosition: string;
  serpPosition: number;
  impressionsAio: number;
  clicksAio: number;
}

interface MonitoringAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  trigger: AlertTrigger;
  detectedAt: string;
  keyword?: string;
  positionBefore?: number;
  positionAfter?: number;
}

// ── Helpers ─────────────────────────────────────────────────────────

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString();
}

function positionColor(pos: number): string {
  if (pos <= 3) return "text-green-600 font-bold";
  if (pos <= 10) return "text-blue-600 font-semibold";
  if (pos <= 20) return "text-yellow-600";
  return "text-gray-500";
}

function ctrColor(ctr: number): string {
  if (ctr >= 5) return "text-green-600";
  if (ctr >= 2) return "text-yellow-600";
  return "text-red-500";
}

// ── Mock Data: Rankings ─────────────────────────────────────────────

const RANKING_DATA: RankingEntry[] = [
  { keyword: "best ai writing tools 2026", url: "/blog/best-ai-writing-tools", position: 2, change: 1, impressions: 8420, clicks: 2526, ctr: 30.0, bestPosition: 1, contentScore: 92, status: "ranking", previousClicks: 2180, previousImpressions: 7600, previousPosition: 3 },
  { keyword: "jasper ai review", url: "/blog/jasper-ai-review", position: 3, change: -1, impressions: 6310, clicks: 1389, ctr: 22.0, bestPosition: 2, contentScore: 88, status: "ranking", previousClicks: 1520, previousImpressions: 6100, previousPosition: 2 },
  { keyword: "grammarly vs quillbot", url: "/blog/grammarly-vs-quillbot", position: 1, change: 0, impressions: 5840, clicks: 1927, ctr: 33.0, bestPosition: 1, contentScore: 95, status: "ranking", previousClicks: 1890, previousImpressions: 5700, previousPosition: 1 },
  { keyword: "notion ai features", url: "/blog/notion-ai-review", position: 5, change: 2, impressions: 4200, clicks: 462, ctr: 11.0, bestPosition: 3, contentScore: 84, status: "ranking", previousClicks: 310, previousImpressions: 3500, previousPosition: 7 },
  { keyword: "claude ai for students", url: "/blog/claude-ai-education", position: 4, change: 3, impressions: 3900, clicks: 546, ctr: 14.0, bestPosition: 4, contentScore: 90, status: "ranking", previousClicks: 280, previousImpressions: 2800, previousPosition: 7 },
  { keyword: "ai seo tools comparison", url: "/blog/ai-seo-tools", position: 7, change: -2, impressions: 3100, clicks: 217, ctr: 7.0, bestPosition: 4, contentScore: 81, status: "ranking", previousClicks: 290, previousImpressions: 3400, previousPosition: 5 },
  { keyword: "chatgpt alternatives for writing", url: "/blog/chatgpt-alternatives", position: 6, change: 1, impressions: 2980, clicks: 268, ctr: 9.0, bestPosition: 5, contentScore: 87, status: "ranking", previousClicks: 240, previousImpressions: 2700, previousPosition: 7 },
  { keyword: "surfer seo review 2026", url: "/blog/surfer-seo-review", position: 8, change: 0, impressions: 2750, clicks: 165, ctr: 6.0, bestPosition: 6, contentScore: 79, status: "ranking", previousClicks: 170, previousImpressions: 2800, previousPosition: 8 },
  { keyword: "ai productivity tools for teachers", url: "/blog/ai-tools-teachers", position: 9, change: 4, impressions: 2400, clicks: 120, ctr: 5.0, bestPosition: 9, contentScore: 76, status: "ranking", previousClicks: 60, previousImpressions: 1800, previousPosition: 13 },
  { keyword: "neuronwriter review", url: "/blog/neuronwriter-review", position: 11, change: -3, impressions: 2100, clicks: 63, ctr: 3.0, bestPosition: 7, contentScore: 82, status: "ranking", previousClicks: 95, previousImpressions: 2400, previousPosition: 8 },
  { keyword: "best ai tools for seo", url: "/blog/ai-tools-seo-guide", position: 12, change: 1, impressions: 1900, clicks: 49, ctr: 2.6, bestPosition: 10, contentScore: 78, status: "ranking", previousClicks: 42, previousImpressions: 1750, previousPosition: 13 },
  { keyword: "writesonic vs copy ai", url: "/blog/writesonic-vs-copy-ai", position: 14, change: -1, impressions: 1700, clicks: 34, ctr: 2.0, bestPosition: 11, contentScore: 74, status: "ranking", previousClicks: 38, previousImpressions: 1800, previousPosition: 13 },
  { keyword: "ai content detection bypass", url: "/blog/ai-detection-guide", position: 16, change: 5, impressions: 1500, clicks: 23, ctr: 1.5, bestPosition: 16, contentScore: 71, status: "ranking", previousClicks: 8, previousImpressions: 900, previousPosition: 21 },
  { keyword: "perplexity ai for research", url: "/blog/perplexity-ai-research", position: 10, change: 2, impressions: 2200, clicks: 88, ctr: 4.0, bestPosition: 8, contentScore: 85, status: "ranking", previousClicks: 65, previousImpressions: 1900, previousPosition: 12 },
  { keyword: "ai image generators ranking", url: "/blog/ai-image-generators", position: 18, change: -4, impressions: 1300, clicks: 14, ctr: 1.1, bestPosition: 12, contentScore: 68, status: "ranking", previousClicks: 28, previousImpressions: 1600, previousPosition: 14 },
  { keyword: "google sge optimization", url: "/blog/sge-optimization-guide", position: 13, change: 0, impressions: 1800, clicks: 43, ctr: 2.4, bestPosition: 9, contentScore: 80, status: "ranking", previousClicks: 45, previousImpressions: 1850, previousPosition: 13 },
  { keyword: "ai study tools for college", url: "/blog/ai-study-tools", position: 15, change: 3, impressions: 1600, clicks: 26, ctr: 1.6, bestPosition: 15, contentScore: null, status: "ranking", previousClicks: 12, previousImpressions: 1100, previousPosition: 18 },
  { keyword: "rank math vs yoast 2026", url: "/blog/rank-math-vs-yoast", position: 21, change: -6, impressions: 980, clicks: 10, ctr: 1.0, bestPosition: 14, contentScore: 65, status: "ranking", previousClicks: 30, previousImpressions: 1400, previousPosition: 15 },
  { keyword: "ai email marketing tools", url: "/blog/ai-email-marketing", position: 24, change: 2, impressions: 820, clicks: 6, ctr: 0.7, bestPosition: 18, contentScore: 62, status: "ranking", previousClicks: 4, previousImpressions: 700, previousPosition: 26 },
  { keyword: "best llm for coding 2026", url: "/blog/best-llm-coding", position: 19, change: -2, impressions: 1100, clicks: 15, ctr: 1.4, bestPosition: 13, contentScore: 73, status: "ranking", previousClicks: 22, previousImpressions: 1250, previousPosition: 17 },
  { keyword: "canva ai features review", url: "/blog/canva-ai-features", position: 22, change: 1, impressions: 900, clicks: 8, ctr: 0.9, bestPosition: 20, contentScore: 60, status: "ranking", previousClicks: 7, previousImpressions: 850, previousPosition: 23 },
  { keyword: "ai tools for small business", url: "/blog/ai-small-business", position: 28, change: -3, impressions: 650, clicks: 3, ctr: 0.5, bestPosition: 22, contentScore: 58, status: "ranking", previousClicks: 6, previousImpressions: 800, previousPosition: 25 },
  { keyword: "midjourney vs dall-e 3", url: "/blog/midjourney-vs-dalle", position: 17, change: 0, impressions: 1400, clicks: 18, ctr: 1.3, bestPosition: 15, contentScore: 72, status: "ranking", previousClicks: 19, previousImpressions: 1420, previousPosition: 17 },
  { keyword: "ai presentation tools", url: "/blog/ai-presentation-tools", position: 32, change: -5, impressions: 480, clicks: 2, ctr: 0.4, bestPosition: 25, contentScore: 55, status: "indexing", previousClicks: 5, previousImpressions: 620, previousPosition: 27 },
  { keyword: "claude vs chatgpt comparison", url: "/blog/claude-vs-chatgpt", position: 20, change: 6, impressions: 1050, clicks: 12, ctr: 1.1, bestPosition: 20, contentScore: 77, status: "ranking", previousClicks: 3, previousImpressions: 500, previousPosition: 26 },
  { keyword: "ai podcast tools 2026", url: "/blog/ai-podcast-tools", position: 35, change: 0, impressions: 350, clicks: 1, ctr: 0.3, bestPosition: 35, contentScore: null, status: "indexing", previousClicks: 1, previousImpressions: 340, previousPosition: 35 },
  { keyword: "gemini pro vs claude opus", url: "/blog/gemini-vs-claude", position: 26, change: -1, impressions: 720, clicks: 4, ctr: 0.6, bestPosition: 23, contentScore: 67, status: "ranking", previousClicks: 5, previousImpressions: 760, previousPosition: 25 },
  { keyword: "ai tools for teachers 2026", url: "/blog/ai-tools-teachers-2026", position: 42, change: 0, impressions: 210, clicks: 0, ctr: 0.0, bestPosition: 42, contentScore: null, status: "indexing", previousClicks: 0, previousImpressions: 200, previousPosition: 42 },
  { keyword: "seo automation with ai", url: "/blog/seo-automation-ai", position: 30, change: 2, impressions: 540, clicks: 2, ctr: 0.4, bestPosition: 28, contentScore: 59, status: "ranking", previousClicks: 1, previousImpressions: 480, previousPosition: 32 },
  { keyword: "ai writing for education blogs", url: "/blog/ai-writing-education", position: 48, change: 0, impressions: 120, clicks: 0, ctr: 0.0, bestPosition: 48, contentScore: null, status: "not-found", previousClicks: 0, previousImpressions: 110, previousPosition: 48 },
];

// ── Mock Data: Position Trend (7d) ─────────────────────────────────

function generatePositionTrend(days: number) {
  const keywords = [
    { name: "best ai writing tools 2026", base: 3 },
    { name: "grammarly vs quillbot", base: 2 },
    { name: "jasper ai review", base: 4 },
    { name: "notion ai features", base: 7 },
    { name: "claude ai for students", base: 7 },
  ];

  const data = [];
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const entry: Record<string, string | number> = { date: label };
    keywords.forEach((kw) => {
      const drift = Math.sin(i * 0.4 + kw.base) * 2;
      const trend = i > days / 2 ? 1 : -0.5;
      entry[kw.name] = Math.max(1, Math.round(kw.base + drift + trend * (i / days)));
    });
    data.push(entry);
  }
  return { data, keywords: keywords.map((k) => k.name) };
}

// ── Mock Data: Citations ────────────────────────────────────────────

const CITATION_DATA: CitationEntry[] = [
  { article: "Best AI Writing Tools 2026", targetKeyword: "best ai writing tools", chatgpt: "cited", perplexity: "cited", gemini: "cited", aiOverview: "cited", lastChecked: "2026-03-20T08:00:00Z" },
  { article: "Jasper AI Review", targetKeyword: "jasper ai review", chatgpt: "cited", perplexity: "cited", gemini: "partial", aiOverview: "not-cited", lastChecked: "2026-03-20T07:30:00Z" },
  { article: "Grammarly vs QuillBot", targetKeyword: "grammarly vs quillbot", chatgpt: "cited", perplexity: "cited", gemini: "cited", aiOverview: "cited", lastChecked: "2026-03-20T06:45:00Z" },
  { article: "Claude AI for Education", targetKeyword: "claude ai for students", chatgpt: "partial", perplexity: "cited", gemini: "not-cited", aiOverview: "not-cited", lastChecked: "2026-03-20T06:00:00Z" },
  { article: "AI SEO Tools Comparison", targetKeyword: "ai seo tools", chatgpt: "cited", perplexity: "partial", gemini: "not-cited", aiOverview: "not-cited", lastChecked: "2026-03-19T22:00:00Z" },
  { article: "ChatGPT Alternatives for Writing", targetKeyword: "chatgpt alternatives", chatgpt: "not-cited", perplexity: "cited", gemini: "cited", aiOverview: "not-cited", lastChecked: "2026-03-19T20:00:00Z" },
  { article: "Surfer SEO Review 2026", targetKeyword: "surfer seo review", chatgpt: "partial", perplexity: "not-cited", gemini: "not-cited", aiOverview: "not-cited", lastChecked: "2026-03-19T18:00:00Z" },
  { article: "NeuronWriter Review", targetKeyword: "neuronwriter review", chatgpt: "not-cited", perplexity: "cited", gemini: "not-cited", aiOverview: "not-cited", lastChecked: "2026-03-19T16:00:00Z" },
  { article: "Perplexity AI for Research", targetKeyword: "perplexity ai", chatgpt: "cited", perplexity: "cited", gemini: "cited", aiOverview: "partial", lastChecked: "2026-03-19T14:00:00Z" },
  { article: "Notion AI Review", targetKeyword: "notion ai features", chatgpt: "cited", perplexity: "partial", gemini: "partial", aiOverview: "not-cited", lastChecked: "2026-03-19T12:00:00Z" },
  { article: "Google SGE Optimization Guide", targetKeyword: "google sge optimization", chatgpt: "not-cited", perplexity: "cited", gemini: "partial", aiOverview: "cited", lastChecked: "2026-03-19T10:00:00Z" },
  { article: "AI Tools for Teachers", targetKeyword: "ai tools for teachers", chatgpt: "partial", perplexity: "not-cited", gemini: "not-cited", aiOverview: "not-cited", lastChecked: "2026-03-19T08:00:00Z" },
  { article: "Claude vs ChatGPT Comparison", targetKeyword: "claude vs chatgpt", chatgpt: "not-cited", perplexity: "cited", gemini: "cited", aiOverview: "not-cited", lastChecked: "2026-03-18T22:00:00Z" },
  { article: "Midjourney vs DALL-E 3", targetKeyword: "midjourney vs dall-e", chatgpt: "cited", perplexity: "not-cited", gemini: "not-cited", aiOverview: "not-cited", lastChecked: "2026-03-18T20:00:00Z" },
  { article: "Best LLM for Coding 2026", targetKeyword: "best llm for coding", chatgpt: "partial", perplexity: "partial", gemini: "cited", aiOverview: "not-cited", lastChecked: "2026-03-18T18:00:00Z" },
];

// ── Mock Data: Citations Over Time ──────────────────────────────────

const CITATION_TREND_DATA = [
  { week: "Feb 3", chatgpt: 5, perplexity: 3, gemini: 2, aiOverview: 1 },
  { week: "Feb 10", chatgpt: 6, perplexity: 4, gemini: 2, aiOverview: 1 },
  { week: "Feb 17", chatgpt: 7, perplexity: 5, gemini: 3, aiOverview: 2 },
  { week: "Feb 24", chatgpt: 7, perplexity: 6, gemini: 3, aiOverview: 2 },
  { week: "Mar 3", chatgpt: 8, perplexity: 7, gemini: 4, aiOverview: 3 },
  { week: "Mar 10", chatgpt: 9, perplexity: 8, gemini: 5, aiOverview: 3 },
  { week: "Mar 17", chatgpt: 9, perplexity: 9, gemini: 5, aiOverview: 4 },
];

// ── Mock Data: AI Overviews ─────────────────────────────────────────

const AI_OVERVIEW_DATA: AiOverviewEntry[] = [
  { query: "best ai writing tools", article: "Best AI Writing Tools 2026", featured: true, overviewPosition: "1st source", serpPosition: 2, impressionsAio: 1240, clicksAio: 186 },
  { query: "grammarly vs quillbot", article: "Grammarly vs QuillBot", featured: true, overviewPosition: "1st source", serpPosition: 1, impressionsAio: 980, clicksAio: 147 },
  { query: "chatgpt alternatives", article: "ChatGPT Alternatives for Writing", featured: true, overviewPosition: "2nd source", serpPosition: 6, impressionsAio: 720, clicksAio: 86 },
  { query: "ai tools for seo", article: "AI SEO Tools Comparison", featured: true, overviewPosition: "3rd source", serpPosition: 7, impressionsAio: 540, clicksAio: 38 },
  { query: "google sge optimization", article: "Google SGE Optimization Guide", featured: true, overviewPosition: "2nd source", serpPosition: 13, impressionsAio: 460, clicksAio: 41 },
  { query: "jasper ai review", article: "Jasper AI Review", featured: false, overviewPosition: "Not listed", serpPosition: 3, impressionsAio: 0, clicksAio: 0 },
  { query: "claude ai for education", article: "Claude AI for Education", featured: true, overviewPosition: "3rd source", serpPosition: 4, impressionsAio: 380, clicksAio: 27 },
  { query: "notion ai features", article: "Notion AI Review", featured: false, overviewPosition: "Not listed", serpPosition: 5, impressionsAio: 0, clicksAio: 0 },
  { query: "surfer seo review", article: "Surfer SEO Review 2026", featured: false, overviewPosition: "Not listed", serpPosition: 8, impressionsAio: 0, clicksAio: 0 },
  { query: "perplexity ai research tool", article: "Perplexity AI for Research", featured: true, overviewPosition: "1st source", serpPosition: 10, impressionsAio: 620, clicksAio: 93 },
];

// ── Mock Data: Alerts ───────────────────────────────────────────────

const ALERT_DATA: MonitoringAlert[] = [
  { id: "a1", severity: "high", title: "Rank Math vs Yoast dropped 6 positions", description: "Position moved from #15 to #21 in the last 48 hours. Likely caused by a new competitor article ranking.", trigger: "serp-drop", detectedAt: "2026-03-20T06:00:00Z", keyword: "rank math vs yoast 2026", positionBefore: 15, positionAfter: 21 },
  { id: "a2", severity: "high", title: "AI Image Generators ranking dropped 4 spots", description: "Steady decline from #14 to #18 over the past week. Competitor domain authority increase detected.", trigger: "serp-drop", detectedAt: "2026-03-19T14:00:00Z", keyword: "ai image generators ranking", positionBefore: 14, positionAfter: 18 },
  { id: "a3", severity: "high", title: "Citation lost on ChatGPT for AI Tools for Teachers", description: "Article was previously cited by ChatGPT but is no longer appearing in responses. May need content refresh.", trigger: "citation-lost", detectedAt: "2026-03-19T10:00:00Z" },
  { id: "a4", severity: "medium", title: "AI Presentation Tools page stuck indexing", description: "Page submitted 14 days ago but still showing as indexing. Position at #32 suggests thin content or crawl issues.", trigger: "content-stale", detectedAt: "2026-03-18T08:00:00Z" },
  { id: "a5", severity: "medium", title: "NeuronWriter review dropped from top 10", description: "Position moved from #8 to #11 over 5 days. NeuronWriter released a major update that is not covered.", trigger: "serp-drop", detectedAt: "2026-03-18T06:00:00Z", keyword: "neuronwriter review", positionBefore: 8, positionAfter: 11 },
  { id: "a6", severity: "medium", title: "New competitor for 'best ai writing tools'", description: "Authority Hacker published a comprehensive guide that entered top 5. Monitor closely for further impact.", trigger: "new-competitor", detectedAt: "2026-03-17T22:00:00Z" },
  { id: "a7", severity: "low", title: "Surfer SEO review content age > 90 days", description: "Last updated 94 days ago. Review for outdated pricing, features, and screenshots.", trigger: "content-stale", detectedAt: "2026-03-17T12:00:00Z" },
  { id: "a8", severity: "high", title: "AI SEO Tools comparison lost Gemini citation", description: "Gemini no longer cites this article. Perplexity citation changed to partial. Immediate re-optimization recommended.", trigger: "citation-lost", detectedAt: "2026-03-17T08:00:00Z" },
  { id: "a9", severity: "medium", title: "WriteSonic vs Copy.ai slipping", description: "Position declined from #13 to #14. CTR dropped below 2%. Consider adding comparison tables and updated pricing.", trigger: "serp-drop", detectedAt: "2026-03-16T16:00:00Z", keyword: "writesonic vs copy ai", positionBefore: 13, positionAfter: 14 },
  { id: "a10", severity: "low", title: "AI Email Marketing page needs schema markup", description: "No FAQ schema detected. Adding structured data could improve CTR from 0.7% to estimated 1.5%.", trigger: "content-stale", detectedAt: "2026-03-16T10:00:00Z" },
  { id: "a11", severity: "low", title: "New competitor for 'claude vs chatgpt'", description: "Tom's Guide published an updated comparison. Currently ranked #8. Monitor for potential impact on our #20 position.", trigger: "new-competitor", detectedAt: "2026-03-15T20:00:00Z" },
  { id: "a12", severity: "medium", title: "AI Podcast Tools page not gaining traction", description: "Published 21 days ago, still at position #35 with minimal impressions. Consider internal linking and content expansion.", trigger: "content-stale", detectedAt: "2026-03-15T08:00:00Z" },
];

// ── Severity / Trigger Config ───────────────────────────────────────

const SEVERITY_CONFIG: Record<AlertSeverity, { label: string; className: string; stripe: string }> = {
  high: { label: "High", className: "bg-red-100 text-red-800 hover:bg-red-100", stripe: "bg-red-500" },
  medium: { label: "Medium", className: "bg-amber-100 text-amber-800 hover:bg-amber-100", stripe: "bg-amber-500" },
  low: { label: "Low", className: "bg-blue-100 text-blue-800 hover:bg-blue-100", stripe: "bg-blue-500" },
};

const TRIGGER_CONFIG: Record<AlertTrigger, { label: string; icon: typeof AlertTriangle }> = {
  "serp-drop": { label: "SERP Drop", icon: TrendingDown },
  "content-stale": { label: "Content Stale", icon: Clock },
  "citation-lost": { label: "Citation Lost", icon: MessageSquareWarning },
  "new-competitor": { label: "New Competitor", icon: UserPlus },
};

const RANKING_STATUS_CONFIG: Record<RankingStatus, { label: string; className: string }> = {
  ranking: { label: "Ranking", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  indexing: { label: "Indexing", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
  "not-found": { label: "Not Found", className: "bg-red-100 text-red-800 hover:bg-red-100" },
};

// ── Citation Badge Component ────────────────────────────────────────

function CitationBadge({ status }: { status: CitationStatus }) {
  if (status === "cited") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
        <Check className="h-3 w-3" /> Cited
      </span>
    );
  }
  if (status === "partial") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">
        <AlertTriangle className="h-3 w-3" /> Partial
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
      <X className="h-3 w-3" /> Not Cited
    </span>
  );
}

// ── Citation Count Helper ───────────────────────────────────────────

function countCitations(entry: CitationEntry): number {
  let count = 0;
  if (entry.chatgpt === "cited") count++;
  if (entry.perplexity === "cited") count++;
  if (entry.gemini === "cited") count++;
  if (entry.aiOverview === "cited") count++;
  return count;
}

function countCitationsByEngine(engine: "chatgpt" | "perplexity" | "gemini" | "aiOverview"): number {
  return CITATION_DATA.filter((e) => e[engine] === "cited").length;
}

// ── KPI Card Row ────────────────────────────────────────────────────

function KpiCards() {
  const avgPosition = (RANKING_DATA.reduce((s, r) => s + r.position, 0) / RANKING_DATA.length).toFixed(1);
  const totalClicks = RANKING_DATA.reduce((s, r) => s + r.clicks, 0);
  const totalImpressions = RANKING_DATA.reduce((s, r) => s + r.impressions, 0);
  const citedCount = CITATION_DATA.filter(
    (c) => c.chatgpt === "cited" || c.perplexity === "cited" || c.gemini === "cited" || c.aiOverview === "cited"
  ).length;
  const aioCount = AI_OVERVIEW_DATA.filter((a) => a.featured).length;

  const cards = [
    { title: "Total Keywords Tracked", value: "142", icon: Search, iconBg: "bg-primary-50", iconClass: "text-primary-600" },
    { title: "Avg. Position", value: avgPosition, change: "+2.1", changeColor: "text-green-600", icon: BarChart3, iconBg: "bg-blue-50", iconClass: "text-blue-600" },
    { title: "Total Clicks (7d)", value: formatNumber(totalClicks), change: "+12%", changeColor: "text-green-600", icon: MousePointerClick, iconBg: "bg-green-50", iconClass: "text-green-600" },
    { title: "Total Impressions (7d)", value: formatNumber(totalImpressions), icon: Eye, iconBg: "bg-purple-50", iconClass: "text-purple-600" },
    { title: "LLM Citations", value: `${citedCount}/${CITATION_DATA.length} articles`, icon: Bot, iconBg: "bg-orange-50", iconClass: "text-orange-600" },
    { title: "AI Overview Appearances", value: String(aioCount), icon: Sparkles, iconBg: "bg-cyan-50", iconClass: "text-cyan-600" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.title}</p>
                <p className="text-xl font-bold text-gray-900">{card.value}</p>
                {"change" in card && card.change && (
                  <span className={`text-xs font-medium ${card.changeColor}`}>{card.change}</span>
                )}
              </div>
              <div className={`p-2.5 rounded-lg ${card.iconBg}`}>
                <card.icon className={`h-5 w-5 ${card.iconClass}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ── Rankings Tab ─────────────────────────────────────────────────────

function getClicksTrend(current: number, previous: number): "gaining" | "declining" | "stable" {
  if (previous === 0 && current === 0) return "stable";
  if (previous === 0) return "gaining";
  const pctChange = ((current - previous) / previous) * 100;
  if (pctChange > 5) return "gaining";
  if (pctChange < -5) return "declining";
  return "stable";
}

function TrendBadge({ trend }: { trend: "gaining" | "declining" | "stable" }) {
  if (trend === "gaining") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
        <TrendingUp className="h-3 w-3" /> Gaining
      </span>
    );
  }
  if (trend === "declining") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
        <TrendingDown className="h-3 w-3" /> Declining
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
      <Minus className="h-3 w-3" /> Stable
    </span>
  );
}

function PeriodComparisonCards() {
  const currentClicks = RANKING_DATA.reduce((s, r) => s + r.clicks, 0);
  const previousClicks = RANKING_DATA.reduce((s, r) => s + r.previousClicks, 0);
  const currentImpressions = RANKING_DATA.reduce((s, r) => s + r.impressions, 0);
  const previousImpressions = RANKING_DATA.reduce((s, r) => s + r.previousImpressions, 0);
  const currentAvgCtr = currentImpressions > 0 ? (currentClicks / currentImpressions) * 100 : 0;
  const previousAvgCtr = previousImpressions > 0 ? (previousClicks / previousImpressions) * 100 : 0;
  const currentAvgPos = RANKING_DATA.reduce((s, r) => s + r.position, 0) / RANKING_DATA.length;
  const previousAvgPos = RANKING_DATA.reduce((s, r) => s + r.previousPosition, 0) / RANKING_DATA.length;

  function pctChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  const metrics = [
    {
      label: "Clicks",
      current: formatNumber(currentClicks),
      previous: formatNumber(previousClicks),
      change: pctChange(currentClicks, previousClicks),
      invertColor: false,
    },
    {
      label: "Impressions",
      current: formatNumber(currentImpressions),
      previous: formatNumber(previousImpressions),
      change: pctChange(currentImpressions, previousImpressions),
      invertColor: false,
    },
    {
      label: "Avg CTR",
      current: `${currentAvgCtr.toFixed(1)}%`,
      previous: `${previousAvgCtr.toFixed(1)}%`,
      change: pctChange(currentAvgCtr, previousAvgCtr),
      invertColor: false,
    },
    {
      label: "Avg Position",
      current: currentAvgPos.toFixed(1),
      previous: previousAvgPos.toFixed(1),
      change: pctChange(currentAvgPos, previousAvgPos),
      invertColor: true, // lower position = better, so decrease is green
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => {
        const isPositive = m.invertColor ? m.change < 0 : m.change > 0;
        const isNegative = m.invertColor ? m.change > 0 : m.change < 0;
        const changeColor = isPositive ? "text-green-600" : isNegative ? "text-red-500" : "text-gray-500";
        const changeBg = isPositive ? "bg-green-50" : isNegative ? "bg-red-50" : "bg-gray-50";
        const ChangeIcon = isPositive ? ArrowUp : isNegative ? ArrowDown : Minus;

        return (
          <Card key={m.label}>
            <CardContent className="p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{m.label}</p>
              <div className="flex items-end justify-between mt-2">
                <p className="text-xl font-bold text-gray-900">{m.current}</p>
                <span className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded ${changeBg} ${changeColor}`}>
                  <ChangeIcon className="h-3 w-3" />
                  {Math.abs(m.change).toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Previous: {m.previous}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function RankingsTab() {
  const [timeRange, setTimeRange] = useState<7 | 28 | 90>(7);
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [sortKey, setSortKey] = useState<keyof RankingEntry>("position");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");

  const trend = useMemo(() => generatePositionTrend(timeRange), [timeRange]);

  const filtered = useMemo(() => {
    let data = [...RANKING_DATA];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter((r) => r.keyword.toLowerCase().includes(q) || r.url.toLowerCase().includes(q));
    }

    if (positionFilter !== "all") {
      const [min, max] = positionFilter.split("-").map(Number);
      data = data.filter((r) => r.position >= min && r.position <= max);
    }

    data.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return data;
  }, [searchQuery, positionFilter, sortKey, sortDir]);

  const handleSort = (key: keyof RankingEntry) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: keyof RankingEntry }) => {
    if (sortKey !== col) return <ChevronUp className="h-3 w-3 text-gray-300" />;
    return sortDir === "asc" ? (
      <ChevronUp className="h-3 w-3 text-gray-700" />
    ) : (
      <ChevronDown className="h-3 w-3 text-gray-700" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Time range + filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-lg border p-1">
          {([7, 28, 90] as const).map((d) => (
            <button
              key={d}
              onClick={() => setTimeRange(d)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                timeRange === d ? "bg-primary-50 text-primary-600" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={positionFilter} onValueChange={setPositionFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Position Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            <SelectItem value="1-3">Top 3</SelectItem>
            <SelectItem value="1-10">Top 10</SelectItem>
            <SelectItem value="11-20">Positions 11-20</SelectItem>
            <SelectItem value="21-50">Positions 21-50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Period-over-Period Comparison */}
      <PeriodComparisonCards />

      {/* Position trend chart */}
      <ChartCard title="Position Trend" description={`Top 5 keywords over ${timeRange} days (lower is better)`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trend.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis reversed tick={{ fontSize: 11 }} domain={[1, "auto"]} label={{ value: "Position", angle: -90, position: "insideLeft", fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {trend.keywords.map((kw, i) => (
              <Line
                key={kw}
                type="monotone"
                dataKey={kw}
                stroke={CHART_COLORS[i % CHART_COLORS.length]}
                strokeWidth={2}
                dot={false}
                name={kw.length > 28 ? kw.slice(0, 28) + "..." : kw}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Rankings table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("keyword")}>
                    <span className="inline-flex items-center gap-1">Keyword <SortIcon col="keyword" /></span>
                  </TableHead>
                  <TableHead>Page URL</TableHead>
                  <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort("position")}>
                    <span className="inline-flex items-center gap-1 justify-end">Position <SortIcon col="position" /></span>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort("change")}>
                    <span className="inline-flex items-center gap-1 justify-end">Change <SortIcon col="change" /></span>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort("impressions")}>
                    <span className="inline-flex items-center gap-1 justify-end">Impressions <SortIcon col="impressions" /></span>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort("clicks")}>
                    <span className="inline-flex items-center gap-1 justify-end">Clicks <SortIcon col="clicks" /></span>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort("ctr")}>
                    <span className="inline-flex items-center gap-1 justify-end">CTR <SortIcon col="ctr" /></span>
                  </TableHead>
                  <TableHead className="text-center">Trend</TableHead>
                  <TableHead className="text-right">Best</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.keyword}>
                    <TableCell className="font-medium text-gray-900 max-w-[240px]">
                      <span className="truncate block">{r.keyword}</span>
                    </TableCell>
                    <TableCell className="max-w-[180px]">
                      <a href="#" className="text-blue-600 hover:underline text-xs truncate block" title={r.url}>
                        {r.url} <ExternalLink className="inline h-3 w-3 ml-0.5" />
                      </a>
                    </TableCell>
                    <TableCell className={`text-right tabular-nums ${positionColor(r.position)}`}>
                      {r.position}
                    </TableCell>
                    <TableCell className="text-right">
                      {r.change > 0 ? (
                        <span className="inline-flex items-center gap-0.5 text-green-600 text-sm font-medium">
                          <ArrowUp className="h-3.5 w-3.5" />{r.change}
                        </span>
                      ) : r.change < 0 ? (
                        <span className="inline-flex items-center gap-0.5 text-red-500 text-sm font-medium">
                          <ArrowDown className="h-3.5 w-3.5" />{Math.abs(r.change)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-gray-400 text-sm">
                          <Minus className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-gray-700">{formatNumber(r.impressions)}</TableCell>
                    <TableCell className="text-right tabular-nums text-gray-700">{formatNumber(r.clicks)}</TableCell>
                    <TableCell className={`text-right tabular-nums ${ctrColor(r.ctr)}`}>{r.ctr.toFixed(1)}%</TableCell>
                    <TableCell className="text-center">
                      <TrendBadge trend={getClicksTrend(r.clicks, r.previousClicks)} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-gray-500">{r.bestPosition}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {r.contentScore !== null ? (
                        <span className={`font-medium ${r.contentScore >= 80 ? "text-green-600" : r.contentScore >= 60 ? "text-yellow-600" : "text-red-500"}`}>
                          {r.contentScore}
                        </span>
                      ) : (
                        <span className="text-gray-300">--</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={`border-transparent text-xs ${RANKING_STATUS_CONFIG[r.status].className}`}>
                        {RANKING_STATUS_CONFIG[r.status].label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Citations Tab ───────────────────────────────────────────────────

function CitationsTab() {
  const engineCards = [
    { engine: "ChatGPT" as const, key: "chatgpt" as const, color: "bg-green-50 text-green-700 border-green-200" },
    { engine: "Perplexity" as const, key: "perplexity" as const, color: "bg-blue-50 text-blue-700 border-blue-200" },
    { engine: "Gemini" as const, key: "gemini" as const, color: "bg-purple-50 text-purple-700 border-purple-200" },
    { engine: "AI Overviews" as const, key: "aiOverview" as const, color: "bg-orange-50 text-orange-700 border-orange-200" },
  ];

  return (
    <div className="space-y-6">
      {/* Engine summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {engineCards.map((ec) => {
          const cited = countCitationsByEngine(ec.key);
          const total = CITATION_DATA.length;
          const pct = Math.round((cited / total) * 100);
          return (
            <Card key={ec.engine} className={`border ${ec.color.split(" ")[2]}`}>
              <CardContent className="p-5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{ec.engine}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{cited}/{total}</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${ec.color.split(" ")[0].replace("50", "500")}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">{pct}% cited</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Citations over time chart */}
      <ChartCard title="Citations Over Time" description="Weekly count of articles cited by each engine">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={CITATION_TREND_DATA}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="chatgpt" name="ChatGPT" fill={CHART_COLORS[0]} radius={[2, 2, 0, 0]} />
            <Bar dataKey="perplexity" name="Perplexity" fill={CHART_COLORS[1]} radius={[2, 2, 0, 0]} />
            <Bar dataKey="gemini" name="Gemini" fill={CHART_COLORS[2]} radius={[2, 2, 0, 0]} />
            <Bar dataKey="aiOverview" name="AI Overviews" fill={CHART_COLORS[3]} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Citations table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article Title</TableHead>
                  <TableHead>Target Keyword</TableHead>
                  <TableHead className="text-center">ChatGPT</TableHead>
                  <TableHead className="text-center">Perplexity</TableHead>
                  <TableHead className="text-center">Gemini</TableHead>
                  <TableHead className="text-center">AI Overviews</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead>Last Checked</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CITATION_DATA.map((c) => {
                  const total = countCitations(c);
                  return (
                    <TableRow key={c.article}>
                      <TableCell className="font-medium text-gray-900 max-w-[220px]">
                        <span className="truncate block">{c.article}</span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{c.targetKeyword}</TableCell>
                      <TableCell className="text-center"><CitationBadge status={c.chatgpt} /></TableCell>
                      <TableCell className="text-center"><CitationBadge status={c.perplexity} /></TableCell>
                      <TableCell className="text-center"><CitationBadge status={c.gemini} /></TableCell>
                      <TableCell className="text-center"><CitationBadge status={c.aiOverview} /></TableCell>
                      <TableCell className="text-center">
                        <span className={`font-bold tabular-nums ${total >= 3 ? "text-green-600" : total >= 1 ? "text-yellow-600" : "text-red-500"}`}>
                          {total}/4
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-gray-500 whitespace-nowrap">{timeAgo(c.lastChecked)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── AI Overviews Tab ────────────────────────────────────────────────

function AiOverviewsTab() {
  const featuredCount = AI_OVERVIEW_DATA.filter((a) => a.featured).length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Featured in AI Overviews</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{featuredCount}/{AI_OVERVIEW_DATA.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">AIO Impressions (7d)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatNumber(AI_OVERVIEW_DATA.reduce((s, a) => s + a.impressionsAio, 0))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">AIO Clicks (7d)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatNumber(AI_OVERVIEW_DATA.reduce((s, a) => s + a.clicksAio, 0))}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Query</TableHead>
                  <TableHead>Your Article</TableHead>
                  <TableHead className="text-center">Featured?</TableHead>
                  <TableHead className="text-center">Position in Overview</TableHead>
                  <TableHead className="text-right">SERP Position</TableHead>
                  <TableHead className="text-right">AIO Impressions</TableHead>
                  <TableHead className="text-right">AIO Clicks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {AI_OVERVIEW_DATA.map((a) => (
                  <TableRow key={a.query}>
                    <TableCell className="font-medium text-gray-900">{a.query}</TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-[200px]">
                      <span className="truncate block">{a.article}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      {a.featured ? (
                        <Badge className="border-transparent bg-green-100 text-green-800 hover:bg-green-100">Yes</Badge>
                      ) : (
                        <Badge className="border-transparent bg-gray-100 text-gray-600 hover:bg-gray-100">No</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={a.featured ? "font-medium text-gray-900" : "text-gray-400"}>
                        {a.overviewPosition}
                      </span>
                    </TableCell>
                    <TableCell className={`text-right tabular-nums ${positionColor(a.serpPosition)}`}>
                      {a.serpPosition}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-gray-700">
                      {a.impressionsAio > 0 ? formatNumber(a.impressionsAio) : "--"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-gray-700">
                      {a.clicksAio > 0 ? formatNumber(a.clicksAio) : "--"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Alerts Tab ──────────────────────────────────────────────────────

function AlertsTab() {
  const [severityFilter, setSeverityFilter] = useState("all");
  const [triggerFilter, setTriggerFilter] = useState("all");

  const filtered = useMemo(() => {
    return ALERT_DATA.filter((a) => {
      if (severityFilter !== "all" && a.severity !== severityFilter) return false;
      if (triggerFilter !== "all" && a.trigger !== triggerFilter) return false;
      return true;
    });
  }, [severityFilter, triggerFilter]);

  const highCount = ALERT_DATA.filter((a) => a.severity === "high").length;
  const medCount = ALERT_DATA.filter((a) => a.severity === "medium").length;
  const lowCount = ALERT_DATA.filter((a) => a.severity === "low").length;

  return (
    <div className="space-y-6">
      {/* Alert summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-red-50">
              <ShieldAlert className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">High Priority</p>
              <p className="text-xl font-bold text-red-600">{highCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-amber-50">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Medium Priority</p>
              <p className="text-xl font-bold text-amber-600">{medCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-blue-50">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Low Priority</p>
              <p className="text-xl font-bold text-blue-600">{lowCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={triggerFilter} onValueChange={setTriggerFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trigger Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Triggers</SelectItem>
            <SelectItem value="serp-drop">SERP Drop</SelectItem>
            <SelectItem value="content-stale">Content Stale</SelectItem>
            <SelectItem value="citation-lost">Citation Lost</SelectItem>
            <SelectItem value="new-competitor">New Competitor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alert cards */}
      <div className="space-y-3">
        {filtered.map((alert) => {
          const sevCfg = SEVERITY_CONFIG[alert.severity];
          const trigCfg = TRIGGER_CONFIG[alert.trigger];
          const TriggerIcon = trigCfg.icon;

          return (
            <Card key={alert.id} className="overflow-hidden">
              <div className="flex">
                <div className={`w-1.5 shrink-0 ${sevCfg.stripe}`} />
                <CardContent className="p-5 flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 mr-auto">{alert.title}</h3>
                    <Badge className={`border-transparent ${sevCfg.className}`}>{sevCfg.label}</Badge>
                    <Badge className="border-transparent bg-gray-100 text-gray-700 hover:bg-gray-100">
                      <TriggerIcon className="h-3 w-3 mr-1" />
                      {trigCfg.label}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed">{alert.description}</p>

                  {/* Position change metrics */}
                  {alert.positionBefore !== undefined && alert.positionAfter !== undefined && (
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500 font-medium">Position:</span>
                      <span className="font-mono text-gray-700">#{alert.positionBefore}</span>
                      <ArrowDown className="h-4 w-4 text-red-400" />
                      <span className="font-mono text-red-600 font-semibold">#{alert.positionAfter}</span>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <span className="text-xs text-gray-400">Detected {timeAgo(alert.detectedAt)}</span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">Acknowledge</Button>
                      <Button size="sm" className="bg-primary-600 text-white hover:bg-primary-700">
                        <RefreshCw className="h-3.5 w-3.5 mr-1" />
                        Re-optimise
                      </Button>
                      <Button variant="outline" size="sm" className="text-gray-500">Dismiss</Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

export default function MonitoringPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitoring"
        description="Track your Google rankings and LLM citations"
      />

      <KpiCards />

      <Tabs defaultValue="rankings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="citations">LLM Citations</TabsTrigger>
          <TabsTrigger value="ai-overviews">AI Overviews</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="rankings">
          <RankingsTab />
        </TabsContent>

        <TabsContent value="citations">
          <CitationsTab />
        </TabsContent>

        <TabsContent value="ai-overviews">
          <AiOverviewsTab />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
