"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
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
  Search,
  Globe,
  Shield,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpDown,
  PenTool,
  Link2,
  BarChart3,
  Eye,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────

interface RankingKeyword {
  id: number;
  keyword: string;
  position: number;
  volume: number;
  traffic: number;
  url: string;
  change: number;
  impressions: number;
  clicks: number;
  ctr: number;
}

interface ContentGap {
  id: number;
  keyword: string;
  competitor: string;
  theirPosition: number;
  volume: number;
  gapScore: number;
}

interface TopicCluster {
  topic: string;
  covered: number;
  total: number;
  subtopics: string[];
}

type SortField = keyof Pick<RankingKeyword, "keyword" | "position" | "volume" | "traffic" | "change" | "impressions" | "clicks" | "ctr">;
type SortDir = "asc" | "desc";

// ─── Mock Data ───────────────────────────────────────────────────────

const MOCK_RANKINGS: RankingKeyword[] = [
  { id: 1, keyword: "best AI writing tools", position: 3, volume: 12400, traffic: 2480, url: "/blog/best-ai-writing-tools", change: 2, impressions: 18200, clicks: 2480, ctr: 13.6 },
  { id: 2, keyword: "AI content generator review", position: 7, volume: 6800, traffic: 612, url: "/blog/ai-content-generators", change: -1, impressions: 9400, clicks: 612, ctr: 6.5 },
  { id: 3, keyword: "jasper AI review 2026", position: 2, volume: 4200, traffic: 1260, url: "/reviews/jasper-ai", change: 1, impressions: 5800, clicks: 1260, ctr: 21.7 },
  { id: 4, keyword: "how to use AI for SEO", position: 5, volume: 8900, traffic: 890, url: "/blog/ai-for-seo-guide", change: 0, impressions: 12100, clicks: 890, ctr: 7.4 },
  { id: 5, keyword: "surfer SEO review", position: 11, volume: 5400, traffic: 216, url: "/reviews/surfer-seo", change: -3, impressions: 7200, clicks: 216, ctr: 3.0 },
  { id: 6, keyword: "AI writing assistant comparison", position: 4, volume: 3600, traffic: 540, url: "/blog/ai-writing-comparison", change: 3, impressions: 4900, clicks: 540, ctr: 11.0 },
  { id: 7, keyword: "neuronwriter alternative", position: 8, volume: 1800, traffic: 126, url: "/blog/neuronwriter-alternatives", change: 5, impressions: 2400, clicks: 126, ctr: 5.3 },
  { id: 8, keyword: "content at scale pricing", position: 14, volume: 2100, traffic: 63, url: "/reviews/content-at-scale", change: -2, impressions: 3100, clicks: 63, ctr: 2.0 },
  { id: 9, keyword: "AI SEO tools 2026", position: 6, volume: 7200, traffic: 648, url: "/blog/ai-seo-tools", change: 1, impressions: 9800, clicks: 648, ctr: 6.6 },
  { id: 10, keyword: "copy.ai vs jasper", position: 1, volume: 3200, traffic: 1280, url: "/comparisons/copyai-vs-jasper", change: 0, impressions: 4100, clicks: 1280, ctr: 31.2 },
  { id: 11, keyword: "grammarly business review", position: 9, volume: 4600, traffic: 276, url: "/reviews/grammarly-business", change: -1, impressions: 6300, clicks: 276, ctr: 4.4 },
  { id: 12, keyword: "AI blog writer free", position: 16, volume: 9800, traffic: 196, url: "/blog/free-ai-blog-writers", change: 4, impressions: 8200, clicks: 196, ctr: 2.4 },
  { id: 13, keyword: "frase vs surfer SEO", position: 3, volume: 2400, traffic: 480, url: "/comparisons/frase-vs-surfer", change: 2, impressions: 3200, clicks: 480, ctr: 15.0 },
  { id: 14, keyword: "scalenut review", position: 12, volume: 1600, traffic: 48, url: "/reviews/scalenut", change: -4, impressions: 2100, clicks: 48, ctr: 2.3 },
  { id: 15, keyword: "ChatGPT for content marketing", position: 10, volume: 5100, traffic: 255, url: "/blog/chatgpt-content-marketing", change: 0, impressions: 6900, clicks: 255, ctr: 3.7 },
  { id: 16, keyword: "AI article writer", position: 18, volume: 11200, traffic: 112, url: "/blog/ai-article-writers", change: 3, impressions: 7800, clicks: 112, ctr: 1.4 },
  { id: 17, keyword: "koala AI review", position: 5, volume: 980, traffic: 98, url: "/reviews/koala-ai", change: 1, impressions: 1300, clicks: 98, ctr: 7.5 },
  { id: 18, keyword: "what is GEO optimization", position: 2, volume: 2400, traffic: 720, url: "/blog/geo-optimization-guide", change: 0, impressions: 3100, clicks: 720, ctr: 23.2 },
  { id: 19, keyword: "AI writing tool with citations", position: 13, volume: 3100, traffic: 93, url: "/blog/ai-tools-citations", change: -2, impressions: 4200, clicks: 93, ctr: 2.2 },
  { id: 20, keyword: "NeuronWriter vs Frase", position: 6, volume: 1400, traffic: 126, url: "/comparisons/neuronwriter-vs-frase", change: 2, impressions: 1900, clicks: 126, ctr: 6.6 },
];

const MOCK_GAPS: ContentGap[] = [
  { id: 1, keyword: "AI writing for ecommerce", competitor: "writesonic.com", theirPosition: 4, volume: 3400, gapScore: 4 },
  { id: 2, keyword: "claude AI for content creation", competitor: "zapier.com", theirPosition: 3, volume: 5800, gapScore: 5 },
  { id: 3, keyword: "AI product description generator", competitor: "copy.ai", theirPosition: 2, volume: 7200, gapScore: 3 },
  { id: 4, keyword: "best AI tools for teachers", competitor: "edutopia.org", theirPosition: 5, volume: 4100, gapScore: 4 },
  { id: 5, keyword: "AI resume writer review", competitor: "resumegenius.com", theirPosition: 1, volume: 9200, gapScore: 2 },
  { id: 6, keyword: "perplexity AI vs ChatGPT for research", competitor: "zdnet.com", theirPosition: 3, volume: 6700, gapScore: 5 },
  { id: 7, keyword: "AI email copywriting", competitor: "mailchimp.com", theirPosition: 6, volume: 2800, gapScore: 3 },
  { id: 8, keyword: "LLM content optimization", competitor: "searchenginejournal.com", theirPosition: 4, volume: 1900, gapScore: 5 },
  { id: 9, keyword: "AI tools for small business", competitor: "hubspot.com", theirPosition: 2, volume: 8400, gapScore: 3 },
  { id: 10, keyword: "automated blog writing tools", competitor: "ahrefs.com", theirPosition: 5, volume: 3600, gapScore: 4 },
];

const MOCK_TOPICS: TopicCluster[] = [
  { topic: "AI Writing Tools", covered: 8, total: 12, subtopics: ["Reviews", "Comparisons", "Pricing", "Use Cases", "Tutorials", "Free Options", "Enterprise", "API Integration", "Templates", "Prompts", "Limitations", "Future Trends"] },
  { topic: "SEO Automation", covered: 5, total: 10, subtopics: ["AI SEO Tools", "Content Optimization", "Keyword Research", "Link Building", "Technical SEO", "Rank Tracking", "SERP Analysis", "Schema Markup", "Site Audits", "Reporting"] },
  { topic: "Content Marketing", covered: 4, total: 12, subtopics: ["Strategy", "Distribution", "Email Marketing", "Social Media", "Blog Writing", "Video Content", "Podcast Content", "Lead Magnets", "Content Calendar", "Analytics", "ROI Tracking", "Repurposing"] },
  { topic: "GEO Optimization", covered: 3, total: 8, subtopics: ["What is GEO", "LLM Citations", "AI Overview Optimization", "Perplexity Ranking", "ChatGPT Visibility", "Gemini Presence", "Copilot Citations", "GEO Tracking"] },
  { topic: "AI for Education", covered: 2, total: 8, subtopics: ["Student Tools", "Teacher Tools", "Grading AI", "Tutoring AI", "Plagiarism Detection", "Classroom Integration", "Accessibility", "Learning Analytics"] },
  { topic: "Copywriting", covered: 6, total: 10, subtopics: ["Email Copy", "Ad Copy", "Landing Pages", "Product Descriptions", "Headlines", "CTAs", "Brand Voice", "A/B Testing", "Conversion Optimization", "Templates"] },
];

// ─── Helpers ─────────────────────────────────────────────────────────

function positionColor(pos: number) {
  if (pos <= 3) return "bg-green-100 text-green-800";
  if (pos <= 10) return "bg-blue-100 text-blue-800";
  if (pos <= 20) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
}

function ChangeIndicator({ value }: { value: number }) {
  if (value > 0) {
    return (
      <span className="flex items-center gap-0.5 text-green-600 text-sm font-medium">
        <TrendingUp className="h-3.5 w-3.5" />+{value}
      </span>
    );
  }
  if (value < 0) {
    return (
      <span className="flex items-center gap-0.5 text-red-500 text-sm font-medium">
        <TrendingDown className="h-3.5 w-3.5" />{value}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-0.5 text-gray-400 text-sm">
      <Minus className="h-3.5 w-3.5" />0
    </span>
  );
}

function topicCoverageColor(pct: number) {
  if (pct >= 70) return "bg-green-500";
  if (pct >= 40) return "bg-yellow-500";
  return "bg-red-500";
}

// ─── Component ───────────────────────────────────────────────────────

export default function DomainPage() {
  const [domain, setDomain] = useState("");
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // Ranking table sort
  const [sortField, setSortField] = useState<SortField>("position");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleAnalyze = () => {
    if (domain.trim()) setHasAnalyzed(true);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "keyword" ? "asc" : "desc");
    }
  };

  const sortedRankings = useMemo(() => {
    const data = [...MOCK_RANKINGS];
    data.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return data;
  }, [sortField, sortDir]);

  const quickWins = useMemo(() => {
    return MOCK_RANKINGS
      .filter((k) => k.position >= 4 && k.position <= 20)
      .sort((a, b) => {
        // Opportunity = high volume, close to top 3
        const scoreA = a.volume / a.position;
        const scoreB = b.volume / b.position;
        return scoreB - scoreA;
      });
  }, []);

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button onClick={() => handleSort(field)} className="flex items-center gap-1 hover:text-gray-900 transition-colors">
      {children} <ArrowUpDown className="h-3.5 w-3.5" />
    </button>
  );

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Domain Analysis"
        description="Analyze your domain's SEO performance, find content gaps, and discover quick wins"
      />

      {/* Input section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter a domain (e.g. myblog.com)"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              />
            </div>
            <Button onClick={handleAnalyze} disabled={!domain.trim()}>
              <Search className="h-4 w-4" />
              Analyze
            </Button>
            <Link href="/app/connect">
              <Button variant="outline" className="gap-2">
                <Link2 className="h-4 w-4" />
                Connect GSC
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {hasAnalyzed && (
        <>
          {/* Overview KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              title="Domain Authority"
              value={72}
              change={3}
              icon={Shield}
            />
            <KpiCard
              title="Total Keywords"
              value="1,847"
              change={12}
              icon={Search}
            />
            <KpiCard
              title="Organic Traffic"
              value="24,500"
              change={8}
              icon={Eye}
            />
            <KpiCard
              title="Top 3 Positions"
              value={23}
              change={5}
              icon={Target}
            />
          </div>

          {/* Tabs */}
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="rankings" className="w-full">
                <div className="px-4 pt-4">
                  <TabsList>
                    <TabsTrigger value="rankings" className="gap-1.5">
                      <BarChart3 className="h-4 w-4" />
                      Ranking Keywords
                    </TabsTrigger>
                    <TabsTrigger value="quickwins" className="gap-1.5">
                      <Target className="h-4 w-4" />
                      Quick Wins
                    </TabsTrigger>
                    <TabsTrigger value="gaps" className="gap-1.5">
                      <Globe className="h-4 w-4" />
                      Content Gaps
                    </TabsTrigger>
                    <TabsTrigger value="authority" className="gap-1.5">
                      <Shield className="h-4 w-4" />
                      Topical Authority
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Tab 1: Ranking Keywords */}
                <TabsContent value="rankings" className="mt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead><SortableHeader field="keyword">Keyword</SortableHeader></TableHead>
                        <TableHead><SortableHeader field="position">Position</SortableHeader></TableHead>
                        <TableHead><SortableHeader field="volume">Volume</SortableHeader></TableHead>
                        <TableHead><SortableHeader field="traffic">Traffic</SortableHeader></TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead><SortableHeader field="change">Change</SortableHeader></TableHead>
                        <TableHead><SortableHeader field="impressions">Impressions</SortableHeader></TableHead>
                        <TableHead><SortableHeader field="clicks">Clicks</SortableHeader></TableHead>
                        <TableHead><SortableHeader field="ctr">CTR</SortableHeader></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedRankings.map((kw) => (
                        <TableRow key={kw.id}>
                          <TableCell className="font-medium text-gray-900">{kw.keyword}</TableCell>
                          <TableCell>
                            <Badge className={`border-transparent text-xs ${positionColor(kw.position)}`}>
                              #{kw.position}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{kw.volume.toLocaleString()}</TableCell>
                          <TableCell className="font-mono text-sm">{kw.traffic.toLocaleString()}</TableCell>
                          <TableCell>
                            <span className="text-xs text-gray-500 truncate max-w-[180px] block" title={kw.url}>
                              {kw.url}
                            </span>
                          </TableCell>
                          <TableCell><ChangeIndicator value={kw.change} /></TableCell>
                          <TableCell className="font-mono text-sm">{kw.impressions.toLocaleString()}</TableCell>
                          <TableCell className="font-mono text-sm">{kw.clicks.toLocaleString()}</TableCell>
                          <TableCell className="font-mono text-sm">{kw.ctr}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* Tab 2: Quick Wins */}
                <TabsContent value="quickwins" className="mt-0">
                  <div className="px-4 py-3 border-b bg-yellow-50">
                    <p className="text-sm text-yellow-800">
                      <strong>{quickWins.length} keywords</strong> ranking between #4-20 with high traffic potential. Push these to top 3 for maximum impact.
                    </p>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Keyword</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Volume</TableHead>
                        <TableHead>Est. Traffic</TableHead>
                        <TableHead>Potential Traffic</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quickWins.map((kw) => {
                        const potentialTraffic = Math.round(kw.volume * 0.2);
                        const trafficGain = potentialTraffic - kw.traffic;
                        return (
                          <TableRow key={kw.id}>
                            <TableCell className="font-medium text-gray-900">{kw.keyword}</TableCell>
                            <TableCell>
                              <Badge className={`border-transparent text-xs ${positionColor(kw.position)}`}>
                                #{kw.position}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{kw.volume.toLocaleString()}</TableCell>
                            <TableCell className="font-mono text-sm">{kw.traffic.toLocaleString()}</TableCell>
                            <TableCell>
                              <span className="text-green-600 font-semibold text-sm">
                                +{trafficGain.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-xs text-gray-500 truncate max-w-[160px] block" title={kw.url}>
                                {kw.url}
                              </span>
                            </TableCell>
                            <TableCell><ChangeIndicator value={kw.change} /></TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                                <PenTool className="h-3 w-3" />
                                Write Content
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* Tab 3: Content Gaps */}
                <TabsContent value="gaps" className="mt-0">
                  <div className="px-4 py-3 border-b bg-blue-50">
                    <p className="text-sm text-blue-800">
                      <strong>{MOCK_GAPS.length} content gaps</strong> discovered. These are keywords competitors rank for that your domain does not cover.
                    </p>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Keyword</TableHead>
                        <TableHead>Competitor</TableHead>
                        <TableHead>Their Position</TableHead>
                        <TableHead>Volume</TableHead>
                        <TableHead>Gap Score</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_GAPS.map((gap) => (
                        <TableRow key={gap.id}>
                          <TableCell className="font-medium text-gray-900">{gap.keyword}</TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">{gap.competitor}</span>
                          </TableCell>
                          <TableCell>
                            <Badge className={`border-transparent text-xs ${positionColor(gap.theirPosition)}`}>
                              #{gap.theirPosition}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{gap.volume.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={`border-transparent text-xs ${gap.gapScore >= 4 ? "bg-green-100 text-green-800" : gap.gapScore === 3 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                              {gap.gapScore}/5
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                              <PenTool className="h-3 w-3" />
                              Write Content
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* Tab 4: Topical Authority */}
                <TabsContent value="authority" className="mt-0 p-4">
                  <div className="space-y-6">
                    {MOCK_TOPICS.map((topic) => {
                      const pct = Math.round((topic.covered / topic.total) * 100);
                      return (
                        <div key={topic.topic} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">{topic.topic}</h3>
                              <p className="text-sm text-gray-500">
                                {topic.covered}/{topic.total} subtopics covered
                              </p>
                            </div>
                            <span className={`text-lg font-bold ${pct >= 70 ? "text-green-600" : pct >= 40 ? "text-yellow-600" : "text-red-600"}`}>
                              {pct}%
                            </span>
                          </div>
                          <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100 mb-3">
                            <div
                              className={`h-full rounded-full transition-all ${topicCoverageColor(pct)}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {topic.subtopics.map((sub, i) => {
                              const isCovered = i < topic.covered;
                              return (
                                <Badge
                                  key={sub}
                                  variant={isCovered ? "default" : "outline"}
                                  className={`text-xs ${isCovered ? "bg-green-100 text-green-800 border-transparent hover:bg-green-100" : "text-gray-500 border-gray-300"}`}
                                >
                                  {sub}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
