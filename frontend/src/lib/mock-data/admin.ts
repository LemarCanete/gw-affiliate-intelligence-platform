// ── Admin Mock Data ──────────────────────────────────────────────────

const delay = () => new Promise<void>((r) => setTimeout(r, 100));

function dateStr(daysAgo: number): string {
  const d = new Date('2026-03-17');
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

function timeStr(daysAgo: number, hours: number = 9, minutes: number = 0): string {
  const d = new Date('2026-03-17');
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

// ── Types ────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'suspended' | 'pending';
  plan: 'Starter' | 'Pro' | 'Enterprise';
  productsTracked: number;
  lastActive: string;
  createdAt: string;
}

export interface SystemConfig {
  key: string;
  label: string;
  value: string;
  type: 'number' | 'text' | 'toggle' | 'select';
  category: 'scoring' | 'feeds' | 'content' | 'publishing';
  description: string;
}

export interface ModerationItem {
  id: string;
  productName: string;
  contentType: string;
  title: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  wordCount: number;
}

export interface ApiHealthCheck {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  latency: number;
  rateLimit: { used: number; total: number } | null;
  lastChecked: string;
  errorRate: number;
}

export interface SubscriptionMetrics {
  mrr: number;
  mrrChange: number;
  totalUsers: number;
  activeUsers: number;
  churnRate: number;
  usersByTier: { tier: string; count: number; revenue: number }[];
  recentSignups: { email: string; plan: string; date: string }[];
}

export interface ErrorLogEntry {
  id: string;
  timestamp: string;
  severity: 'error' | 'warning' | 'info';
  source: string;
  message: string;
  count: number;
}

// ── Admin Users ──────────────────────────────────────────────────────

export async function getAdminUsers(): Promise<AdminUser[]> {
  await delay();
  return [
    { id: 'u-001', email: 'gareth@gwplatform.com', name: 'Gareth Williams', role: 'admin', status: 'active', plan: 'Enterprise', productsTracked: 42, lastActive: timeStr(0, 10, 15), createdAt: dateStr(180) },
    { id: 'u-002', email: 'sarah.ops@gwplatform.com', name: 'Sarah Chen', role: 'admin', status: 'active', plan: 'Enterprise', productsTracked: 38, lastActive: timeStr(0, 9, 42), createdAt: dateStr(165) },
    { id: 'u-003', email: 'mike.editor@gmail.com', name: 'Mike Reynolds', role: 'editor', status: 'active', plan: 'Pro', productsTracked: 24, lastActive: timeStr(0, 8, 30), createdAt: dateStr(120) },
    { id: 'u-004', email: 'jessica.w@outlook.com', name: 'Jessica Wang', role: 'editor', status: 'active', plan: 'Pro', productsTracked: 19, lastActive: timeStr(1, 16, 20), createdAt: dateStr(95) },
    { id: 'u-005', email: 'tom.content@gmail.com', name: 'Tom Baker', role: 'editor', status: 'suspended', plan: 'Pro', productsTracked: 12, lastActive: timeStr(14, 11, 0), createdAt: dateStr(88) },
    { id: 'u-006', email: 'nina.r@company.io', name: 'Nina Rodriguez', role: 'editor', status: 'active', plan: 'Pro', productsTracked: 31, lastActive: timeStr(0, 7, 55), createdAt: dateStr(75) },
    { id: 'u-007', email: 'alex.seo@agency.co', name: 'Alex Petrov', role: 'editor', status: 'active', plan: 'Starter', productsTracked: 8, lastActive: timeStr(2, 14, 10), createdAt: dateStr(60) },
    { id: 'u-008', email: 'dave.viewer@gmail.com', name: 'Dave Morton', role: 'viewer', status: 'active', plan: 'Starter', productsTracked: 5, lastActive: timeStr(0, 11, 30), createdAt: dateStr(55) },
    { id: 'u-009', email: 'lucy.k@startup.com', name: 'Lucy Kim', role: 'viewer', status: 'active', plan: 'Starter', productsTracked: 3, lastActive: timeStr(3, 9, 0), createdAt: dateStr(45) },
    { id: 'u-010', email: 'raj.patel@edu.ac.uk', name: 'Raj Patel', role: 'viewer', status: 'pending', plan: 'Starter', productsTracked: 0, lastActive: timeStr(0, 0, 0), createdAt: dateStr(1) },
    { id: 'u-011', email: 'emma.jones@freelance.io', name: 'Emma Jones', role: 'viewer', status: 'active', plan: 'Pro', productsTracked: 15, lastActive: timeStr(1, 10, 45), createdAt: dateStr(40) },
    { id: 'u-012', email: 'carlos.m@saas.dev', name: 'Carlos Martinez', role: 'viewer', status: 'active', plan: 'Starter', productsTracked: 7, lastActive: timeStr(5, 8, 20), createdAt: dateStr(30) },
    { id: 'u-013', email: 'helen.t@corp.com', name: 'Helen Turner', role: 'viewer', status: 'suspended', plan: 'Starter', productsTracked: 2, lastActive: timeStr(21, 15, 0), createdAt: dateStr(25) },
    { id: 'u-014', email: 'ben.w@marketing.co', name: 'Ben Walker', role: 'viewer', status: 'active', plan: 'Pro', productsTracked: 11, lastActive: timeStr(0, 13, 5), createdAt: dateStr(20) },
    { id: 'u-015', email: 'sophie.new@gmail.com', name: 'Sophie Lambert', role: 'viewer', status: 'pending', plan: 'Starter', productsTracked: 0, lastActive: timeStr(0, 0, 0), createdAt: dateStr(0) },
  ];
}

// ── System Configuration ─────────────────────────────────────────────

export async function getSystemConfig(): Promise<SystemConfig[]> {
  await delay();
  return [
    // Scoring
    { key: 'scoring_threshold', label: 'Qualification Threshold', value: '18', type: 'number', category: 'scoring', description: 'Minimum score out of 25 for a product to qualify for content generation' },
    { key: 'scoring_weight_search_volume', label: 'Search Volume Weight', value: '1.0', type: 'number', category: 'scoring', description: 'Multiplier for the search volume scoring dimension' },
    { key: 'scoring_weight_competition', label: 'Competition Weight', value: '1.0', type: 'number', category: 'scoring', description: 'Multiplier for the competition gap scoring dimension' },
    { key: 'scoring_weight_commission', label: 'Commission Weight', value: '1.0', type: 'number', category: 'scoring', description: 'Multiplier for the affiliate commission scoring dimension' },
    { key: 'scoring_weight_trend', label: 'Trend Weight', value: '1.0', type: 'number', category: 'scoring', description: 'Multiplier for the trend momentum scoring dimension' },
    { key: 'scoring_weight_ai_citation', label: 'AI Citation Weight', value: '1.0', type: 'number', category: 'scoring', description: 'Multiplier for the AI/GEO citation potential scoring dimension' },
    { key: 'scoring_auto_score', label: 'Auto-Score on Discovery', value: 'true', type: 'toggle', category: 'scoring', description: 'Automatically run scoring engine when a new product is discovered' },
    // Feeds
    { key: 'feeds_daily_cron', label: 'Daily Discovery Cron', value: '6:00 AM', type: 'text', category: 'feeds', description: 'Time to run daily product discovery feeds (UTC)' },
    { key: 'feeds_weekly_cron', label: 'Weekly Intelligence Cron', value: 'Monday 7:00 AM', type: 'text', category: 'feeds', description: 'Day and time to run weekly intelligence digest (UTC)' },
    { key: 'feeds_max_items', label: 'Max Items Per Feed', value: '100', type: 'number', category: 'feeds', description: 'Maximum number of items each feed returns per run' },
    // Content
    { key: 'content_default_wordcount', label: 'Default Word Count', value: '2000', type: 'number', category: 'content', description: 'Default target word count for SEO articles' },
    { key: 'content_auto_briefs', label: 'Auto-Generate Briefs', value: 'true', type: 'toggle', category: 'content', description: 'Automatically generate content briefs for qualified products' },
    { key: 'content_require_review', label: 'Require Human Review', value: 'true', type: 'toggle', category: 'content', description: 'Require manual approval before publishing AI-generated content' },
    // Publishing
    { key: 'pub_blog_first', label: 'Blog-First Enforcement', value: 'true', type: 'toggle', category: 'publishing', description: 'Enforce blog post publication before any other format distribution' },
    { key: 'pub_pinterest_pins', label: 'Pinterest Pin Count', value: '5', type: 'number', category: 'publishing', description: 'Number of Pinterest pins to generate per product' },
    { key: 'pub_social_variants', label: 'Social Caption Variants', value: '3', type: 'number', category: 'publishing', description: 'Number of social media caption variations to produce' },
  ];
}

// ── Moderation Queue ─────────────────────────────────────────────────

export async function getModerationQueue(): Promise<ModerationItem[]> {
  await delay();
  return [
    { id: 'mod-001', productName: 'Notion AI', contentType: 'SEO Article', title: 'Notion AI Review 2026: The Best AI Workspace for Students?', submittedBy: 'Mike Reynolds', submittedAt: timeStr(0, 8, 45), status: 'pending', wordCount: 2340 },
    { id: 'mod-002', productName: 'Gamma.app', contentType: 'YouTube Script', title: 'I Replaced PowerPoint with Gamma AI - Here\'s What Happened', submittedBy: 'Jessica Wang', submittedAt: timeStr(0, 7, 30), status: 'pending', wordCount: 1850 },
    { id: 'mod-003', productName: 'Otter.ai', contentType: 'Pinterest Pins', title: 'Otter.ai for Meeting Notes - 5 Pin Templates', submittedBy: 'Nina Rodriguez', submittedAt: timeStr(0, 6, 15), status: 'pending', wordCount: 420 },
    { id: 'mod-004', productName: 'Jasper AI', contentType: 'Email Sequence', title: 'Jasper AI Welcome Sequence - 5 Emails', submittedBy: 'Alex Petrov', submittedAt: timeStr(1, 14, 0), status: 'pending', wordCount: 1620 },
    { id: 'mod-005', productName: 'Writesonic', contentType: 'SEO Article', title: 'Writesonic vs ChatGPT for Content Creation: Full Comparison', submittedBy: 'Mike Reynolds', submittedAt: timeStr(2, 10, 30), status: 'approved', wordCount: 2780 },
    { id: 'mod-006', productName: 'Descript', contentType: 'YouTube Script', title: 'Edit Videos Like a Google Doc with Descript', submittedBy: 'Jessica Wang', submittedAt: timeStr(2, 9, 0), status: 'approved', wordCount: 1540 },
    { id: 'mod-007', productName: 'Copy.ai', contentType: 'Social Posts', title: 'Copy.ai Launch Day Social Campaign', submittedBy: 'Nina Rodriguez', submittedAt: timeStr(3, 11, 20), status: 'rejected', wordCount: 380 },
    { id: 'mod-008', productName: 'Grammarly', contentType: 'Reddit Draft', title: 'Has anyone tried Grammarly\'s new AI rewrite feature?', submittedBy: 'Tom Baker', submittedAt: timeStr(4, 16, 45), status: 'rejected', wordCount: 290 },
  ];
}

// ── API Health ────────────────────────────────────────────────────────

export async function getApiHealth(): Promise<ApiHealthCheck[]> {
  await delay();
  return [
    { name: 'ProductHunt API', status: 'operational', latency: 142, rateLimit: { used: 312, total: 1000 }, lastChecked: timeStr(0, 10, 14), errorRate: 0.1 },
    { name: 'SerpAPI', status: 'operational', latency: 238, rateLimit: { used: 4200, total: 10000 }, lastChecked: timeStr(0, 10, 14), errorRate: 0.3 },
    { name: 'Claude API', status: 'operational', latency: 1240, rateLimit: { used: 850, total: 4000 }, lastChecked: timeStr(0, 10, 14), errorRate: 0.0 },
    { name: 'WordPress REST', status: 'operational', latency: 89, rateLimit: null, lastChecked: timeStr(0, 10, 14), errorRate: 0.0 },
    { name: 'YouTube Data API', status: 'operational', latency: 195, rateLimit: { used: 5800, total: 10000 }, lastChecked: timeStr(0, 10, 14), errorRate: 0.2 },
    { name: 'GSC API', status: 'operational', latency: 310, rateLimit: { used: 180, total: 2000 }, lastChecked: timeStr(0, 10, 14), errorRate: 0.0 },
    { name: 'Reddit API', status: 'degraded', latency: 890, rateLimit: { used: 580, total: 600 }, lastChecked: timeStr(0, 10, 14), errorRate: 4.2 },
    { name: 'Pinterest API', status: 'down', latency: 0, rateLimit: null, lastChecked: timeStr(0, 9, 50), errorRate: 100.0 },
    { name: 'Buffer API', status: 'operational', latency: 175, rateLimit: { used: 45, total: 500 }, lastChecked: timeStr(0, 10, 14), errorRate: 0.0 },
    { name: 'Supabase', status: 'operational', latency: 32, rateLimit: null, lastChecked: timeStr(0, 10, 14), errorRate: 0.0 },
  ];
}

// ── Subscription Metrics ─────────────────────────────────────────────

export async function getSubscriptionMetrics(): Promise<SubscriptionMetrics> {
  await delay();
  return {
    mrr: 12450,
    mrrChange: 8.4,
    totalUsers: 89,
    activeUsers: 72,
    churnRate: 3.2,
    usersByTier: [
      { tier: 'Starter', count: 45, revenue: 2205 },
      { tier: 'Pro', count: 38, revenue: 5662 },
      { tier: 'Enterprise', count: 6, revenue: 2394 },
    ],
    recentSignups: [
      { email: 'sophie.new@gmail.com', plan: 'Starter', date: dateStr(0) },
      { email: 'raj.patel@edu.ac.uk', plan: 'Starter', date: dateStr(1) },
      { email: 'liam.tech@saas.io', plan: 'Pro', date: dateStr(2) },
      { email: 'maria.g@startup.com', plan: 'Pro', date: dateStr(3) },
      { email: 'kevin.d@agency.co', plan: 'Starter', date: dateStr(5) },
    ],
  };
}

// ── Error Logs ────────────────────────────────────────────────────────

export async function getErrorLogs(): Promise<ErrorLogEntry[]> {
  await delay();
  return [
    { id: 'err-001', timestamp: timeStr(0, 9, 52), severity: 'error', source: 'Pinterest API', message: 'Authentication token expired. Refresh failed: 401 Unauthorized.', count: 23 },
    { id: 'err-002', timestamp: timeStr(0, 9, 30), severity: 'warning', source: 'Reddit API', message: 'Rate limit approaching: 580/600 requests used. Throttling enabled.', count: 8 },
    { id: 'err-003', timestamp: timeStr(0, 8, 15), severity: 'error', source: 'Content Engine', message: 'Claude API timeout after 30s for brief generation (product: Gamma.app).', count: 2 },
    { id: 'err-004', timestamp: timeStr(0, 6, 45), severity: 'info', source: 'Scoring Engine', message: 'Batch scoring completed: 12 products scored, 8 qualified (threshold 18/25).', count: 1 },
    { id: 'err-005', timestamp: timeStr(1, 14, 20), severity: 'warning', source: 'WordPress REST', message: 'Slow response detected: average latency 2.3s over last 10 requests.', count: 5 },
    { id: 'err-006', timestamp: timeStr(1, 11, 0), severity: 'error', source: 'YouTube Data API', message: 'Quota exceeded for video upload. Daily limit reached.', count: 1 },
    { id: 'err-007', timestamp: timeStr(2, 16, 30), severity: 'info', source: 'Feed Scheduler', message: 'Daily discovery cron completed successfully. 47 new items discovered.', count: 1 },
    { id: 'err-008', timestamp: timeStr(3, 9, 10), severity: 'warning', source: 'SerpAPI', message: 'Partial results returned for 3/10 queries. Retrying with backoff.', count: 3 },
    { id: 'err-009', timestamp: timeStr(4, 13, 45), severity: 'error', source: 'Publishing Pipeline', message: 'Buffer API: Failed to schedule 2 social posts. Invalid media format.', count: 2 },
    { id: 'err-010', timestamp: timeStr(5, 7, 20), severity: 'info', source: 'Optimisation Engine', message: 'Weekly weight adjustment complete. Competition weight increased to 1.15.', count: 1 },
    { id: 'err-011', timestamp: timeStr(6, 10, 0), severity: 'warning', source: 'GSC API', message: 'Data freshness delay: latest available data is 72 hours old.', count: 4 },
    { id: 'err-012', timestamp: timeStr(6, 8, 30), severity: 'error', source: 'Supabase', message: 'Connection pool exhausted briefly (max 20). Recovered after 3s.', count: 1 },
  ];
}
