"use client";

import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ScoreBadge } from "@/components/dashboard/ScoreBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Search,
  Globe,
  Download,
  Filter,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Video,
  Zap,
  PenTool,
  ChevronLeft,
  ChevronRight,
  X,
  HelpCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ─── Types ───────────────────────────────────────────────────────────

type Intent = "Informational" | "Commercial" | "Transactional" | "Navigational";
type Competition = "Low" | "Medium" | "High";
type Trend = "up" | "down" | "stable";
type SerpFeature = "featured_snippet" | "paa" | "video" | "ai_overview";

interface Keyword {
  id: number;
  keyword: string;
  volume: number;
  kd: number;
  cpc: number;
  intent: Intent;
  competition: Competition;
  serpFeatures: SerpFeature[];
  llmGapScore: number;
  trend: Trend;
}

type SortField = "keyword" | "volume" | "kd" | "cpc" | "llmGapScore";
type SortDir = "asc" | "desc";

// ─── Mock Data ───────────────────────────────────────────────────────

const MOCK_KEYWORDS_RAW: Omit<Keyword, "intent">[] = [
  { id: 1, keyword: "best AI writing tools 2026", volume: 12400, kd: 45, cpc: 4.2, competition: "Medium", serpFeatures: ["featured_snippet", "paa"], llmGapScore: 4, trend: "up" },
  { id: 2, keyword: "is jasper AI worth it", volume: 3600, kd: 22, cpc: 3.8, competition: "Low", serpFeatures: ["paa", "video"], llmGapScore: 5, trend: "up" },
  { id: 3, keyword: "AI content detector", volume: 28000, kd: 67, cpc: 2.5, competition: "High", serpFeatures: ["featured_snippet", "ai_overview"], llmGapScore: 2, trend: "stable" },
  { id: 4, keyword: "grammarly vs quillbot", volume: 8200, kd: 38, cpc: 3.1, competition: "Medium", serpFeatures: ["featured_snippet", "paa", "video"], llmGapScore: 3, trend: "stable" },
  { id: 5, keyword: "how to use ChatGPT for essays", volume: 14800, kd: 31, cpc: 1.2, competition: "Medium", serpFeatures: ["video", "paa"], llmGapScore: 4, trend: "up" },
  { id: 6, keyword: "copy.ai review", volume: 2900, kd: 19, cpc: 4.5, competition: "Low", serpFeatures: ["paa"], llmGapScore: 5, trend: "down" },
  { id: 7, keyword: "AI paraphrasing tool free", volume: 22100, kd: 54, cpc: 1.8, competition: "High", serpFeatures: ["featured_snippet", "ai_overview"], llmGapScore: 2, trend: "stable" },
  { id: 8, keyword: "writesonic pricing", volume: 1800, kd: 15, cpc: 5.2, competition: "Low", serpFeatures: [], llmGapScore: 4, trend: "down" },
  { id: 9, keyword: "best AI tools for students", volume: 9400, kd: 35, cpc: 2.9, competition: "Medium", serpFeatures: ["featured_snippet", "paa", "ai_overview"], llmGapScore: 5, trend: "up" },
  { id: 10, keyword: "surfer SEO alternative", volume: 4100, kd: 28, cpc: 6.3, competition: "Low", serpFeatures: ["paa"], llmGapScore: 4, trend: "up" },
  { id: 11, keyword: "AI content writing for SEO", volume: 6700, kd: 42, cpc: 3.4, competition: "Medium", serpFeatures: ["video", "ai_overview"], llmGapScore: 3, trend: "up" },
  { id: 12, keyword: "claude AI vs ChatGPT", volume: 18600, kd: 52, cpc: 2.1, competition: "High", serpFeatures: ["featured_snippet", "paa", "video", "ai_overview"], llmGapScore: 3, trend: "up" },
  { id: 13, keyword: "frase.io review 2026", volume: 1400, kd: 12, cpc: 4.8, competition: "Low", serpFeatures: ["paa"], llmGapScore: 5, trend: "stable" },
  { id: 14, keyword: "how to detect AI generated text", volume: 33500, kd: 71, cpc: 1.9, competition: "High", serpFeatures: ["featured_snippet", "paa", "ai_overview"], llmGapScore: 2, trend: "stable" },
  { id: 15, keyword: "neuronwriter review", volume: 1100, kd: 8, cpc: 5.7, competition: "Low", serpFeatures: [], llmGapScore: 5, trend: "up" },
  { id: 16, keyword: "AI blog post generator", volume: 7800, kd: 47, cpc: 3.6, competition: "Medium", serpFeatures: ["featured_snippet", "video"], llmGapScore: 3, trend: "stable" },
  { id: 17, keyword: "perplexity AI for research", volume: 5200, kd: 26, cpc: 1.5, competition: "Low", serpFeatures: ["video", "ai_overview"], llmGapScore: 4, trend: "up" },
  { id: 18, keyword: "jasper AI pricing 2026", volume: 4600, kd: 20, cpc: 7.1, competition: "Low", serpFeatures: ["paa"], llmGapScore: 4, trend: "down" },
  { id: 19, keyword: "AI SEO tools comparison", volume: 3200, kd: 33, cpc: 5.4, competition: "Medium", serpFeatures: ["featured_snippet", "paa"], llmGapScore: 4, trend: "up" },
  { id: 20, keyword: "content at scale review", volume: 2100, kd: 17, cpc: 4.3, competition: "Low", serpFeatures: ["paa", "video"], llmGapScore: 5, trend: "stable" },
  { id: 21, keyword: "AI writing assistant for students", volume: 6100, kd: 29, cpc: 2.7, competition: "Medium", serpFeatures: ["ai_overview", "paa"], llmGapScore: 4, trend: "up" },
  { id: 22, keyword: "how to humanize AI text", volume: 41000, kd: 78, cpc: 2.3, competition: "High", serpFeatures: ["featured_snippet", "video", "ai_overview"], llmGapScore: 1, trend: "up" },
  { id: 23, keyword: "scalenut vs surfer SEO", volume: 1600, kd: 14, cpc: 5.9, competition: "Low", serpFeatures: ["paa"], llmGapScore: 5, trend: "stable" },
  { id: 24, keyword: "AI article rewriter", volume: 11200, kd: 56, cpc: 2.0, competition: "High", serpFeatures: ["featured_snippet"], llmGapScore: 2, trend: "down" },
  { id: 25, keyword: "best AI tools for content marketing", volume: 3800, kd: 36, cpc: 4.1, competition: "Medium", serpFeatures: ["paa", "video", "ai_overview"], llmGapScore: 4, trend: "up" },
  { id: 26, keyword: "koala AI writer review", volume: 980, kd: 7, cpc: 3.9, competition: "Low", serpFeatures: [], llmGapScore: 5, trend: "up" },
  { id: 27, keyword: "AI email writer free", volume: 8900, kd: 44, cpc: 2.6, competition: "Medium", serpFeatures: ["featured_snippet", "paa"], llmGapScore: 3, trend: "stable" },
  { id: 28, keyword: "what is GEO optimization", volume: 2400, kd: 11, cpc: 1.3, competition: "Low", serpFeatures: ["ai_overview"], llmGapScore: 5, trend: "up" },
  { id: 29, keyword: "ChatGPT SEO prompts", volume: 7200, kd: 39, cpc: 1.8, competition: "Medium", serpFeatures: ["paa", "video"], llmGapScore: 3, trend: "stable" },
  { id: 30, keyword: "AI writing tool with citations", volume: 3100, kd: 24, cpc: 3.5, competition: "Low", serpFeatures: ["ai_overview", "paa"], llmGapScore: 4, trend: "up" },
];

// Derive intent from the classifyIntent function for consistency
const MOCK_KEYWORDS: Keyword[] = MOCK_KEYWORDS_RAW.map((kw) => ({
  ...kw,
  intent: classifyIntent(kw.keyword),
}));

// ─── Intent Classification ───────────────────────────────────────────

function classifyIntent(keyword: string): Intent {
  const kw = keyword.toLowerCase();
  if (/\b(buy|price|pricing|discount|coupon|deal|cheap|order|purchase)\b/.test(kw)) return "Transactional";
  if (/\b(best|top|review|vs|versus|compare|comparison|alternative)\b/.test(kw)) return "Commercial";
  if (/\b(how|what|where|why|when|who|guide|tutorial|learn|example)\b/.test(kw)) return "Informational";
  if (/\b(login|sign in|dashboard|account|download|app)\b/.test(kw)) return "Navigational";
  return "Informational";
}

// ─── Helpers ─────────────────────────────────────────────────────────

function kdColor(kd: number) {
  if (kd <= 30) return "bg-green-100 text-green-800";
  if (kd <= 60) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
}

function intentColor(intent: Intent) {
  const map: Record<Intent, string> = {
    Informational: "bg-blue-100 text-blue-800",
    Commercial: "bg-purple-100 text-purple-800",
    Transactional: "bg-orange-100 text-orange-800",
    Navigational: "bg-gray-100 text-gray-800",
  };
  return map[intent];
}

function competitionColor(c: Competition) {
  const map: Record<Competition, string> = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-red-100 text-red-800",
  };
  return map[c];
}

const SERP_ICONS: Record<SerpFeature, { icon: React.ElementType; label: string }> = {
  featured_snippet: { icon: Sparkles, label: "Featured Snippet" },
  paa: { icon: MessageSquare, label: "People Also Ask" },
  video: { icon: Video, label: "Video" },
  ai_overview: { icon: Zap, label: "AI Overview" },
};

function TrendIcon({ trend }: { trend: Trend }) {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-600" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-gray-400" />;
}

const PAGE_SIZE = 10;

// ─── Component ───────────────────────────────────────────────────────

export default function KeywordsPage() {
  // Input state
  const [seedKeyword, setSeedKeyword] = useState("");
  const [domainInput, setDomainInput] = useState("");
  const [country, setCountry] = useState("US");
  const [city, setCity] = useState("");
  const [language, setLanguage] = useState("en");
  const [hasSearched, setHasSearched] = useState(false);

  // Table state
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [sortField, setSortField] = useState<SortField>("volume");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filterIntent, setFilterIntent] = useState<Intent | "all">("all");
  const [filterCompetition, setFilterCompetition] = useState<Competition | "all">("all");
  const [filterKdMin, setFilterKdMin] = useState(0);
  const [filterKdMax, setFilterKdMax] = useState(100);
  const [filterVolMin, setFilterVolMin] = useState(0);
  const [filterVolMax, setFilterVolMax] = useState(100000);

  // Derived data
  const filtered = useMemo(() => {
    let data = [...MOCK_KEYWORDS];
    if (filterIntent !== "all") data = data.filter((k) => k.intent === filterIntent);
    if (filterCompetition !== "all") data = data.filter((k) => k.competition === filterCompetition);
    data = data.filter((k) => k.kd >= filterKdMin && k.kd <= filterKdMax);
    data = data.filter((k) => k.volume >= filterVolMin && k.volume <= filterVolMax);
    data.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return data;
  }, [filterIntent, filterCompetition, filterKdMin, filterKdMax, filterVolMin, filterVolMax, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const allPageSelected = pageData.length > 0 && pageData.every((k) => selected.has(k.id));

  // Handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(0);
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        pageData.forEach((k) => next.delete(k.id));
      } else {
        pageData.forEach((k) => next.add(k.id));
      }
      return next;
    });
  };

  const handleResearch = () => {
    setHasSearched(true);
    setPage(0);
    setSelected(new Set());
  };

  const handleExport = () => {
    const headers = ["Keyword", "Volume", "KD", "CPC", "Intent", "Competition", "LLM Gap Score", "Trend"];
    const rows = filtered.map((k) => [k.keyword, k.volume, k.kd, `$${k.cpc.toFixed(2)}`, k.intent, k.competition, `${k.llmGapScore}/5`, k.trend]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "keywords.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setFilterIntent("all");
    setFilterCompetition("all");
    setFilterKdMin(0);
    setFilterKdMax(100);
    setFilterVolMin(0);
    setFilterVolMax(100000);
    setPage(0);
  };

  const hasActiveFilters = filterIntent !== "all" || filterCompetition !== "all" || filterKdMin > 0 || filterKdMax < 100 || filterVolMin > 0 || filterVolMax < 100000;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Keyword Research"
        description="Discover high-opportunity keywords and content gaps for your SEO/GEO strategy"
      />

      {/* Input section */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="seed">
            <TabsList>
              <TabsTrigger value="seed" className="gap-2">
                <Search className="h-4 w-4" />
                Seed Keyword
              </TabsTrigger>
              <TabsTrigger value="domain" className="gap-2">
                <Globe className="h-4 w-4" />
                Domain Input
              </TabsTrigger>
            </TabsList>

            <TabsContent value="seed">
              <div className="flex flex-col md:flex-row gap-3 mt-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter a seed keyword (e.g. AI writing tools)"
                    value={seedKeyword}
                    onChange={(e) => setSeedKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && seedKeyword.trim() && handleResearch()}
                  />
                </div>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="City (optional)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-[160px]"
                />
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleResearch} disabled={!seedKeyword.trim()}>
                  <Search className="h-4 w-4" />
                  Research
                </Button>
              </div>
              {hasSearched && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-xs text-gray-500 self-center">Related:</span>
                  {["AI copywriting software", "AI text generator", "automated content creation", "NLP writing tools", "GPT writing assistant"].map((term) => (
                    <Badge key={term} variant="secondary" className="cursor-pointer hover:bg-gray-200 text-xs">
                      {term}
                    </Badge>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="domain">
              <div className="flex flex-col md:flex-row gap-3 mt-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter a domain (e.g. myblog.com)"
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && domainInput.trim() && handleResearch()}
                  />
                </div>
                <Button onClick={handleResearch} disabled={!domainInput.trim()}>
                  <Search className="h-4 w-4" />
                  Analyze
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Finds ranking gaps, topical authority gaps, and quick-win keywords (ranking #11-20) for your domain.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Results section */}
      {hasSearched && (
        <>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{filtered.length}</span> keywords found
              </p>
              {selected.size > 0 && (
                <Badge variant="secondary">{selected.size} selected</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {selected.size > 0 && (
                <Button size="sm" className="gap-1">
                  <PenTool className="h-3.5 w-3.5" />
                  Generate Content for Selected
                </Button>
              )}
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-1"
              >
                <Filter className="h-3.5 w-3.5" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 bg-white text-primary rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">!</span>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} className="gap-1">
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs gap-1 h-7">
                      <X className="h-3 w-3" />
                      Reset
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Intent</label>
                    <Select value={filterIntent} onValueChange={(v) => { setFilterIntent(v as Intent | "all"); setPage(0); }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Intents</SelectItem>
                        <SelectItem value="Informational">Informational</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Transactional">Transactional</SelectItem>
                        <SelectItem value="Navigational">Navigational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Competition</label>
                    <Select value={filterCompetition} onValueChange={(v) => { setFilterCompetition(v as Competition | "all"); setPage(0); }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">KD Range ({filterKdMin} - {filterKdMax})</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={filterKdMin}
                        onChange={(e) => { setFilterKdMin(Number(e.target.value)); setPage(0); }}
                        className="h-9"
                      />
                      <span className="text-gray-400">-</span>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={filterKdMax}
                        onChange={(e) => { setFilterKdMax(Number(e.target.value)); setPage(0); }}
                        className="h-9"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Volume Range</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        value={filterVolMin}
                        onChange={(e) => { setFilterVolMin(Number(e.target.value)); setPage(0); }}
                        className="h-9"
                        placeholder="Min"
                      />
                      <span className="text-gray-400">-</span>
                      <Input
                        type="number"
                        min={0}
                        value={filterVolMax}
                        onChange={(e) => { setFilterVolMax(Number(e.target.value)); setPage(0); }}
                        className="h-9"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Keywords Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <input
                        type="checkbox"
                        checked={allPageSelected}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300"
                        aria-label="Select all keywords on page"
                      />
                    </TableHead>
                    <TableHead>
                      <button onClick={() => handleSort("keyword")} className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                        Keyword <ArrowUpDown className="h-3.5 w-3.5" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button onClick={() => handleSort("volume")} className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                        Volume <ArrowUpDown className="h-3.5 w-3.5" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button onClick={() => handleSort("kd")} className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                        KD <ArrowUpDown className="h-3.5 w-3.5" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button onClick={() => handleSort("cpc")} className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                        CPC <ArrowUpDown className="h-3.5 w-3.5" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-1 cursor-help">
                              Intent <HelpCircle className="h-3 w-3 text-gray-400" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
                            <p className="font-semibold mb-1">Intent Classification (regex-based):</p>
                            <ul className="space-y-0.5">
                              <li><span className="font-medium text-orange-700">Transactional:</span> buy, price, pricing, discount, coupon, deal, cheap, order, purchase</li>
                              <li><span className="font-medium text-purple-700">Commercial:</span> best, top, review, vs, compare, comparison, alternative</li>
                              <li><span className="font-medium text-blue-700">Informational:</span> how, what, where, why, when, who, guide, tutorial, learn</li>
                              <li><span className="font-medium text-gray-700">Navigational:</span> login, sign in, dashboard, account, download, app</li>
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableHead>
                    <TableHead>Competition</TableHead>
                    <TableHead>SERP</TableHead>
                    <TableHead>
                      <button onClick={() => handleSort("llmGapScore")} className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                        LLM Gap <ArrowUpDown className="h-3.5 w-3.5" />
                      </button>
                    </TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageData.map((kw) => (
                    <TableRow key={kw.id} data-state={selected.has(kw.id) ? "selected" : undefined}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selected.has(kw.id)}
                          onChange={() => toggleSelect(kw.id)}
                          className="rounded border-gray-300"
                          aria-label={`Select ${kw.keyword}`}
                        />
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-gray-900 cursor-pointer hover:text-primary-600 transition-colors">
                          {kw.keyword}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {kw.volume.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={`border-transparent text-xs ${kdColor(kw.kd)}`}>
                          {kw.kd}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        ${kw.cpc.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={`border-transparent text-xs ${intentColor(kw.intent)}`}>
                          {kw.intent}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`border-transparent text-xs ${competitionColor(kw.competition)}`}>
                          {kw.competition}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {kw.serpFeatures.map((f) => {
                            const { icon: Icon, label } = SERP_ICONS[f];
                            return (
                              <span key={f} title={label}>
                                <Icon className="h-3.5 w-3.5 text-gray-500" />
                              </span>
                            );
                          })}
                          {kw.serpFeatures.length === 0 && (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <ScoreBadge score={kw.llmGapScore} />
                      </TableCell>
                      <TableCell>
                        <TrendIcon trend={kw.trend} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1" title="Check Gap">
                            <ExternalLink className="h-3 w-3" />
                            Gap
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1" title="Write Content">
                            <PenTool className="h-3 w-3" />
                            Write
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-sm text-gray-500">
                  Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                    className="h-8 w-8 p-0"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i}
                      variant={page === i ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(i)}
                      className="h-8 w-8 p-0 text-xs"
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                    className="h-8 w-8 p-0"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
