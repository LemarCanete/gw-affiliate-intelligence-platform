"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import {
  Check,
  X,
  Sparkles,
  BarChart3,
  Save,
  Send,
  Loader2,
  Search,
  ExternalLink,
  Plus,
  TrendingUp,
  FileText,
  Eye,
  Type,
  AlignLeft,
  MessageSquare,
  PanelLeftClose,
  PanelRightClose,
  PanelLeftOpen,
  PanelRightOpen,
  ArrowRight,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────

interface SeoCheckItem {
  id: string;
  label: string;
  passed: boolean;
}

interface NeuronTerm {
  term: string;
  current: number;
  target: number;
}

interface CompetitorArticle {
  position: number;
  title: string;
  domain: string;
  wordCount: number;
  score: number;
}

interface PaaQuestion {
  id: string;
  question: string;
}

interface RelatedKeyword {
  keyword: string;
  volume: number;
}

// ── Constants ─────────────────────────────────────────────────────────

const INITIAL_NEURON_TERMS: NeuronTerm[] = [
  { term: "ai writing tool", current: 0, target: 5 },
  { term: "content creation", current: 0, target: 3 },
  { term: "SEO optimization", current: 0, target: 2 },
  { term: "natural language processing", current: 0, target: 2 },
  { term: "content marketing", current: 0, target: 3 },
  { term: "automated writing", current: 0, target: 2 },
  { term: "copywriting software", current: 0, target: 2 },
  { term: "blog post generator", current: 0, target: 2 },
  { term: "plagiarism free", current: 0, target: 1 },
  { term: "long form content", current: 0, target: 2 },
  { term: "content quality", current: 0, target: 3 },
  { term: "writing assistant", current: 0, target: 2 },
];

const COMPETITOR_ARTICLES: CompetitorArticle[] = [
  { position: 1, title: "Best AI Writing Tools 2026: Complete Guide", domain: "techradar.com", wordCount: 3200, score: 82 },
  { position: 2, title: "AI Writer Review: Top 10 Compared", domain: "writingtools.io", wordCount: 2800, score: 75 },
  { position: 3, title: "AI Content Generators That Actually Work", domain: "bloggersguide.com", wordCount: 2400, score: 71 },
  { position: 4, title: "AI Writing Software: Honest Reviews", domain: "contentcreator.net", wordCount: 2100, score: 68 },
  { position: 5, title: "The Ultimate AI Writing Tool Comparison", domain: "saasreviews.com", wordCount: 1900, score: 63 },
];

const PAA_QUESTIONS: PaaQuestion[] = [
  { id: "paa-1", question: "What is the best AI writing tool in 2026?" },
  { id: "paa-2", question: "Is AI-generated content good for SEO?" },
  { id: "paa-3", question: "How much does AI writing software cost?" },
  { id: "paa-4", question: "Can AI replace human content writers?" },
  { id: "paa-5", question: "Which AI writer has the best free plan?" },
  { id: "paa-6", question: "How to detect AI-generated content?" },
];

const RELATED_KEYWORDS: RelatedKeyword[] = [
  { keyword: "ai content writer", volume: 12400 },
  { keyword: "best ai writer for blogs", volume: 8800 },
  { keyword: "ai copywriting tool", volume: 6200 },
  { keyword: "automated blog writing", volume: 4100 },
  { keyword: "ai article generator free", volume: 9500 },
  { keyword: "content writing software", volume: 5300 },
  { keyword: "ai seo content tool", volume: 3700 },
  { keyword: "jasper ai alternative", volume: 7200 },
  { keyword: "ai writing assistant 2026", volume: 2900 },
  { keyword: "long form ai writer", volume: 1800 },
];

const SAMPLE_CONTENT = `## What Are AI Writing Tools?

AI writing tools are software applications powered by natural language processing and machine learning that help content creators produce high-quality written content faster. These ai writing tool solutions have evolved dramatically in 2026, offering capabilities that range from simple blog post generator features to sophisticated long form content creation.

The best ai content writer platforms now understand context, tone, and SEO optimization requirements, making them indispensable for modern content marketing strategies.

## Why You Need an AI Writing Tool in 2026

The content creation landscape has shifted fundamentally. With search engines demanding more comprehensive, well-structured content, having an automated writing assistant is no longer optional — it is essential for competitive content marketing.

Here is what makes modern writing assistant software stand out:

- **Speed**: Generate first drafts 10x faster than manual writing
- **Consistency**: Maintain brand voice across all content
- **SEO optimization**: Built-in keyword analysis and content quality scoring
- **Scalability**: Produce more content without hiring additional writers
- **Research**: AI-powered research capabilities save hours per article

## Top AI Writing Tools Compared

| Feature | Jasper AI | Copy.ai | WriteSonic | Surfer AI | Claude Writer |
|---------|-----------|---------|------------|-----------|---------------|
| Long Form | Yes | Yes | Yes | Yes | Yes |
| SEO Score | No | No | Basic | Advanced | Advanced |
| Plagiarism Check | Yes | No | Yes | No | Yes |
| Free Plan | No | Yes | Yes | No | Yes |
| API Access | Yes | Yes | Yes | Yes | Yes |
| Monthly Price | $49 | $36 | $16 | $89 | $40 |

## Key Features to Look For

When evaluating copywriting software, focus on these critical capabilities:

### Content Quality and Accuracy

The best ai writing tool solutions produce content that reads naturally and requires minimal editing. Look for tools that leverage advanced natural language processing to generate plagiarism free content that passes AI detection tools.

### SEO Optimization Integration

Modern content creation platforms should include built-in SEO optimization features. This includes keyword density analysis, readability scoring, and SERP competitor analysis. The best tools integrate with platforms like NeuronWriter for comprehensive content quality assessment.

### Long Form Content Capabilities

Not all ai article generators handle long form content well. Test each tool with a 2,000+ word article to evaluate coherence, structure, and quality consistency throughout the piece. The best blog post generator tools maintain context across thousands of words.

### Content Marketing Workflow Integration

Your automated writing tool should fit seamlessly into your existing content marketing workflow. Look for integrations with WordPress, social media schedulers, and email marketing platforms.

## Pricing Comparison

AI writing software pricing varies significantly. Free tiers typically limit you to 5,000-10,000 words per month, while professional plans range from $16 to $89 per month. Enterprise teams should evaluate volume discounts and API pricing for their content creation needs.

## Frequently Asked Questions

### What is the best AI writing tool in 2026?

The best ai writing tool depends on your specific needs. For SEO-focused content marketing, tools with built-in SEO optimization like Surfer AI excel. For general copywriting software needs, Jasper and Copy.ai offer excellent versatility. Claude Writer provides the best balance of content quality and affordability.

### Is AI-generated content good for SEO?

Yes, when used correctly. Modern ai content writer tools produce content that ranks well when combined with proper SEO optimization, original insights, and human editing. The key is using AI as a writing assistant rather than publishing raw output.

### How much does AI writing software cost?

AI writing software ranges from free (with limitations) to $89+ per month for premium plans. Most content creation professionals find the $30-50/month tier offers the best value for regular blog post generator usage and long form content needs.

### Can AI replace human content writers?

AI writing tools are best used as a writing assistant to augment human creativity, not replace it. The most effective content marketing strategies combine ai writing tool efficiency with human expertise, editing, and original thought leadership.

### Which AI writer has the best free plan?

Copy.ai and WriteSonic offer the most generous free plans for content creation. Both include enough monthly words to test their automated writing capabilities thoroughly before committing to a paid plan.

*Affiliate Disclosure: This article contains affiliate links. If you purchase through our links, we may earn a commission at no extra cost to you. This helps support our content creation efforts.*`;

// ── Utility Functions ─────────────────────────────────────────────────

function countWords(text: string): number {
  const stripped = text
    .replace(/#{1,6}\s/g, "")
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
    .replace(/\|[^|]*\|/g, " ")
    .replace(/-{3,}/g, "")
    .replace(/[-*]\s/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
  if (!stripped) return 0;
  return stripped.split(/\s+/).filter((w) => w.length > 0).length;
}

function computeFleschKincaid(text: string): number {
  const words = countWords(text);
  if (words === 0) return 0;
  const sentences = Math.max(
    1,
    (text.match(/[.!?]+/g) || []).length
  );
  const syllables = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .reduce((acc, word) => {
      if (!word) return acc;
      let count = (word.match(/[aeiouy]+/g) || []).length;
      if (count === 0) count = 1;
      return acc + count;
    }, 0);
  const grade = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
  return Math.max(0, Math.min(18, Math.round(grade * 10) / 10));
}

function countTermOccurrences(text: string, term: string): number {
  const lower = text.toLowerCase();
  const termLower = term.toLowerCase();
  let count = 0;
  let pos = 0;
  while ((pos = lower.indexOf(termLower, pos)) !== -1) {
    count++;
    pos += termLower.length;
  }
  return count;
}

// ── Circular Score Component ──────────────────────────────────────────

interface CircularScoreProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

function CircularScore({ score, size = 120, strokeWidth = 8 }: CircularScoreProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 65
      ? "text-green-500"
      : score >= 40
        ? "text-yellow-500"
        : "text-red-500";

  const bgColor =
    score >= 65
      ? "stroke-green-100"
      : score >= 40
        ? "stroke-yellow-100"
        : "stroke-red-100";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={color}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-2xl font-bold tabular-nums", color)}>
          {score}
        </span>
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
          Score
        </span>
      </div>
    </div>
  );
}

// ── SEO Check Item ────────────────────────────────────────────────────

function SeoCheckRow({ item }: { item: SeoCheckItem }) {
  return (
    <div className="flex items-center gap-2 py-1">
      {item.passed ? (
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="h-3 w-3 text-green-600" />
        </div>
      ) : (
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
          <X className="h-3 w-3 text-gray-400" />
        </div>
      )}
      <span
        className={cn(
          "text-sm",
          item.passed ? "text-gray-900" : "text-gray-500"
        )}
      >
        {item.label}
      </span>
    </div>
  );
}

// ── NeuronWriter Term Row ─────────────────────────────────────────────

function NeuronTermRow({ term }: { term: NeuronTerm }) {
  const ratio = term.target > 0 ? term.current / term.target : 0;
  const status =
    ratio >= 1 ? "met" : ratio > 0 ? "partial" : "unused";

  const colors = {
    met: "text-green-700 bg-green-50 border-green-200",
    partial: "text-yellow-700 bg-yellow-50 border-yellow-200",
    unused: "text-gray-500 bg-gray-50 border-gray-200",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between px-2.5 py-1.5 rounded-md border text-sm",
        colors[status]
      )}
    >
      <span className="truncate mr-2">{term.term}</span>
      <span className="font-mono text-xs font-medium whitespace-nowrap">
        {term.current}/{term.target}
      </span>
    </div>
  );
}

// ── SERP Preview ──────────────────────────────────────────────────────

interface SerpPreviewProps {
  title: string;
  slug: string;
  metaDescription: string;
}

function SerpPreview({ title, slug, metaDescription }: SerpPreviewProps) {
  const displayTitle = title || "Page Title";
  const displaySlug = slug
    ? slug
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 60)
    : "page-url";
  const displayMeta = metaDescription || "Add a meta description to see how your page will appear in search results.";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-1">
      <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Google Preview</p>
      <p className="text-sm text-green-700 truncate">
        yoursite.com/{displaySlug}
      </p>
      <p className="text-lg text-blue-700 hover:underline cursor-pointer leading-tight line-clamp-1">
        {displayTitle.slice(0, 60)}
        {displayTitle.length > 60 && "..."}
      </p>
      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
        {displayMeta.slice(0, 160)}
        {displayMeta.length > 160 && "..."}
      </p>
    </div>
  );
}

// ── Left Sidebar ──────────────────────────────────────────────────────

interface OptimizationSuggestion {
  label: string;
  current: string;
  recommend: string;
  reason: string;
  status: "good" | "improve" | "attention";
}

function OptimizationSuggestions({
  title,
  metaDescription,
  content,
  wordCount,
  targetKeyword,
}: {
  title: string;
  metaDescription: string;
  content: string;
  wordCount: number;
  targetKeyword: string;
}) {
  const suggestions = useMemo((): OptimizationSuggestion[] => {
    const titleLen = title.length;
    const h2Regex = /^##\s(.+)/gm;
    const h2Matches = content.match(h2Regex) || [];
    const kwLower = targetKeyword.toLowerCase();
    const h2WithKeyword = h2Matches.filter((h) =>
      h.toLowerCase().includes(kwLower)
    ).length;
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links = content.match(linkRegex) || [];
    const faqPresent =
      content.toLowerCase().includes("faq") ||
      content.toLowerCase().includes("frequently asked");
    const faqQCount = (content.match(/^###\s.+\?/gm) || []).length;

    const items: OptimizationSuggestion[] = [];

    // Title length
    if (titleLen === 0) {
      items.push({
        label: "Title length",
        current: "Not set",
        recommend: "55-60 chars",
        reason: "Longer titles get more clicks",
        status: "attention",
      });
    } else if (titleLen < 50 || titleLen > 65) {
      items.push({
        label: "Title length",
        current: `${titleLen} chars`,
        recommend: "55-60 chars",
        reason: titleLen < 50 ? "Longer titles get more clicks" : "May get truncated in SERPs",
        status: "improve",
      });
    } else {
      items.push({
        label: "Title length",
        current: `${titleLen} chars`,
        recommend: "55-60 chars",
        reason: "Good length for SERPs",
        status: "good",
      });
    }

    // Meta description
    if (metaDescription.length === 0) {
      items.push({
        label: "Meta desc",
        current: "Not set",
        recommend: "Add keyword in first 70 chars",
        reason: "Improves CTR",
        status: "attention",
      });
    } else if (metaDescription.length < 120 || !metaDescription.toLowerCase().includes(kwLower)) {
      items.push({
        label: "Meta desc",
        current: `${metaDescription.length} chars`,
        recommend: metaDescription.toLowerCase().includes(kwLower) ? "Extend to 150-160 chars" : "Add keyword in first 70 chars",
        reason: "Improves CTR",
        status: "improve",
      });
    } else {
      items.push({
        label: "Meta desc",
        current: `${metaDescription.length} chars`,
        recommend: "150-160 chars with keyword",
        reason: "Well optimized",
        status: "good",
      });
    }

    // H2 keywords
    if (h2WithKeyword === 0) {
      items.push({
        label: "H2 keywords",
        current: "0 found",
        recommend: "Add 2-3 H2s with keyword",
        reason: "Better topic signals",
        status: h2Matches.length === 0 ? "attention" : "improve",
      });
    } else if (h2WithKeyword < 2) {
      items.push({
        label: "H2 keywords",
        current: `${h2WithKeyword} found`,
        recommend: "Add 2-3 H2s with keyword",
        reason: "Better topic signals",
        status: "improve",
      });
    } else {
      items.push({
        label: "H2 keywords",
        current: `${h2WithKeyword} found`,
        recommend: "2-3 H2s with keyword",
        reason: "Good topic coverage",
        status: "good",
      });
    }

    // Word count
    if (wordCount < 1200) {
      items.push({
        label: "Word count",
        current: wordCount.toLocaleString(),
        recommend: "2,000+",
        reason: "Top results average 2,100 words",
        status: "attention",
      });
    } else if (wordCount < 2000) {
      items.push({
        label: "Word count",
        current: wordCount.toLocaleString(),
        recommend: "2,000+",
        reason: "Top results average 2,100 words",
        status: "improve",
      });
    } else {
      items.push({
        label: "Word count",
        current: wordCount.toLocaleString(),
        recommend: "2,000+",
        reason: "Competitive length",
        status: "good",
      });
    }

    // Internal links
    if (links.length === 0) {
      items.push({
        label: "Internal links",
        current: "0",
        recommend: "Add 2-3",
        reason: "Distributes page authority",
        status: "attention",
      });
    } else if (links.length < 2) {
      items.push({
        label: "Internal links",
        current: String(links.length),
        recommend: "Add 2-3",
        reason: "Distributes page authority",
        status: "improve",
      });
    } else {
      items.push({
        label: "Internal links",
        current: String(links.length),
        recommend: "2-3+",
        reason: "Good link structure",
        status: "good",
      });
    }

    // FAQ section
    if (!faqPresent) {
      items.push({
        label: "FAQ section",
        current: "Missing",
        recommend: "Add 5+ Q&As",
        reason: "LLMs extract FAQ blocks",
        status: "attention",
      });
    } else if (faqQCount < 5) {
      items.push({
        label: "FAQ section",
        current: `${faqQCount} Q&As`,
        recommend: "Add 5+ Q&As",
        reason: "LLMs extract FAQ blocks",
        status: "improve",
      });
    } else {
      items.push({
        label: "FAQ section",
        current: `${faqQCount} Q&As`,
        recommend: "5+ Q&As",
        reason: "Good for LLM extraction",
        status: "good",
      });
    }

    return items;
  }, [title, metaDescription, content, wordCount, targetKeyword]);

  const statusColors = {
    attention: "border-l-red-500 bg-red-50/50",
    improve: "border-l-yellow-500 bg-yellow-50/50",
    good: "border-l-green-500 bg-green-50/50",
  };

  const statusDotColors = {
    attention: "bg-red-500",
    improve: "bg-yellow-500",
    good: "bg-green-500",
  };

  return (
    <div className="p-4 border-b flex-shrink-0">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-3.5 w-3.5 text-yellow-500" />
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Optimization Suggestions
        </h3>
      </div>
      <div className="space-y-1.5">
        {suggestions.map((s) => (
          <div
            key={s.label}
            className={cn(
              "rounded-md border-l-2 px-2.5 py-2 text-[11px]",
              statusColors[s.status]
            )}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", statusDotColors[s.status])} />
              <span className="font-semibold text-gray-800">{s.label}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600 ml-3">
              <span className="text-gray-500">{s.current}</span>
              <ArrowRight className="h-2.5 w-2.5 text-gray-400 flex-shrink-0" />
              <span className="font-medium text-gray-700">{s.recommend}</span>
            </div>
            <p className="text-gray-400 ml-3 mt-0.5 italic">{s.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LeftSidebarProps {
  targetKeyword: string;
  onTargetKeywordChange: (val: string) => void;
  contentScore: number;
  wordCount: number;
  targetWordCount: number;
  readabilityGrade: number;
  seoChecklist: SeoCheckItem[];
  neuronTerms: NeuronTerm[];
  title: string;
  metaDescription: string;
  content: string;
}

function LeftSidebar({
  targetKeyword,
  onTargetKeywordChange,
  contentScore,
  wordCount,
  targetWordCount,
  readabilityGrade,
  seoChecklist,
  neuronTerms,
  title,
  metaDescription,
  content,
}: LeftSidebarProps) {
  const passedCount = seoChecklist.filter((c) => c.passed).length;
  const totalChecks = seoChecklist.length;

  return (
    <div className="h-full flex flex-col">
      {/* Keyword */}
      <div className="p-4 border-b">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
          Target Keyword
        </label>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={targetKeyword}
            onChange={(e) => onTargetKeywordChange(e.target.value)}
            placeholder="Enter target keyword..."
            className="pl-8 h-9 text-sm"
          />
        </div>
      </div>

      {/* Score Ring */}
      <div className="px-4 py-5 border-b flex flex-col items-center">
        <CircularScore score={contentScore} />
        <p className="text-xs text-muted-foreground mt-2">Content Score</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-px bg-gray-100 border-b">
        <div className="bg-white p-3 text-center">
          <p className="text-lg font-semibold tabular-nums text-gray-900">
            {wordCount.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
            / {targetWordCount.toLocaleString()} words
          </p>
        </div>
        <div className="bg-white p-3 text-center">
          <p className="text-lg font-semibold tabular-nums text-gray-900">
            {readabilityGrade}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
            FK Grade
          </p>
        </div>
      </div>

      {/* SEO Checklist */}
      <div className="p-4 border-b flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            SEO Checklist
          </h3>
          <Badge
            variant="secondary"
            className={cn(
              "text-[10px] px-1.5 py-0",
              passedCount === totalChecks
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            )}
          >
            {passedCount}/{totalChecks}
          </Badge>
        </div>
        <div className="space-y-0.5">
          {seoChecklist.map((item) => (
            <SeoCheckRow key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Optimization Suggestions */}
      <OptimizationSuggestions
        title={title}
        metaDescription={metaDescription}
        content={content}
        wordCount={wordCount}
        targetKeyword={targetKeyword}
      />

      {/* NeuronWriter Terms */}
      <div className="p-4 flex-1 min-h-0 overflow-y-auto">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
          NeuronWriter Terms
        </h3>
        <div className="space-y-1.5">
          {neuronTerms.map((t) => (
            <NeuronTermRow key={t.term} term={t} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Right Sidebar ─────────────────────────────────────────────────────

interface RightSidebarProps {
  title: string;
  metaDescription: string;
  competitors: CompetitorArticle[];
  paaQuestions: PaaQuestion[];
  relatedKeywords: RelatedKeyword[];
  onAddFaq: (question: string) => void;
  onAddKeyword: (keyword: string) => void;
}

function RightSidebar({
  title,
  metaDescription,
  competitors,
  paaQuestions,
  relatedKeywords,
  onAddFaq,
  onAddKeyword,
}: RightSidebarProps) {
  return (
    <div className="h-full flex flex-col">
      {/* SERP Preview */}
      <div className="p-4 border-b">
        <SerpPreview
          title={title}
          slug={title}
          metaDescription={metaDescription}
        />
      </div>

      {/* Tabbed sections */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <Tabs defaultValue="competitors" className="w-full">
          <TabsList className="w-full rounded-none border-b bg-transparent h-auto p-0">
            <TabsTrigger
              value="competitors"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs py-2.5"
            >
              SERP
            </TabsTrigger>
            <TabsTrigger
              value="paa"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs py-2.5"
            >
              PAA
            </TabsTrigger>
            <TabsTrigger
              value="related"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs py-2.5"
            >
              Related
            </TabsTrigger>
          </TabsList>

          {/* Competitors */}
          <TabsContent value="competitors" className="mt-0 p-4 space-y-3">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
              Top 5 Ranking Articles
            </p>
            {competitors.map((comp) => (
              <div
                key={comp.position}
                className="p-3 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors space-y-1.5"
              >
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded bg-gray-100 text-[10px] font-bold flex items-center justify-center text-gray-600">
                    {comp.position}
                  </span>
                  <p className="text-sm font-medium text-gray-900 leading-tight line-clamp-2">
                    {comp.title}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-7 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    {comp.domain}
                  </span>
                  <span>{comp.wordCount.toLocaleString()} words</span>
                  <span
                    className={cn(
                      "font-semibold",
                      comp.score >= 70 ? "text-green-600" : "text-yellow-600"
                    )}
                  >
                    {comp.score}/100
                  </span>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* PAA */}
          <TabsContent value="paa" className="mt-0 p-4 space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
              People Also Ask
            </p>
            {paaQuestions.map((q) => (
              <button
                key={q.id}
                onClick={() => onAddFaq(q.question)}
                className="w-full flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5 transition-colors text-left group"
              >
                <Plus className="h-3.5 w-3.5 text-gray-400 group-hover:text-primary flex-shrink-0" />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {q.question}
                </span>
              </button>
            ))}
            <p className="text-[10px] text-muted-foreground pt-1">
              Click to add as FAQ section
            </p>
          </TabsContent>

          {/* Related Keywords */}
          <TabsContent value="related" className="mt-0 p-4 space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
              Related Keywords
            </p>
            {relatedKeywords.map((kw) => (
              <button
                key={kw.keyword}
                onClick={() => onAddKeyword(kw.keyword)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5 transition-colors group"
              >
                <span className="text-sm text-gray-700 group-hover:text-gray-900 truncate mr-2">
                  {kw.keyword}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                  <TrendingUp className="h-3 w-3" />
                  {kw.volume.toLocaleString()}
                </span>
              </button>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────

export default function WriterPage() {
  // Content state
  const [title, setTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [content, setContent] = useState("");
  const [plainText, setPlainText] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("best ai writing tools 2026");
  const TARGET_WORD_COUNT = 2000;

  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimising, setIsOptimising] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [contentScore, setContentScore] = useState(0);
  const [neuronTerms, setNeuronTerms] = useState<NeuronTerm[]>(INITIAL_NEURON_TERMS);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [mobileTab, setMobileTab] = useState<"brief" | "editor" | "serp">("editor");


  // Computed values
  const wordCount = useMemo(() => countWords(plainText || content.replace(/<[^>]+>/g, ' ')), [plainText, content]);
  const readabilityGrade = useMemo(() => computeFleschKincaid(content), [content]);

  // Update neuron terms on content change
  useEffect(() => {
    setNeuronTerms((prev) =>
      prev.map((t) => ({
        ...t,
        current: countTermOccurrences(content, t.term),
      }))
    );
  }, [content]);

  // Compute SEO checklist
  const seoChecklist: SeoCheckItem[] = useMemo(() => {
    const lowerContent = content.toLowerCase();
    const lowerTitle = title.toLowerCase();
    const lowerKeyword = targetKeyword.toLowerCase();
    const first100Words = lowerContent.split(/\s+/).slice(0, 100).join(" ");
    const h2Regex = /^##\s.+/gm;
    const h2Matches = content.match(h2Regex) || [];
    const h2Text = h2Matches.join(" ").toLowerCase();
    const faqPresent =
      lowerContent.includes("faq") ||
      lowerContent.includes("frequently asked") ||
      h2Text.includes("faq") ||
      h2Text.includes("frequently asked");
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links = content.match(linkRegex) || [];
    const altRegex = /!\[([^\]]+)\]/g;
    const altTags = content.match(altRegex) || [];
    const hasDisclosure =
      lowerContent.includes("affiliate disclosure") ||
      lowerContent.includes("affiliate link");

    return [
      {
        id: "kw-title",
        label: "Keyword in title",
        passed: lowerTitle.includes(lowerKeyword) && title.length > 0,
      },
      {
        id: "kw-intro",
        label: "Keyword in first 100 words",
        passed: first100Words.includes(lowerKeyword),
      },
      {
        id: "kw-h2",
        label: "Keyword in H2",
        passed: h2Text.includes(lowerKeyword),
      },
      {
        id: "meta",
        label: "Meta description set",
        passed: metaDescription.length >= 50,
      },
      {
        id: "faq",
        label: "FAQ section present",
        passed: faqPresent,
      },
      {
        id: "links",
        label: "Internal links (2+)",
        passed: links.length >= 2,
      },
      {
        id: "alt",
        label: "Image alt text",
        passed: altTags.length > 0,
      },
      {
        id: "words",
        label: "Word count >= 1,200",
        passed: wordCount >= 1200,
      },
      {
        id: "disclosure",
        label: "Affiliate disclosure",
        passed: hasDisclosure,
      },
    ];
  }, [content, title, metaDescription, targetKeyword, wordCount]);

  // Compute a content score based on checklist + terms + word count
  useEffect(() => {
    if (isOptimising || isGenerating) return;
    const checklistScore = seoChecklist.filter((c) => c.passed).length / seoChecklist.length;
    const termScore =
      neuronTerms.reduce((acc, t) => acc + Math.min(t.current / Math.max(t.target, 1), 1), 0) /
      neuronTerms.length;
    const wcScore = Math.min(wordCount / TARGET_WORD_COUNT, 1);
    const raw = Math.round(checklistScore * 40 + termScore * 40 + wcScore * 20);
    setContentScore(raw);
  }, [seoChecklist, neuronTerms, wordCount, isOptimising, isGenerating, TARGET_WORD_COUNT]);

  // Handlers
  const handleGenerateWithAI = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      setTitle("Best AI Writing Tools 2026: Complete Review & Comparison");
      setMetaDescription(
        "Discover the best AI writing tools in 2026. We compare top AI content writers including Jasper, Copy.ai, WriteSonic, and more. Find the perfect AI writing assistant for your needs."
      );
      setContent(SAMPLE_CONTENT);
      setIsGenerating(false);
    }, 3000);
  }, []);

  const handleOptimise = useCallback(() => {
    setIsOptimising(true);
    setTimeout(() => {
      setContentScore((prev) => Math.min(100, prev + Math.floor(Math.random() * 15) + 10));
      setNeuronTerms((prev) =>
        prev.map((t) => ({
          ...t,
          current: Math.min(t.target, t.current + Math.floor(Math.random() * 2) + 1),
        }))
      );
      setIsOptimising(false);
    }, 2000);
  }, []);

  const handleSaveDraft = useCallback(() => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  }, []);

  const handleAddFaq = useCallback(
    (question: string) => {
      const faqSection = `\n\n### ${question}\n\n[Write your answer here]\n`;
      setContent((prev) => prev + faqSection);
    },
    []
  );


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddKeyword = useCallback((_keyword: string) => {
    // Will be handled by TiptapEditor in future
  }, []);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="-m-4 flex flex-col h-[calc(100vh-4rem)]">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h1 className="text-sm font-semibold text-gray-900">Content Writer</h1>
            <Separator orientation="vertical" className="h-5 mx-1" />
            <Badge variant="secondary" className="text-[10px]">
              {wordCount.toLocaleString()} words
            </Badge>
            {contentScore > 0 && (
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px]",
                  contentScore >= 65
                    ? "bg-green-100 text-green-700"
                    : contentScore >= 40
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                )}
              >
                Score: {contentScore}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop sidebar toggles */}
            <div className="hidden lg:flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                    className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    aria-label="Toggle left sidebar"
                  >
                    {leftSidebarOpen ? (
                      <PanelLeftClose className="h-4 w-4" />
                    ) : (
                      <PanelLeftOpen className="h-4 w-4" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">{leftSidebarOpen ? "Hide brief" : "Show brief"}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                    className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    aria-label="Toggle right sidebar"
                  >
                    {rightSidebarOpen ? (
                      <PanelRightClose className="h-4 w-4" />
                    ) : (
                      <PanelRightOpen className="h-4 w-4" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">{rightSidebarOpen ? "Hide SERP" : "Show SERP"}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <Separator orientation="vertical" className="h-5 mx-1 hidden lg:block" />

            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="hidden sm:flex"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span className="ml-1">{isSaving ? "Saving..." : "Save Draft"}</span>
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Send className="h-4 w-4" />
              <span className="ml-1">Send to Staging</span>
            </Button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="lg:hidden flex border-b bg-white flex-shrink-0">
          <button
            onClick={() => setMobileTab("brief")}
            className={cn(
              "flex-1 py-2.5 text-xs font-medium text-center border-b-2 transition-colors",
              mobileTab === "brief"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500"
            )}
          >
            <AlignLeft className="h-4 w-4 mx-auto mb-0.5" />
            Brief
          </button>
          <button
            onClick={() => setMobileTab("editor")}
            className={cn(
              "flex-1 py-2.5 text-xs font-medium text-center border-b-2 transition-colors",
              mobileTab === "editor"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500"
            )}
          >
            <Type className="h-4 w-4 mx-auto mb-0.5" />
            Editor
          </button>
          <button
            onClick={() => setMobileTab("serp")}
            className={cn(
              "flex-1 py-2.5 text-xs font-medium text-center border-b-2 transition-colors",
              mobileTab === "serp"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500"
            )}
          >
            <Eye className="h-4 w-4 mx-auto mb-0.5" />
            SERP
          </button>
        </div>

        {/* 3-Panel Layout */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left Sidebar */}
          <aside
            className={cn(
              "w-[280px] border-r bg-white overflow-y-auto flex-shrink-0 transition-all duration-200",
              // Desktop
              "hidden lg:block",
              !leftSidebarOpen && "lg:hidden",
              // Mobile
              mobileTab === "brief" && "!block !w-full lg:!w-[280px]"
            )}
          >
            <LeftSidebar
              targetKeyword={targetKeyword}
              onTargetKeywordChange={setTargetKeyword}
              contentScore={contentScore}
              wordCount={wordCount}
              targetWordCount={TARGET_WORD_COUNT}
              readabilityGrade={readabilityGrade}
              seoChecklist={seoChecklist}
              neuronTerms={neuronTerms}
              title={title}
              metaDescription={metaDescription}
              content={content}
            />
          </aside>

          {/* Main Editor */}
          <main
            className={cn(
              "flex-1 min-w-0 flex flex-col bg-gray-50 overflow-hidden",
              // Mobile: hide when other tabs active
              mobileTab !== "editor" && "hidden lg:flex"
            )}
          >
            {/* Editor Area */}
            <div className="flex-1 overflow-y-auto relative">
              {/* Loading Overlays */}
              {isGenerating && (
                <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary-500 animate-pulse mb-3" />
                  <p className="text-sm font-medium text-gray-900">Generating article with Claude...</p>
                  <p className="text-xs text-gray-500 mt-1">Analyzing SERP data and creating optimized content</p>
                </div>
              )}
              {isOptimising && (
                <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-yellow-600 animate-pulse mb-3" />
                  <p className="text-sm font-medium text-gray-900">Optimising with NeuronWriter...</p>
                </div>
              )}

              {/* Title + Meta above editor */}
              <div className="max-w-3xl mx-auto px-6 pt-6">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your article title..."
                  className="w-full text-3xl font-bold text-gray-900 placeholder:text-gray-300 border-none outline-none bg-transparent mb-3 leading-tight"
                />
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value.slice(0, 200))}
                    placeholder="Write a compelling meta description..."
                    className="w-full text-sm text-gray-500 placeholder:text-gray-300 border-none outline-none bg-transparent pr-16"
                  />
                  <span className={cn("absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-mono tabular-nums", metaDescription.length > 160 ? "text-red-500" : metaDescription.length > 140 ? "text-yellow-500" : "text-gray-400")}>
                    {metaDescription.length}/160
                  </span>
                </div>
              </div>

              {/* Tiptap Rich Text Editor */}
              <TiptapEditor
                content={content}
                onUpdate={(html, text) => {
                  setContent(html);
                  setPlainText(text);
                }}
                placeholder="Start writing your article... Or click 'Generate with AI' to create a draft."
                className="min-h-[60vh]"
              />
            </div>

            {/* Bottom Action Bar */}
            <div className="border-t bg-white px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleGenerateWithAI}
                  disabled={isGenerating || isOptimising}
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                  size="sm"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span className="ml-1">
                    {isGenerating ? "Generating..." : "Generate with AI"}
                  </span>
                </Button>
                <Button
                  onClick={handleOptimise}
                  disabled={isOptimising || isGenerating || wordCount < 50}
                  variant="outline"
                  size="sm"
                >
                  {isOptimising ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <BarChart3 className="h-4 w-4" />
                  )}
                  <span className="ml-1">
                    {isOptimising ? "Optimising..." : "Optimise with NeuronWriter"}
                  </span>
                </Button>
              </div>

              {/* Mobile-only save/send */}
              <div className="flex items-center gap-2 sm:hidden">
                <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={isSaving}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {seoChecklist.filter((c) => c.passed).length}/{seoChecklist.length} checks
                </span>
                <span>FK Grade: {readabilityGrade}</span>
                <span>
                  {wordCount.toLocaleString()} / {TARGET_WORD_COUNT.toLocaleString()} words
                </span>
              </div>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside
            className={cn(
              "w-[300px] border-l bg-gray-50 overflow-y-auto flex-shrink-0 transition-all duration-200",
              "hidden lg:block",
              !rightSidebarOpen && "lg:hidden",
              mobileTab === "serp" && "!block !w-full lg:!w-[300px]"
            )}
          >
            <RightSidebar
              title={title}
              metaDescription={metaDescription}
              competitors={COMPETITOR_ARTICLES}
              paaQuestions={PAA_QUESTIONS}
              relatedKeywords={RELATED_KEYWORDS}
              onAddFaq={handleAddFaq}
              onAddKeyword={handleAddKeyword}
            />
          </aside>
        </div>
      </div>
    </TooltipProvider>
  );
}
