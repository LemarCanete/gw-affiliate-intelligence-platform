import type {
  Product,
  ContentAsset,
  ContentBrief,
  ContentFormat,
  ContentIntent,
  Platform,
  PublishStatus,
} from '../types/domain';

// ── Helpers ──────────────────────────────────────────────────────────

const delay = () => new Promise<void>((r) => setTimeout(r, 100));

function asset(
  id: string,
  productId: string,
  format: ContentFormat,
  title: string,
  intent: ContentIntent,
  status: PublishStatus,
  platform: Platform,
  url: string | null,
  publishedAt: string | null,
  views: number,
  clicks: number,
  revenue: number,
): ContentAsset {
  return { id, productId, format, title, intent, status, platform, url, publishedAt, views, clicks, revenue };
}

// ── Product Catalogue (25 AI/SaaS education & productivity tools) ───

const products: Product[] = [
  {
    id: 'prod-001', name: 'StudyAI Pro', description: 'AI-powered study planner that adapts to learning styles and exam schedules.', category: 'Education - Study Tools',
    score: { productNewness: 5, llmGapStrength: 4, buyingIntent: 5, affiliateAvailable: 5, googleGapStrength: 4, total: 23 },
    status: 'published', revenue: 2480, serpPosition: 5, geoScore: 88, source: 'serp-gap', gapStatus: 'double-gap', intent: 'review', launchedAt: '2026-02-20',
    llmTestResults: [
      { engine: 'chatgpt', query: 'StudyAI Pro review', responseType: 'vague', citedSources: [], testedAt: '2026-03-10T10:00:00Z' },
      { engine: 'perplexity', query: 'best AI study planner 2026', responseType: 'no-info', citedSources: [], testedAt: '2026-03-10T10:05:00Z' },
      { engine: 'gemini', query: 'StudyAI Pro vs traditional planners', responseType: 'vague', citedSources: [], testedAt: '2026-03-11T08:00:00Z' },
    ],
    contentBriefs: [
      { id: 'cb-001a', productId: 'prod-001', targetQuery: 'StudyAI Pro review 2026', intent: 'review', llmCurrentAnswer: 'ChatGPT provides vague info about AI study tools but does not mention StudyAI Pro specifically.', googleLandscape: 'Only 2 thin articles from low-DA sites. No comprehensive review exists.', affiliateLink: 'https://studyai.pro/ref/gw', wordCount: 2800, structureOutline: ['Introduction', 'Key Features', 'Pricing', 'Pros & Cons', 'Verdict'], status: 'published', createdAt: '2026-02-01' },
      { id: 'cb-001b', productId: 'prod-001', targetQuery: 'best AI study planner for college', intent: 'comparison', llmCurrentAnswer: 'No specific tools mentioned by any LLM engine.', googleLandscape: 'Forum posts only, no proper comparison articles.', affiliateLink: 'https://studyai.pro/ref/gw', wordCount: 3200, structureOutline: ['Introduction', 'Top 5 AI Study Planners', 'Feature Comparison Table', 'Best For Each Use Case', 'Conclusion'], status: 'approved', createdAt: '2026-02-15' },
    ],
    affiliateProgram: { network: 'PartnerStack', commission: '30% recurring', cookieDuration: '90 days', paymentTerms: 'Net 30' },
    contentAssets: [
      asset('ca-001a', 'prod-001', 'seo-article', 'StudyAI Pro Review: The AI Study Planner That Actually Works', 'review', 'published', 'blog', 'https://gwaffiliates.com/studyai-pro-review', '2026-02-10', 4820, 312, 1240),
      asset('ca-001b', 'prod-001', 'youtube-script', 'I Tried StudyAI Pro for 30 Days - Honest Review', 'review', 'published', 'youtube', 'https://youtube.com/watch?v=abc123', '2026-02-14', 12400, 580, 870),
      asset('ca-001c', 'prod-001', 'pinterest-pin', 'StudyAI Pro - Transform Your Study Habits', 'informational', 'published', 'pinterest', 'https://pin.it/xyz1', '2026-02-12', 3200, 95, 190),
      asset('ca-001d', 'prod-001', 'email', 'This AI study tool boosted my productivity 3x', 'review', 'published', 'email', null, '2026-02-16', 1800, 142, 180),
    ],
    discoveredAt: '2026-01-28', lastUpdated: '2026-03-15',
  },
  {
    id: 'prod-002', name: 'NoteGenius', description: 'Transforms lecture recordings into structured notes with AI summarisation.', category: 'Education - Note Taking',
    score: { productNewness: 4, llmGapStrength: 4, buyingIntent: 5, affiliateAvailable: 5, googleGapStrength: 4, total: 22 },
    status: 'published', revenue: 1920, serpPosition: 8, geoScore: 82, source: 'gsc-miner', gapStatus: 'double-gap', intent: 'comparison', launchedAt: '2026-01-15',
    llmTestResults: [
      { engine: 'chatgpt', query: 'NoteGenius AI review', responseType: 'vague', citedSources: [], testedAt: '2026-03-08T09:00:00Z' },
      { engine: 'perplexity', query: 'NoteGenius vs Notion AI for students', responseType: 'no-info', citedSources: [], testedAt: '2026-03-08T09:10:00Z' },
      { engine: 'copilot', query: 'best AI note taking app', responseType: 'generic', citedSources: ['notion.so'], testedAt: '2026-03-09T14:00:00Z' },
    ],
    contentBriefs: [
      { id: 'cb-002a', productId: 'prod-002', targetQuery: 'NoteGenius vs Notion AI', intent: 'comparison', llmCurrentAnswer: 'Copilot mentions Notion AI but not NoteGenius.', googleLandscape: 'Only forums discussing note-taking apps. No head-to-head comparison.', affiliateLink: 'https://notegenius.ai/ref/gw', wordCount: 3000, structureOutline: ['Introduction', 'NoteGenius Overview', 'Notion AI Overview', 'Feature Comparison', 'Pricing', 'Verdict'], status: 'published', createdAt: '2026-01-25' },
    ],
    affiliateProgram: { network: 'Impact', commission: '35% recurring', cookieDuration: '60 days', paymentTerms: 'Net 30' },
    contentAssets: [
      asset('ca-002a', 'prod-002', 'seo-article', 'NoteGenius Review: AI Note-Taking for Students', 'review', 'published', 'blog', 'https://gwaffiliates.com/notegenius-review', '2026-02-05', 3980, 256, 960),
      asset('ca-002b', 'prod-002', 'youtube-script', 'NoteGenius vs Notion AI - Which Is Better for Students?', 'comparison', 'published', 'youtube', 'https://youtube.com/watch?v=def456', '2026-02-18', 8900, 420, 630),
      asset('ca-002c', 'prod-002', 'social-post', 'How NoteGenius changed my lecture workflow', 'informational', 'published', 'social', 'https://twitter.com/gwaff/status/123', '2026-02-08', 2100, 78, 330),
    ],
    discoveredAt: '2026-01-20', lastUpdated: '2026-03-14',
  },
  {
    id: 'prod-003', name: 'QuizMaster AI', description: 'Generates adaptive practice quizzes from any study material using spaced repetition.', category: 'Education - Assessment',
    score: { productNewness: 4, llmGapStrength: 3, buyingIntent: 4, affiliateAvailable: 4, googleGapStrength: 5, total: 20 },
    status: 'published', revenue: 1650, serpPosition: 3, geoScore: 91, source: 'kgr-weakspot', gapStatus: 'google-only', intent: 'how-to', launchedAt: '2026-01-05',
    llmTestResults: [
      { engine: 'chatgpt', query: 'how to create AI quizzes from study notes', responseType: 'generic', citedSources: ['quizlet.com'], testedAt: '2026-03-05T11:00:00Z' },
      { engine: 'gemini', query: 'QuizMaster AI review', responseType: 'generic', citedSources: [], testedAt: '2026-03-05T11:15:00Z' },
      { engine: 'perplexity', query: 'best AI quiz generator 2026', responseType: 'vague', citedSources: [], testedAt: '2026-03-06T09:00:00Z' },
      { engine: 'copilot', query: 'QuizMaster AI for exam prep', responseType: 'no-info', citedSources: [], testedAt: '2026-03-06T09:20:00Z' },
    ],
    contentBriefs: [
      { id: 'cb-003a', productId: 'prod-003', targetQuery: 'how to generate practice quizzes with AI', intent: 'how-to', llmCurrentAnswer: 'ChatGPT generically mentions Quizlet but no specific AI quiz generators.', googleLandscape: 'No real content exists for this query. Only DA90+ thin listicles.', affiliateLink: 'https://quizmaster.ai/ref/gw', wordCount: 2500, structureOutline: ['Introduction', 'Step-by-Step Guide', 'Tips for Better Quizzes', 'QuizMaster AI Walkthrough', 'Conclusion'], status: 'published', createdAt: '2026-01-20' },
    ],
    affiliateProgram: { network: 'ShareASale', commission: '25% recurring', cookieDuration: '45 days', paymentTerms: 'Net 45' },
    contentAssets: [
      asset('ca-003a', 'prod-003', 'seo-article', 'QuizMaster AI Review: Smarter Practice Tests in Minutes', 'review', 'published', 'blog', 'https://gwaffiliates.com/quizmaster-ai-review', '2026-01-30', 5620, 390, 1050),
      asset('ca-003b', 'prod-003', 'reddit-draft', 'Has anyone tried QuizMaster AI for exam prep?', 'how-to', 'draft', 'reddit', null, null, 0, 0, 0),
      asset('ca-003c', 'prod-003', 'pinterest-pin', 'AI Quiz Generator for Students', 'informational', 'published', 'pinterest', 'https://pin.it/xyz2', '2026-02-02', 4100, 128, 320),
      asset('ca-003d', 'prod-003', 'email', 'Generate 100 practice questions in 60 seconds', 'how-to', 'published', 'email', null, '2026-02-06', 2200, 168, 280),
    ],
    discoveredAt: '2026-01-15', lastUpdated: '2026-03-12',
  },
  {
    id: 'prod-004', name: 'GradeBot', description: 'AI teaching assistant that auto-grades assignments and provides personalised feedback.', category: 'Education - Grading',
    score: { productNewness: 3, llmGapStrength: 4, buyingIntent: 4, affiliateAvailable: 5, googleGapStrength: 3, total: 19 },
    status: 'published', revenue: 1180, serpPosition: 12, geoScore: 74, source: 'ai-proxy', gapStatus: 'llm-only', intent: 'review', launchedAt: '2025-12-15',
    llmTestResults: [
      { engine: 'chatgpt', query: 'GradeBot AI grading tool', responseType: 'vague', citedSources: [], testedAt: '2026-03-07T10:00:00Z' },
      { engine: 'perplexity', query: 'best AI grading software for teachers', responseType: 'vague', citedSources: [], testedAt: '2026-03-07T10:10:00Z' },
    ],
    contentBriefs: [
      { id: 'cb-004a', productId: 'prod-004', targetQuery: 'GradeBot review for teachers', intent: 'review', llmCurrentAnswer: 'Both ChatGPT and Perplexity give vague answers about AI grading.', googleLandscape: 'Some competition from education blogs but no in-depth review.', affiliateLink: 'https://gradebot.ai/ref/gw', wordCount: 2600, structureOutline: ['Introduction', 'How GradeBot Works', 'Accuracy Testing', 'Pricing', 'Verdict'], status: 'published', createdAt: '2026-02-05' },
    ],
    affiliateProgram: { network: 'PartnerStack', commission: '40% recurring', cookieDuration: '60 days', paymentTerms: 'Net 30' },
    contentAssets: [
      asset('ca-004a', 'prod-004', 'seo-article', 'GradeBot Review: Is AI Grading Finally Ready?', 'review', 'published', 'blog', 'https://gwaffiliates.com/gradebot-review', '2026-02-20', 2800, 185, 720),
      asset('ca-004b', 'prod-004', 'youtube-script', 'GradeBot Demo: AI Grading in Real Time', 'how-to', 'scheduled', 'youtube', null, null, 0, 0, 0),
      asset('ca-004c', 'prod-004', 'social-post', 'Teachers: GradeBot just saved me 10 hours/week', 'informational', 'published', 'social', 'https://twitter.com/gwaff/status/456', '2026-02-22', 1600, 62, 460),
    ],
    discoveredAt: '2026-02-01', lastUpdated: '2026-03-13',
  },
  {
    id: 'prod-005', name: 'LessonForge', description: 'AI lesson plan generator aligned with curriculum standards for K-12 teachers.', category: 'Education - Lesson Planning',
    score: { productNewness: 4, llmGapStrength: 4, buyingIntent: 4, affiliateAvailable: 4, googleGapStrength: 4, total: 20 },
    status: 'published', revenue: 980, serpPosition: 15, geoScore: 68, source: 'pseo-engine', gapStatus: 'double-gap', intent: 'how-to', launchedAt: '2026-01-10',
    llmTestResults: [
      { engine: 'chatgpt', query: 'LessonForge AI lesson plan generator', responseType: 'no-info', citedSources: [], testedAt: '2026-03-04T15:00:00Z' },
      { engine: 'gemini', query: 'best AI lesson plan tool for teachers', responseType: 'vague', citedSources: [], testedAt: '2026-03-04T15:10:00Z' },
    ],
    contentBriefs: [
      { id: 'cb-005a', productId: 'prod-005', targetQuery: 'how to create AI lesson plans', intent: 'how-to', llmCurrentAnswer: 'No LLM mentions LessonForge.', googleLandscape: 'Only forum threads from teachers. No structured guides.', affiliateLink: 'https://lessonforge.io/ref/gw', wordCount: 2400, structureOutline: ['Introduction', 'Setting Up LessonForge', 'Choosing Standards', 'Generating Plans', 'Conclusion'], status: 'in-production', createdAt: '2026-02-10' },
    ],
    affiliateProgram: { network: 'CJ Affiliate', commission: '20% recurring', cookieDuration: '30 days', paymentTerms: 'Net 45' },
    contentAssets: [
      asset('ca-005a', 'prod-005', 'seo-article', 'LessonForge Review: AI Lesson Plans Aligned to Standards', 'review', 'published', 'blog', 'https://gwaffiliates.com/lessonforge-review', '2026-02-15', 3100, 198, 580),
      asset('ca-005b', 'prod-005', 'pinterest-pin', 'Create Lesson Plans in Seconds with AI', 'how-to', 'published', 'pinterest', 'https://pin.it/xyz3', '2026-02-17', 2800, 86, 210),
      asset('ca-005c', 'prod-005', 'email', 'K-12 teachers: this tool writes your lesson plans', 'how-to', 'published', 'email', null, '2026-02-20', 1400, 95, 190),
    ],
    discoveredAt: '2026-01-25', lastUpdated: '2026-03-10',
  },
  {
    id: 'prod-006', name: 'EduFlow', description: 'All-in-one LMS with AI-powered course creation and student analytics.', category: 'Education - LMS',
    score: { productNewness: 2, llmGapStrength: 3, buyingIntent: 5, affiliateAvailable: 4, googleGapStrength: 3, total: 17 },
    status: 'published', revenue: 2150, serpPosition: 18, geoScore: 65, source: 'yt-blog-overlap', gapStatus: 'closing', intent: 'comparison', launchedAt: '2025-09-20',
    llmTestResults: [
      { engine: 'chatgpt', query: 'EduFlow LMS review', responseType: 'generic', citedSources: ['g2.com'], testedAt: '2026-03-06T12:00:00Z' },
      { engine: 'perplexity', query: 'EduFlow vs Teachable vs Thinkific', responseType: 'generic', citedSources: ['techcrunch.com'], testedAt: '2026-03-06T12:10:00Z' },
      { engine: 'copilot', query: 'best LMS for solo course creators', responseType: 'detailed', citedSources: ['teachable.com', 'thinkific.com'], testedAt: '2026-03-07T09:00:00Z' },
    ],
    contentBriefs: [
      { id: 'cb-006a', productId: 'prod-006', targetQuery: 'EduFlow vs Teachable vs Thinkific', intent: 'comparison', llmCurrentAnswer: 'Copilot mentions Teachable and Thinkific but not EduFlow.', googleLandscape: 'Thin DA90+ articles. Some competition but no comprehensive comparison.', affiliateLink: 'https://eduflow.com/ref/gw', wordCount: 3500, structureOutline: ['Introduction', 'EduFlow Overview', 'Teachable Overview', 'Thinkific Overview', 'Feature Comparison', 'Pricing'], status: 'published', createdAt: '2026-01-20' },
    ],
    affiliateProgram: { network: 'Impact', commission: '25% recurring', cookieDuration: '90 days', paymentTerms: 'Net 30' },
    contentAssets: [
      asset('ca-006a', 'prod-006', 'seo-article', 'EduFlow Review: The LMS Built for Solo Course Creators', 'review', 'published', 'blog', 'https://gwaffiliates.com/eduflow-review', '2026-02-08', 4200, 278, 1100),
      asset('ca-006b', 'prod-006', 'youtube-script', 'EduFlow vs Teachable vs Thinkific - Full Comparison', 'comparison', 'published', 'youtube', 'https://youtube.com/watch?v=ghi789', '2026-02-22', 15200, 720, 850),
      asset('ca-006c', 'prod-006', 'social-post', 'Built my first course in 2 hours with EduFlow AI', 'informational', 'published', 'social', 'https://twitter.com/gwaff/status/789', '2026-02-10', 3400, 124, 200),
    ],
    discoveredAt: '2026-01-18', lastUpdated: '2026-03-16',
  },
  {
    id: 'prod-007', name: 'BrainSpark', description: 'AI flashcard generator with visual mnemonics and collaborative study rooms.', category: 'Education - Flashcards',
    score: { productNewness: 5, llmGapStrength: 5, buyingIntent: 4, affiliateAvailable: 5, googleGapStrength: 5, total: 24 },
    status: 'published', revenue: 1340, serpPosition: 7, geoScore: 85, source: 'youtube-comments', gapStatus: 'double-gap', intent: 'comparison', launchedAt: '2026-02-25',
    llmTestResults: [
      { engine: 'chatgpt', query: 'BrainSpark AI flashcards review', responseType: 'no-info', citedSources: [], testedAt: '2026-03-12T10:00:00Z' },
      { engine: 'perplexity', query: 'BrainSpark vs Anki', responseType: 'no-info', citedSources: [], testedAt: '2026-03-12T10:05:00Z' },
      { engine: 'gemini', query: 'best AI flashcard app 2026', responseType: 'vague', citedSources: [], testedAt: '2026-03-13T08:00:00Z' },
      { engine: 'copilot', query: 'AI flashcards with visual mnemonics', responseType: 'no-info', citedSources: [], testedAt: '2026-03-13T08:15:00Z' },
    ],
    contentBriefs: [
      { id: 'cb-007a', productId: 'prod-007', targetQuery: 'BrainSpark vs Anki comparison', intent: 'comparison', llmCurrentAnswer: 'No LLM has any information about BrainSpark.', googleLandscape: 'No real content. Only Anki-related pages appear.', affiliateLink: 'https://brainspark.app/ref/gw', wordCount: 2800, structureOutline: ['Introduction', 'BrainSpark Features', 'Anki Features', 'Head-to-Head', 'Verdict'], status: 'published', createdAt: '2026-03-01' },
    ],
    affiliateProgram: { network: 'Awin', commission: '30% recurring', cookieDuration: '45 days', paymentTerms: 'Net 30' },
    contentAssets: [
      asset('ca-007a', 'prod-007', 'seo-article', 'BrainSpark Review: AI Flashcards That Actually Stick', 'review', 'published', 'blog', 'https://gwaffiliates.com/brainspark-review', '2026-02-12', 3600, 234, 680),
      asset('ca-007b', 'prod-007', 'youtube-script', 'BrainSpark vs Anki: Which AI Flashcard App Wins?', 'comparison', 'published', 'youtube', 'https://youtube.com/watch?v=jkl012', '2026-02-26', 9800, 460, 440),
      asset('ca-007c', 'prod-007', 'reddit-draft', 'BrainSpark just launched visual mnemonics - game changer', 'informational', 'draft', 'reddit', null, null, 0, 0, 0),
      asset('ca-007d', 'prod-007', 'pinterest-pin', 'AI Flashcards with Visual Memory Aids', 'informational', 'published', 'pinterest', 'https://pin.it/xyz4', '2026-02-14', 2500, 72, 220),
    ],
    discoveredAt: '2026-02-03', lastUpdated: '2026-03-15',
  },
  {
    id: 'prod-008', name: 'ClassPilot', description: 'AI classroom management tool with behaviour tracking and parent communication.', category: 'Education - Classroom Management',
    score: { productNewness: 5, llmGapStrength: 5, buyingIntent: 3, affiliateAvailable: 4, googleGapStrength: 5, total: 22 },
    status: 'published', revenue: 720, serpPosition: 22, geoScore: 58, source: 'reddit-miner', gapStatus: 'double-gap', intent: 'informational', launchedAt: '2026-03-01',
    llmTestResults: [
      { engine: 'chatgpt', query: 'ClassPilot classroom management AI', responseType: 'no-info', citedSources: [], testedAt: '2026-03-14T09:00:00Z' },
      { engine: 'gemini', query: 'AI classroom behaviour tracking', responseType: 'no-info', citedSources: [], testedAt: '2026-03-14T09:10:00Z' },
    ],
    contentBriefs: [
      { id: 'cb-008a', productId: 'prod-008', targetQuery: 'AI classroom management tools', intent: 'informational', llmCurrentAnswer: 'No LLM mentions ClassPilot.', googleLandscape: 'No real content exists.', affiliateLink: 'https://classpilot.io/ref/gw', wordCount: 2200, structureOutline: ['Introduction', 'ClassPilot Features', 'Real Teacher Results', 'Getting Started'], status: 'approved', createdAt: '2026-03-05' },
    ],
    affiliateProgram: { network: 'PartnerStack', commission: '25% recurring', cookieDuration: '60 days', paymentTerms: 'Net 45' },
    contentAssets: [
      asset('ca-008a', 'prod-008', 'seo-article', 'ClassPilot Review: AI-Powered Classroom Management', 'review', 'published', 'blog', 'https://gwaffiliates.com/classpilot-review', '2026-02-25', 1800, 118, 420),
      asset('ca-008b', 'prod-008', 'email', 'The AI classroom tool teachers are raving about', 'informational', 'published', 'email', null, '2026-03-01', 1100, 74, 300),
    ],
    discoveredAt: '2026-02-10', lastUpdated: '2026-03-11',
  },
  {
    id: 'prod-009', name: 'TutorLens', description: 'AI-driven tutoring marketplace matching students with specialised AI + human tutors.', category: 'Education - Tutoring',
    score: { productNewness: 3, llmGapStrength: 3, buyingIntent: 5, affiliateAvailable: 5, googleGapStrength: 3, total: 19 },
    status: 'published', revenue: 1560, serpPosition: 10, geoScore: 78, source: 'serp-gap', gapStatus: 'closing', intent: 'comparison', launchedAt: '2025-12-01',
    llmTestResults: [
      { engine: 'chatgpt', query: 'TutorLens AI tutoring review', responseType: 'generic', citedSources: [], testedAt: '2026-03-05T14:00:00Z' },
      { engine: 'perplexity', query: 'AI tutoring vs human tutoring', responseType: 'detailed', citedSources: ['khanacademy.org', 'wyzant.com'], testedAt: '2026-03-05T14:10:00Z' },
      { engine: 'gemini', query: 'best AI tutoring platform 2026', responseType: 'generic', citedSources: ['khanacademy.org'], testedAt: '2026-03-06T10:00:00Z' },
    ],
    contentBriefs: [
      { id: 'cb-009a', productId: 'prod-009', targetQuery: 'AI tutoring vs human tutoring', intent: 'comparison', llmCurrentAnswer: 'Perplexity cites Khan Academy and Wyzant but not TutorLens.', googleLandscape: 'Some competition. Gap is narrowing.', affiliateLink: 'https://tutorlens.com/ref/gw', wordCount: 3000, structureOutline: ['Introduction', 'AI Tutoring Pros & Cons', 'TutorLens Hybrid Approach', 'Results', 'Conclusion'], status: 'published', createdAt: '2026-02-10' },
    ],
    affiliateProgram: { network: 'Impact', commission: '35% first month', cookieDuration: '30 days', paymentTerms: 'Net 30' },
    contentAssets: [
      asset('ca-009a', 'prod-009', 'seo-article', 'TutorLens Review: AI + Human Tutoring Combined', 'review', 'published', 'blog', 'https://gwaffiliates.com/tutorlens-review', '2026-02-18', 3400, 220, 780),
      asset('ca-009b', 'prod-009', 'youtube-script', 'Is AI Tutoring Better Than Human Tutoring? TutorLens Test', 'comparison', 'published', 'youtube', 'https://youtube.com/watch?v=mno345', '2026-03-02', 7600, 350, 520),
      asset('ca-009c', 'prod-009', 'social-post', 'My daughter improved 2 grade levels with TutorLens', 'informational', 'published', 'social', 'https://twitter.com/gwaff/status/101', '2026-02-20', 4800, 180, 260),
    ],
    discoveredAt: '2026-02-05', lastUpdated: '2026-03-14',
  },
  {
    id: 'prod-010', name: 'SkillPath AI', description: 'Personalised learning roadmap generator for upskilling in tech and business.', category: 'Productivity - Learning',
    score: { productNewness: 4, llmGapStrength: 4, buyingIntent: 4, affiliateAvailable: 4, googleGapStrength: 5, total: 21 },
    status: 'published', revenue: 1890, serpPosition: 6, geoScore: 92, source: 'gsc-miner', gapStatus: 'double-gap', intent: 'how-to', launchedAt: '2026-01-20',
    llmTestResults: [
      { engine: 'chatgpt', query: 'SkillPath AI learning roadmap', responseType: 'vague', citedSources: [], testedAt: '2026-03-09T10:00:00Z' },
      { engine: 'perplexity', query: 'best AI learning roadmap generator', responseType: 'vague', citedSources: [], testedAt: '2026-03-09T10:15:00Z' },
      { engine: 'copilot', query: 'personalised AI upskilling tool', responseType: 'no-info', citedSources: [], testedAt: '2026-03-10T08:00:00Z' },
    ],
    contentBriefs: [
      { id: 'cb-010a', productId: 'prod-010', targetQuery: 'how to create a personalised learning roadmap with AI', intent: 'how-to', llmCurrentAnswer: 'ChatGPT gives vague suggestions but no specific tools.', googleLandscape: 'No real content. Only generic career advice.', affiliateLink: 'https://skillpath.ai/ref/gw', wordCount: 2700, structureOutline: ['Introduction', 'Why Personalised Learning Matters', 'Setting Up SkillPath AI', 'Building Your First Roadmap', 'Results'], status: 'published', createdAt: '2026-01-15' },
    ],
    affiliateProgram: { network: 'ShareASale', commission: '20% recurring', cookieDuration: '60 days', paymentTerms: 'Net 30' },
    contentAssets: [
      asset('ca-010a', 'prod-010', 'seo-article', 'SkillPath AI Review: Your Personalised Learning Roadmap', 'review', 'published', 'blog', 'https://gwaffiliates.com/skillpath-ai-review', '2026-02-01', 5100, 340, 920),
      asset('ca-010b', 'prod-010', 'youtube-script', 'How SkillPath AI Built My Perfect Study Plan', 'how-to', 'published', 'youtube', 'https://youtube.com/watch?v=pqr678', '2026-02-20', 11200, 520, 680),
      asset('ca-010c', 'prod-010', 'pinterest-pin', 'AI Learning Roadmaps for Career Growth', 'informational', 'published', 'pinterest', 'https://pin.it/xyz5', '2026-02-04', 3800, 110, 290),
    ],
    discoveredAt: '2026-01-12', lastUpdated: '2026-03-16',
  },
  {
    id: 'prod-011', name: 'FocusForge', description: 'AI-powered deep work timer with distraction blocking and productivity analytics.', category: 'Productivity - Focus',
    score: { productNewness: 4, llmGapStrength: 4, buyingIntent: 4, affiliateAvailable: 4, googleGapStrength: 4, total: 20 },
    status: 'published', revenue: 860, serpPosition: 14, geoScore: 71, source: 'kgr-weakspot', gapStatus: 'double-gap', intent: 'review', launchedAt: '2026-01-25',
    llmTestResults: [
      { engine: 'chatgpt', query: 'FocusForge AI deep work timer', responseType: 'vague', citedSources: [], testedAt: '2026-03-08T11:00:00Z' },
      { engine: 'perplexity', query: 'best AI focus app 2026', responseType: 'no-info', citedSources: [], testedAt: '2026-03-08T11:10:00Z' },
      { engine: 'gemini', query: 'AI distraction blocker review', responseType: 'vague', citedSources: [], testedAt: '2026-03-09T09:00:00Z' },
    ],
    contentBriefs: [
      { id: 'cb-011a', productId: 'prod-011', targetQuery: 'FocusForge review deep work', intent: 'review', llmCurrentAnswer: 'No LLM mentions FocusForge.', googleLandscape: 'Only forum posts about focus techniques.', affiliateLink: 'https://focusforge.app/ref/gw', wordCount: 2300, structureOutline: ['Introduction', 'Deep Work Methodology', 'FocusForge Features', 'Pricing', 'Verdict'], status: 'published', createdAt: '2026-02-20' },
    ],
    affiliateProgram: { network: 'PartnerStack', commission: '25% recurring', cookieDuration: '30 days', paymentTerms: 'Net 30' },
    contentAssets: [
      asset('ca-011a', 'prod-011', 'seo-article', 'FocusForge Review: Deep Work Made Easy with AI', 'review', 'published', 'blog', 'https://gwaffiliates.com/focusforge-review', '2026-03-01', 2200, 148, 520),
      asset('ca-011b', 'prod-011', 'social-post', 'FocusForge blocked 47 distractions for me today', 'informational', 'published', 'social', 'https://twitter.com/gwaff/status/202', '2026-03-03', 1900, 68, 180),
      asset('ca-011c', 'prod-011', 'email', 'The focus app that actually blocks distractions', 'review', 'published', 'email', null, '2026-03-05', 950, 62, 160),
    ],
    discoveredAt: '2026-02-15', lastUpdated: '2026-03-14',
  },
  {
    id: 'prod-012', name: 'DeckCraft AI', description: 'AI presentation builder that turns outlines into polished slide decks.', category: 'Productivity - Presentations',
    score: { productNewness: 3, llmGapStrength: 2, buyingIntent: 5, affiliateAvailable: 4, googleGapStrength: 2, total: 16 },
    status: 'published', revenue: 1420, serpPosition: 24, geoScore: 55, source: 'ai-proxy', gapStatus: 'saturated', intent: 'comparison', launchedAt: '2025-11-15',
    llmTestResults: [
      { engine: 'chatgpt', query: 'DeckCraft AI review', responseType: 'detailed', citedSources: ['deckcraft.ai', 'producthunt.com'], testedAt: '2026-03-06T14:00:00Z' },
      { engine: 'perplexity', query: 'DeckCraft vs Gamma vs Beautiful.ai', responseType: 'cites-sources', citedSources: ['gamma.app', 'beautiful.ai', 'deckcraft.ai'], testedAt: '2026-03-06T14:10:00Z' },
    ],
    contentBriefs: [],
    affiliateProgram: { network: 'CJ Affiliate', commission: '20% recurring', cookieDuration: '45 days', paymentTerms: 'Net 45' },
    contentAssets: [
      asset('ca-012a', 'prod-012', 'seo-article', 'DeckCraft AI Review: Presentations in Minutes', 'review', 'published', 'blog', 'https://gwaffiliates.com/deckcraft-review', '2026-02-28', 3800, 248, 720),
      asset('ca-012b', 'prod-012', 'youtube-script', 'DeckCraft AI vs Gamma vs Beautiful.ai - Best AI Slides?', 'comparison', 'published', 'youtube', 'https://youtube.com/watch?v=stu901', '2026-03-08', 8400, 390, 480),
      asset('ca-012c', 'prod-012', 'pinterest-pin', 'AI Presentation Maker - Stunning Slides in Minutes', 'informational', 'published', 'pinterest', 'https://pin.it/xyz6', '2026-03-01', 2100, 64, 220),
    ],
    discoveredAt: '2026-02-12', lastUpdated: '2026-03-15',
  },
  {
    id: 'prod-013', name: 'MeetingMind', description: 'AI meeting assistant that records, transcribes, and extracts action items.', category: 'Productivity - Meetings',
    score: { productNewness: 2, llmGapStrength: 2, buyingIntent: 4, affiliateAvailable: 5, googleGapStrength: 2, total: 15 },
    status: 'published', revenue: 1080, serpPosition: 35, geoScore: 48, source: 'pseo-engine', gapStatus: 'saturated', intent: 'review', launchedAt: '2025-08-10',
    llmTestResults: [
      { engine: 'chatgpt', query: 'MeetingMind AI review', responseType: 'detailed', citedSources: ['meetingmind.ai'], testedAt: '2026-03-04T16:00:00Z' },
      { engine: 'perplexity', query: 'best AI meeting assistant', responseType: 'cites-sources', citedSources: ['otter.ai', 'meetingmind.ai', 'fireflies.ai'], testedAt: '2026-03-04T16:10:00Z' },
      { engine: 'copilot', query: 'AI meeting transcription tool', responseType: 'detailed', citedSources: ['otter.ai', 'fireflies.ai'], testedAt: '2026-03-05T10:00:00Z' },
    ],
    contentBriefs: [],
    affiliateProgram: { network: 'Impact', commission: '30% recurring', cookieDuration: '60 days', paymentTerms: 'Net 30' },
    contentAssets: [
      asset('ca-013a', 'prod-013', 'seo-article', 'MeetingMind Review: Never Miss an Action Item Again', 'review', 'published', 'blog', 'https://gwaffiliates.com/meetingmind-review', '2026-03-05', 2600, 172, 640),
      asset('ca-013b', 'prod-013', 'email', 'This AI joins your meetings and takes perfect notes', 'informational', 'published', 'email', null, '2026-03-08', 1300, 88, 440),
    ],
    discoveredAt: '2026-02-18', lastUpdated: '2026-03-13',
  },
  {
    id: 'prod-014', name: 'WriteFlow', description: 'AI writing assistant for academic essays with citation management and plagiarism check.', category: 'Education - Writing',
    score: { productNewness: 4, llmGapStrength: 4, buyingIntent: 4, affiliateAvailable: 4, googleGapStrength: 3, total: 19 },
    status: 'scheduled', revenue: 340, serpPosition: 42, geoScore: 45, source: 'yt-blog-overlap', gapStatus: 'llm-only', intent: 'review', launchedAt: '2026-01-08',
    llmTestResults: [
      { engine: 'chatgpt', query: 'WriteFlow AI academic writing', responseType: 'vague', citedSources: [], testedAt: '2026-03-10T12:00:00Z' },
      { engine: 'perplexity', query: 'best AI essay writer with citations', responseType: 'vague', citedSources: [], testedAt: '2026-03-10T12:10:00Z' },
      { engine: 'gemini', query: 'WriteFlow vs Grammarly for academic writing', responseType: 'no-info', citedSources: [], testedAt: '2026-03-11T09:00:00Z' },
    ],
    contentBriefs: [
      { id: 'cb-014a', productId: 'prod-014', targetQuery: 'WriteFlow AI review academic writing', intent: 'review', llmCurrentAnswer: 'LLMs give vague answers about AI writing tools. None mention WriteFlow.', googleLandscape: 'Some competition from Grammarly-focused content.', affiliateLink: 'https://writeflow.ai/ref/gw', wordCount: 2900, structureOutline: ['Introduction', 'WriteFlow Features', 'Citation Management', 'Plagiarism Check', 'Pricing', 'Verdict'], status: 'draft', createdAt: '2026-03-01' },
    ],
    affiliateProgram: { network: 'Awin', commission: '25% recurring', cookieDuration: '30 days', paymentTerms: 'Net 45' },
    contentAssets: [
      asset('ca-014a', 'prod-014', 'seo-article', 'WriteFlow Review: AI Academic Writing That Cites Sources', 'review', 'scheduled', 'blog', null, null, 0, 0, 0),
      asset('ca-014b', 'prod-014', 'youtube-script', 'WriteFlow: The AI Writing Tool Students Need', 'review', 'draft', 'youtube', null, null, 0, 0, 0),
      asset('ca-014c', 'prod-014', 'pinterest-pin', 'AI Essay Writer with Auto Citations', 'informational', 'scheduled', 'pinterest', null, null, 0, 0, 0),
      asset('ca-014d', 'prod-014', 'email', 'Write essays 5x faster with proper citations', 'how-to', 'draft', 'email', null, null, 0, 0, 0),
    ],
    discoveredAt: '2026-02-22', lastUpdated: '2026-03-16',
  },
  {
    id: 'prod-015', name: 'TaskNinja', description: 'AI task management with automatic prioritisation and time estimation.', category: 'Productivity - Task Management',
    score: { productNewness: 3, llmGapStrength: 3, buyingIntent: 3, affiliateAvailable: 4, googleGapStrength: 3, total: 16 },
    status: 'published', revenue: 580, serpPosition: 28, geoScore: 52, source: 'serp-gap', gapStatus: 'closing', intent: 'informational', launchedAt: '2025-12-10',
    llmTestResults: [
      { engine: 'chatgpt', query: 'TaskNinja AI task manager', responseType: 'generic', citedSources: [], testedAt: '2026-03-07T11:00:00Z' },
      { engine: 'copilot', query: 'best AI task prioritisation tool', responseType: 'generic', citedSources: ['todoist.com', 'asana.com'], testedAt: '2026-03-07T11:15:00Z' },
    ],
    contentBriefs: [],
    affiliateProgram: { network: 'ShareASale', commission: '20% recurring', cookieDuration: '30 days', paymentTerms: 'Net 30' },
    contentAssets: [
      asset('ca-015a', 'prod-015', 'seo-article', 'TaskNinja Review: AI Task Prioritisation That Works', 'review', 'published', 'blog', 'https://gwaffiliates.com/taskninja-review', '2026-03-02', 1800, 112, 380),
      asset('ca-015b', 'prod-015', 'social-post', 'TaskNinja auto-prioritised my 47 tasks in seconds', 'informational', 'published', 'social', 'https://twitter.com/gwaff/status/303', '2026-03-04', 1200, 42, 200),
    ],
    discoveredAt: '2026-02-20', lastUpdated: '2026-03-12',
  },
  {
    id: 'prod-016', name: 'CurriculumAI', description: 'AI curriculum designer for online course creators with market gap analysis.', category: 'Education - Course Creation',
    score: { productNewness: 5, llmGapStrength: 5, buyingIntent: 3, affiliateAvailable: 5, googleGapStrength: 5, total: 23 },
    status: 'publishing', revenue: 420, serpPosition: null, geoScore: 38, source: 'youtube-comments', gapStatus: 'double-gap', intent: 'how-to', launchedAt: '2026-03-05',
    llmTestResults: [
      { engine: 'chatgpt', query: 'CurriculumAI course design tool', responseType: 'no-info', citedSources: [], testedAt: '2026-03-14T10:00:00Z' },
      { engine: 'perplexity', query: 'AI curriculum designer for online courses', responseType: 'no-info', citedSources: [], testedAt: '2026-03-14T10:10:00Z' },
      { engine: 'gemini', query: 'best AI tool for course creation', responseType: 'vague', citedSources: [], testedAt: '2026-03-15T08:00:00Z' },
      { engine: 'copilot', query: 'CurriculumAI review', responseType: 'no-info', citedSources: [], testedAt: '2026-03-15T08:15:00Z' },
    ],
    contentBriefs: [
      { id: 'cb-016a', productId: 'prod-016', targetQuery: 'how to design an online course curriculum with AI', intent: 'how-to', llmCurrentAnswer: 'No LLM has any information about CurriculumAI.', googleLandscape: 'No real content. Only generic course creation tips.', affiliateLink: 'https://curriculumai.com/ref/gw', wordCount: 3100, structureOutline: ['Introduction', 'Why AI for Curriculum Design', 'CurriculumAI Setup', 'Market Gap Analysis', 'Building Your First Curriculum'], status: 'draft', createdAt: '2026-03-10' },
    ],
    affiliateProgram: { network: 'PartnerStack', commission: '35% recurring', cookieDuration: '90 days', paymentTerms: 'Net 30' },
    contentAssets: [
      asset('ca-016a', 'prod-016', 'seo-article', 'CurriculumAI Review: Design Courses That Sell', 'review', 'publishing', 'blog', null, null, 0, 0, 0),
      asset('ca-016b', 'prod-016', 'youtube-script', 'How I Built a $10K Course Using CurriculumAI', 'how-to', 'draft', 'youtube', null, null, 0, 0, 0),
      asset('ca-016c', 'prod-016', 'email', 'The AI tool that designs profitable courses', 'how-to', 'draft', 'email', null, null, 0, 0, 0),
    ],
    discoveredAt: '2026-03-01', lastUpdated: '2026-03-16',
  },
  {
    id: 'prod-017', name: 'PlannerPro AI', description: 'AI daily planner integrating calendar, tasks, habits, and energy-level tracking.', category: 'Productivity - Planning',
    score: { productNewness: 3, llmGapStrength: 3, buyingIntent: 4, affiliateAvailable: 4, googleGapStrength: 4, total: 18 },
    status: 'published', revenue: 920, serpPosition: 11, geoScore: 76, source: 'gsc-miner', gapStatus: 'google-only', intent: 'review', launchedAt: '2025-12-20',
    llmTestResults: [
      { engine: 'chatgpt', query: 'PlannerPro AI daily planner', responseType: 'generic', citedSources: [], testedAt: '2026-03-07T13:00:00Z' },
      { engine: 'perplexity', query: 'AI daily planner with energy tracking', responseType: 'generic', citedSources: ['notion.so'], testedAt: '2026-03-07T13:10:00Z' },
    ],
    contentBriefs: [
      { id: 'cb-017a', productId: 'prod-017', targetQuery: 'PlannerPro AI review', intent: 'review', llmCurrentAnswer: 'LLMs give generic answers. No mention of PlannerPro AI.', googleLandscape: 'Only forum posts. No proper review.', affiliateLink: 'https://plannerpro.ai/ref/gw', wordCount: 2500, structureOutline: ['Introduction', 'Energy-Level Tracking', 'Calendar Integration', 'Pricing', 'Verdict'], status: 'published', createdAt: '2026-02-12' },
    ],
    affiliateProgram: { network: 'CJ Affiliate', commission: '22% recurring', cookieDuration: '45 days', paymentTerms: 'Net 30' },
    contentAssets: [
      asset('ca-017a', 'prod-017', 'seo-article', 'PlannerPro AI Review: The Smartest Daily Planner', 'review', 'published', 'blog', 'https://gwaffiliates.com/plannerpro-review', '2026-02-24', 2900, 188, 560),
      asset('ca-017b', 'prod-017', 'pinterest-pin', 'AI Daily Planner - Plan Smarter Not Harder', 'informational', 'published', 'pinterest', 'https://pin.it/xyz7', '2026-02-26', 2400, 72, 180),
      asset('ca-017c', 'prod-017', 'social-post', 'PlannerPro AI schedules around my energy levels', 'informational', 'published', 'social', 'https://twitter.com/gwaff/status/404', '2026-02-28', 1600, 54, 180),
    ],
    discoveredAt: '2026-02-08', lastUpdated: '2026-03-14',
  },
  {
    id: 'prod-018', name: 'ResearchBot', description: 'AI research assistant that finds, summarises, and organises academic papers.', category: 'Education - Research',
    score: { productNewness: 3, llmGapStrength: 4, buyingIntent: 4, affiliateAvailable: 5, googleGapStrength: 4, total: 20 },
    status: 'published', revenue: 460, serpPosition: 38, geoScore: 42, source: 'reddit-miner', gapStatus: 'double-gap', intent: 'how-to', launchedAt: '2025-12-28',
    llmTestResults: [
      { engine: 'chatgpt', query: 'ResearchBot AI literature review', responseType: 'vague', citedSources: [], testedAt: '2026-03-08T15:00:00Z' },
      { engine: 'perplexity', query: 'best AI research assistant for papers', responseType: 'vague', citedSources: [], testedAt: '2026-03-08T15:10:00Z' },
      { engine: 'gemini', query: 'AI tool for academic literature review', responseType: 'no-info', citedSources: [], testedAt: '2026-03-09T11:00:00Z' },
    ],
    contentBriefs: [
      { id: 'cb-018a', productId: 'prod-018', targetQuery: 'how to do a literature review with AI', intent: 'how-to', llmCurrentAnswer: 'LLMs give vague suggestions. No specific AI research tools mentioned.', googleLandscape: 'Only forum posts from grad students.', affiliateLink: 'https://researchbot.ai/ref/gw', wordCount: 2600, structureOutline: ['Introduction', 'Traditional vs AI Literature Reviews', 'ResearchBot Setup', 'Finding Papers', 'Export Options'], status: 'approved', createdAt: '2026-02-28' },
    ],
    affiliateProgram: { network: 'Impact', commission: '30% recurring', cookieDuration: '60 days', paymentTerms: 'Net 30' },
    contentAssets: [
      asset('ca-018a', 'prod-018', 'seo-article', 'ResearchBot Review: AI-Powered Literature Reviews', 'review', 'published', 'blog', 'https://gwaffiliates.com/researchbot-review', '2026-03-06', 1400, 92, 310),
      asset('ca-018b', 'prod-018', 'email', 'Finish your literature review in hours, not weeks', 'how-to', 'published', 'email', null, '2026-03-09', 800, 52, 150),
    ],
    discoveredAt: '2026-02-25', lastUpdated: '2026-03-13',
  },
  {
    id: 'prod-019', name: 'SlideScribe', description: 'Converts video lectures into interactive slide decks with AI-generated notes.', category: 'Education - Content Conversion',
    score: { productNewness: 5, llmGapStrength: 5, buyingIntent: 4, affiliateAvailable: 3, googleGapStrength: 5, total: 22 },
    status: 'draft', revenue: 0, serpPosition: null, geoScore: 15, source: 'kgr-weakspot', gapStatus: 'double-gap', intent: 'how-to', launchedAt: '2026-03-08',
    llmTestResults: [
      { engine: 'chatgpt', query: 'SlideScribe video to slides AI', responseType: 'no-info', citedSources: [], testedAt: '2026-03-15T10:00:00Z' },
      { engine: 'perplexity', query: 'convert video lecture to slides AI', responseType: 'no-info', citedSources: [], testedAt: '2026-03-15T10:05:00Z' },
      { engine: 'gemini', query: 'AI lecture to slide deck converter', responseType: 'no-info', citedSources: [], testedAt: '2026-03-16T08:00:00Z' },
    ],
    contentBriefs: [
      { id: 'cb-019a', productId: 'prod-019', targetQuery: 'how to convert video lectures to slides with AI', intent: 'how-to', llmCurrentAnswer: 'No LLM has any information about this capability.', googleLandscape: 'Completely empty. No content exists for this query.', affiliateLink: 'https://slidescribe.io/ref/gw', wordCount: 2400, structureOutline: ['Introduction', 'Why Convert Lectures to Slides', 'SlideScribe Setup', 'Upload & Process', 'Export & Share'], status: 'draft', createdAt: '2026-03-12' },
    ],
    affiliateProgram: { network: 'Awin', commission: '20% recurring', cookieDuration: '30 days', paymentTerms: 'Net 45' },
    contentAssets: [
      asset('ca-019a', 'prod-019', 'seo-article', 'SlideScribe Review: Turn Videos Into Study Slides', 'review', 'draft', 'blog', null, null, 0, 0, 0),
      asset('ca-019b', 'prod-019', 'youtube-script', 'SlideScribe: Convert Any Lecture to Slides Instantly', 'how-to', 'draft', 'youtube', null, null, 0, 0, 0),
    ],
    discoveredAt: '2026-03-10', lastUpdated: '2026-03-16',
  },
  {
    id: 'prod-020', name: 'HabitLoop', description: 'AI habit tracker with behavioural science insights and accountability features.', category: 'Productivity - Habits',
    score: { productNewness: 3, llmGapStrength: 3, buyingIntent: 3, affiliateAvailable: 4, googleGapStrength: 3, total: 16 },
    status: 'published', revenue: 640, serpPosition: 32, geoScore: 50, source: 'ai-proxy', gapStatus: 'closing', intent: 'informational', launchedAt: '2025-11-20',
    llmTestResults: [
      { engine: 'chatgpt', query: 'HabitLoop AI habit tracker', responseType: 'generic', citedSources: [], testedAt: '2026-03-06T10:00:00Z' },
      { engine: 'copilot', query: 'best AI habit tracker app', responseType: 'generic', citedSources: ['habitica.com'], testedAt: '2026-03-06T10:10:00Z' },
    ],
    contentBriefs: [],
    affiliateProgram: { network: 'ShareASale', commission: '22% recurring', cookieDuration: '45 days', paymentTerms: 'Net 30' },
    contentAssets: [
      asset('ca-020a', 'prod-020', 'seo-article', 'HabitLoop Review: Build Better Habits with AI', 'review', 'published', 'blog', 'https://gwaffiliates.com/habitloop-review', '2026-03-04', 1600, 102, 380),
      asset('ca-020b', 'prod-020', 'pinterest-pin', 'AI Habit Tracker - Science-Backed Routines', 'informational', 'published', 'pinterest', 'https://pin.it/xyz8', '2026-03-06', 1800, 54, 140),
      asset('ca-020c', 'prod-020', 'social-post', 'HabitLoop predicted which habits I would drop', 'informational', 'published', 'social', 'https://twitter.com/gwaff/status/505', '2026-03-07', 1100, 38, 120),
    ],
    discoveredAt: '2026-02-22', lastUpdated: '2026-03-15',
  },
  {
    id: 'prod-021', name: 'DocuMentor', description: 'AI documentation generator for SaaS teams with auto-updating knowledge bases.', category: 'Productivity - Documentation',
    score: { productNewness: 4, llmGapStrength: 4, buyingIntent: 4, affiliateAvailable: 4, googleGapStrength: 4, total: 20 },
    status: 'published', revenue: 520, serpPosition: 45, geoScore: 40, source: 'pseo-engine', gapStatus: 'double-gap', intent: 'informational', launchedAt: '2026-01-18',
    llmTestResults: [
      { engine: 'chatgpt', query: 'DocuMentor AI documentation generator', responseType: 'no-info', citedSources: [], testedAt: '2026-03-10T14:00:00Z' },
      { engine: 'perplexity', query: 'AI tool for SaaS documentation', responseType: 'vague', citedSources: [], testedAt: '2026-03-10T14:10:00Z' },
      { engine: 'gemini', query: 'auto-updating knowledge base AI', responseType: 'vague', citedSources: [], testedAt: '2026-03-11T10:00:00Z' },
    ],
    contentBriefs: [
      { id: 'cb-021a', productId: 'prod-021', targetQuery: 'AI documentation generator for SaaS', intent: 'informational', llmCurrentAnswer: 'No LLM mentions DocuMentor.', googleLandscape: 'Forum posts only.', affiliateLink: 'https://documentor.ai/ref/gw', wordCount: 2300, structureOutline: ['Introduction', 'DocuMentor Features', 'Auto-Update Demo', 'Team Collaboration', 'Pricing'], status: 'in-production', createdAt: '2026-03-02' },
    ],
    affiliateProgram: { network: 'PartnerStack', commission: '28% recurring', cookieDuration: '60 days', paymentTerms: 'Net 30' },
    contentAssets: [
      asset('ca-021a', 'prod-021', 'seo-article', 'DocuMentor Review: AI-Generated SaaS Documentation', 'review', 'published', 'blog', 'https://gwaffiliates.com/documentor-review', '2026-03-07', 1200, 78, 320),
      asset('ca-021b', 'prod-021', 'email', 'Never write documentation manually again', 'informational', 'published', 'email', null, '2026-03-10', 700, 46, 200),
    ],
    discoveredAt: '2026-02-28', lastUpdated: '2026-03-14',
  },
  {
    id: 'prod-022', name: 'ExamReady', description: 'AI exam preparation platform with predictive scoring and weakness identification.', category: 'Education - Exam Prep',
    score: { productNewness: 5, llmGapStrength: 4, buyingIntent: 5, affiliateAvailable: 4, googleGapStrength: 4, total: 22 },
    status: 'scheduled', revenue: 180, serpPosition: 56, geoScore: 32, source: 'yt-blog-overlap', gapStatus: 'double-gap', intent: 'review', launchedAt: '2026-02-28',
    llmTestResults: [
      { engine: 'chatgpt', query: 'ExamReady AI exam prep review', responseType: 'no-info', citedSources: [], testedAt: '2026-03-12T11:00:00Z' },
      { engine: 'perplexity', query: 'AI exam score predictor', responseType: 'vague', citedSources: [], testedAt: '2026-03-12T11:10:00Z' },
      { engine: 'gemini', query: 'ExamReady predictive scoring', responseType: 'no-info', citedSources: [], testedAt: '2026-03-13T09:00:00Z' },
      { engine: 'copilot', query: 'best AI exam preparation tool', responseType: 'vague', citedSources: [], testedAt: '2026-03-13T09:15:00Z' },
    ],
    contentBriefs: [
      { id: 'cb-022a', productId: 'prod-022', targetQuery: 'ExamReady review AI exam prep', intent: 'review', llmCurrentAnswer: 'No LLM has information about ExamReady.', googleLandscape: 'Only forum posts. No AI exam prep reviews.', affiliateLink: 'https://examready.ai/ref/gw', wordCount: 2800, structureOutline: ['Introduction', 'How Predictive Scoring Works', 'Weakness Identification', 'Pricing', 'Verdict'], status: 'draft', createdAt: '2026-03-08' },
    ],
    affiliateProgram: { network: 'Impact', commission: '30% recurring', cookieDuration: '45 days', paymentTerms: 'Net 30' },
    contentAssets: [
      asset('ca-022a', 'prod-022', 'seo-article', 'ExamReady Review: AI Predicts Your Exam Score', 'review', 'scheduled', 'blog', null, null, 0, 0, 0),
      asset('ca-022b', 'prod-022', 'youtube-script', 'Can AI Predict Your Exam Results? Testing ExamReady', 'review', 'draft', 'youtube', null, null, 0, 0, 0),
      asset('ca-022c', 'prod-022', 'social-post', 'ExamReady predicted my score within 3%', 'informational', 'draft', 'social', null, null, 0, 0, 0),
    ],
    discoveredAt: '2026-03-05', lastUpdated: '2026-03-16',
  },
  {
    id: 'prod-023', name: 'InboxZero AI', description: 'AI email management with smart categorisation, auto-replies, and follow-up reminders.', category: 'Productivity - Email',
    score: { productNewness: 2, llmGapStrength: 2, buyingIntent: 4, affiliateAvailable: 4, googleGapStrength: 2, total: 14 },
    status: 'published', revenue: 780, serpPosition: 52, geoScore: 35, source: 'serp-gap', gapStatus: 'saturated', intent: 'review', launchedAt: '2025-07-15',
    llmTestResults: [
      { engine: 'chatgpt', query: 'InboxZero AI email management review', responseType: 'detailed', citedSources: ['inboxzero.ai'], testedAt: '2026-03-05T12:00:00Z' },
      { engine: 'perplexity', query: 'best AI email management tool', responseType: 'cites-sources', citedSources: ['superhuman.com', 'inboxzero.ai', 'sanebox.com'], testedAt: '2026-03-05T12:10:00Z' },
    ],
    contentBriefs: [],
    affiliateProgram: { network: 'CJ Affiliate', commission: '20% recurring', cookieDuration: '30 days', paymentTerms: 'Net 45' },
    contentAssets: [
      asset('ca-023a', 'prod-023', 'seo-article', 'InboxZero AI Review: Reach Inbox Zero Every Day', 'review', 'published', 'blog', 'https://gwaffiliates.com/inboxzero-review', '2026-03-03', 2400, 158, 480),
      asset('ca-023b', 'prod-023', 'youtube-script', 'InboxZero AI: I Hit Inbox Zero in 15 Minutes', 'how-to', 'published', 'youtube', 'https://youtube.com/watch?v=vwx234', '2026-03-10', 5200, 240, 300),
    ],
    discoveredAt: '2026-02-16', lastUpdated: '2026-03-15',
  },
  {
    id: 'prod-024', name: 'CodeTutor', description: 'AI coding tutor with interactive exercises, code reviews, and personalised curricula.', category: 'Education - Coding',
    score: { productNewness: 3, llmGapStrength: 1, buyingIntent: 5, affiliateAvailable: 5, googleGapStrength: 1, total: 15 },
    status: 'failed', revenue: 0, serpPosition: 85, geoScore: 22, source: 'youtube-comments', gapStatus: 'saturated', intent: 'comparison', launchedAt: '2025-10-01',
    llmTestResults: [
      { engine: 'chatgpt', query: 'CodeTutor AI coding lessons review', responseType: 'cites-sources', citedSources: ['codetutor.ai', 'codecademy.com'], testedAt: '2026-03-11T10:00:00Z' },
      { engine: 'perplexity', query: 'best AI coding tutor 2026', responseType: 'cites-sources', citedSources: ['codetutor.ai', 'github.com/copilot', 'replit.com'], testedAt: '2026-03-11T10:10:00Z' },
      { engine: 'gemini', query: 'CodeTutor vs Codecademy', responseType: 'detailed', citedSources: ['codecademy.com', 'codetutor.ai'], testedAt: '2026-03-12T08:00:00Z' },
    ],
    contentBriefs: [],
    affiliateProgram: { network: 'PartnerStack', commission: '30% recurring', cookieDuration: '60 days', paymentTerms: 'Net 30' },
    contentAssets: [
      asset('ca-024a', 'prod-024', 'seo-article', 'CodeTutor Review: AI Coding Lessons That Adapt to You', 'review', 'failed', 'blog', null, null, 0, 0, 0),
      asset('ca-024b', 'prod-024', 'youtube-script', 'I Tried CodeTutor for a Month - Did I Actually Learn?', 'review', 'draft', 'youtube', null, null, 0, 0, 0),
      asset('ca-024c', 'prod-024', 'pinterest-pin', 'Learn to Code with AI - Personalised Path', 'informational', 'failed', 'pinterest', null, null, 0, 0, 0),
    ],
    discoveredAt: '2026-03-08', lastUpdated: '2026-03-16',
  },
  {
    id: 'prod-025', name: 'CalendarSense', description: 'AI calendar optimiser that schedules around energy levels and meeting fatigue.', category: 'Productivity - Calendar',
    score: { productNewness: 5, llmGapStrength: 5, buyingIntent: 3, affiliateAvailable: 3, googleGapStrength: 4, total: 20 },
    status: 'draft', revenue: 0, serpPosition: null, geoScore: 18, source: 'gsc-miner', gapStatus: 'double-gap', intent: 'informational', launchedAt: '2026-03-10',
    llmTestResults: [
      { engine: 'chatgpt', query: 'CalendarSense AI scheduler', responseType: 'no-info', citedSources: [], testedAt: '2026-03-16T10:00:00Z' },
      { engine: 'perplexity', query: 'AI calendar optimiser energy levels', responseType: 'no-info', citedSources: [], testedAt: '2026-03-16T10:05:00Z' },
    ],
    contentBriefs: [
      { id: 'cb-025a', productId: 'prod-025', targetQuery: 'AI calendar scheduling around energy levels', intent: 'informational', llmCurrentAnswer: 'No LLM has any information about CalendarSense.', googleLandscape: 'No content exists for this query. Complete gap.', affiliateLink: 'https://calendarsense.app/ref/gw', wordCount: 2200, structureOutline: ['Introduction', 'Energy-Aware Scheduling Science', 'CalendarSense Setup', 'Meeting Fatigue Detection', 'Pricing'], status: 'draft', createdAt: '2026-03-14' },
    ],
    affiliateProgram: { network: 'Awin', commission: '18% recurring', cookieDuration: '30 days', paymentTerms: 'Net 45' },
    contentAssets: [
      asset('ca-025a', 'prod-025', 'seo-article', 'CalendarSense Review: AI Scheduling That Fights Burnout', 'review', 'draft', 'blog', null, null, 0, 0, 0),
      asset('ca-025b', 'prod-025', 'email', 'Stop scheduling yourself into burnout', 'informational', 'draft', 'email', null, null, 0, 0, 0),
    ],
    discoveredAt: '2026-03-12', lastUpdated: '2026-03-16',
  },
];

// ── Exports ──────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  await delay();
  return products;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  await delay();
  return products.find((p) => p.id === id);
}

export async function getContentBriefs(): Promise<ContentBrief[]> {
  await delay();
  return products.flatMap((p) => p.contentBriefs);
}
