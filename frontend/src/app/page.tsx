import React from 'react';
import Link from 'next/link';
import { ArrowRight, Radar, BarChart3, Zap, Target, LineChart, Brain } from 'lucide-react';
import AuthAwareButtons from '@/components/AuthAwareButtons';
import HomePricing from "@/components/HomePricing";
import LandingNav from "@/components/LandingNav";

export default function Home() {
  const productName = process.env.NEXT_PUBLIC_PRODUCTNAME;

  const features = [
    {
      icon: Radar,
      title: '8 Discovery Feeds',
      description: 'SERP gaps, GSC mining, KGR weak-spots, pSEO, AI proxy, Reddit, YouTube comments, and blog overlap — running in parallel.',
      color: 'text-indigo-600'
    },
    {
      icon: Brain,
      title: 'AI-Powered Scoring',
      description: '5-point scoring engine evaluates every opportunity on product newness, LLM gap strength, buying intent, affiliate availability, and Google gap strength.',
      color: 'text-violet-600'
    },
    {
      icon: Zap,
      title: '6-Format Content Engine',
      description: 'Auto-generate SEO articles, YouTube scripts, Pinterest pins, social posts, Reddit drafts, and email sequences from a single brief.',
      color: 'text-cyan-600'
    },
    {
      icon: Target,
      title: 'GEO Citation Tracking',
      description: 'Monitor your presence across Perplexity, ChatGPT, Gemini, and Copilot. Know where AI is citing your content.',
      color: 'text-emerald-600'
    },
    {
      icon: LineChart,
      title: 'Revenue Attribution',
      description: 'UTM-based 3-layer attribution connects every click to commission. See exactly which content drives revenue.',
      color: 'text-amber-600'
    },
    {
      icon: BarChart3,
      title: 'Optimisation Engine',
      description: 'Automatic weight adjustment, A/B testing across formats, niche pivot triggers, and weekly performance reports.',
      color: 'text-rose-600'
    }
  ];

  const stats = [
    { label: 'Opportunities Scored', value: '12K+' },
    { label: 'Content Pieces Generated', value: '8K+' },
    { label: 'Revenue Tracked', value: '$2.4M+' },
    { label: 'Avg. Gap Window', value: '< 48h' }
  ];

  return (
      <div className="min-h-screen">
        <LandingNav />

        <section className="relative pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-white" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                Now tracking AI/SaaS affiliate programs
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
                Find winning affiliates
                <span className="block bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">before anyone else</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                8 parallel discovery feeds. AI-powered scoring. Automated content generation.
                Stop guessing which products to promote — let intelligence drive your revenue.
              </p>
              <div className="mt-10 flex gap-4 justify-center">
                <AuthAwareButtons />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl font-bold text-gray-900">{stat.value}</div>
                    <div className="mt-2 text-sm text-gray-500 font-medium">{stat.label}</div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">The full affiliate intelligence stack</h2>
              <p className="mt-4 text-lg text-gray-600">
                From discovery to revenue — every step automated and measured
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                  <div
                      key={index}
                      className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all"
                  >
                    <div className={`inline-flex p-2.5 rounded-lg bg-gray-50 ${feature.color}`}>
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
              ))}
            </div>
          </div>
        </section>

        <HomePricing />

        <section className="py-24 bg-gradient-to-br from-primary-700 to-primary-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white">
              Stop leaving affiliate revenue on the table
            </h2>
            <p className="mt-4 text-lg text-primary-200">
              Every hour you wait, competitors are capturing gap windows you could own.
            </p>
            <Link
                href="/auth/register"
                className="mt-8 inline-flex items-center px-6 py-3 rounded-lg bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-colors"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>

        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Product</h4>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="#features" className="text-gray-500 hover:text-gray-900 text-sm">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#pricing" className="text-gray-500 hover:text-gray-900 text-sm">
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Platform</h4>
                <ul className="mt-4 space-y-2">
                  <li><span className="text-gray-500 text-sm">Intelligence Feeds</span></li>
                  <li><span className="text-gray-500 text-sm">Content Engine</span></li>
                  <li><span className="text-gray-500 text-sm">Analytics</span></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Legal</h4>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="/legal/privacy" className="text-gray-500 hover:text-gray-900 text-sm">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal/terms" className="text-gray-500 hover:text-gray-900 text-sm">
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-100">
              <p className="text-center text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} {productName}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
  );
}
