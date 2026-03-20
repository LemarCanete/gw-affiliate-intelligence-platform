"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/dashboard";

// ── Types ────────────────────────────────────────────────────────────

type ContentType = "SEO Article" | "Comparison" | "Explainer" | "How-To Guide";
type StagingStatus = "pending" | "approved" | "rejected";

interface StagedItem {
  id: string;
  title: string;
  contentType: ContentType;
  primaryKeyword: string;
  wordCount: number;
  faqCount: number;
  neuronScore: number;
  seoChecks: { passed: number; total: number };
  validationWarnings: string[];
  snippet: string;
  status: StagingStatus;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

// ── Mock Data ────────────────────────────────────────────────────────

const MOCK_ITEMS: StagedItem[] = [
  {
    id: "stg-1",
    title: "Best AI Writing Tools 2026",
    contentType: "SEO Article",
    primaryKeyword: "best ai writing tools",
    wordCount: 2400,
    faqCount: 7,
    neuronScore: 78,
    seoChecks: { passed: 14, total: 16 },
    validationWarnings: [],
    snippet:
      "The AI writing tools landscape has exploded in 2026, with dozens of new entrants challenging established players. In this comprehensive guide, we evaluate the top tools by output quality, ease of use, and value for content teams...",
    status: "pending",
  },
  {
    id: "stg-2",
    title: "Jasper AI vs Copy.ai: Which Is Better?",
    contentType: "Comparison",
    primaryKeyword: "jasper ai vs copy ai",
    wordCount: 2100,
    faqCount: 6,
    neuronScore: 72,
    seoChecks: { passed: 13, total: 16 },
    validationWarnings: ["Primary keyword missing from H2"],
    snippet:
      "Jasper AI and Copy.ai are the two most popular AI writing platforms for marketing teams. Both have evolved significantly, but they take fundamentally different approaches to content generation and workflow integration...",
    status: "pending",
  },
  {
    id: "stg-3",
    title: "What Is GEO? Complete Guide",
    contentType: "Explainer",
    primaryKeyword: "what is geo",
    wordCount: 1800,
    faqCount: 8,
    neuronScore: 68,
    seoChecks: { passed: 12, total: 16 },
    validationWarnings: ["Missing internal links"],
    snippet:
      "Generative Engine Optimisation (GEO) is the practice of optimising content to appear as citations in AI-generated responses. As LLMs like ChatGPT, Perplexity, and Gemini reshape how users find information, GEO has become essential...",
    status: "pending",
  },
  {
    id: "stg-4",
    title: "How to Optimise Content for AI Citations",
    contentType: "How-To Guide",
    primaryKeyword: "optimise content ai citations",
    wordCount: 2200,
    faqCount: 6,
    neuronScore: 74,
    seoChecks: { passed: 14, total: 16 },
    validationWarnings: [],
    snippet:
      "Getting your content cited by AI engines requires a different approach than traditional SEO. This step-by-step guide covers structured data, authority signals, and content formatting patterns that increase your citation rate...",
    status: "pending",
  },
  {
    id: "stg-5",
    title: "Surfer SEO vs NeuronWriter: Content Optimisation Showdown",
    contentType: "Comparison",
    primaryKeyword: "surfer seo vs neuronwriter",
    wordCount: 2300,
    faqCount: 7,
    neuronScore: 82,
    seoChecks: { passed: 15, total: 16 },
    validationWarnings: [],
    snippet:
      "Content optimisation tools are critical for hitting target NeuronWriter scores. Surfer SEO and NeuronWriter both offer real-time content grading, but their scoring algorithms and feature sets differ in important ways...",
    status: "approved",
    approvedAt: "2026-03-15T14:30:00Z",
  },
  {
    id: "stg-6",
    title: "AI Productivity Tools for Students: 2026 Guide",
    contentType: "SEO Article",
    primaryKeyword: "ai productivity tools students",
    wordCount: 2050,
    faqCount: 7,
    neuronScore: 80,
    seoChecks: { passed: 14, total: 16 },
    validationWarnings: [],
    snippet:
      "Students in 2026 have access to a growing ecosystem of AI-powered productivity tools. From note-taking to research summarisation, this guide covers the best free and affordable options for academic workflows...",
    status: "approved",
    approvedAt: "2026-03-16T09:15:00Z",
  },
  {
    id: "stg-7",
    title: "How to Build a Keyword Gap Analysis Workflow",
    contentType: "How-To Guide",
    primaryKeyword: "keyword gap analysis workflow",
    wordCount: 1400,
    faqCount: 5,
    neuronScore: 48,
    seoChecks: { passed: 8, total: 16 },
    validationWarnings: [
      "NeuronWriter score below 50",
      "FAQ section missing schema markup",
    ],
    snippet:
      "A keyword gap analysis helps you find terms your competitors rank for that you do not. This guide walks through building an automated workflow using GSC data, Ahrefs exports, and a scoring matrix...",
    status: "rejected",
    rejectedAt: "2026-03-14T11:00:00Z",
    rejectionReason:
      "NeuronWriter score too low and missing several on-page SEO elements. Needs significant rework of H2 structure and keyword placement before it can be published.",
  },
  {
    id: "stg-8",
    title: "Content Scoring Explained: NeuronWriter Methodology",
    contentType: "Explainer",
    primaryKeyword: "neuronwriter content scoring",
    wordCount: 1200,
    faqCount: 5,
    neuronScore: 55,
    seoChecks: { passed: 11, total: 16 },
    validationWarnings: ["Word count at minimum threshold"],
    snippet:
      "NeuronWriter scores content on a 0-100 scale using semantic analysis, keyword coverage, and structural checks. Understanding how the scoring works helps you write articles that consistently hit 70+ without over-optimising...",
    status: "rejected",
    rejectedAt: "2026-03-13T16:45:00Z",
    rejectionReason:
      "Too thin. Needs real-world scoring examples and a comparison table of score ranges vs. ranking performance.",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const CONTENT_TYPE_COLORS: Record<ContentType, string> = {
  "SEO Article": "bg-blue-100 text-blue-800",
  Comparison: "bg-purple-100 text-purple-800",
  Explainer: "bg-amber-100 text-amber-800",
  "How-To Guide": "bg-emerald-100 text-emerald-800",
};

function neuronScoreColor(score: number): string {
  if (score >= 65) return "text-green-700 bg-green-100";
  if (score >= 50) return "text-yellow-700 bg-yellow-100";
  return "text-red-700 bg-red-100";
}

// ── Staging Card ─────────────────────────────────────────────────────

interface StagingCardProps {
  item: StagedItem;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onSendBack: (id: string) => void;
}

function StagingCard({ item, onApprove, onReject, onSendBack }: StagingCardProps) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const seoPercent = Math.round((item.seoChecks.passed / item.seoChecks.total) * 100);

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    onReject(item.id, rejectReason);
    setShowRejectForm(false);
    setRejectReason("");
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base font-semibold leading-snug">
            {item.title}
          </CardTitle>
          <Badge
            className={`border-transparent shrink-0 ${CONTENT_TYPE_COLORS[item.contentType]}`}
          >
            {item.contentType}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="italic">{item.primaryKeyword}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-gray-600">
            {item.wordCount.toLocaleString()} words
          </span>
          <span className="text-gray-600">{item.faqCount} FAQs</span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${neuronScoreColor(item.neuronScore)}`}
          >
            NW: {item.neuronScore}
          </span>
        </div>

        {/* SEO checklist */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>
              SEO: {item.seoChecks.passed}/{item.seoChecks.total} checks passed
            </span>
            <span>{seoPercent}%</span>
          </div>
          <Progress value={seoPercent} className="h-2" />
        </div>

        {/* Preview snippet */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
          {item.snippet}
        </p>

        {/* Validation warnings */}
        {item.validationWarnings.length > 0 && (
          <div className="space-y-1">
            {item.validationWarnings.map((warning, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded px-2 py-1"
              >
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                {warning}
              </div>
            ))}
          </div>
        )}

        {/* Status-specific content */}
        {item.status === "approved" && item.approvedAt && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded px-3 py-2">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>
              Approved {formatDate(item.approvedAt)} &mdash; Queued for
              publishing
            </span>
          </div>
        )}

        {item.status === "rejected" && (
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 rounded px-3 py-2">
              <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">
                  Rejected{" "}
                  {item.rejectedAt ? formatDate(item.rejectedAt) : ""}
                </span>
                {item.rejectionReason && (
                  <p className="mt-1 text-red-600">{item.rejectionReason}</p>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSendBack(item.id)}
              className="text-sm"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Send back to generation
            </Button>
          </div>
        )}

        {/* Reject form */}
        {showRejectForm && (
          <div className="space-y-2 border-t pt-3">
            <Textarea
              placeholder="Rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectReason.trim()}
              >
                Confirm Rejection
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowRejectForm(false);
                  setRejectReason("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Action buttons for pending items */}
        {item.status === "pending" && !showRejectForm && (
          <div className="flex flex-wrap items-center gap-2 border-t pt-3">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => onApprove(item.id)}
            >
              <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
              Approve &amp; Queue
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => setShowRejectForm(true)}
            >
              <XCircle className="h-3.5 w-3.5 mr-1.5" />
              Reject
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => console.log("Preview full article:", item.id)}
            >
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Preview Full Article
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────

export default function StagingPage() {
  const [items, setItems] = useState<StagedItem[]>(MOCK_ITEMS);
  const [activeFilter, setActiveFilter] = useState<StagingStatus>("pending");

  const counts: Record<StagingStatus, number> = {
    pending: items.filter((i) => i.status === "pending").length,
    approved: items.filter((i) => i.status === "approved").length,
    rejected: items.filter((i) => i.status === "rejected").length,
  };

  const filtered = items.filter((i) => i.status === activeFilter);

  const handleApprove = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "approved" as StagingStatus,
              approvedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
    console.log("Approved and queued for publishing:", id);
  };

  const handleReject = (id: string, reason: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "rejected" as StagingStatus,
              rejectedAt: new Date().toISOString(),
              rejectionReason: reason,
            }
          : item,
      ),
    );
    console.log("Rejected:", id, "Reason:", reason);
  };

  const handleSendBack = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    console.log("Sent back to generation:", id);
  };

  const FILTER_TABS: { key: StagingStatus; label: string }[] = [
    { key: "pending", label: "Pending Review" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Staging"
        description="Review and approve SEO/GEO content before publishing to WordPress"
      />

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeFilter === tab.key
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {tab.label}
            <span
              className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                activeFilter === tab.key
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No {activeFilter} items.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <StagingCard
              key={item.id}
              item={item}
              onApprove={handleApprove}
              onReject={handleReject}
              onSendBack={handleSendBack}
            />
          ))}
        </div>
      )}
    </div>
  );
}
