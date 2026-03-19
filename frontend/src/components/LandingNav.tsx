"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Radar,
  ChevronDown,
  Search,
  Brain,
  Zap,
  Target,
  LineChart,
  BarChart3,
  Layers,
  FileText,
  PenTool,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Play,
  Menu,
  X,
} from "lucide-react";
import AuthAwareButtons from "@/components/AuthAwareButtons";

interface DropdownItem {
  icon: React.ElementType;
  label: string;
  description: string;
  href: string;
}

interface NavDropdown {
  label: string;
  items: DropdownItem[];
}

const productDropdown: NavDropdown = {
  label: "Products",
  items: [
    { icon: Search, label: "SERP Gap Scanner", description: "Discover products with zero review content", href: "#features" },
    { icon: Brain, label: "AI Scoring Engine", description: "5-factor gap prioritisation matrix", href: "#features" },
    { icon: Zap, label: "Content Engine", description: "6-format content from a single brief", href: "#features" },
    { icon: Target, label: "GEO Citation Tracker", description: "Monitor AI engine citations", href: "#features" },
    { icon: LineChart, label: "Revenue Attribution", description: "UTM-based 3-layer tracking", href: "#features" },
    { icon: BarChart3, label: "Optimisation Engine", description: "Auto-adjust weights and A/B test", href: "#features" },
  ],
};

const solutionsDropdown: NavDropdown = {
  label: "Solutions",
  items: [
    { icon: Radar, label: "First-Mover Advantage", description: "Capture gap windows before competitors", href: "#features" },
    { icon: Layers, label: "Multi-Platform Publishing", description: "Blog, YouTube, Pinterest, social, email", href: "#features" },
    { icon: PenTool, label: "Content at Scale", description: "Generate review, comparison, and how-to content", href: "#features" },
    { icon: FileText, label: "Weekly Intelligence Reports", description: "Automated performance and pipeline reports", href: "#features" },
  ],
};

const resourcesDropdown: NavDropdown = {
  label: "Resources",
  items: [
    { icon: BookOpen, label: "Documentation", description: "Platform guides and API reference", href: "#" },
    { icon: Play, label: "Getting Started", description: "Quick start guide for new users", href: "#" },
    { icon: MessageSquare, label: "Community", description: "Join the affiliate intelligence community", href: "#" },
    { icon: HelpCircle, label: "Support", description: "Get help from our team", href: "#" },
  ],
};

function DesktopDropdown({ dropdown }: { dropdown: NavDropdown }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
      >
        {dropdown.label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[420px] bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-50">
          <div className="grid gap-1">
            {dropdown.items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-primary-50 text-primary-600 group-hover:bg-primary-100 shrink-0 mt-0.5">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LandingNav() {
  const productName = process.env.NEXT_PUBLIC_PRODUCTNAME;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const dropdowns = [productDropdown, solutionsDropdown, resourcesDropdown];

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <img src="/gigwavelogo.png" alt="GW" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              {productName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {dropdowns.map((d) => (
              <DesktopDropdown key={d.label} dropdown={d} />
            ))}
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Pricing
            </Link>
            <div className="flex items-center gap-4 pl-4 ml-2 border-l border-gray-200">
              <AuthAwareButtons variant="nav" />
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {dropdowns.map((dropdown) => (
              <div key={dropdown.label}>
                <button
                  onClick={() =>
                    setMobileExpanded(mobileExpanded === dropdown.label ? null : dropdown.label)
                  }
                  className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {dropdown.label}
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                      mobileExpanded === dropdown.label ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileExpanded === dropdown.label && (
                  <div className="pl-3 pb-2 space-y-1">
                    {dropdown.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50"
                      >
                        <item.icon className="h-4 w-4 text-primary-600 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="#pricing"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Pricing
            </Link>
            <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
              <AuthAwareButtons variant="nav" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
