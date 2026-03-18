import type {
  OverviewKpis,
  Alert,
  TimeSeriesPoint,
  Product,
} from '../types/domain';
import { getProducts } from './products';

const delay = () => new Promise<void>((r) => setTimeout(r, 100));

function dateStr(daysAgo: number): string {
  const d = new Date('2026-03-17');
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

function seeded(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

// ── Overview KPIs ────────────────────────────────────────────────────
// Values are designed to be roughly consistent with the 25 products and 8 feeds.
//   Total revenue across published products: ~$23,390
//   Active (published) products: 18
//   Pipeline (draft + scheduled + publishing): 5
//   Feeds: 6 healthy / 8 total

export async function getOverviewKpis(): Promise<OverviewKpis> {
  await delay();

  return {
    totalRevenue: 23390,
    revenueChange: 14.2,
    activeProducts: 18,
    productsChange: 3,
    pipelineItems: 5,
    pipelineChange: -1,
    feedsHealthy: 6,
    feedsTotal: 8,
  };
}

// ── Alerts ───────────────────────────────────────────────────────────

export async function getAlerts(): Promise<Alert[]> {
  await delay();

  return [
    {
      id: 'alert-001',
      type: 'error',
      title: 'Reddit API Auth Expired',
      message: 'The Reddit Opportunity Miner feed has stopped. Re-authenticate at Settings > Integrations > Reddit.',
      timestamp: '2026-03-17T08:12:00Z',
    },
    {
      id: 'alert-002',
      type: 'warning',
      title: 'YouTube API Rate Limited',
      message: 'YouTube Comment Miner is rate-limited. Processing will resume after midnight PT quota reset.',
      timestamp: '2026-03-17T07:45:00Z',
    },
    {
      id: 'alert-003',
      type: 'success',
      title: 'StudyAI Pro Hit $2,400 Revenue',
      message: 'StudyAI Pro has crossed the $2,400 revenue milestone. Consider increasing content frequency for this product.',
      timestamp: '2026-03-17T06:30:00Z',
    },
    {
      id: 'alert-004',
      type: 'info',
      title: 'Weekly Report Generated',
      message: 'The weekly performance report for Mar 10-16, 2026 is ready. View it in the Reports section.',
      timestamp: '2026-03-17T06:00:00Z',
    },
    {
      id: 'alert-005',
      type: 'success',
      title: 'QuizMaster AI Reached SERP Position 3',
      message: 'The SEO article for QuizMaster AI climbed from position 8 to position 3 this week.',
      timestamp: '2026-03-16T18:00:00Z',
    },
    {
      id: 'alert-006',
      type: 'warning',
      title: 'CodeTutor Content Publishing Failed',
      message: 'WordPress API returned a 503 error when publishing the CodeTutor article. Retry queued.',
      timestamp: '2026-03-16T14:22:00Z',
    },
    {
      id: 'alert-007',
      type: 'info',
      title: 'New Product Discovered: CalendarSense',
      message: 'GSC Keyword Miner found a new opportunity with a score of 3/5. Flagged for human review.',
      timestamp: '2026-03-16T10:00:00Z',
    },
    {
      id: 'alert-008',
      type: 'success',
      title: 'EduFlow YouTube Video Hit 15K Views',
      message: 'The EduFlow comparison video has reached 15,200 views with a 4.7% click-through rate to the affiliate link.',
      timestamp: '2026-03-15T22:15:00Z',
    },
  ];
}

// ── Revenue Trend (30 days) ──────────────────────────────────────────

export async function getRevenueTrend(): Promise<TimeSeriesPoint[]> {
  await delay();

  const data: TimeSeriesPoint[] = [];

  for (let i = 29; i >= 0; i--) {
    // Gradual uptrend with daily variance
    const base = 580 + ((30 - i) / 30) * 220; // ~580 -> ~800 over 30 days
    const variance = seeded(i + 42) * 160 - 80; // +/- 80
    const weekendDip = new Date(dateStr(i)).getDay() % 6 === 0 ? -60 : 0;
    data.push({
      date: dateStr(i),
      value: Math.round(base + variance + weekendDip),
    });
  }

  return data;
}

// ── Top Products (top 5 by revenue) ──────────────────────────────────

export async function getTopProducts(): Promise<Product[]> {
  await delay();

  const all = await getProducts();
  return all
    .filter((p) => p.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

// ── Feed Activity (items per feed this week) ─────────────────────────

export async function getFeedActivity(): Promise<{ feed: string; items: number }[]> {
  await delay();

  return [
    { feed: 'GSC Keyword Miner', items: 24 },
    { feed: 'SERP Gap Scanner', items: 18 },
    { feed: 'pSEO Engine', items: 15 },
    { feed: 'KGR Weak-Spot Finder', items: 12 },
    { feed: 'YT+Blog Overlap Finder', items: 11 },
    { feed: 'AI Proxy Generator', items: 9 },
    { feed: 'YouTube Comment Miner', items: 6 },
    { feed: 'Reddit Opportunity Miner', items: 0 },
  ];
}
