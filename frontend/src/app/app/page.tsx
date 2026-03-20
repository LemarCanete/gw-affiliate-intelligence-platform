"use client";

import React from "react";
import { useGlobal } from "@/lib/context/GlobalContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ChartCard } from "@/components/dashboard/ChartCard";
import {
  FileText,
  BarChart3,
  Search,
  Quote,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ── Inline mock data ────────────────────────────────────────────────

const SCORE_TREND = [
  { date: "Feb 19", score: 62 },
  { date: "Feb 23", score: 64 },
  { date: "Feb 27", score: 66 },
  { date: "Mar 03", score: 69 },
  { date: "Mar 07", score: 71 },
  { date: "Mar 11", score: 73 },
  { date: "Mar 15", score: 76 },
  { date: "Mar 19", score: 78 },
];

const RECENT_ACTIVITY = [
  { id: 1, text: "Article published: Best AI Writing Tools 2026", time: "2h ago" },
  { id: 2, text: "NeuronWriter score: 82/100 — Jasper AI Review", time: "4h ago" },
  { id: 3, text: "Citation detected on Perplexity — AI Productivity Tools", time: "6h ago" },
  { id: 4, text: "Keyword gap found: jasper ai review", time: "8h ago" },
  { id: 5, text: "WordPress draft created: GEO Complete Guide", time: "12h ago" },
];

const PIPELINE_STAGES = [
  { label: "Research", count: 3, color: "bg-blue-500" },
  { label: "Gap Check", count: 2, color: "bg-indigo-500" },
  { label: "Writing", count: 1, color: "bg-purple-500" },
  { label: "Optimizing", count: 2, color: "bg-amber-500" },
  { label: "Staging", count: 1, color: "bg-orange-500" },
  { label: "Published", count: 38, color: "bg-green-500" },
];

const TOP_ARTICLES = [
  { title: "Best AI Writing Tools 2026", keyword: "best ai writing tools", score: 84, position: 3, clicks: 312, citations: 4 },
  { title: "Jasper AI Review: Full Breakdown", keyword: "jasper ai review", score: 79, position: 5, clicks: 248, citations: 3 },
  { title: "Copy.ai vs ChatGPT for Content", keyword: "copy ai vs chatgpt", score: 76, position: 7, clicks: 189, citations: 2 },
  { title: "What Is GEO? Complete Guide", keyword: "what is geo", score: 82, position: 4, clicks: 276, citations: 5 },
  { title: "AI Productivity Tools for Students", keyword: "ai productivity tools students", score: 71, position: 11, clicks: 134, citations: 1 },
];

// ── Page ────────────────────────────────────────────────────────────

export default function OverviewPage() {
  const { loading: userLoading } = useGlobal();

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const totalPipeline = PIPELINE_STAGES.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Overview"
        description="Your SEO/GEO content platform at a glance"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Articles Published"
          value={47}
          change={8}
          icon={FileText}
        />
        <KpiCard
          title="Avg. Content Score"
          value="74/100"
          change={3.2}
          icon={BarChart3}
        />
        <KpiCard
          title="Keywords Tracked"
          value={142}
          icon={Search}
        />
        <KpiCard
          title="LLM Citations"
          value="18 articles cited"
          icon={Quote}
        />
      </div>

      {/* Content Score Trend + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Content Score Trend" description="Avg NeuronWriter score — last 30 days">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SCORE_TREND}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[50, 90]} />
                <Tooltip formatter={(value: number) => [value, "Score"]} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {RECENT_ACTIVITY.map((item) => (
              <div key={item.id} className="flex gap-3 items-start">
                <div className="h-2 w-2 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 leading-snug">{item.text}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pipeline Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Bar */}
          <div className="flex h-6 rounded-full overflow-hidden mb-3">
            {PIPELINE_STAGES.map((stage) => (
              <div
                key={stage.label}
                className={`${stage.color} transition-all`}
                style={{ width: `${(stage.count / totalPipeline) * 100}%` }}
              />
            ))}
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            {PIPELINE_STAGES.map((stage) => (
              <div key={stage.label} className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-sm ${stage.color}`} />
                <span className="text-gray-700">{stage.label}: <span className="font-semibold">{stage.count}</span></span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Articles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Performing Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 font-medium text-gray-500">Title</th>
                  <th className="pb-2 font-medium text-gray-500">Keyword</th>
                  <th className="pb-2 font-medium text-gray-500 text-center">Content Score</th>
                  <th className="pb-2 font-medium text-gray-500 text-center">GSC Position</th>
                  <th className="pb-2 font-medium text-gray-500 text-right">Clicks (7d)</th>
                  <th className="pb-2 font-medium text-gray-500 text-right">Citations</th>
                </tr>
              </thead>
              <tbody>
                {TOP_ARTICLES.map((article) => (
                  <tr key={article.title} className="border-b last:border-0">
                    <td className="py-2 font-medium text-gray-900">{article.title}</td>
                    <td className="py-2 text-gray-600 italic">{article.keyword}</td>
                    <td className="py-2 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                          article.score >= 75
                            ? "bg-green-100 text-green-700"
                            : article.score >= 60
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {article.score}
                      </span>
                    </td>
                    <td className="py-2 text-center text-gray-900">{article.position}</td>
                    <td className="py-2 text-right text-gray-900">{article.clicks.toLocaleString()}</td>
                    <td className="py-2 text-right text-gray-900">{article.citations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
