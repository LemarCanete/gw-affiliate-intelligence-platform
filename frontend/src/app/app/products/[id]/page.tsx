"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  FileText,
  Video,
  Image as ImageIcon,
  MessageSquare,
  Mail,
  Share2,
  Calendar,
  FlaskConical,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RunLlmTestModal } from "@/components/forms/RunLlmTestModal";
import { CreateBriefModal } from "@/components/forms/CreateBriefModal";
import { GenerateContentModal } from "@/components/forms/GenerateContentModal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ScoreBadge,
  StatusBadge,
  ScoreBar,
  ChartCard,
  EmptyState,
} from "@/components/dashboard";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { getProductById } from "@/lib/mock-data/products";
import type { ContentFormat, GapStatus, LlmTestResult } from "@/lib/types/domain";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ── Helpers ──────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return `$${value.toLocaleString()}`;
}

function formatContentFormat(format: ContentFormat): string {
  const labels: Record<ContentFormat, string> = {
    "seo-article": "SEO Article",
    "youtube-script": "YouTube Script",
    "pinterest-pin": "Pinterest Pin",
    "social-post": "Social Post",
    "reddit-draft": "Reddit Draft",
    email: "Email",
  };
  return labels[format] || format;
}

function getFormatIcon(format: ContentFormat) {
  switch (format) {
    case "seo-article":
      return <FileText className="h-4 w-4 text-muted-foreground" />;
    case "youtube-script":
      return <Video className="h-4 w-4 text-muted-foreground" />;
    case "pinterest-pin":
      return <ImageIcon className="h-4 w-4 text-muted-foreground" />;
    case "social-post":
      return <Share2 className="h-4 w-4 text-muted-foreground" />;
    case "reddit-draft":
      return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
    case "email":
      return <Mail className="h-4 w-4 text-muted-foreground" />;
  }
}

function generatePerformanceData() {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      views: Math.floor(Math.random() * 800 + 200),
    });
  }
  return data;
}

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

// ── Gap Status Badge ─────────────────────────────────────────────────

const gapStatusConfig: Record<GapStatus, { label: string; className: string }> = {
  "double-gap": { label: "Double Gap", className: "bg-green-100 text-green-800 border-green-200" },
  "google-only": { label: "Google Gap", className: "bg-blue-100 text-blue-800 border-blue-200" },
  "llm-only": { label: "LLM Gap", className: "bg-purple-100 text-purple-800 border-purple-200" },
  closing: { label: "Closing", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  saturated: { label: "Saturated", className: "bg-red-100 text-red-800 border-red-200" },
};

function GapStatusBadge({ status }: { status: GapStatus }) {
  const { label, className } = gapStatusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {label}
    </span>
  );
}

// ── LLM Response Helpers ─────────────────────────────────────────────

function getLlmGapColor(responseType: LlmTestResult["responseType"]): string {
  switch (responseType) {
    case "no-info": return "bg-green-500";
    case "vague": return "bg-emerald-500";
    case "generic": return "bg-yellow-500";
    case "detailed": return "bg-orange-500";
    case "cites-sources": return "bg-red-500";
  }
}

function getLlmGapLabel(responseType: LlmTestResult["responseType"]): string {
  switch (responseType) {
    case "no-info": return "No Info — Maximum Gap";
    case "vague": return "Vague — Strong Gap";
    case "generic": return "Generic — Partial Gap";
    case "detailed": return "Detailed — Gap Closing";
    case "cites-sources": return "Cites Sources — Gap Closed";
  }
}

const intentColors: Record<string, string> = {
  informational: "bg-blue-100 text-blue-800",
  comparison: "bg-amber-100 text-amber-800",
  review: "bg-green-100 text-green-800",
  "how-to": "bg-purple-100 text-purple-800",
};

// ── Page component ───────────────────────────────────────────────────

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const fetcher = useCallback(() => getProductById(id), [id]);
  const { data: product, loading } = useAsyncData(fetcher);
  const [llmTestOpen, setLlmTestOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <Link
          href="/app/products"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
        <EmptyState
          title="Product not found"
          description="The product you are looking for does not exist or has been removed."
        />
      </div>
    );
  }

  const performanceData = generatePerformanceData();

  return (
    <div className="space-y-6">
      {/* ── Back link ─────────────────────────────────────────────── */}
      <Link
        href="/app/products"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <ScoreBadge score={product.score.total} />
            <StatusBadge status={product.status} />
            <GapStatusBadge status={product.gapStatus} />
            <Badge variant="outline" className={intentColors[product.intent]}>
              {product.intent}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500 max-w-2xl">
            {product.description}
          </p>
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="h-3 w-3" />
            Launched {new Date(product.launchedAt).toLocaleDateString()} ({daysSince(product.launchedAt)}d ago)
          </div>
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" onClick={() => setLlmTestOpen(true)}>
              <FlaskConical className="h-4 w-4 mr-1" />
              Run LLM Test
            </Button>
            <Button variant="outline" size="sm" onClick={() => setBriefOpen(true)}>
              <FileText className="h-4 w-4 mr-1" />
              Create Brief
            </Button>
            <Button size="sm" className="bg-primary-600 text-white hover:bg-primary-700" onClick={() => setGenerateOpen(true)}>
              <Sparkles className="h-4 w-4 mr-1" />
              Generate Content
            </Button>
          </div>
        </div>
      </div>

      {/* ── Score Breakdown + Affiliate Program ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Gap Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreBar score={product.score} />
            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Total Score</span>
              <span className="text-lg font-bold text-gray-900">
                {product.score.total}/25
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Affiliate Program</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Network</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {product.affiliateProgram.network}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Commission</dt>
                <dd className="text-sm font-medium text-primary-600">
                  {product.affiliateProgram.commission}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Cookie Duration</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {product.affiliateProgram.cookieDuration}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Payment Terms</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {product.affiliateProgram.paymentTerms}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Primary Intent</dt>
                <dd className="text-sm font-medium text-gray-900 capitalize">
                  {product.intent}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────────── */}
      <Tabs defaultValue="llm-tests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="llm-tests">LLM Gap Tests</TabsTrigger>
          <TabsTrigger value="content">Content Assets</TabsTrigger>
          <TabsTrigger value="briefs">Content Briefs</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* ── LLM Gap Tests tab ───────────────────────────────────── */}
        <TabsContent value="llm-tests">
          {(!product.llmTestResults || product.llmTestResults.length === 0) ? (
            <EmptyState
              title="No LLM tests yet"
              description="Run gap tests against ChatGPT, Perplexity, Gemini, and Copilot to identify opportunities."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.llmTestResults.map((result, idx) => (
                <Card key={idx}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold capitalize">
                        {result.engine}
                      </CardTitle>
                      <span className="text-xs text-gray-400">
                        {new Date(result.testedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600 italic">&ldquo;{result.query}&rdquo;</p>
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${getLlmGapColor(result.responseType)}`} />
                      <span className="text-sm font-medium text-gray-900">
                        {getLlmGapLabel(result.responseType)}
                      </span>
                    </div>
                    {result.citedSources.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Cited sources:</p>
                        <ul className="text-xs text-gray-600 space-y-0.5">
                          {result.citedSources.map((src, i) => (
                            <li key={i} className="truncate">- {src}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Content Assets tab ────────────────────────────────── */}
        <TabsContent value="content">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Format</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.contentAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      No content assets yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  product.contentAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getFormatIcon(asset.format)}
                          <span className="text-sm">
                            {formatContentFormat(asset.format)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium max-w-xs truncate">
                        {asset.title}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={asset.status} />
                      </TableCell>
                      <TableCell className="text-sm capitalize text-muted-foreground">
                        {asset.platform}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {asset.views.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {asset.clicks.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {formatCurrency(asset.revenue)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ── Content Briefs tab ──────────────────────────────────── */}
        <TabsContent value="briefs">
          {(!product.contentBriefs || product.contentBriefs.length === 0) ? (
            <EmptyState
              title="No content briefs yet"
              description="Create a content brief to start the production pipeline for this product."
            />
          ) : (
            <div className="space-y-4">
              {product.contentBriefs.map((brief) => (
                <Card key={brief.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-medium text-gray-900">{brief.targetQuery}</p>
                          <Badge variant="outline" className={intentColors[brief.intent]}>
                            {brief.intent}
                          </Badge>
                          <Badge variant="outline" className={
                            brief.status === "published" ? "bg-green-50 text-green-700" :
                            brief.status === "in-production" ? "bg-blue-50 text-blue-700" :
                            brief.status === "approved" ? "bg-yellow-50 text-yellow-700" :
                            "bg-gray-50 text-gray-700"
                          }>
                            {brief.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{brief.llmCurrentAnswer}</p>
                        <div className="flex gap-4 text-xs text-gray-400">
                          <span>{brief.wordCount.toLocaleString()} words</span>
                          <span>{brief.structureOutline.length} sections</span>
                          <span>{new Date(brief.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Performance tab ───────────────────────────────────── */}
        <TabsContent value="performance">
          <ChartCard title="Views (Last 30 Days)" description="Daily page views across all content assets.">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="var(--color-primary-500)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>
      </Tabs>

      <RunLlmTestModal open={llmTestOpen} onOpenChange={setLlmTestOpen} productName={product.name} />
      <CreateBriefModal open={briefOpen} onOpenChange={setBriefOpen} productName={product.name} />
      <GenerateContentModal open={generateOpen} onOpenChange={setGenerateOpen} productName={product.name} />
    </div>
  );
}
