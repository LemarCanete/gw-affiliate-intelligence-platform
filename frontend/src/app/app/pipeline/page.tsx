"use client";

import { useState } from "react";
import {
  Search,
  Bot,
  FileText,
  Sparkles,
  ClipboardCheck,
  Globe,
  Satellite,
  Activity,
  Eye,
  RotateCcw,
  CheckCircle2,
  Rocket,
  ExternalLink,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/dashboard";
import { cn } from "@/lib/utils";

// ── Pipeline Steps ──────────────────────────────────────────────────

const PIPELINE_STEPS = [
  { num: 1, label: "Keyword Research", icon: Search },
  { num: 2, label: "LLM Gap Check", icon: Bot },
  { num: 3, label: "Article Generated", icon: FileText },
  { num: 4, label: "NeuronWriter", icon: Sparkles },
  { num: 5, label: "Staging", icon: ClipboardCheck },
  { num: 6, label: "Published", icon: Globe },
  { num: 7, label: "Post-Publish", icon: Satellite },
  { num: 8, label: "Monitoring", icon: Activity },
] as const;

// ── Types ───────────────────────────────────────────────────────────

type StepStatus = "completed" | "current" | "failed" | "pending";

interface PipelineArticle {
  id: string;
  title: string;
  keyword: string;
  currentStep: number;
  stepStatus: StepStatus;
  statusDetail: string;
  neuronScore?: number;
  wordCount?: number;
  estimatedTime?: string;
  retryCount?: number;
  actions: ("view" | "approve" | "reject" | "retry" | "publish")[];
}

interface PublishedArticle {
  id: string;
  title: string;
  keyword: string;
  publishedDate: string;
  wpStatus: "Live" | "Draft" | "Scheduled";
  neuronScore: number;
  wordCount: number;
  gscIndexed: "Yes" | "No" | "Pending";
  internalLinks: number;
  nextCheck: string;
  wpUrl: string;
}

// ── Mock Data ───────────────────────────────────────────────────────

const PIPELINE_ARTICLES: PipelineArticle[] = [
  { id: "pa-1", title: "Best AI Writing Tools 2026", keyword: "best ai writing tools 2026", currentStep: 8, stepStatus: "current", statusDetail: "Monitoring active — day 7 check due tomorrow", neuronScore: 78, wordCount: 2840, actions: ["view"] },
  { id: "pa-2", title: "Jasper AI Review: Worth It?", keyword: "jasper ai review", currentStep: 6, stepStatus: "current", statusDetail: "Publishing to WordPress (in progress)", neuronScore: 71, wordCount: 3120, estimatedTime: "~2 min", actions: ["view"] },
  { id: "pa-3", title: "AI Content Detection Guide", keyword: "ai content detection tools", currentStep: 5, stepStatus: "current", statusDetail: "Staged, awaiting human approval", neuronScore: 69, wordCount: 2560, actions: ["view", "approve", "reject"] },
  { id: "pa-4", title: "Surfer SEO vs Clearscope", keyword: "surfer seo vs clearscope", currentStep: 4, stepStatus: "current", statusDetail: "NeuronWriter optimizing (score: 72/100)", neuronScore: 72, wordCount: 2980, estimatedTime: "~5 min", actions: ["view"] },
  { id: "pa-5", title: "How to Use ChatGPT for SEO", keyword: "chatgpt for seo strategy", currentStep: 4, stepStatus: "failed", statusDetail: "NeuronWriter failed — score 48/100 (min 65)", neuronScore: 48, wordCount: 2210, retryCount: 2, actions: ["view", "retry"] },
  { id: "pa-6", title: "Grammarly Business Review", keyword: "grammarly business plan review", currentStep: 3, stepStatus: "current", statusDetail: "Generating article with Claude...", estimatedTime: "~3 min", actions: ["view"] },
  { id: "pa-7", title: "WriteSonic Pricing 2026", keyword: "writesonic pricing plans", currentStep: 2, stepStatus: "current", statusDetail: "LLM gap check in progress", estimatedTime: "~1 min", actions: ["view"] },
  { id: "pa-8", title: "Copy.ai Free Plan Review", keyword: "copy.ai free plan features", currentStep: 1, stepStatus: "completed", statusDetail: "Keyword research complete, queued for gap check", actions: ["view"] },
];

const PUBLISHED_ARTICLES: PublishedArticle[] = [
  { id: "pub-1", title: "Best AI Writing Tools 2026", keyword: "best ai writing tools 2026", publishedDate: "2026-03-18", wpStatus: "Live", neuronScore: 78, wordCount: 2840, gscIndexed: "Yes", internalLinks: 6, nextCheck: "2026-03-25", wpUrl: "#" },
  { id: "pub-2", title: "Notion AI vs Coda AI", keyword: "notion ai vs coda ai", publishedDate: "2026-03-15", wpStatus: "Live", neuronScore: 82, wordCount: 3410, gscIndexed: "Yes", internalLinks: 8, nextCheck: "2026-03-22", wpUrl: "#" },
  { id: "pub-3", title: "Otter.ai Review for Students", keyword: "otter ai review students", publishedDate: "2026-03-14", wpStatus: "Live", neuronScore: 74, wordCount: 2650, gscIndexed: "Yes", internalLinks: 4, nextCheck: "2026-03-21", wpUrl: "#" },
  { id: "pub-4", title: "Top 10 AI Productivity Tools", keyword: "ai productivity tools list", publishedDate: "2026-03-12", wpStatus: "Live", neuronScore: 81, wordCount: 4120, gscIndexed: "Yes", internalLinks: 12, nextCheck: "2026-04-12", wpUrl: "#" },
  { id: "pub-5", title: "Quillbot vs Grammarly 2026", keyword: "quillbot vs grammarly", publishedDate: "2026-03-10", wpStatus: "Live", neuronScore: 76, wordCount: 2980, gscIndexed: "Yes", internalLinks: 5, nextCheck: "2026-04-10", wpUrl: "#" },
  { id: "pub-6", title: "Perplexity AI for Research", keyword: "perplexity ai research guide", publishedDate: "2026-03-08", wpStatus: "Live", neuronScore: 85, wordCount: 3200, gscIndexed: "Yes", internalLinks: 7, nextCheck: "2026-04-08", wpUrl: "#" },
  { id: "pub-7", title: "Claude AI vs ChatGPT", keyword: "claude ai vs chatgpt writing", publishedDate: "2026-03-20", wpStatus: "Scheduled", neuronScore: 79, wordCount: 3050, gscIndexed: "No", internalLinks: 5, nextCheck: "2026-03-27", wpUrl: "#" },
  { id: "pub-8", title: "AI Tools for Teachers 2026", keyword: "ai tools for teachers", publishedDate: "2026-03-06", wpStatus: "Live", neuronScore: 71, wordCount: 2480, gscIndexed: "Pending", internalLinks: 3, nextCheck: "2026-04-06", wpUrl: "#" },
];

// ── Step Indicator ──────────────────────────────────────────────────

function StepIndicator({ currentStep, stepStatus }: { currentStep: number; stepStatus: StepStatus }) {
  return (
    <div className="flex items-center gap-0">
      {PIPELINE_STEPS.map((step, idx) => {
        const isCompleted = step.num < currentStep;
        const isCurrent = step.num === currentStep;
        const isFailed = isCurrent && stepStatus === "failed";
        const isLast = idx === PIPELINE_STEPS.length - 1;

        return (
          <div key={step.num} className="flex items-center">
            <div className="relative group">
              <div
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  isCompleted && "bg-green-500",
                  isCurrent && !isFailed && "bg-primary-500 ring-4 ring-primary-500/20",
                  isFailed && "bg-red-500 ring-4 ring-red-500/20",
                  !isCompleted && !isCurrent && "bg-gray-200"
                )}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-[11px] text-white rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                {step.label}
              </div>
            </div>
            {!isLast && (
              <div className={cn("h-[1.5px] w-5", isCompleted ? "bg-green-400" : "bg-gray-200")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Pipeline Card ───────────────────────────────────────────────────

function PipelineCard({ article }: { article: PipelineArticle }) {
  const currentStepDef = PIPELINE_STEPS.find((s) => s.num === article.currentStep);
  const StepIcon = currentStepDef?.icon ?? Activity;

  const stepBadgeClass = article.stepStatus === "failed"
    ? "bg-red-50 text-red-700 border-red-200"
    : article.stepStatus === "completed"
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-primary-50 text-primary-700 border-primary-200";

  return (
    <Card className="border-gray-200/80 hover:border-gray-300 transition-all hover:shadow-sm">
      <CardContent className="p-5">
        <div className="flex flex-col gap-3.5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{article.title}</h3>
              <p className="text-xs text-gray-400 mt-0.5 font-mono">{article.keyword}</p>
            </div>
            <Badge className={cn("text-[11px] font-medium whitespace-nowrap border", stepBadgeClass)}>
              Step {article.currentStep}: {currentStepDef?.label}
            </Badge>
          </div>

          {/* Step indicator */}
          <StepIndicator currentStep={article.currentStep} stepStatus={article.stepStatus} />

          {/* Status */}
          <div className="flex items-center gap-2 text-sm">
            <StepIcon className="h-4 w-4 text-gray-400 shrink-0" strokeWidth={1.75} />
            <span className={cn("text-gray-500", article.stepStatus === "failed" && "text-red-600")}>
              {article.statusDetail}
            </span>
          </div>

          {/* Metrics */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-gray-400">
            {article.neuronScore !== undefined && (
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                NW: <span className={cn("font-semibold", article.neuronScore >= 65 ? "text-green-600" : "text-red-600")}>{article.neuronScore}/100</span>
              </span>
            )}
            {article.wordCount !== undefined && (
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />{article.wordCount.toLocaleString()} words
              </span>
            )}
            {article.estimatedTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />{article.estimatedTime}
              </span>
            )}
            {(article.retryCount ?? 0) > 0 && (
              <span className="flex items-center gap-1 text-amber-600">
                <AlertTriangle className="h-3 w-3" />Retry #{article.retryCount}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {article.actions.includes("view") && (
              <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-500 hover:text-gray-900">
                <Eye className="h-3 w-3 mr-1" />View
              </Button>
            )}
            {article.actions.includes("approve") && (
              <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle2 className="h-3 w-3 mr-1" />Approve
              </Button>
            )}
            {article.actions.includes("reject") && (
              <Button variant="outline" size="sm" className="h-7 text-xs border-red-200 text-red-600 hover:bg-red-50">
                Reject
              </Button>
            )}
            {article.actions.includes("retry") && (
              <Button variant="outline" size="sm" className="h-7 text-xs border-amber-200 text-amber-600 hover:bg-amber-50">
                <RotateCcw className="h-3 w-3 mr-1" />Retry
              </Button>
            )}
            {article.actions.includes("publish") && (
              <Button size="sm" className="h-7 text-xs bg-primary-600 hover:bg-primary-700 text-white">
                <Rocket className="h-3 w-3 mr-1" />Publish
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Badge Helpers ───────────────────────────────────────────────────

function WpStatusBadge({ status }: { status: PublishedArticle["wpStatus"] }) {
  const cls = { Live: "bg-green-50 text-green-700 border-green-200", Draft: "bg-gray-50 text-gray-600 border-gray-200", Scheduled: "bg-blue-50 text-blue-700 border-blue-200" };
  return <Badge className={cn("text-[11px] border", cls[status])}>{status}</Badge>;
}

function GscBadge({ status }: { status: PublishedArticle["gscIndexed"] }) {
  const cls = { Yes: "bg-green-50 text-green-700 border-green-200", No: "bg-red-50 text-red-600 border-red-200", Pending: "bg-amber-50 text-amber-700 border-amber-200" };
  return <Badge className={cn("text-[11px] border", cls[status])}>{status}</Badge>;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ── Page ────────────────────────────────────────────────────────────

export default function PipelinePage() {
  const [activeTab, setActiveTab] = useState("pipeline");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Publishing"
        description="Track articles through the 8-stage content pipeline"
      />

      {/* Summary */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary-500" />
          <span className="text-gray-500">{PIPELINE_ARTICLES.length} in pipeline</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-gray-500">{PUBLISHED_ARTICLES.filter(a => a.wpStatus === "Live").length} published</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-gray-500">{PIPELINE_ARTICLES.filter(a => a.stepStatus === "failed").length} need attention</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pipeline">Content Pipeline</TabsTrigger>
          <TabsTrigger value="published">Published Articles ({PUBLISHED_ARTICLES.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="mt-4 space-y-3">
          {PIPELINE_ARTICLES.map((article) => (
            <PipelineCard key={article.id} article={article} />
          ))}
        </TabsContent>

        <TabsContent value="published" className="mt-4">
          <div className="rounded-xl border border-gray-200/80 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Keyword</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">NW Score</TableHead>
                  <TableHead className="text-right">Words</TableHead>
                  <TableHead className="text-center">Indexed</TableHead>
                  <TableHead className="text-center">Links</TableHead>
                  <TableHead>Next Check</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PUBLISHED_ARTICLES.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium text-gray-900 max-w-[220px]">
                      <a href={a.wpUrl} className="hover:text-primary-600 inline-flex items-center gap-1 transition-colors">
                        <span className="truncate">{a.title}</span>
                        <ExternalLink className="h-3 w-3 text-gray-300 shrink-0" />
                      </a>
                    </TableCell>
                    <TableCell className="text-gray-500 text-xs font-mono max-w-[160px] truncate">{a.keyword}</TableCell>
                    <TableCell className="text-gray-500 text-sm whitespace-nowrap">{formatDate(a.publishedDate)}</TableCell>
                    <TableCell><WpStatusBadge status={a.wpStatus} /></TableCell>
                    <TableCell className="text-center">
                      <span className={cn("text-sm font-semibold", a.neuronScore >= 75 ? "text-green-600" : a.neuronScore >= 65 ? "text-amber-600" : "text-red-600")}>
                        {a.neuronScore}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm text-right">{a.wordCount.toLocaleString()}</TableCell>
                    <TableCell className="text-center"><GscBadge status={a.gscIndexed} /></TableCell>
                    <TableCell className="text-gray-500 text-sm text-center">{a.internalLinks}</TableCell>
                    <TableCell className="text-gray-400 text-sm whitespace-nowrap">{a.nextCheck === "-" ? "—" : formatDate(a.nextCheck)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
