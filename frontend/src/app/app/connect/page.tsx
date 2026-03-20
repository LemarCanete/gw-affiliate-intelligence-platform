"use client";

import { useState, useEffect } from "react";
import { apiPost } from "@/lib/api";
import {
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Loader2,
  Globe,
  ExternalLink,
  Search,
  BarChart3,
  Brain,
  Database,
  Zap,
  FileSearch,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/dashboard";
import { getUserSettings, saveUserSettings } from "@/lib/data/settings";

// ── Shared Components ───────────────────────────────────────────────

function PasswordInput({
  value,
  onChange,
  placeholder,
  configured,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  configured?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={configured && !value ? "••••••••••••" : placeholder}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function ConnectorStatus({ connected }: { connected: boolean }) {
  return connected ? (
    <Badge className="border-transparent bg-green-100 text-green-800">Connected</Badge>
  ) : (
    <Badge variant="outline" className="text-gray-500 border-gray-300">Not connected</Badge>
  );
}

function OAuthCard({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  connected,
  propertyName,
  onConnect,
  onDisconnect,
  features,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  connected: boolean;
  propertyName?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  features: string[];
}) {
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    await new Promise((r) => setTimeout(r, 1500));
    onConnect();
    setConnecting(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
              <span className={iconColor}>{icon}</span>
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <ConnectorStatus connected={connected} />
        </div>
      </CardHeader>
      <CardContent>
        {connected ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
              <CheckCircle className="h-4 w-4 shrink-0" />
              {propertyName || "Connected successfully"}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {features.map((f) => (
                <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-600 hover:bg-red-50"
              onClick={onDisconnect}
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <XCircle className="h-4 w-4 shrink-0" />
              Not connected — click below to authorize
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {features.map((f) => (
                <Badge key={f} variant="outline" className="text-xs text-gray-400">{f}</Badge>
              ))}
            </div>
            <Button onClick={handleConnect} disabled={connecting}>
              {connecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Connect {title}
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── WordPress Card ──────────────────────────────────────────────────

function WordPressCard() {
  const [connected, setConnected] = useState(false);
  const [siteUrl, setSiteUrl] = useState("");
  const [username, setUsername] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [seoPlugin, setSeoPlugin] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    getUserSettings().then((settings) => {
      if (settings?.wp_connected) {
        setConnected(true);
        setSiteUrl((settings.wp_site_url as string) ?? "");
        setUsername((settings.wp_username as string) ?? "");
        setSeoPlugin((settings.wp_seo_plugin as string) ?? "");
      }
    });
  }, []);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const data = await apiPost("/api/wordpress/test", {
        site_url: siteUrl,
        username,
        app_password: appPassword,
      });
      if (data.connected) {
        if (data.seo_plugin === "rankmath") {
          setTestResult("Connected! RankMath detected.");
          setSeoPlugin("RankMath");
        } else {
          setTestResult("Failed: RankMath SEO plugin is required. Please install and activate RankMath on your WordPress site.");
          return;
        }
      } else {
        setTestResult(`Failed: ${data.error || "Could not connect"}`);
      }
    } catch (err) {
      setTestResult(`Failed: ${err instanceof Error ? err.message : "Connection error"}`);
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    setConnected(true);
    await saveUserSettings({
      wp_connected: true,
      wp_site_url: siteUrl,
      wp_username: username,
      wp_app_password: appPassword,
      wp_seo_plugin: "rankmath",
    });
    setAppPassword("");
    setTestResult(null);
  };

  const handleDisconnect = async () => {
    setConnected(false);
    setSiteUrl("");
    setUsername("");
    setAppPassword("");
    setSeoPlugin("");
    setTestResult(null);
    await saveUserSettings({ wp_connected: false });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Globe className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">WordPress</CardTitle>
              <CardDescription>Publish articles directly to your WordPress site</CardDescription>
            </div>
          </div>
          <ConnectorStatus connected={connected} />
        </div>
      </CardHeader>
      <CardContent>
        {connected ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{siteUrl} &middot; {username} &middot; {seoPlugin || "SEO plugin detected"}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="text-xs">Auto-publish</Badge>
              <Badge variant="outline" className="text-xs">Schema injection</Badge>
              <Badge variant="outline" className="text-xs">SEO meta fields</Badge>
              <Badge variant="outline" className="text-xs">Image upload</Badge>
            </div>
            <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site URL</label>
                <Input value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} placeholder="https://yourblog.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="wp-admin" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Password</label>
              <PasswordInput value={appPassword} onChange={setAppPassword} placeholder="xxxx xxxx xxxx xxxx" />
              <p className="mt-1 text-xs text-gray-500">WordPress → Users → Profile → Application Passwords</p>
            </div>
            {testResult && (
              <div className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${testResult.startsWith("Connected") ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"}`}>
                {testResult.startsWith("Connected") ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {testResult}
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleTest} disabled={testing || !siteUrl || !username || !appPassword}>
                {testing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Test Connection
              </Button>
              <Button onClick={handleSave} disabled={!testResult?.startsWith("Connected")} className="bg-primary-600 text-white hover:bg-primary-700">
                Save
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

export default function ConnectionsPage() {
  const [gscConnected, setGscConnected] = useState(false);
  const [gaConnected, setGaConnected] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Connections"
        description="Connect your data sources, publishing targets, and API services"
      />

      {/* Publishing */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Publishing</h3>
        <WordPressCard />
      </div>

      <Separator />

      {/* Google Services */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Google Services</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <OAuthCard
            icon={<Search className="h-5 w-5" />}
            iconBg="bg-orange-100"
            iconColor="text-orange-600"
            title="Google Search Console"
            description="Import rankings, clicks, impressions, and CTR data"
            connected={gscConnected}
            propertyName="sc-domain:yourdomain.com"
            onConnect={() => setGscConnected(true)}
            onDisconnect={() => setGscConnected(false)}
            features={["Keyword rankings", "Click data", "Impressions", "CTR", "URL indexing", "Sitemap status"]}
          />
          <OAuthCard
            icon={<BarChart3 className="h-5 w-5" />}
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
            title="Google Analytics"
            description="Track organic traffic, user behavior, and conversions"
            connected={gaConnected}
            propertyName="GA4 Property: 123456789"
            onConnect={() => setGaConnected(true)}
            onDisconnect={() => setGaConnected(false)}
            features={["Organic traffic", "Page views", "Bounce rate", "Conversions", "User flow", "Real-time data"]}
          />
        </div>
      </div>

      <Separator />

      {/* AI & Content Services */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">AI & Content Services</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ApiKeyCard
            icon={<Brain className="h-5 w-5" />}
            iconBg="bg-violet-100"
            iconColor="text-violet-600"
            title="OpenRouter"
            description="AI models for content generation and gap analysis (Claude, GPT-4, Perplexity)"
            keyName="openrouter"
            placeholder="sk-or-v1-..."
            features={["Article generation", "LLM gap checks", "Response classification", "Brief generation"]}
          />
          <ApiKeyCard
            icon={<Zap className="h-5 w-5" />}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            title="NeuronWriter"
            description="Content optimization with semantic terms and scoring"
            keyName="neuronwriter"
            placeholder="nw_..."
            features={["Semantic analysis", "PAA questions", "Content scoring", "Term suggestions"]}
          />
        </div>
      </div>

      <Separator />

      {/* SEO Data Services */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">SEO Data Services</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ApiKeyCard
            icon={<Database className="h-5 w-5" />}
            iconBg="bg-cyan-100"
            iconColor="text-cyan-600"
            title="DataForSEO"
            description="Keyword research, SERP data, volume, difficulty, and competition metrics"
            keyName="dataforseo"
            placeholder="login:password (Base64)"
            features={["Search volume", "Keyword difficulty", "CPC", "SERP features", "Competitor data", "Keyword suggestions"]}
          />
          <ApiKeyCard
            icon={<FileSearch className="h-5 w-5" />}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
            title="SerpAPI"
            description="Google and YouTube SERP analysis for gap detection"
            keyName="serpapi"
            placeholder="abc123..."
            features={["Google SERP analysis", "YouTube search", "PAA extraction", "Featured snippets", "AI Overview detection"]}
          />
        </div>
      </div>
    </div>
  );
}

// ── API Key Card ────────────────────────────────────────────────────

function ApiKeyCard({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  keyName,
  placeholder,
  features,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  keyName: string;
  placeholder: string;
  features: string[];
}) {
  const [value, setValue] = useState("");
  const [configured, setConfigured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getUserSettings().then((settings) => {
      if (settings) {
        const key = `api_key_${keyName}`;
        if (settings[key as keyof typeof settings]) {
          setConfigured(true);
        }
      }
    });
  }, [keyName]);

  const handleSave = async () => {
    if (!value.trim()) return;
    setSaving(true);
    await saveUserSettings({ [`api_key_${keyName}`]: value.trim() });
    setConfigured(true);
    setValue("");
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRemove = async () => {
    await saveUserSettings({ [`api_key_${keyName}`]: null });
    setConfigured(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
              <span className={iconColor}>{icon}</span>
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription className="text-xs">{description}</CardDescription>
            </div>
          </div>
          {configured ? (
            <Badge className="border-transparent bg-green-100 text-green-800 text-xs">Active</Badge>
          ) : (
            <Badge variant="outline" className="text-gray-400 text-xs">Not set</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {features.map((f) => (
            <Badge key={f} variant="outline" className={`text-xs ${configured ? "" : "text-gray-400"}`}>{f}</Badge>
          ))}
        </div>

        {configured ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <CheckCircle className="h-4 w-4" />
              API key configured
            </div>
            <Button variant="outline" size="sm" className="text-xs border-red-200 text-red-500 hover:bg-red-50" onClick={handleRemove}>
              Remove
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <PasswordInput value={value} onChange={setValue} placeholder={placeholder} />
            <Button onClick={handleSave} disabled={!value.trim() || saving} className="bg-primary-600 text-white hover:bg-primary-700 shrink-0">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </div>
        )}

        {saved && (
          <span className="flex items-center gap-1.5 text-xs text-green-700">
            <CheckCircle className="h-3.5 w-3.5" />
            Saved successfully
          </span>
        )}
      </CardContent>
    </Card>
  );
}
