"use client";

import { useState, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import {
  getRevenueByPlatform,
  getRevenueByFormat,
  getGapWindows,
  getRoiData,
  getScoringWeightHistory,
} from "@/lib/mock-data/analytics";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
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

export default function AnalyticsPage() {
  const [days, setDays] = useState<TimeRange>(30);

  const { data: revenuePlatform, loading: rpLoading } = useAsyncData(
    useCallback(() => getRevenueByPlatform(days), [days])
  );
  const { data: revenueFormat, loading: rfLoading } = useAsyncData(
    useCallback(() => getRevenueByFormat(), [])
  );
  const { data: gapWindows, loading: gwLoading } = useAsyncData(
    useCallback(() => getGapWindows(days), [days])
  );
  const { data: roiData, loading: roiLoading } = useAsyncData(
    useCallback(() => getRoiData(), [])
  );
  const { data: scoringHistory, loading: shLoading } = useAsyncData(
    useCallback(() => getScoringWeightHistory(), [])
  );

  const loading = rpLoading || rfLoading || gwLoading || roiLoading || shLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Analytics"
        description="Performance metrics and trends"
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
        {/* Revenue by Platform */}
        <ChartCard title="Revenue by Platform">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenuePlatform ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) =>
                  new Date(v).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(value: number) => [`$${value}`, undefined]} />
              <Bar dataKey="blog" stackId="a" fill={CHART_COLORS[0]} />
              <Bar dataKey="youtube" stackId="a" fill={CHART_COLORS[1]} />
              <Bar dataKey="pinterest" stackId="a" fill={CHART_COLORS[2]} />
              <Bar dataKey="social" stackId="a" fill={CHART_COLORS[3]} />
              <Bar dataKey="email" stackId="a" fill={CHART_COLORS[4]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue by Content Format */}
        <ChartCard title="Revenue by Content Format">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={revenueFormat ?? []}
                dataKey="revenue"
                nameKey="format"
                cx="50%"
                cy="45%"
                outerRadius={90}
                label={({ format, percentage }) =>
                  `${format} (${percentage}%)`
                }
              >
                {(revenueFormat ?? []).map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`$${value}`, "Revenue"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Gap Window Distribution */}
        <ChartCard title="Gap Window Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={gapWindows ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) =>
                  new Date(v).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="gapWindows"
                stroke={CHART_COLORS[0]}
                fill={CHART_COLORS[0]}
                fillOpacity={0.3}
                name="Gap Windows"
              />
              <Area
                type="monotone"
                dataKey="captured"
                stroke={CHART_COLORS[1]}
                fill={CHART_COLORS[1]}
                fillOpacity={0.3}
                name="Captured"
              />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ROI by Product */}
        <ChartCard title="ROI by Product">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="cost"
                name="Cost"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `$${v}`}
                label={{
                  value: "Cost ($)",
                  position: "insideBottom",
                  offset: -5,
                  fontSize: 12,
                }}
              />
              <YAxis
                dataKey="revenue"
                name="Revenue"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `$${v}`}
                label={{
                  value: "Revenue ($)",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 12,
                }}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `$${value}`,
                  name,
                ]}
                labelFormatter={() => ""}
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  const data = payload[0]?.payload;
                  if (!data) return null;
                  return (
                    <div className="rounded-lg border bg-white p-2 shadow-sm text-sm">
                      <p className="font-medium">{data.product}</p>
                      <p>Cost: ${data.cost}</p>
                      <p>Revenue: ${data.revenue}</p>
                      <p>ROI: {data.roi}%</p>
                    </div>
                  );
                }}
              />
              <Scatter
                data={roiData ?? []}
                fill={CHART_COLORS[0]}
                name="Products"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Scoring Weight History - full width */}
      <ChartCard title="Scoring Weight History">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={scoringHistory ?? []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(v) =>
                new Date(v).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis tick={{ fontSize: 12 }} domain={[0.5, 1.5]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="productNewness"
              stroke={CHART_COLORS[0]}
              strokeWidth={2}
              dot={false}
              name="Product Newness"
            />
            <Line
              type="monotone"
              dataKey="llmGapStrength"
              stroke={CHART_COLORS[1]}
              strokeWidth={2}
              dot={false}
              name="LLM Gap"
            />
            <Line
              type="monotone"
              dataKey="buyingIntent"
              stroke={CHART_COLORS[2]}
              strokeWidth={2}
              dot={false}
              name="Buying Intent"
            />
            <Line
              type="monotone"
              dataKey="affiliateAvailable"
              stroke={CHART_COLORS[3]}
              strokeWidth={2}
              dot={false}
              name="Affiliate Available"
            />
            <Line
              type="monotone"
              dataKey="googleGapStrength"
              stroke={CHART_COLORS[4]}
              strokeWidth={2}
              dot={false}
              name="Google Gap"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
