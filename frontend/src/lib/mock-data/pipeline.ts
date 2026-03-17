export type PipelineStepStatus = 'completed' | 'running' | 'pending' | 'failed' | 'skipped';

export interface PipelineStep {
  step: number;
  name: string;
  platform: string;
  blocking: boolean;
  status: PipelineStepStatus;
  startedAt: string | null;
  completedAt: string | null;
  retries: number;
  errorMessage: string | null;
}

export interface ProductPipeline {
  id: string;
  productId: string;
  productName: string;
  triggeredAt: string;
  status: 'completed' | 'in-progress' | 'failed' | 'partial';
  steps: PipelineStep[];
  completedSteps: number;
  totalSteps: number;
}

export interface QueueItem {
  id: string;
  productId: string;
  productName: string;
  type: 'generation' | 'publishing' | 'refresh';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  details: string;
}

// ── Helpers ──────────────────────────────────────────────────────────

const delay = () => new Promise<void>((r) => setTimeout(r, 100));

const STEP_TEMPLATES: Omit<PipelineStep, 'status' | 'startedAt' | 'completedAt' | 'retries' | 'errorMessage'>[] = [
  { step: 1,  name: 'Load Product Data',       platform: 'Internal',   blocking: true },
  { step: 2,  name: 'Generate UTMs',           platform: 'Internal',   blocking: true },
  { step: 3,  name: 'Upload Image',            platform: 'CDN',        blocking: true },
  { step: 4,  name: 'Publish Blog',            platform: 'WordPress',  blocking: true },
  { step: 5,  name: 'Verify Blog Live',        platform: 'WordPress',  blocking: true },
  { step: 6,  name: 'Upload YouTube',          platform: 'YouTube',    blocking: false },
  { step: 7,  name: 'Update Blog with Video',  platform: 'WordPress',  blocking: false },
  { step: 8,  name: 'Create Pinterest Pins',   platform: 'Pinterest',  blocking: false },
  { step: 9,  name: 'Schedule Social Posts',    platform: 'Buffer',     blocking: false },
  { step: 10, name: 'Prepare Reddit Draft',     platform: 'Reddit',     blocking: false },
  { step: 11, name: 'Queue Email',             platform: 'ConvertKit', blocking: false },
  { step: 12, name: 'Update Status',           platform: 'Internal',   blocking: false },
  { step: 13, name: 'Send Notification',       platform: 'Slack',      blocking: false },
  { step: 14, name: 'Init Tracking',           platform: 'Internal',   blocking: false },
];

function makeStep(
  template: typeof STEP_TEMPLATES[number],
  status: PipelineStepStatus,
  startedAt: string | null = null,
  completedAt: string | null = null,
  retries: number = 0,
  errorMessage: string | null = null,
): PipelineStep {
  return { ...template, status, startedAt, completedAt, retries, errorMessage };
}

function allCompleted(baseTime: string): PipelineStep[] {
  const base = new Date(baseTime).getTime();
  return STEP_TEMPLATES.map((t, i) => makeStep(
    t,
    'completed',
    new Date(base + i * 120_000).toISOString(),
    new Date(base + (i + 1) * 120_000).toISOString(),
  ));
}

// ── Pipeline Data ────────────────────────────────────────────────────

const pipelines: ProductPipeline[] = [
  // 1) Completed — StudyAI Pro
  {
    id: 'pipe-001',
    productId: 'prod-001',
    productName: 'StudyAI Pro',
    triggeredAt: '2026-03-15T09:00:00Z',
    status: 'completed',
    steps: allCompleted('2026-03-15T09:00:00Z'),
    completedSteps: 14,
    totalSteps: 14,
  },
  // 2) Completed — NoteGenius
  {
    id: 'pipe-002',
    productId: 'prod-002',
    productName: 'NoteGenius',
    triggeredAt: '2026-03-14T14:30:00Z',
    status: 'completed',
    steps: allCompleted('2026-03-14T14:30:00Z'),
    completedSteps: 14,
    totalSteps: 14,
  },
  // 3) In-progress — FlashcardAI (step 8 running)
  {
    id: 'pipe-003',
    productId: 'prod-003',
    productName: 'FlashcardAI',
    triggeredAt: '2026-03-16T10:00:00Z',
    status: 'in-progress',
    steps: STEP_TEMPLATES.map((t, i) => {
      if (i < 7) return makeStep(t, 'completed', '2026-03-16T10:00:00Z', `2026-03-16T10:${String((i + 1) * 2).padStart(2, '0')}:00Z`);
      if (i === 7) return makeStep(t, 'running', '2026-03-16T10:14:00Z');
      return makeStep(t, 'pending');
    }),
    completedSteps: 7,
    totalSteps: 14,
  },
  // 4) Partial — GradeBot (steps 1-5 done, step 6 failed, 7-14 skipped)
  {
    id: 'pipe-004',
    productId: 'prod-004',
    productName: 'GradeBot',
    triggeredAt: '2026-03-15T16:00:00Z',
    status: 'partial',
    steps: STEP_TEMPLATES.map((t, i) => {
      if (i < 5) return makeStep(t, 'completed', '2026-03-15T16:00:00Z', `2026-03-15T16:${String((i + 1) * 2).padStart(2, '0')}:00Z`);
      if (i === 5) return makeStep(t, 'failed', '2026-03-15T16:10:00Z', '2026-03-15T16:12:30Z', 2, 'YouTube API quota exceeded. Upload rejected with status 403.');
      return makeStep(t, 'skipped');
    }),
    completedSteps: 5,
    totalSteps: 14,
  },
  // 5) Failed — LessonPlan AI (step 4 failed after 3 retries, 5-14 pending)
  {
    id: 'pipe-005',
    productId: 'prod-005',
    productName: 'LessonPlan AI',
    triggeredAt: '2026-03-16T08:00:00Z',
    status: 'failed',
    steps: STEP_TEMPLATES.map((t, i) => {
      if (i < 3) return makeStep(t, 'completed', '2026-03-16T08:00:00Z', `2026-03-16T08:${String((i + 1) * 2).padStart(2, '0')}:00Z`);
      if (i === 3) return makeStep(t, 'failed', '2026-03-16T08:06:00Z', '2026-03-16T08:15:00Z', 3, 'WordPress REST API returned 502 Bad Gateway. All 3 retry attempts exhausted.');
      return makeStep(t, 'pending');
    }),
    completedSteps: 3,
    totalSteps: 14,
  },
  // 6) In-progress — TaskFlow Pro (step 3 running)
  {
    id: 'pipe-006',
    productId: 'prod-006',
    productName: 'TaskFlow Pro',
    triggeredAt: '2026-03-16T11:30:00Z',
    status: 'in-progress',
    steps: STEP_TEMPLATES.map((t, i) => {
      if (i < 2) return makeStep(t, 'completed', '2026-03-16T11:30:00Z', `2026-03-16T11:${30 + (i + 1) * 2}:00Z`);
      if (i === 2) return makeStep(t, 'running', '2026-03-16T11:34:00Z');
      return makeStep(t, 'pending');
    }),
    completedSteps: 2,
    totalSteps: 14,
  },
];

// ── Queue Data ───────────────────────────────────────────────────────

const queue: QueueItem[] = [
  {
    id: 'q-001', productId: 'prod-007', productName: 'QuizMaster AI',
    type: 'generation', status: 'processing', priority: 'high',
    createdAt: '2026-03-16T12:00:00Z', startedAt: '2026-03-16T12:01:00Z', completedAt: null,
    details: 'Generating SEO article and YouTube script via Claude API',
  },
  {
    id: 'q-002', productId: 'prod-008', productName: 'EssayCoach',
    type: 'publishing', status: 'queued', priority: 'high',
    createdAt: '2026-03-16T11:50:00Z', startedAt: null, completedAt: null,
    details: 'Blog post ready for WordPress publishing pipeline',
  },
  {
    id: 'q-003', productId: 'prod-001', productName: 'StudyAI Pro',
    type: 'refresh', status: 'queued', priority: 'medium',
    createdAt: '2026-03-16T11:30:00Z', startedAt: null, completedAt: null,
    details: 'Content refresh triggered — SERP position dropped from #5 to #9',
  },
  {
    id: 'q-004', productId: 'prod-009', productName: 'PlagiarismGuard',
    type: 'generation', status: 'completed', priority: 'medium',
    createdAt: '2026-03-16T09:00:00Z', startedAt: '2026-03-16T09:02:00Z', completedAt: '2026-03-16T09:18:00Z',
    details: 'All 6 content formats generated successfully',
  },
  {
    id: 'q-005', productId: 'prod-010', productName: 'FocusTimer',
    type: 'publishing', status: 'failed', priority: 'high',
    createdAt: '2026-03-16T08:00:00Z', startedAt: '2026-03-16T08:01:00Z', completedAt: '2026-03-16T08:05:00Z',
    details: 'WordPress publish failed — authentication token expired',
  },
  {
    id: 'q-006', productId: 'prod-002', productName: 'NoteGenius',
    type: 'refresh', status: 'completed', priority: 'low',
    createdAt: '2026-03-15T20:00:00Z', startedAt: '2026-03-15T20:05:00Z', completedAt: '2026-03-15T20:22:00Z',
    details: 'Monthly content refresh — updated pricing and feature tables',
  },
  {
    id: 'q-007', productId: 'prod-011', productName: 'SlideGenius',
    type: 'generation', status: 'queued', priority: 'medium',
    createdAt: '2026-03-16T12:10:00Z', startedAt: null, completedAt: null,
    details: 'Product brief approved — awaiting content generation slot',
  },
  {
    id: 'q-008', productId: 'prod-003', productName: 'FlashcardAI',
    type: 'publishing', status: 'processing', priority: 'medium',
    createdAt: '2026-03-16T10:00:00Z', startedAt: '2026-03-16T10:00:30Z', completedAt: null,
    details: 'Publishing pipeline in progress — step 8 of 14',
  },
  {
    id: 'q-009', productId: 'prod-012', productName: 'ResearchPal',
    type: 'generation', status: 'queued', priority: 'low',
    createdAt: '2026-03-16T12:15:00Z', startedAt: null, completedAt: null,
    details: 'Queued for content generation — score 19/25',
  },
  {
    id: 'q-010', productId: 'prod-005', productName: 'LessonPlan AI',
    type: 'publishing', status: 'failed', priority: 'high',
    createdAt: '2026-03-16T08:00:00Z', startedAt: '2026-03-16T08:00:30Z', completedAt: '2026-03-16T08:15:00Z',
    details: 'Pipeline failed at step 4 — WordPress 502 error after 3 retries',
  },
];

// ── Exports ──────────────────────────────────────────────────────────

export async function getPipelines(): Promise<ProductPipeline[]> {
  await delay();
  return pipelines;
}

export async function getQueue(): Promise<QueueItem[]> {
  await delay();
  return queue;
}
