"use client";

import { useState, useCallback, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader, EmptyState } from "@/components/dashboard";
import { PipelineTimeline } from "@/components/dashboard/PipelineTimeline";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { getPipelines, getQueue } from "@/lib/mock-data/pipeline";
import { cn } from "@/lib/utils";
import type { ProductPipeline, QueueItem } from "@/lib/mock-data/pipeline";

// ── Helpers ──────────────────────────────────────────────────────────

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateTimeFull(iso: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Status configs ───────────────────────────────────────────────────

const PIPELINE_STATUS_CONFIG: Record<
  ProductPipeline["status"],
  { label: string; className: string; icon: React.ReactNode }
> = {
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
    icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    icon: <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />,
  },
  failed: {
    label: "Failed",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
    icon: <XCircle className="h-4 w-4 text-red-600" />,
  },
  partial: {
    label: "Partial",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />,
  },
};

const QUEUE_STATUS_CONFIG: Record<
  QueueItem["status"],
  { label: string; className: string }
> = {
  queued: { label: "Queued", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
  processing: { label: "Processing", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  completed: { label: "Completed", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  failed: { label: "Failed", className: "bg-red-100 text-red-800 hover:bg-red-100" },
};

const PRIORITY_CONFIG: Record<
  QueueItem["priority"],
  { label: string; className: string }
> = {
  high: { label: "High", className: "bg-red-100 text-red-800 hover:bg-red-100" },
  medium: { label: "Medium", className: "bg-amber-100 text-amber-800 hover:bg-amber-100" },
  low: { label: "Low", className: "bg-gray-100 text-gray-600 hover:bg-gray-100" },
};

const TYPE_CONFIG: Record<
  QueueItem["type"],
  { label: string; className: string }
> = {
  generation: { label: "Generation", className: "bg-purple-100 text-purple-800 hover:bg-purple-100" },
  publishing: { label: "Publishing", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  refresh: { label: "Refresh", className: "bg-orange-100 text-orange-800 hover:bg-orange-100" },
};

function progressColor(status: ProductPipeline["status"]): string {
  switch (status) {
    case "completed": return "[&>div]:bg-green-500";
    case "in-progress": return "[&>div]:bg-blue-500";
    case "failed": return "[&>div]:bg-red-500";
    case "partial": return "[&>div]:bg-yellow-500";
  }
}

// ── Pipeline Card ────────────────────────────────────────────────────

interface PipelineCardProps {
  pipeline: ProductPipeline;
}

function PipelineCard({ pipeline }: PipelineCardProps) {
  const [expanded, setExpanded] = useState(false);
  const statusConfig = PIPELINE_STATUS_CONFIG[pipeline.status];
  const progressValue = (pipeline.completedSteps / pipeline.totalSteps) * 100;

  return (
    <Card>
      <CardHeader className="pb-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left"
          aria-label={expanded ? "Collapse pipeline details" : "Expand pipeline details"}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {statusConfig.icon}
              <div className="min-w-0">
                <h3 className="text-sm font-semibold truncate">
                  {pipeline.productName}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Triggered {formatDateTime(pipeline.triggeredAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <Badge className={cn("border-transparent", statusConfig.className)}>
                {statusConfig.label}
              </Badge>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {pipeline.completedSteps}/{pipeline.totalSteps} steps
              </span>
              {expanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>

          <div className="mt-3">
            <Progress
              value={progressValue}
              className={cn("h-2", progressColor(pipeline.status))}
            />
          </div>
        </button>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          <div className="border-t pt-4">
            <PipelineTimeline steps={pipeline.steps} />
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// ── Pipelines Tab ────────────────────────────────────────────────────

function PipelinesTab() {
  const fetcher = useCallback(() => getPipelines(), []);
  const { data: pipelines, loading } = useAsyncData(fetcher);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!pipelines || pipelines.length === 0) {
    return (
      <EmptyState
        title="No pipelines yet"
        description="Publishing pipelines will appear here when content is ready for distribution."
      />
    );
  }

  return (
    <div className="space-y-4">
      {pipelines.map((pipeline) => (
        <PipelineCard key={pipeline.id} pipeline={pipeline} />
      ))}
    </div>
  );
}

// ── Queue Tab ────────────────────────────────────────────────────────

function QueueTab() {
  const fetcher = useCallback(() => getQueue(), []);
  const { data: queue, loading } = useAsyncData(fetcher);

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (!queue) return [];
    let result = [...queue];

    if (typeFilter !== "all") {
      result = result.filter((q) => q.type === typeFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((q) => q.status === statusFilter);
    }

    return result;
  }, [queue, typeFilter, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="generation">Generation</SelectItem>
            <SelectItem value="publishing">Publishing</SelectItem>
            <SelectItem value="refresh">Refresh</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="queued">Queued</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Queue table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Completed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-12 text-muted-foreground"
                >
                  No queue items match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => {
                const typeConfig = TYPE_CONFIG[item.type];
                const priorityConfig = PRIORITY_CONFIG[item.priority];
                const qStatusConfig = QUEUE_STATUS_CONFIG[item.status];

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.productName}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "border-transparent",
                          typeConfig.className,
                        )}
                      >
                        {typeConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "border-transparent",
                          priorityConfig.className,
                        )}
                      >
                        {priorityConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "border-transparent",
                          qStatusConfig.className,
                        )}
                      >
                        {qStatusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[260px]">
                      <span className="text-sm text-muted-foreground line-clamp-2">
                        {item.details}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDateTimeFull(item.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDateTimeFull(item.startedAt)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDateTimeFull(item.completedAt)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Publishing Pipeline"
        description="Monitor the 14-step n8n publishing pipeline and content queue for all products."
      />

      <Tabs defaultValue="pipelines" className="w-full">
        <TabsList>
          <TabsTrigger value="pipelines">Publishing Pipelines</TabsTrigger>
          <TabsTrigger value="queue">Content Queue</TabsTrigger>
        </TabsList>

        <TabsContent value="pipelines">
          <PipelinesTab />
        </TabsContent>

        <TabsContent value="queue">
          <QueueTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
