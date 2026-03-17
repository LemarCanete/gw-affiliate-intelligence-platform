import type {
  RevenueByPlatform,
  RevenueByFormat,
  GapWindowPoint,
  RoiPoint,
  ScoringWeightHistory,
} from '../types/domain';

const delay = () => new Promise<void>((r) => setTimeout(r, 100));

// ── Helpers ──────────────────────────────────────────────────────────

function dateStr(daysAgo: number): string {
  const d = new Date('2026-03-17');
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

function weekStr(weeksAgo: number): string {
  const d = new Date('2026-03-17');
  d.setDate(d.getDate() - weeksAgo * 7);
  return d.toISOString().split('T')[0];
}

/** Add jitter around a base value */
function jitter(base: number, variance: number): number {
  return Math.round((base + (Math.random() - 0.5) * 2 * variance) * 100) / 100;
}

/** Seeded pseudo-random for deterministic data */
function seeded(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

// ── Revenue by Platform ──────────────────────────────────────────────

export async function getRevenueByPlatform(
  days: number,
): Promise<RevenueByPlatform[]> {
  await delay();

  const data: RevenueByPlatform[] = [];

  for (let i = days - 1; i >= 0; i--) {
    // Blog is the primary revenue driver, growing over time
    const growthFactor = 1 + ((days - i) / days) * 0.3;
    data.push({
      date: dateStr(i),
      blog: Math.round(jitter(42 * growthFactor, 12) * 100) / 100,
      youtube: Math.round(jitter(28 * growthFactor, 8) * 100) / 100,
      pinterest: Math.round(jitter(12 * growthFactor, 5) * 100) / 100,
      social: Math.round(jitter(8 * growthFactor, 4) * 100) / 100,
      email: Math.round(jitter(18 * growthFactor, 6) * 100) / 100,
    });
  }

  return data;
}

// ── Revenue by Content Format ────────────────────────────────────────

export async function getRevenueByFormat(): Promise<RevenueByFormat[]> {
  await delay();

  const formats: RevenueByFormat[] = [
    { format: 'SEO Article', revenue: 8940, percentage: 38.2 },
    { format: 'YouTube Script', revenue: 5470, percentage: 23.4 },
    { format: 'Email', revenue: 3280, percentage: 14.0 },
    { format: 'Pinterest Pin', revenue: 2640, percentage: 11.3 },
    { format: 'Social Post', revenue: 1980, percentage: 8.5 },
    { format: 'Reddit Draft', revenue: 1080, percentage: 4.6 },
  ];

  return formats;
}

// ── Gap Window Analysis ──────────────────────────────────────────────

export async function getGapWindows(days: number): Promise<GapWindowPoint[]> {
  await delay();

  const data: GapWindowPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const s = seeded(i + 100);
    const gaps = Math.round(3 + s * 8); // 3-11 gap windows per day
    const captured = Math.round(gaps * (0.3 + seeded(i + 200) * 0.4)); // 30-70% capture rate
    data.push({
      date: dateStr(i),
      gapWindows: gaps,
      captured: Math.min(captured, gaps),
    });
  }

  return data;
}

// ── ROI by Product ───────────────────────────────────────────────────

export async function getRoiData(): Promise<RoiPoint[]> {
  await delay();

  const roiProducts: RoiPoint[] = [
    { product: 'StudyAI Pro', cost: 180, revenue: 2480, roi: 1278 },
    { product: 'NoteGenius', cost: 160, revenue: 1920, roi: 1100 },
    { product: 'SkillPath AI', cost: 170, revenue: 1890, roi: 1012 },
    { product: 'QuizMaster AI', cost: 150, revenue: 1650, roi: 1000 },
    { product: 'EduFlow', cost: 200, revenue: 2150, roi: 975 },
    { product: 'TutorLens', cost: 165, revenue: 1560, roi: 845 },
    { product: 'DeckCraft AI', cost: 155, revenue: 1420, roi: 816 },
    { product: 'BrainSpark', cost: 145, revenue: 1340, roi: 824 },
    { product: 'GradeBot', cost: 140, revenue: 1180, roi: 743 },
    { product: 'MeetingMind', cost: 130, revenue: 1080, roi: 731 },
    { product: 'LessonForge', cost: 135, revenue: 980, roi: 626 },
    { product: 'PlannerPro AI', cost: 125, revenue: 920, roi: 636 },
    { product: 'FocusForge', cost: 120, revenue: 860, roi: 617 },
    { product: 'InboxZero AI', cost: 130, revenue: 780, roi: 500 },
    { product: 'ClassPilot', cost: 115, revenue: 720, roi: 526 },
  ];

  return roiProducts;
}

// ── Scoring Weight History (12 weeks) ────────────────────────────────

export async function getScoringWeightHistory(): Promise<ScoringWeightHistory[]> {
  await delay();

  const data: ScoringWeightHistory[] = [
    { date: weekStr(11), productNewness: 1.0, llmGapStrength: 1.0, buyingIntent: 1.0, affiliateAvailable: 1.0, googleGapStrength: 1.0 },
    { date: weekStr(10), productNewness: 1.0, llmGapStrength: 1.05, buyingIntent: 1.0, affiliateAvailable: 1.0, googleGapStrength: 0.95 },
    { date: weekStr(9), productNewness: 1.05, llmGapStrength: 1.05, buyingIntent: 1.0, affiliateAvailable: 0.95, googleGapStrength: 0.95 },
    { date: weekStr(8), productNewness: 1.05, llmGapStrength: 1.1, buyingIntent: 1.0, affiliateAvailable: 0.95, googleGapStrength: 0.9 },
    { date: weekStr(7), productNewness: 1.1, llmGapStrength: 1.1, buyingIntent: 1.0, affiliateAvailable: 0.9, googleGapStrength: 0.9 },
    { date: weekStr(6), productNewness: 1.1, llmGapStrength: 1.15, buyingIntent: 0.95, affiliateAvailable: 0.9, googleGapStrength: 0.9 },
    { date: weekStr(5), productNewness: 1.15, llmGapStrength: 1.15, buyingIntent: 0.95, affiliateAvailable: 0.85, googleGapStrength: 0.9 },
    { date: weekStr(4), productNewness: 1.15, llmGapStrength: 1.2, buyingIntent: 0.95, affiliateAvailable: 0.85, googleGapStrength: 0.85 },
    { date: weekStr(3), productNewness: 1.2, llmGapStrength: 1.2, buyingIntent: 0.95, affiliateAvailable: 0.85, googleGapStrength: 0.8 },
    { date: weekStr(2), productNewness: 1.2, llmGapStrength: 1.2, buyingIntent: 1.0, affiliateAvailable: 0.8, googleGapStrength: 0.8 },
    { date: weekStr(1), productNewness: 1.2, llmGapStrength: 1.25, buyingIntent: 1.0, affiliateAvailable: 0.8, googleGapStrength: 0.75 },
    { date: weekStr(0), productNewness: 1.25, llmGapStrength: 1.25, buyingIntent: 1.0, affiliateAvailable: 0.75, googleGapStrength: 0.75 },
  ];

  return data;
}
