import React from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Brain, PenTool, Zap, Globe, Eye } from 'lucide-react';
import AuthAwareButtons from '@/components/AuthAwareButtons';
import HomePricing from "@/components/HomePricing";
import LandingNav from "@/components/LandingNav";

export default function Home() {
  const productName = process.env.NEXT_PUBLIC_PRODUCTNAME;

  const features = [
    {
      icon: Search,
      title: 'Keyword Intelligence',
      description: 'Discover high-potential keywords with volume, difficulty, CPC, and intent data. Find gaps your competitors missed.',
      color: 'text-blue-600'
    },
    {
      icon: Brain,
      title: 'LLM Gap Detection',
      description: 'Check what ChatGPT, Perplexity, and Google AI Overviews know about your topic. Target gaps where LLMs have no answer.',
      color: 'text-violet-600'
    },
    {
      icon: PenTool,
      title: 'AI Content Writer',
      description: 'Generate SEO-optimized articles with Claude. Direct answer blocks, structured H2s, FAQ sections — built for both Google and LLMs.',
      color: 'text-cyan-600'
    },
    {
      icon: Zap,
      title: 'NeuronWriter Optimization',
      description: 'Optimize every article with semantic terms, PAA questions, and content scoring. Hit score 65+ before publishing.',
      color: 'text-amber-600'
    },
    {
      icon: Globe,
      title: 'WordPress Publishing',
      description: 'One-click publish to WordPress with RankMath/Yoast integration. Schema markup, meta tags, and affiliate links — all automated.',
      color: 'text-emerald-600'
    },
    {
      icon: Eye,
      title: 'Citation Monitoring',
      description: 'Track if AI engines cite your content. Monitor GSC rankings, clicks, impressions, CTR, and AI Overview appearances.',
      color: 'text-rose-600'
    }
  ];

  const stats = [
    { label: 'Keywords Analyzed', value: '50K+' },
    { label: 'Articles Published', value: '2,400+' },
    { label: 'LLM Citations Achieved', value: '890+' },
    { label: 'Avg. Content Score', value: '78/100' }
  ];

  const steps = [
    {
      number: 1,
      title: 'Research keywords',
      description: 'Find opportunities with volume, difficulty, and LLM gap data.'
    },
    {
      number: 2,
      title: 'Check the gap',
      description: 'Query ChatGPT + Perplexity to confirm where LLMs lack answers.'
    },
    {
      number: 3,
      title: 'Generate content',
      description: 'AI writes structured, GEO-optimized articles with direct answer blocks.'
    },
    {
      number: 4,
      title: 'Optimize',
      description: 'NeuronWriter semantic scoring ensures every article hits 65+.'
    },
    {
      number: 5,
      title: 'Publish',
      description: 'WordPress with full SEO metadata, schema markup, and internal links.'
    },
    {
      number: 6,
      title: 'Monitor',
      description: 'Track Google rankings and LLM citations over time.'
    }
  ];

  return (
      <div className="min-h-screen">
        <LandingNav />

        {/* Hero */}
        <section className="relative pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-white" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                Now with AI Overview tracking
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
                Rank on Google. Get Cited by AI.
                <span className="block bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">The SEO/GEO content platform.</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                From keyword research to published article — automated. Write content that ranks
                on Google AND gets cited by ChatGPT, Perplexity, and AI Overviews.
              </p>
              <div className="mt-10 flex gap-4 justify-center">
                <AuthAwareButtons />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
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

        {/* Features */}
        <section id="features" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Everything you need to rank and get cited</h2>
              <p className="mt-4 text-lg text-gray-600">
                From keyword research to citation monitoring — one platform, fully automated
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

        {/* How It Works */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
              <p className="mt-4 text-lg text-gray-600">
                Six stages from research to results — fully automated
              </p>
            </div>
            <div className="relative">
              {steps.map((step, index) => (
                  <div key={step.number} className="relative flex items-start gap-6 pb-12 last:pb-0">
                    {/* Vertical line */}
                    {index < steps.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200 -translate-x-1/2" />
                    )}
                    {/* Number circle */}
                    <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                      {step.number}
                    </div>
                    {/* Content */}
                    <div className="pt-2">
                      <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                      <p className="mt-1 text-gray-600 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <HomePricing />

        {/* CTA */}
        <section className="py-24 bg-gradient-to-br from-primary-700 to-primary-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white">
              Stop guessing what to write.
            </h2>
            <p className="mt-4 text-lg text-primary-200">
              Let data and AI intelligence drive your content strategy. Rank on Google. Get cited by AI.
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

        {/* Footer */}
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
                  <li><span className="text-gray-500 text-sm">Keyword Research</span></li>
                  <li><span className="text-gray-500 text-sm">Content Writer</span></li>
                  <li><span className="text-gray-500 text-sm">Monitoring</span></li>
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
