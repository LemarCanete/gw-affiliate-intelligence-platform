"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ChartCard } from "@/components/dashboard/ChartCard";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const TIME_RANGES = [7, 30, 90] as const;
type TimeRange = (typeof TIME_RANGES)[number];

// ── Inline mock data ────────────────────────────────────────────────

const SCORE_DISTRIBUTION = [
  { range: "40-49", count: 3 },
  { range: "50-59", count: 5 },
  { range: "60-69", count: 9 },
  { range: "70-79", count: 16 },
  { range: "80-89", count: 11 },
  { range: "90+", count: 3 },
];

const ARTICLES_OVER_TIME = [
  { week: "Feb 3", published: 2 },
  { week: "Feb 10", published: 3 },
  { week: "Feb 17", published: 4 },
  { week: "Feb 24", published: 3 },
  { week: "Mar 3", published: 5 },
  { week: "Mar 10", published: 6 },
  { week: "Mar 17", published: 8 },
];

const KEYWORD_RANKINGS = [
  { name: "Top 3", value: 12 },
  { name: "4-10", value: 28 },
  { name: "11-20", value: 35 },
  { name: "21-50", value: 42 },
  { name: "50+", value: 25 },
];

const LLM_CITATIONS = [
  { engine: "ChatGPT", citations: 8 },
  { engine: "Perplexity", citations: 14 },
  { engine: "Gemini", citations: 5 },
  { engine: "AI Overviews", citations: 11 },
];

const GSC_TREND = [
  { date: "Feb 19", clicks: 120, impressions: 4200, avgPosition: 18.4 },
  { date: "Feb 23", clicks: 145, impressions: 4800, avgPosition: 17.1 },
  { date: "Feb 27", clicks: 168, impressions: 5300, avgPosition: 15.8 },
  { date: "Mar 03", clicks: 192, impressions: 5900, avgPosition: 14.2 },
  { date: "Mar 07", clicks: 215, impressions: 6400, avgPosition: 13.5 },
  { date: "Mar 11", clicks: 248, impressions: 7100, avgPosition: 12.1 },
  { date: "Mar 15", clicks: 276, impressions: 7800, avgPosition: 11.3 },
  { date: "Mar 19", clicks: 312, impressions: 8500, avgPosition: 10.6 },
];

// ── Page ────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [days, setDays] = useState<TimeRange>(30);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Analytics"
        description="Content performance and SEO/GEO metrics"
      />

      {/* Time range selector */}
      <div className="flex gap-1 rounded-lg border p-1 w-fit">
        {TIME_RANGES.map((range) => (
          <button
            key={range}
            onClick={() => setDays(range)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              days === range
                ? "bg-primary-50 text-primary-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {range}d
          </button>
        ))}
      </div>

      {/* 2x2 chart grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Score Distribution */}
        <ChartCard title="Content Score Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SCORE_DISTRIBUTION}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [value, "Articles"]}
              />
              <Bar dataKey="count" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} name="Articles" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Articles Published Over Time */}
        <ChartCard title="Articles Published Over Time">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ARTICLES_OVER_TIME}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [value, "Articles"]} />
              <Area
                type="monotone"
                dataKey="published"
                stroke={CHART_COLORS[1]}
                fill={CHART_COLORS[1]}
                fillOpacity={0.3}
                name="Published"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Keyword Rankings Distribution */}
        <ChartCard title="Keyword Rankings Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={KEYWORD_RANKINGS}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                outerRadius={90}
                label={({ name, value }) => `${name} (${value})`}
              >
                {KEYWORD_RANKINGS.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [value, "Keywords"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* LLM Citations by Engine */}
        <ChartCard title="LLM Citations by Engine">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={LLM_CITATIONS}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="engine" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [value, "Citations"]} />
              <Bar dataKey="citations" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} name="Citations" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* GSC Performance Trend — full width */}
      <ChartCard title="GSC Performance Trend" description="Clicks, Impressions, and Average Position over time">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={GSC_TREND}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              label={{ value: "Clicks", angle: -90, position: "insideLeft", fontSize: 12 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              label={{ value: "Impressions", angle: 90, position: "insideRight", fontSize: 12 }}
            />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="clicks"
              stroke={CHART_COLORS[0]}
              strokeWidth={2}
              dot={false}
              name="Clicks"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="impressions"
              stroke={CHART_COLORS[1]}
              strokeWidth={2}
              dot={false}
              name="Impressions"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="avgPosition"
              stroke={CHART_COLORS[3]}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Avg Position"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
