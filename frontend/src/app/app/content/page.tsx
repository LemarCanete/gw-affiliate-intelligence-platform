"use client";

import { useCallback } from "react";
import { Loader2, FileText, GitCompare, ClipboardList, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageHeader, ScoreBadge, EmptyState } from "@/components/dashboard";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import {
  getGapScores,
  getContentBriefs,
  getReviewTemplates,
  getComparisonTemplates,
} from "@/lib/mock-data/templates";
import type { GapScoreEntry, ReviewTemplate } from "@/lib/mock-data/templates";
import type { ContentBrief } from "@/lib/types/domain";

// ── Brief Status Badge ──────────────────────────────────────────────

type BriefStatus = ContentBrief["status"];

const BRIEF_STATUS_CONFIG: Record<BriefStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
  approved: { label: "Approved", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  "in-production": { label: "In Production", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
  published: { label: "Published", className: "bg-green-100 text-green-800 hover:bg-green-100" },
};

function BriefStatusBadge({ status }: { status: BriefStatus }) {
  const config = BRIEF_STATUS_CONFIG[status];
  return (
    <Badge className={`border-transparent ${config.className}`}>
      {config.label}
    </Badge>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

// ── Score Cell Badge ────────────────────────────────────────────────

interface ScoreCellProps {
  value: number;
}

function ScoreCell({ value }: ScoreCellProps) {
  const colorClass =
    value >= 4
      ? "bg-green-100 text-green-800"
      : value === 3
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800";

  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-semibold ${colorClass}`}>
      {value}
    </span>
  );
}

// ── Verdict Badge ───────────────────────────────────────────────────

interface VerdictBadgeProps {
  verdict: GapScoreEntry["verdict"];
}

const VERDICT_CONFIG: Record<GapScoreEntry["verdict"], { label: string; className: string }> = {
  "write-immediately": {
    label: "Write Immediately",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  "worth-pursuing": {
    label: "Worth Pursuing",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  monitor: {
    label: "Monitor",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  skip: {
    label: "Skip",
    className: "bg-gray-100 text-gray-600 hover:bg-gray-100",
  },
};

function VerdictBadge({ verdict }: VerdictBadgeProps) {
  const config = VERDICT_CONFIG[verdict];
  return (
    <Badge className={`border-transparent ${config.className}`}>
      {config.label}
    </Badge>
  );
}

// ── Intent Badge ────────────────────────────────────────────────────

const INTENT_COLORS: Record<string, string> = {
  informational: "bg-sky-100 text-sky-800 hover:bg-sky-100",
  commercial: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  transactional: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  navigational: "bg-orange-100 text-orange-800 hover:bg-orange-100",
};

function IntentBadge({ intent }: { intent: string }) {
  const colorClass = INTENT_COLORS[intent] || "bg-gray-100 text-gray-800";
  return (
    <Badge className={`border-transparent capitalize ${colorClass}`}>
      {intent}
    </Badge>
  );
}

// ── Review Status Badge ─────────────────────────────────────────────

const REVIEW_STATUS_CONFIG: Record<ReviewTemplate["status"], { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
  "in-progress": { label: "In Progress", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
  review: { label: "In Review", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  published: { label: "Published", className: "bg-green-100 text-green-800 hover:bg-green-100" },
};

function ReviewStatusBadge({ status }: { status: ReviewTemplate["status"] }) {
  const config = REVIEW_STATUS_CONFIG[status];
  return (
    <Badge className={`border-transparent ${config.className}`}>
      {config.label}
    </Badge>
  );
}

// ── Loading Spinner ─────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
    </div>
  );
}

// ── Tab 1: Gap Scoring Sheet ────────────────────────────────────────

function GapScoringTab() {
  const fetcher = useCallback(() => getGapScores(), []);
  const { data: scores, loading } = useAsyncData(fetcher);

  if (loading) return <LoadingSpinner />;

  if (!scores || scores.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No gap scores yet"
        description="Run the scoring engine to evaluate products against the 5-point gap criteria."
      />
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Scored</TableHead>
            <TableHead className="text-center">New</TableHead>
            <TableHead className="text-center">LLM</TableHead>
            <TableHead className="text-center">Intent</TableHead>
            <TableHead className="text-center">Aff.</TableHead>
            <TableHead className="text-center">Google</TableHead>
            <TableHead className="text-center">Total</TableHead>
            <TableHead>Verdict</TableHead>
            <TableHead className="hidden lg:table-cell">Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scores.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">{entry.productName}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(entry.scoredAt)}
              </TableCell>
              <TableCell className="text-center">
                <ScoreCell value={entry.productNewness} />
              </TableCell>
              <TableCell className="text-center">
                <ScoreCell value={entry.llmGapStrength} />
              </TableCell>
              <TableCell className="text-center">
                <ScoreCell value={entry.buyingIntent} />
              </TableCell>
              <TableCell className="text-center">
                <ScoreCell value={entry.affiliateAvailable} />
              </TableCell>
              <TableCell className="text-center">
                <ScoreCell value={entry.googleGapStrength} />
              </TableCell>
              <TableCell className="text-center">
                <ScoreBadge score={entry.total} />
              </TableCell>
              <TableCell>
                <VerdictBadge verdict={entry.verdict} />
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[280px]">
                {truncate(entry.notes, 80)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Tab 2: Content Briefs ───────────────────────────────────────────

function ContentBriefsTab() {
  const fetcher = useCallback(() => getContentBriefs(), []);
  const { data: briefs, loading } = useAsyncData(fetcher);

  if (loading) return <LoadingSpinner />;

  if (!briefs || briefs.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No content briefs"
        description="Content briefs are generated from scored products that pass the 18/25 threshold."
      />
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Target Query</TableHead>
            <TableHead>Intent</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Words</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {briefs.map((brief) => (
            <TableRow key={brief.id}>
              <TableCell className="font-medium">{brief.targetQuery}</TableCell>
              <TableCell>
                <IntentBadge intent={brief.intent} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {brief.productName}
              </TableCell>
              <TableCell>
                <BriefStatusBadge status={brief.status} />
              </TableCell>
              <TableCell className="text-right text-sm tabular-nums">
                {brief.wordCount.toLocaleString()}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(brief.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Tab 3: Product Reviews ──────────────────────────────────────────

function ProductReviewsTab() {
  const fetcher = useCallback(() => getReviewTemplates(), []);
  const { data: reviews, loading } = useAsyncData(fetcher);

  if (loading) return <LoadingSpinner />;

  if (!reviews || reviews.length === 0) {
    return (
      <EmptyState
        icon={Star}
        title="No review templates"
        description="Create review templates from scored products to generate structured product reviews."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {reviews.map((review) => (
        <Card key={review.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base font-semibold">{review.productName}</CardTitle>
              <ReviewStatusBadge status={review.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {review.sections.whatIsIt}
            </p>

            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-green-700">
                <span className="font-medium">{review.sections.pros.length}</span> pros
              </span>
              <span className="flex items-center gap-1 text-red-700">
                <span className="font-medium">{review.sections.cons.length}</span> cons
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <span className="font-medium">{review.sections.keyFeatures.length}</span> features
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
              <span>{review.wordCount.toLocaleString()} words</span>
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ── Tab 4: Comparisons ──────────────────────────────────────────────

function ComparisonsTab() {
  const fetcher = useCallback(() => getComparisonTemplates(), []);
  const { data: comparisons, loading } = useAsyncData(fetcher);

  if (loading) return <LoadingSpinner />;

  if (!comparisons || comparisons.length === 0) {
    return (
      <EmptyState
        icon={GitCompare}
        title="No comparison templates"
        description="Create comparison templates to generate head-to-head product analyses."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {comparisons.map((comp) => (
        <Card key={comp.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base font-semibold">
                {comp.productAName} vs {comp.productBName}
              </CardTitle>
              <ReviewStatusBadge status={comp.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {comp.sections.overview}
            </p>

            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <span className="font-medium">{comp.sections.featureComparison.length}</span> features compared
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
              <span>{comp.wordCount.toLocaleString()} words</span>
              <span>{formatDate(comp.createdAt)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Hub"
        description="Gap scoring, briefs, and content templates"
      />

      <Tabs defaultValue="gap-scores" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gap-scores">Gap Scoring</TabsTrigger>
          <TabsTrigger value="briefs">Content Briefs</TabsTrigger>
          <TabsTrigger value="reviews">Product Reviews</TabsTrigger>
          <TabsTrigger value="comparisons">Comparisons</TabsTrigger>
        </TabsList>

        <TabsContent value="gap-scores">
          <GapScoringTab />
        </TabsContent>

        <TabsContent value="briefs">
          <ContentBriefsTab />
        </TabsContent>

        <TabsContent value="reviews">
          <ProductReviewsTab />
        </TabsContent>

        <TabsContent value="comparisons">
          <ComparisonsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
