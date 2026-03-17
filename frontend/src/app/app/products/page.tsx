"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";
import { PageHeader, ScoreBadge, StatusBadge } from "@/components/dashboard";
import { AddProductModal } from "@/components/forms/AddProductModal";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { getProducts } from "@/lib/mock-data/products";
import type { Product, FeedType, PublishStatus, GapStatus } from "@/lib/types/domain";

// ── Helpers ──────────────────────────────────────────────────────────

function formatFeedType(type: FeedType): string {
  const labels: Record<FeedType, string> = {
    "serp-gap": "SERP Gap",
    "gsc-miner": "GSC Miner",
    "kgr-weakspot": "KGR Weak-Spot",
    "pseo-engine": "pSEO Engine",
    "ai-proxy": "AI Proxy",
    "reddit-miner": "Reddit",
    "youtube-comments": "YT Comments",
    "yt-blog-overlap": "YT+Blog Overlap",
  };
  return labels[type] || type;
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString()}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function GapStatusBadge({ status }: { status: GapStatus }) {
  const config: Record<GapStatus, { label: string; className: string }> = {
    'double-gap': { label: 'Double Gap', className: 'bg-green-100 text-green-800 border-green-200' },
    'google-only': { label: 'Google Gap', className: 'bg-blue-100 text-blue-800 border-blue-200' },
    'llm-only': { label: 'LLM Gap', className: 'bg-purple-100 text-purple-800 border-purple-200' },
    'closing': { label: 'Closing', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    'saturated': { label: 'Saturated', className: 'bg-red-100 text-red-800 border-red-200' },
  };
  const { label, className } = config[status];
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>{label}</span>;
}

// ── Sortable columns ─────────────────────────────────────────────────

type SortKey =
  | "name"
  | "score"
  | "status"
  | "revenue"
  | "serpPosition"
  | "geoScore"
  | "source"
  | "discoveredAt";

type SortDir = "asc" | "desc";

function compareProducts(a: Product, b: Product, key: SortKey, dir: SortDir): number {
  let result = 0;

  switch (key) {
    case "name":
      result = a.name.localeCompare(b.name);
      break;
    case "score":
      result = a.score.total - b.score.total;
      break;
    case "status":
      result = a.status.localeCompare(b.status);
      break;
    case "revenue":
      result = a.revenue - b.revenue;
      break;
    case "serpPosition":
      result = (a.serpPosition ?? 999) - (b.serpPosition ?? 999);
      break;
    case "geoScore":
      result = a.geoScore - b.geoScore;
      break;
    case "source":
      result = a.source.localeCompare(b.source);
      break;
    case "discoveredAt":
      result = new Date(a.discoveredAt).getTime() - new Date(b.discoveredAt).getTime();
      break;
  }

  return dir === "asc" ? result : -result;
}

// ── Constants ────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

const FEED_TYPES: FeedType[] = [
  "serp-gap",
  "gsc-miner",
  "kgr-weakspot",
  "pseo-engine",
  "ai-proxy",
  "reddit-miner",
  "youtube-comments",
  "yt-blog-overlap",
];

const STATUSES: PublishStatus[] = [
  "draft",
  "scheduled",
  "publishing",
  "published",
  "failed",
];

const CATEGORIES = [
  "Education",
  "Productivity",
];

// ── Page component ───────────────────────────────────────────────────

export default function ProductsPage() {
  const fetcher = useCallback(() => getProducts(), []);
  const { data: products, loading } = useAsyncData(fetcher);

  // Add Product modal
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Sort
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Pagination
  const [page, setPage] = useState(0);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(0);
  };

  const filtered = useMemo(() => {
    if (!products) return [];
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (sourceFilter !== "all") {
      result = result.filter((p) => p.source === sourceFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category.startsWith(categoryFilter));
    }

    result.sort((a, b) => compareProducts(a, b, sortKey, sortDir));
    return result;
  }, [products, search, statusFilter, sourceFilter, categoryFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const SortableHeader = ({ label, sortKeyVal }: { label: string; sortKeyVal: SortKey }) => (
    <button
      className="flex items-center gap-1 hover:text-foreground transition-colors"
      onClick={() => handleSort(sortKeyVal)}
    >
      {label}
      <ArrowUpDown className="h-3.5 w-3.5" />
    </button>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Discover and manage affiliate products across all intelligence feeds."
      >
        <Button onClick={() => setAddModalOpen(true)} className="bg-primary-600 text-white hover:bg-primary-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </PageHeader>

      {/* ── Filter bar ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="pl-9"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setPage(0);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={categoryFilter}
          onValueChange={(v) => {
            setCategoryFilter(v);
            setPage(0);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sourceFilter}
          onValueChange={(v) => {
            setSourceFilter(v);
            setPage(0);
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {FEED_TYPES.map((ft) => (
              <SelectItem key={ft} value={ft}>
                {formatFeedType(ft)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <SortableHeader label="Name" sortKeyVal="name" />
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>
                    <SortableHeader label="Score" sortKeyVal="score" />
                  </TableHead>
                  <TableHead>
                    <SortableHeader label="Status" sortKeyVal="status" />
                  </TableHead>
                  <TableHead>Gap Status</TableHead>
                  <TableHead>Intent</TableHead>
                  <TableHead className="text-right">
                    <SortableHeader label="Revenue" sortKeyVal="revenue" />
                  </TableHead>
                  <TableHead className="text-right">
                    <SortableHeader label="SERP Pos." sortKeyVal="serpPosition" />
                  </TableHead>
                  <TableHead className="text-right">
                    <SortableHeader label="GEO Score" sortKeyVal="geoScore" />
                  </TableHead>
                  <TableHead>
                    <SortableHeader label="Source" sortKeyVal="source" />
                  </TableHead>
                  <TableHead>
                    <SortableHeader label="Discovered" sortKeyVal="discoveredAt" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-12 text-muted-foreground">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  pageItems.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/app/products/${product.id}`}
                          className="text-primary-600 hover:text-primary-800 hover:underline"
                        >
                          {product.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">{product.category.split(" - ")[0]}</span>
                        <span className="block text-xs text-gray-400">{product.category.split(" - ")[1]}</span>
                      </TableCell>
                      <TableCell>
                        <ScoreBadge score={product.score.total} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={product.status} />
                      </TableCell>
                      <TableCell>
                        <GapStatusBadge status={product.gapStatus} />
                      </TableCell>
                      <TableCell className="text-sm capitalize text-muted-foreground">
                        {product.intent}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(product.revenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.serpPosition ?? "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.geoScore}/100
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatFeedType(product.source)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(product.discoveredAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* ── Pagination ────────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {page * ITEMS_PER_PAGE + 1}
                {" - "}
                {Math.min((page + 1) * ITEMS_PER_PAGE, filtered.length)} of{" "}
                {filtered.length} products
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      <AddProductModal open={addModalOpen} onOpenChange={setAddModalOpen} />
    </div>
  );
}
