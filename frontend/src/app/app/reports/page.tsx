"use client";

import { useState, useCallback } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { TrendIndicator } from "@/components/dashboard/TrendIndicator";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { getReports } from "@/lib/mock-data/reports";
import { Download, FileText } from "lucide-react";
import type { WeeklyReport } from "@/lib/types/domain";

type FilterType = "all" | "weekly" | "monthly";

export default function ReportsPage() {
  const [filterType, setFilterType] = useState<FilterType>("all");

  const { data: reports, loading } = useAsyncData<WeeklyReport[]>(
    useCallback(() => getReports(), [])
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const allReports = reports ?? [];
  const filteredReports =
    filterType === "all"
      ? allReports
      : allReports.filter((r) => r.type === filterType);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Reports"
        description="Weekly and monthly performance reports"
      />

      {/* Filter */}
      <div className="w-48">
        <Select
          value={filterType}
          onValueChange={(v) => setFilterType(v as FilterType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Report cards */}
      {filteredReports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No reports found"
          description="No reports match the selected filter. Try changing the filter to see more results."
        />
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}

interface ReportCardProps {
  report: WeeklyReport;
}

function ReportCard({ report }: ReportCardProps) {
  const handleDownload = () => {
    console.log(`Downloading report: ${report.id} — ${report.period}`);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {report.period}
          </h3>
          <Badge
            variant={report.type === "monthly" ? "default" : "secondary"}
          >
            {report.type === "monthly" ? "Monthly" : "Weekly"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="text-lg font-semibold text-gray-900">
              ${report.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Revenue Change</p>
            <TrendIndicator value={report.revenueChange} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Top Product</p>
            <p className="text-sm font-medium text-gray-900">
              {report.topProduct}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Products Scored</p>
            <p className="text-lg font-semibold text-gray-900">
              {report.productsScored}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Content Published</p>
            <p className="text-lg font-semibold text-gray-900">
              {report.contentPublished}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600">{report.summary}</p>

        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="h-4 w-4" />
          Download Report
        </button>
      </CardContent>
    </Card>
  );
}
