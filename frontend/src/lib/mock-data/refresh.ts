export type RefreshSeverity = 'high' | 'medium' | 'low';
export type RefreshTriggerType = 'serp-drop' | 'product-update' | 'content-stale' | 'competitor-new' | 'geo-citation-lost' | 'conversion-drop';

export interface RefreshAlert {
  id: string;
  productId: string;
  productName: string;
  triggerType: RefreshTriggerType;
  severity: RefreshSeverity;
  title: string;
  description: string;
  detectedAt: string;
  status: 'new' | 'acknowledged' | 'in-progress' | 'resolved' | 'dismissed';
  actionRequired: string;
  contentUrl: string | null;
  metrics: {
    label: string;
    before: string;
    after: string;
  } | null;
}

const REFRESH_ALERTS: RefreshAlert[] = [
  // 2x serp-drop (high)
  {
    id: 'ref-001',
    productId: 'prod-001',
    productName: 'StudyAI Pro',
    triggerType: 'serp-drop',
    severity: 'high',
    title: 'SERP position dropped 7 places for StudyAI Pro',
    description: 'The main review article for StudyAI Pro has dropped from position 5 to position 12 for the target keyword "best AI study tools 2026". Competitor content from TechRadar now occupies the top spot.',
    detectedAt: '2026-03-16T14:30:00Z',
    status: 'new',
    actionRequired: 'Update the review article with fresh screenshots, new feature coverage, and improved internal linking. Add a FAQ section targeting related long-tail queries.',
    contentUrl: '/app/content/studyai-pro-review',
    metrics: {
      label: 'SERP Position',
      before: 'Position 5',
      after: 'Position 12',
    },
  },
  {
    id: 'ref-002',
    productId: 'prod-005',
    productName: 'LearnFlow AI',
    triggerType: 'serp-drop',
    severity: 'high',
    title: 'SERP position dropped 5 places for LearnFlow AI comparison',
    description: 'The "LearnFlow AI vs Notion AI" comparison article fell from position 3 to position 8. A new article from Zapier has entered the top 3 with fresher content.',
    detectedAt: '2026-03-15T09:15:00Z',
    status: 'acknowledged',
    actionRequired: 'Rewrite the comparison with updated pricing, add a video embed, and include 2026 feature comparison table.',
    contentUrl: '/app/content/learnflow-vs-notion',
    metrics: {
      label: 'SERP Position',
      before: 'Position 3',
      after: 'Position 8',
    },
  },
  // 2x product-update (high)
  {
    id: 'ref-003',
    productId: 'prod-002',
    productName: 'NoteGenius',
    triggerType: 'product-update',
    severity: 'high',
    title: 'NoteGenius released v3.0 with new AI features',
    description: 'NoteGenius launched version 3.0 on March 14th with AI-powered summarisation, voice-to-notes, and a redesigned collaboration workspace. Our review covers v2.4 features only.',
    detectedAt: '2026-03-14T18:00:00Z',
    status: 'new',
    actionRequired: 'Rewrite the full review covering v3.0 features, update all screenshots, re-test the product hands-on, and update the affiliate link to the new pricing page.',
    contentUrl: '/app/content/notegenius-review',
    metrics: null,
  },
  {
    id: 'ref-004',
    productId: 'prod-003',
    productName: 'QuizMaster AI',
    triggerType: 'product-update',
    severity: 'high',
    title: 'QuizMaster AI changed pricing structure',
    description: 'QuizMaster AI has moved from a flat $19/month plan to a tiered model ($9/$19/$39). The free tier was removed. Our review still lists the old pricing and free tier details.',
    detectedAt: '2026-03-13T11:45:00Z',
    status: 'in-progress',
    actionRequired: 'Update pricing tables across all content (review, comparison, roundup). Verify affiliate commission rates have not changed with the new tiers.',
    contentUrl: '/app/content/quizmaster-review',
    metrics: {
      label: 'Pricing',
      before: '$19/mo flat',
      after: '$9/$19/$39 tiered',
    },
  },
  // 2x content-stale (medium)
  {
    id: 'ref-005',
    productId: 'prod-004',
    productName: 'FlashCard Genius',
    triggerType: 'content-stale',
    severity: 'medium',
    title: 'FlashCard Genius review is 94 days old',
    description: 'The main review article for FlashCard Genius was last updated on December 13, 2025. Content older than 90 days in the AI/SaaS niche loses freshness signals.',
    detectedAt: '2026-03-16T06:00:00Z',
    status: 'new',
    actionRequired: 'Refresh the article with updated information, re-verify all facts and pricing, add a "Last updated" date, and check for any new features released since December.',
    contentUrl: '/app/content/flashcard-genius-review',
    metrics: {
      label: 'Content Age',
      before: '0 days',
      after: '94 days',
    },
  },
  {
    id: 'ref-006',
    productId: 'prod-006',
    productName: 'WriterBot',
    triggerType: 'content-stale',
    severity: 'medium',
    title: 'WriterBot comparison article is 102 days old',
    description: 'The "WriterBot vs Jasper AI" comparison was published on December 5, 2025 and has not been updated. Both products have shipped multiple updates since.',
    detectedAt: '2026-03-16T06:00:00Z',
    status: 'acknowledged',
    actionRequired: 'Update comparison metrics, re-run side-by-side tests, refresh screenshots, and add new sections for features released in Q1 2026.',
    contentUrl: '/app/content/writerbot-vs-jasper',
    metrics: {
      label: 'Content Age',
      before: '0 days',
      after: '102 days',
    },
  },
  // 2x competitor-new (medium)
  {
    id: 'ref-007',
    productId: 'prod-007',
    productName: 'BrainSpark',
    triggerType: 'competitor-new',
    severity: 'medium',
    title: '3 new competitor reviews found for BrainSpark',
    description: 'Three new in-depth reviews of BrainSpark have been published in the last 7 days by authority domains (PCMag, G2, and SaaSWorthy). These could push our content down in SERPs.',
    detectedAt: '2026-03-15T16:20:00Z',
    status: 'acknowledged',
    actionRequired: 'Analyse competitor content for gaps we can exploit. Add unique value (original benchmarks, video walkthrough, user interviews) to differentiate our review.',
    contentUrl: '/app/content/brainspark-review',
    metrics: {
      label: 'Competitor Reviews',
      before: '5 total',
      after: '8 total',
    },
  },
  {
    id: 'ref-008',
    productId: 'prod-008',
    productName: 'TaskPilot AI',
    triggerType: 'competitor-new',
    severity: 'medium',
    title: 'New roundup article ranking above our TaskPilot review',
    description: 'A new "Top 10 AI Productivity Tools" roundup from Forbes is now ranking #2 for our target keyword. It includes TaskPilot AI with a different affiliate link.',
    detectedAt: '2026-03-14T10:30:00Z',
    status: 'new',
    actionRequired: 'Create a competing roundup article targeting the same keyword cluster. Update our existing review with schema markup and additional content depth.',
    contentUrl: '/app/content/taskpilot-review',
    metrics: null,
  },
  // 2x geo-citation-lost (medium)
  {
    id: 'ref-009',
    productId: 'prod-009',
    productName: 'EduFlow',
    triggerType: 'geo-citation-lost',
    severity: 'medium',
    title: 'Perplexity no longer citing EduFlow review',
    description: 'Our EduFlow review was previously cited by Perplexity AI in answers about "best education platforms". As of March 13, the citation has been replaced by a Capterra listing.',
    detectedAt: '2026-03-13T20:00:00Z',
    status: 'in-progress',
    actionRequired: 'Optimise the review for GEO (Generative Engine Optimisation): add structured data, cite authoritative sources, include statistics, and ensure factual accuracy for AI citation eligibility.',
    contentUrl: '/app/content/eduflow-review',
    metrics: {
      label: 'GEO Citations',
      before: '3 engines',
      after: '2 engines',
    },
  },
  {
    id: 'ref-010',
    productId: 'prod-010',
    productName: 'CodeTutor AI',
    triggerType: 'geo-citation-lost',
    severity: 'medium',
    title: 'ChatGPT stopped referencing CodeTutor AI review',
    description: 'ChatGPT responses about "AI coding tutors for beginners" no longer reference our CodeTutor AI review article. The content may need freshness and authority signals.',
    detectedAt: '2026-03-12T15:45:00Z',
    status: 'resolved',
    actionRequired: 'Article was updated on March 14 with fresh data points and expert quotes. Monitor GEO citations for 7 days to confirm restoration.',
    contentUrl: '/app/content/codetutor-review',
    metrics: {
      label: 'GEO Citations',
      before: '4 engines',
      after: '3 engines',
    },
  },
  // 2x conversion-drop (low)
  {
    id: 'ref-011',
    productId: 'prod-011',
    productName: 'ClassPilot',
    triggerType: 'conversion-drop',
    severity: 'low',
    title: 'Conversion rate dropped 62% for ClassPilot',
    description: 'The ClassPilot review page conversion rate dropped from 3.2% to 1.2% over the past 14 days. Traffic volume remains stable, suggesting an on-page issue or product-side change.',
    detectedAt: '2026-03-16T08:00:00Z',
    status: 'resolved',
    actionRequired: 'Check if the affiliate link is still active, verify the CTA buttons work, and test the landing page for any changes. Consider A/B testing a new CTA layout.',
    contentUrl: '/app/content/classpilot-review',
    metrics: {
      label: 'Conversion Rate',
      before: '3.2%',
      after: '1.2%',
    },
  },
  {
    id: 'ref-012',
    productId: 'prod-012',
    productName: 'PresentAI',
    triggerType: 'conversion-drop',
    severity: 'low',
    title: 'Click-through rate declining for PresentAI affiliate links',
    description: 'PresentAI affiliate link CTR has dropped from 8.5% to 5.1% over 21 days. The product recently changed their landing page design which may be causing friction.',
    detectedAt: '2026-03-11T12:00:00Z',
    status: 'dismissed',
    actionRequired: 'Low priority. Monitor for another week. If CTR continues to drop, consider updating the CTA copy and testing direct-to-pricing links instead of homepage links.',
    contentUrl: '/app/content/presentai-review',
    metrics: {
      label: 'Click-through Rate',
      before: '8.5%',
      after: '5.1%',
    },
  },
];

export async function getRefreshAlerts(): Promise<RefreshAlert[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return REFRESH_ALERTS;
}
