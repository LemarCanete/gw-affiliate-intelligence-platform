# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The **GW Affiliate Intelligence Platform** is an automated system that discovers high-potential affiliate marketing opportunities before competitors, generates multi-format content, distributes it across platforms, tracks performance, and optimises based on revenue data. The full specification lives in `docs/GW_Complete_System_Specification.docx`.

The platform has five core modules:
1. **Product Intelligence** — 8 parallel feeds (SERP gap scanner, GSC miner, KGR weak-spot finder, pSEO engine, AI proxy generator, Reddit miner, YouTube comment miner, YT+Blog overlap finder) feeding a 5-point scoring engine (threshold: 18/25)
2. **Content Generation** — Automated product briefs via Claude API, then a 6-format content engine (SEO article, YouTube script, Pinterest pins, social posts, Reddit draft, email)
3. **Publishing Automation** — Blog-first distribution (WordPress, YouTube, Pinterest, social via Buffer/Publer, email via ConvertKit/Mailchimp). Reddit is manual only. Orchestrated via n8n (14-step pipeline)
4. **Tracking & Attribution** — UTM-based 3-layer attribution, SERP rank tracking, GEO citation tracking (Perplexity, ChatGPT, Gemini, Copilot), commission dashboard with 5 views
5. **Optimisation Engine** — Scoring weight adjustment, feed prioritisation, content format A/B testing, niche pivot criteria, content refresh triggers, weekly performance reports

### Three-Stage Roadmap
- **Stage 1**: Manual proof-of-concept with Python scripts + Claude API
- **Stage 2**: n8n workflow automation
- **Stage 3**: Full SaaS product (this repo's frontend)

### Target Niche (Phase 1)
AI/SaaS tools in education and productivity — high Product Hunt launch volume, strong affiliate programs (20-40% recurring).

## Repository Structure

- `frontend/` — Next.js 15 SaaS dashboard (currently a template being adapted)
- `backend/` — Reserved for Python FastAPI backend (not yet built)
- `supabase/` — Supabase config and SQL migrations
- `docs/` — Product specification (`.docx`)

## Commands

All frontend commands run from `frontend/`:

```bash
cd frontend
npm run dev      # Dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint
npm start        # Production server
```

No test framework is configured yet. No backend commands exist yet.

## Frontend Architecture (Template — Will Be Adapted)

The frontend is a Next.js 15 App Router app bootstrapped from a SaaS template. It will be restructured to match the SaaS dashboard spec (Section 9.4: Overview, Products, Intelligence Feeds, Analytics, Reports pages).

**Current route groups:**
- `/` — Public landing page
- `/auth/*` — Login, register, password reset, 2FA, email verification
- `/app/*` — Authenticated area (protected by middleware redirecting to `/auth/login`)
- `/legal/*` — Privacy, terms, refund (markdown in `public/terms/`)
- `/api/auth/callback` — OAuth code exchange with MFA check

**Key patterns:**
- `GlobalProvider` (`src/lib/context/GlobalContext.tsx`) loads user via Supabase and exposes `useGlobal()` hook
- `AppLayout` (`src/components/AppLayout.tsx`) provides sidebar + top bar for `/app/*` routes
- Supabase clients in `src/lib/supabase/`: `client.ts` (browser), `server.ts` (SSR), `serverAdminClient.ts` (service role), `unified.ts` (`SassClient` wrapper class)
- Database types generated in `src/lib/types.ts` — all Supabase clients use the `Database` type
- Theming via CSS variables (`--color-primary-*`) applied through a class on `<body>` (configurable via `NEXT_PUBLIC_THEME`)
- UI components follow shadcn/ui pattern in `src/components/ui/`. Icons from `lucide-react`. Charts via `recharts`.

## Target Tech Stack (from spec)

- **Frontend**: Next.js (React) — this repo
- **Backend**: Python (FastAPI)
- **Database**: PostgreSQL (Supabase) + Redis
- **AI**: Anthropic Claude API
- **Auth**: Supabase Auth (current template uses this; spec mentions Clerk/Auth0 as alternatives)
- **Payments**: Stripe (spec) / Paddle (template has dependency)
- **Hosting**: Vercel + Railway/Render + Supabase

## Environment Variables

Copy `frontend/.env.template` to `frontend/.env.local`. Key variables:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase credentials
- `PRIVATE_SUPABASE_SERVICE_KEY` — Service role key (server-side only)
- `NEXT_PUBLIC_PRODUCTNAME` — App display name
- `NEXT_PUBLIC_SSO_PROVIDERS` — Comma-separated OAuth providers
- `NEXT_PUBLIC_THEME` — CSS theme class
- `NEXT_PUBLIC_TIERS_*` — Pricing tier config (env-driven via `PricingService` in `src/lib/pricing.ts`)

## Database

Supabase migrations in `supabase/supabase/migrations/`. Current schema has only template tables (`todo_list`, storage policies, MFA). Will need new migrations for the platform's domain models (products, keywords, scores, content assets, publish status, tracking data).
