import type { WeeklyReport } from '../types/domain';

const delay = () => new Promise<void>((r) => setTimeout(r, 100));

const reports: WeeklyReport[] = [
  {
    id: 'rpt-001',
    period: 'Mar 10 - Mar 16, 2026',
    weekNumber: 11,
    type: 'weekly',
    totalRevenue: 3420,
    revenueChange: 8.5,
    topProduct: 'StudyAI Pro',
    productsScored: 42,
    contentPublished: 9,
    summary:
      'Strong week driven by StudyAI Pro and EduFlow YouTube performance. SERP Gap Scanner discovered 18 new opportunities. Reddit feed remains down due to API auth issues. QuizMaster AI climbed to SERP position 3, driving a 22% increase in organic clicks.',
    generatedAt: '2026-03-17T06:00:00Z',
  },
  {
    id: 'rpt-002',
    period: 'Mar 3 - Mar 9, 2026',
    weekNumber: 10,
    type: 'weekly',
    totalRevenue: 3154,
    revenueChange: 12.3,
    topProduct: 'StudyAI Pro',
    productsScored: 38,
    contentPublished: 11,
    summary:
      'Content output hit a high of 11 pieces published. NoteGenius YouTube comparison video drove significant traffic. Two new products (ExamReady, SlideScribe) entered the pipeline. Scoring weights adjusted: commission rate weight increased to 1.25x.',
    generatedAt: '2026-03-10T06:00:00Z',
  },
  {
    id: 'rpt-003',
    period: 'Feb 24 - Mar 2, 2026',
    weekNumber: 9,
    type: 'weekly',
    totalRevenue: 2810,
    revenueChange: 6.8,
    topProduct: 'EduFlow',
    productsScored: 35,
    contentPublished: 8,
    summary:
      'EduFlow took the top spot this week with strong YouTube performance (15K views on comparison video). DeckCraft AI and FocusForge content went live. KGR Weak-Spot Finder had the highest average score across all feeds at 18.2.',
    generatedAt: '2026-03-03T06:00:00Z',
  },
  {
    id: 'rpt-004',
    period: 'Feb 17 - Feb 23, 2026',
    weekNumber: 8,
    type: 'weekly',
    totalRevenue: 2632,
    revenueChange: 15.1,
    topProduct: 'StudyAI Pro',
    productsScored: 30,
    contentPublished: 10,
    summary:
      'Biggest revenue jump in 4 weeks (+15.1%). StudyAI Pro YouTube review hit 12K views. GradeBot and PlannerPro AI content published. Pinterest pins showing improved click-through rates after visual format changes.',
    generatedAt: '2026-02-24T06:00:00Z',
  },
  {
    id: 'rpt-005',
    period: 'Feb 10 - Feb 16, 2026',
    weekNumber: 7,
    type: 'weekly',
    totalRevenue: 2286,
    revenueChange: 4.2,
    topProduct: 'NoteGenius',
    productsScored: 28,
    contentPublished: 7,
    summary:
      'Steady growth week. NoteGenius social post went viral on Twitter with 2.1K impressions. BrainSpark and LessonForge content pipeline expanding. Email campaigns showing 7.8% average CTR across all products.',
    generatedAt: '2026-02-17T06:00:00Z',
  },
  {
    id: 'rpt-006',
    period: 'Feb 3 - Feb 9, 2026',
    weekNumber: 6,
    type: 'weekly',
    totalRevenue: 2194,
    revenueChange: -2.1,
    topProduct: 'StudyAI Pro',
    productsScored: 25,
    contentPublished: 6,
    summary:
      'Slight dip after the January surge. Content output was lower due to Claude API rate limits. EduFlow and SkillPath AI articles published. Two products dropped below the 18-point threshold after re-scoring.',
    generatedAt: '2026-02-10T06:00:00Z',
  },
  {
    id: 'rpt-007',
    period: 'Jan 27 - Feb 2, 2026',
    weekNumber: 5,
    type: 'weekly',
    totalRevenue: 2240,
    revenueChange: 18.4,
    topProduct: 'QuizMaster AI',
    productsScored: 22,
    contentPublished: 9,
    summary:
      'Outstanding week. QuizMaster AI review article ranked on page 1 for target keyword. YouTube channel crossed 5K total views. 3 new products added from SERP Gap Scanner. Affiliate commission payments of $1,890 received.',
    generatedAt: '2026-02-03T06:00:00Z',
  },
  {
    id: 'rpt-008',
    period: 'Jan 20 - Jan 26, 2026',
    weekNumber: 4,
    type: 'weekly',
    totalRevenue: 1892,
    revenueChange: 22.6,
    topProduct: 'StudyAI Pro',
    productsScored: 18,
    contentPublished: 8,
    summary:
      'First week with all 8 feeds operational. StudyAI Pro and NoteGenius emerging as top performers. Initial Pinterest strategy showing promise. Total tracked products reached 20.',
    generatedAt: '2026-01-27T06:00:00Z',
  },
  {
    id: 'rpt-009',
    period: 'Jan 13 - Jan 19, 2026',
    weekNumber: 3,
    type: 'weekly',
    totalRevenue: 1544,
    revenueChange: 34.8,
    topProduct: 'SkillPath AI',
    productsScored: 14,
    contentPublished: 6,
    summary:
      'Rapid growth as content engine ramps up. SkillPath AI article published and immediately ranked position 12. 5 new products discovered and scored. YouTube channel launched with first 2 videos.',
    generatedAt: '2026-01-20T06:00:00Z',
  },
  {
    id: 'rpt-010',
    period: 'Jan 6 - Jan 12, 2026',
    weekNumber: 2,
    type: 'weekly',
    totalRevenue: 1145,
    revenueChange: 42.0,
    topProduct: 'StudyAI Pro',
    productsScored: 10,
    contentPublished: 4,
    summary:
      'Platform launched with initial product set. First affiliate commissions earned. Blog posts for StudyAI Pro and NoteGenius published. SERP Gap Scanner and GSC Miner producing first results.',
    generatedAt: '2026-01-13T06:00:00Z',
  },
  // ── Monthly Reports ────────────────────────────────────────────────
  {
    id: 'rpt-011',
    period: 'February 2026',
    weekNumber: 0,
    type: 'monthly',
    totalRevenue: 9362,
    revenueChange: 16.2,
    topProduct: 'StudyAI Pro',
    productsScored: 128,
    contentPublished: 34,
    summary:
      'February saw consistent growth across all channels. Blog remained the top revenue driver (38% of total). YouTube channel reached 52K total views. 8 new products entered the pipeline. Scoring engine adjusted weights twice based on performance data. Total active affiliate programs: 12.',
    generatedAt: '2026-03-01T06:00:00Z',
  },
  {
    id: 'rpt-012',
    period: 'January 2026',
    weekNumber: 0,
    type: 'monthly',
    totalRevenue: 4821,
    revenueChange: 0,
    topProduct: 'StudyAI Pro',
    productsScored: 64,
    contentPublished: 18,
    summary:
      'Launch month. Platform went live January 6th. Established content publishing pipeline with 18 pieces across 5 formats. 10 products scored above the 18-point threshold. First affiliate payments received totalling $3,240. Set up all 8 intelligence feeds with 6 reaching healthy status by month end.',
    generatedAt: '2026-02-01T06:00:00Z',
  },
];

export async function getReports(): Promise<WeeklyReport[]> {
  await delay();
  return reports;
}
