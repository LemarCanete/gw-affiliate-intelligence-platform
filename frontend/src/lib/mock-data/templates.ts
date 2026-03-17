import type { ContentBrief, ContentIntent } from '../types/domain';

// ── Types ────────────────────────────────────────────────────────────

export interface GapScoreEntry {
  id: string;
  productName: string;
  productId: string;
  scoredAt: string;
  productNewness: number;
  llmGapStrength: number;
  buyingIntent: number;
  affiliateAvailable: number;
  googleGapStrength: number;
  total: number;
  verdict: 'write-immediately' | 'worth-pursuing' | 'monitor' | 'skip';
  notes: string;
}

export interface ReviewTemplate {
  id: string;
  productId: string;
  productName: string;
  status: 'draft' | 'in-progress' | 'review' | 'published';
  intent: 'review';
  sections: {
    whatIsIt: string;
    whoIsItFor: string;
    keyFeatures: string[];
    pros: string[];
    cons: string[];
    verdict: string;
    ctaText: string;
    affiliateLink: string;
  };
  wordCount: number;
  createdAt: string;
}

export interface ComparisonTemplate {
  id: string;
  productAId: string;
  productAName: string;
  productBId: string;
  productBName: string;
  status: 'draft' | 'in-progress' | 'review' | 'published';
  intent: 'comparison';
  sections: {
    overview: string;
    featureComparison: { feature: string; productA: string; productB: string }[];
    pricing: string;
    useCaseFit: string;
    recommendation: string;
    affiliateLinks: { productA: string; productB: string };
  };
  wordCount: number;
  createdAt: string;
}

// ── Helpers ──────────────────────────────────────────────────────────

const delay = () => new Promise<void>((r) => setTimeout(r, 100));

// ── Gap Score Data ──────────────────────────────────────────────────

const gapScores: GapScoreEntry[] = [
  {
    id: 'gs-001',
    productName: 'StudyAI Pro',
    productId: 'prod-001',
    scoredAt: '2026-03-14',
    productNewness: 5,
    llmGapStrength: 4,
    buyingIntent: 4,
    affiliateAvailable: 5,
    googleGapStrength: 4,
    total: 22,
    verdict: 'write-immediately',
    notes: 'Strong LLM gap, no major competitors covering AI study planners with adaptive scheduling.',
  },
  {
    id: 'gs-002',
    productName: 'QuizMaster AI',
    productId: 'prod-003',
    scoredAt: '2026-03-13',
    productNewness: 4,
    llmGapStrength: 5,
    buyingIntent: 4,
    affiliateAvailable: 4,
    googleGapStrength: 4,
    total: 21,
    verdict: 'write-immediately',
    notes: 'Spaced repetition + AI quiz gen is an underserved query cluster. KGR below 0.25.',
  },
  {
    id: 'gs-003',
    productName: 'NoteGenius',
    productId: 'prod-002',
    scoredAt: '2026-03-12',
    productNewness: 4,
    llmGapStrength: 4,
    buyingIntent: 5,
    affiliateAvailable: 5,
    googleGapStrength: 3,
    total: 21,
    verdict: 'write-immediately',
    notes: 'High buying intent queries. Google has thin content but some competitors entering.',
  },
  {
    id: 'gs-004',
    productName: 'BrainSpark',
    productId: 'prod-007',
    scoredAt: '2026-03-11',
    productNewness: 4,
    llmGapStrength: 3,
    buyingIntent: 4,
    affiliateAvailable: 3,
    googleGapStrength: 5,
    total: 19,
    verdict: 'worth-pursuing',
    notes: 'Visual mnemonics feature is unique. Google gap is wide but LLMs already mention Anki.',
  },
  {
    id: 'gs-005',
    productName: 'EduFlow',
    productId: 'prod-006',
    scoredAt: '2026-03-10',
    productNewness: 3,
    llmGapStrength: 3,
    buyingIntent: 4,
    affiliateAvailable: 4,
    googleGapStrength: 4,
    total: 18,
    verdict: 'worth-pursuing',
    notes: 'LMS space is competitive but solo-creator angle is underserved. Threshold score.',
  },
  {
    id: 'gs-006',
    productName: 'SlideScribe',
    productId: 'prod-019',
    scoredAt: '2026-03-09',
    productNewness: 5,
    llmGapStrength: 5,
    buyingIntent: 2,
    affiliateAvailable: 2,
    googleGapStrength: 3,
    total: 17,
    verdict: 'monitor',
    notes: 'Brand new product, huge content gap but low buying intent and affiliate program is basic.',
  },
  {
    id: 'gs-007',
    productName: 'CalendarSense',
    productId: 'prod-025',
    scoredAt: '2026-03-08',
    productNewness: 3,
    llmGapStrength: 2,
    buyingIntent: 3,
    affiliateAvailable: 3,
    googleGapStrength: 3,
    total: 14,
    verdict: 'skip',
    notes: 'Crowded calendar space. LLMs already recommend Reclaim.ai and Clockwise for this niche.',
  },
  {
    id: 'gs-008',
    productName: 'TaskNinja',
    productId: 'prod-015',
    scoredAt: '2026-03-07',
    productNewness: 3,
    llmGapStrength: 2,
    buyingIntent: 3,
    affiliateAvailable: 3,
    googleGapStrength: 4,
    total: 15,
    verdict: 'monitor',
    notes: 'Google gap exists but LLMs cite Todoist and TickTick heavily. Need differentiation angle.',
  },
];

// ── Content Brief Data ──────────────────────────────────────────────

const contentBriefs: (ContentBrief & { productName: string })[] = [
  {
    id: 'cb-001',
    productId: 'prod-001',
    targetQuery: 'best AI study planner 2026',
    intent: 'commercial' as ContentIntent,
    llmCurrentAnswer: 'ChatGPT mentions generic planners but not StudyAI Pro. Perplexity lists Notion and Motion only.',
    googleLandscape: 'Top 5 results are listicles from 2025 with no StudyAI Pro mention. DR 30-45 range.',
    affiliateLink: 'https://studyai.pro/?ref=gwaff',
    wordCount: 2800,
    structureOutline: ['Introduction + hook', 'What is StudyAI Pro', 'Key features deep dive', 'Pricing breakdown', 'Pros and cons', 'Verdict + CTA'],
    status: 'published',
    createdAt: '2026-02-08',
    productName: 'StudyAI Pro',
  },
  {
    id: 'cb-002',
    productId: 'prod-003',
    targetQuery: 'QuizMaster AI review honest',
    intent: 'commercial' as ContentIntent,
    llmCurrentAnswer: 'LLMs provide generic quiz tool recommendations. No specific QuizMaster AI coverage.',
    googleLandscape: 'Only 2 thin affiliate reviews ranking. KGR 0.18 — strong opportunity.',
    affiliateLink: 'https://quizmaster.ai/?ref=gwaff',
    wordCount: 2400,
    structureOutline: ['Why I tested QuizMaster AI', 'Setup experience', 'Quiz generation quality', 'Spaced repetition results', 'Pricing', 'Final verdict'],
    status: 'published',
    createdAt: '2026-01-28',
    productName: 'QuizMaster AI',
  },
  {
    id: 'cb-003',
    productId: 'prod-002',
    targetQuery: 'AI note taking app for lectures',
    intent: 'informational' as ContentIntent,
    llmCurrentAnswer: 'LLMs recommend Otter.ai and Notion AI. NoteGenius not mentioned in any engine.',
    googleLandscape: 'Listicle-heavy SERPs. Top results are from TechRadar and PCMag with outdated info.',
    affiliateLink: 'https://notegenius.com/?ref=gwaff',
    wordCount: 3200,
    structureOutline: ['The problem with lecture notes', 'How AI note-taking works', 'NoteGenius walkthrough', 'Comparison with alternatives', 'Best use cases', 'Getting started guide'],
    status: 'published',
    createdAt: '2026-02-03',
    productName: 'NoteGenius',
  },
  {
    id: 'cb-004',
    productId: 'prod-007',
    targetQuery: 'BrainSpark vs Anki which is better',
    intent: 'commercial' as ContentIntent,
    llmCurrentAnswer: 'All LLMs heavily recommend Anki. BrainSpark is completely absent from responses.',
    googleLandscape: 'No direct comparison articles exist. Anki dominates with community content.',
    affiliateLink: 'https://brainspark.io/?ref=gwaff',
    wordCount: 2600,
    structureOutline: ['Why this comparison matters', 'Anki overview', 'BrainSpark overview', 'Feature-by-feature comparison', 'Pricing', 'Who should use which'],
    status: 'draft',
    createdAt: '2026-03-10',
    productName: 'BrainSpark',
  },
  {
    id: 'cb-005',
    productId: 'prod-016',
    targetQuery: 'how to create online course with AI',
    intent: 'informational' as ContentIntent,
    llmCurrentAnswer: 'LLMs suggest using ChatGPT for outlines. No mention of dedicated AI course tools.',
    googleLandscape: 'High volume query with generic how-to articles. No product-specific content in top 10.',
    affiliateLink: 'https://curriculumai.com/?ref=gwaff',
    wordCount: 3500,
    structureOutline: ['The AI course creation revolution', 'Step-by-step with CurriculumAI', 'Market gap analysis feature', 'Curriculum design workflow', 'Launch checklist', 'Tools and resources'],
    status: 'approved',
    createdAt: '2026-03-12',
    productName: 'CurriculumAI',
  },
  {
    id: 'cb-006',
    productId: 'prod-006',
    targetQuery: 'EduFlow LMS pricing plans comparison',
    intent: 'transactional' as ContentIntent,
    llmCurrentAnswer: 'LLMs provide outdated EduFlow pricing. No comparison with current competitors.',
    googleLandscape: 'EduFlow pricing page ranks #1 but no third-party comparison content exists.',
    affiliateLink: 'https://eduflow.com/?ref=gwaff',
    wordCount: 1800,
    structureOutline: ['EduFlow pricing tiers overview', 'Feature comparison by plan', 'Hidden costs analysis', 'vs Teachable pricing', 'vs Thinkific pricing', 'Best plan recommendation'],
    status: 'in-production',
    createdAt: '2026-03-14',
    productName: 'EduFlow',
  },
];

// ── Review Template Data ────────────────────────────────────────────

const reviewTemplates: ReviewTemplate[] = [
  {
    id: 'rt-001',
    productId: 'prod-001',
    productName: 'StudyAI Pro',
    status: 'published',
    intent: 'review',
    sections: {
      whatIsIt: 'StudyAI Pro is an AI-powered study planner that analyses your learning style, exam schedule, and knowledge gaps to create adaptive study plans.',
      whoIsItFor: 'University students, professional certification candidates, and self-learners who need structured study schedules.',
      keyFeatures: ['Adaptive scheduling', 'Learning style analysis', 'Spaced repetition integration', 'Exam countdown with milestones', 'Progress analytics dashboard'],
      pros: ['Genuinely adaptive - adjusts when you miss sessions', 'Clean UI with minimal distractions', 'Integrates with Google Calendar'],
      cons: ['Premium plan required for multiple subjects', 'No offline mode yet'],
      verdict: 'StudyAI Pro delivers on its promise of intelligent study planning. The adaptive scheduling genuinely responds to your progress, unlike static planners.',
      ctaText: 'Try StudyAI Pro free for 14 days',
      affiliateLink: 'https://studyai.pro/?ref=gwaff',
    },
    wordCount: 2800,
    createdAt: '2026-02-08',
  },
  {
    id: 'rt-002',
    productId: 'prod-003',
    productName: 'QuizMaster AI',
    status: 'published',
    intent: 'review',
    sections: {
      whatIsIt: 'QuizMaster AI generates adaptive practice quizzes from any study material, using spaced repetition algorithms to target weak areas.',
      whoIsItFor: 'Students preparing for standardised tests, medical boards, bar exams, and any knowledge-intensive certification.',
      keyFeatures: ['Upload any material to generate quizzes', 'Spaced repetition engine', 'Difficulty auto-adjustment', 'Performance analytics', 'Collaborative quiz sharing'],
      pros: ['Quiz quality is surprisingly good from uploaded PDFs', 'Spaced repetition actually improves retention', 'Affordable compared to alternatives'],
      cons: ['Occasional odd question phrasing', 'Limited to text-based materials (no image questions)'],
      verdict: 'For exam prep, QuizMaster AI is a genuine time-saver. The spaced repetition engine catches knowledge gaps before exam day.',
      ctaText: 'Start creating AI quizzes free',
      affiliateLink: 'https://quizmaster.ai/?ref=gwaff',
    },
    wordCount: 2400,
    createdAt: '2026-01-28',
  },
  {
    id: 'rt-003',
    productId: 'prod-002',
    productName: 'NoteGenius',
    status: 'in-progress',
    intent: 'review',
    sections: {
      whatIsIt: 'NoteGenius transforms lecture recordings into structured, searchable notes with AI-powered summarisation and key concept extraction.',
      whoIsItFor: 'Students attending lectures, professionals in meetings, and anyone who learns better from audio but needs written notes.',
      keyFeatures: ['Real-time lecture transcription', 'AI summarisation with key concepts', 'Searchable note archive', 'Export to Notion/Google Docs', 'Multi-language support'],
      pros: ['Transcription accuracy is excellent even in noisy rooms', 'Summary quality saves hours of note review', 'Notion integration works seamlessly'],
      cons: ['Requires stable internet for real-time transcription', 'Free tier limited to 5 hours per month'],
      verdict: 'NoteGenius is the best lecture-to-notes tool we have tested. If you attend lectures regularly, this pays for itself in the first week.',
      ctaText: 'Get NoteGenius with 35% off',
      affiliateLink: 'https://notegenius.com/?ref=gwaff',
    },
    wordCount: 3200,
    createdAt: '2026-02-03',
  },
  {
    id: 'rt-004',
    productId: 'prod-007',
    productName: 'BrainSpark',
    status: 'draft',
    intent: 'review',
    sections: {
      whatIsIt: 'BrainSpark is an AI flashcard generator that creates visual mnemonics alongside standard flashcards, with collaborative study rooms.',
      whoIsItFor: 'Visual learners, language students, medical students memorising anatomy, and study groups.',
      keyFeatures: ['AI-generated visual mnemonics', 'Collaborative study rooms', 'Import from Anki/Quizlet', 'Spaced repetition', 'Image-based flashcards'],
      pros: ['Visual mnemonics are genuinely memorable', 'Study room feature is great for group prep'],
      cons: ['Visual generation can be slow', 'Premium pricing is steep for students'],
      verdict: 'Draft - pending final testing of the visual mnemonic accuracy across different subjects.',
      ctaText: 'Try BrainSpark visual flashcards',
      affiliateLink: 'https://brainspark.io/?ref=gwaff',
    },
    wordCount: 1800,
    createdAt: '2026-03-10',
  },
  {
    id: 'rt-005',
    productId: 'prod-006',
    productName: 'EduFlow',
    status: 'review',
    intent: 'review',
    sections: {
      whatIsIt: 'EduFlow is an all-in-one LMS with AI-powered course creation, student analytics, and built-in marketing tools for solo creators.',
      whoIsItFor: 'Solo course creators, coaches, and small education businesses looking for an integrated platform.',
      keyFeatures: ['AI course outline generator', 'Built-in checkout and payments', 'Student progress analytics', 'Email marketing integration', 'Custom domain support'],
      pros: ['AI course builder saves days of planning', 'All-in-one means fewer subscriptions', 'Student analytics are actionable'],
      cons: ['Steeper learning curve than Teachable', 'Video hosting has size limits on starter plan'],
      verdict: 'EduFlow is the best option for solo creators who want AI-assisted course creation without juggling multiple tools.',
      ctaText: 'Launch your course with EduFlow',
      affiliateLink: 'https://eduflow.com/?ref=gwaff',
    },
    wordCount: 2600,
    createdAt: '2026-03-05',
  },
  {
    id: 'rt-006',
    productId: 'prod-010',
    productName: 'SkillPath AI',
    status: 'in-progress',
    intent: 'review',
    sections: {
      whatIsIt: 'SkillPath AI generates personalised learning roadmaps for tech and business skills, pulling from curated course libraries and free resources.',
      whoIsItFor: 'Career changers, developers learning new stacks, and professionals building structured upskilling plans.',
      keyFeatures: ['AI skill gap analysis', 'Curated resource matching', 'Progress milestones', 'Industry-aligned roadmaps', 'Free + paid resource mix'],
      pros: ['Roadmaps feel genuinely personalised', 'Mix of free and paid resources is practical', 'Industry alignment is data-driven'],
      cons: ['Limited to tech and business domains currently', 'Some recommended resources are outdated'],
      verdict: 'In progress - testing roadmap quality across 5 different skill domains.',
      ctaText: 'Build your AI learning roadmap',
      affiliateLink: 'https://skillpath.ai/?ref=gwaff',
    },
    wordCount: 2200,
    createdAt: '2026-03-12',
  },
];

// ── Comparison Template Data ────────────────────────────────────────

const comparisonTemplates: ComparisonTemplate[] = [
  {
    id: 'ct-001',
    productAId: 'prod-007',
    productAName: 'BrainSpark',
    productBId: 'prod-003',
    productBName: 'QuizMaster AI',
    status: 'published',
    intent: 'comparison',
    sections: {
      overview: 'Both BrainSpark and QuizMaster AI help students memorise material, but they take fundamentally different approaches: visual mnemonics versus adaptive quizzing.',
      featureComparison: [
        { feature: 'Core Method', productA: 'Visual mnemonics + flashcards', productB: 'Adaptive quiz generation' },
        { feature: 'Content Import', productA: 'Anki, Quizlet, manual', productB: 'PDF, doc, text upload' },
        { feature: 'Spaced Repetition', productA: 'Yes', productB: 'Yes (advanced algorithm)' },
        { feature: 'Collaboration', productA: 'Study rooms', productB: 'Shared quiz decks' },
        { feature: 'Free Tier', productA: '50 cards/month', productB: '100 questions/month' },
        { feature: 'Pricing', productA: '$12/mo student, $19/mo pro', productB: '$9/mo student, $15/mo pro' },
      ],
      pricing: 'QuizMaster AI is more affordable at every tier. BrainSpark justifies its premium with visual mnemonic generation.',
      useCaseFit: 'Choose BrainSpark if you are a visual learner or studying subjects with heavy memorisation. Choose QuizMaster AI for exam prep with varied question formats.',
      recommendation: 'For most students, QuizMaster AI offers better value. Visual learners and medical students should consider BrainSpark for the mnemonic features.',
      affiliateLinks: { productA: 'https://brainspark.io/?ref=gwaff', productB: 'https://quizmaster.ai/?ref=gwaff' },
    },
    wordCount: 3100,
    createdAt: '2026-02-26',
  },
  {
    id: 'ct-002',
    productAId: 'prod-006',
    productAName: 'EduFlow',
    productBId: 'prod-016',
    productBName: 'CurriculumAI',
    status: 'in-progress',
    intent: 'comparison',
    sections: {
      overview: 'EduFlow is a full LMS platform while CurriculumAI focuses specifically on AI-powered curriculum design. They overlap in course creation but differ in scope.',
      featureComparison: [
        { feature: 'Primary Focus', productA: 'Full LMS platform', productB: 'Curriculum design tool' },
        { feature: 'AI Course Builder', productA: 'Yes (outline + content)', productB: 'Yes (advanced with market analysis)' },
        { feature: 'Student Management', productA: 'Full analytics suite', productB: 'Not included' },
        { feature: 'Payments', productA: 'Built-in checkout', productB: 'Integrations only' },
        { feature: 'Market Gap Analysis', productA: 'Basic', productB: 'Advanced with competitor mapping' },
      ],
      pricing: 'EduFlow starts at $49/mo for the full platform. CurriculumAI starts at $29/mo for curriculum design only.',
      useCaseFit: 'Use EduFlow if you need an all-in-one solution. Use CurriculumAI if you already have an LMS and need better course planning.',
      recommendation: 'Draft - waiting for CurriculumAI feature update to finalise.',
      affiliateLinks: { productA: 'https://eduflow.com/?ref=gwaff', productB: 'https://curriculumai.com/?ref=gwaff' },
    },
    wordCount: 2800,
    createdAt: '2026-03-08',
  },
  {
    id: 'ct-003',
    productAId: 'prod-001',
    productAName: 'StudyAI Pro',
    productBId: 'prod-017',
    productBName: 'PlannerPro AI',
    status: 'review',
    intent: 'comparison',
    sections: {
      overview: 'Both tools help with planning, but StudyAI Pro is study-specific while PlannerPro AI is a general daily planner with energy-level awareness.',
      featureComparison: [
        { feature: 'Focus', productA: 'Study planning only', productB: 'General daily planning' },
        { feature: 'AI Adaptation', productA: 'Adapts to learning progress', productB: 'Adapts to energy levels' },
        { feature: 'Calendar Integration', productA: 'Google Calendar', productB: 'Google, Outlook, Apple' },
        { feature: 'Habit Tracking', productA: 'Study streaks only', productB: 'Full habit tracking' },
        { feature: 'Analytics', productA: 'Study performance', productB: 'Productivity metrics' },
      ],
      pricing: 'StudyAI Pro at $14/mo vs PlannerPro AI at $11/mo. Both offer 14-day trials.',
      useCaseFit: 'Students should choose StudyAI Pro for its exam-aware scheduling. Professionals should choose PlannerPro AI for its energy-based planning.',
      recommendation: 'StudyAI Pro wins for students; PlannerPro AI wins for working professionals. There is minimal overlap in the ideal user.',
      affiliateLinks: { productA: 'https://studyai.pro/?ref=gwaff', productB: 'https://plannerpro.ai/?ref=gwaff' },
    },
    wordCount: 2500,
    createdAt: '2026-03-11',
  },
  {
    id: 'ct-004',
    productAId: 'prod-002',
    productAName: 'NoteGenius',
    productBId: 'prod-019',
    productBName: 'SlideScribe',
    status: 'draft',
    intent: 'comparison',
    sections: {
      overview: 'NoteGenius and SlideScribe both process lecture content but output in different formats: structured notes versus interactive slide decks.',
      featureComparison: [
        { feature: 'Input', productA: 'Audio recordings', productB: 'Video recordings' },
        { feature: 'Output', productA: 'Structured text notes', productB: 'Interactive slide decks' },
        { feature: 'AI Summarisation', productA: 'Yes', productB: 'Yes (with slide annotations)' },
        { feature: 'Export Options', productA: 'Notion, Google Docs, PDF', productB: 'PowerPoint, Google Slides, PDF' },
        { feature: 'Real-time Processing', productA: 'Yes', productB: 'Post-recording only' },
      ],
      pricing: 'NoteGenius at $12/mo vs SlideScribe pricing TBA (currently in beta).',
      useCaseFit: 'NoteGenius for text-based learners who review notes. SlideScribe for visual learners who prefer slide-based review.',
      recommendation: 'Draft - SlideScribe is still in beta. Will finalise after stable release.',
      affiliateLinks: { productA: 'https://notegenius.com/?ref=gwaff', productB: 'https://slidescribe.io/?ref=gwaff' },
    },
    wordCount: 2100,
    createdAt: '2026-03-14',
  },
];

// ── Exports ─────────────────────────────────────────────────────────

export async function getGapScores(): Promise<GapScoreEntry[]> {
  await delay();
  return gapScores;
}

export async function getContentBriefs(): Promise<(ContentBrief & { productName: string })[]> {
  await delay();
  return contentBriefs;
}

export async function getReviewTemplates(): Promise<ReviewTemplate[]> {
  await delay();
  return reviewTemplates;
}

export async function getComparisonTemplates(): Promise<ComparisonTemplate[]> {
  await delay();
  return comparisonTemplates;
}
