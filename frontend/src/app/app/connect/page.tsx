"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Loader2,
  Globe,
  KeyRound,
  ExternalLink,
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
import { PageHeader } from "@/components/dashboard";

// ── Types ────────────────────────────────────────────────────────────

interface WordPressConnection {
  siteUrl: string;
  username: string;
  seoPlugin: string;
  connectedAt: string;
}

interface ApiKeyConfig {
  key: string;
  label: string;
  placeholder: string;
  configured: boolean;
}

// ── Password Input ───────────────────────────────────────────────────

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  configured?: boolean;
}

function PasswordInput({
  value,
  onChange,
  placeholder,
  configured,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={configured && !value ? "********" : placeholder}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        aria-label={visible ? "Hide" : "Show"}
      >
        {visible ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

// ── Status Indicator ─────────────────────────────────────────────────

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      {ok ? (
        <>
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-green-700">Configured</span>
        </>
      ) : (
        <>
          <span className="h-2 w-2 rounded-full bg-gray-300" />
          <span className="text-gray-500">Not configured</span>
        </>
      )}
    </span>
  );
}

// ── WordPress Card ───────────────────────────────────────────────────

function WordPressCard() {
  const [connection, setConnection] = useState<WordPressConnection | null>({
    siteUrl: "https://gwaffiliates.com",
    username: "gw-admin",
    seoPlugin: "Yoast SEO",
    connectedAt: "2026-03-10T08:00:00Z",
  });
  const [formUrl, setFormUrl] = useState("");
  const [formUser, setFormUser] = useState("");
  const [formPass, setFormPass] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    // Simulate 2s connection check
    await new Promise((r) => setTimeout(r, 2000));
    setTesting(false);
    setTestResult("Connected! Detected: Yoast SEO");
  };

  const handleSave = () => {
    setConnection({
      siteUrl: formUrl,
      username: formUser,
      seoPlugin: "Yoast SEO",
      connectedAt: new Date().toISOString(),
    });
    setFormUrl("");
    setFormUser("");
    setFormPass("");
    setTestResult(null);
    console.log("WordPress connection saved:", { formUrl, formUser });
  };

  const handleDisconnect = () => {
    setConnection(null);
    console.log("WordPress disconnected");
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
              <CardTitle className="text-lg">WordPress Site</CardTitle>
              <CardDescription>
                Publish articles directly to your WordPress blog
              </CardDescription>
            </div>
          </div>
          {connection && (
            <Badge className="border-transparent bg-green-100 text-green-800">
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {connection ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-green-800">
                  {connection.siteUrl}
                </p>
                <span className="text-green-600 block">
                  User: {connection.username} &middot; SEO Plugin:{" "}
                  <Badge
                    variant="secondary"
                    className="ml-1 text-xs bg-green-100 text-green-700"
                  >
                    {connection.seoPlugin}
                  </Badge>
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site URL
                </label>
                <Input
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://yourblog.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <Input
                  value={formUser}
                  onChange={(e) => setFormUser(e.target.value)}
                  placeholder="wp-admin-user"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Password
                </label>
                <PasswordInput
                  value={formPass}
                  onChange={setFormPass}
                  placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Generate an Application Password in WordPress &rarr; Users
                  &rarr; Profile &rarr; Application Passwords
                </p>
              </div>
            </div>

            {testResult && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
                <CheckCircle className="h-4 w-4 shrink-0" />
                {testResult}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={testing || !formUrl || !formUser || !formPass}
              >
                {testing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Test Connection
              </Button>
              <Button
                onClick={handleSave}
                disabled={!testResult}
                className="bg-primary-600 text-white hover:bg-primary-700"
              >
                Save Connection
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── GSC Card ─────────────────────────────────────────────────────────

function GSCCard() {
  const [connected] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <ExternalLink className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Google Search Console</CardTitle>
              <CardDescription>
                Import keyword data and track SERP positions
              </CardDescription>
            </div>
          </div>
          {connected ? (
            <Badge className="border-transparent bg-green-100 text-green-800">
              Connected
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-gray-500 border-gray-300"
            >
              Not connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {connected ? (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
            <CheckCircle className="h-4 w-4 shrink-0" />
            Connected to property
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <XCircle className="h-4 w-4 shrink-0" />
              No Google Search Console property connected
            </div>
            <Button
              variant="outline"
              onClick={() =>
                console.log("OAuth flow would start here for GSC")
              }
            >
              Connect GSC
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── API Keys Card ────────────────────────────────────────────────────

function ApiKeysCard() {
  const [keys, setKeys] = useState<ApiKeyConfig[]>([
    {
      key: "claude",
      label: "Anthropic Claude API Key",
      placeholder: "sk-ant-...",
      configured: true,
    },
    {
      key: "perplexity",
      label: "Perplexity API Key",
      placeholder: "pplx-...",
      configured: false,
    },
    {
      key: "neuronwriter",
      label: "NeuronWriter API Key",
      placeholder: "nw_...",
      configured: false,
    },
    {
      key: "producthunt",
      label: "Product Hunt Developer Token",
      placeholder: "ph_...",
      configured: true,
    },
  ]);

  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const handleValueChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    // Mark any keys that now have values as configured
    setKeys((prev) =>
      prev.map((k) => ({
        ...k,
        configured: k.configured || !!values[k.key]?.trim(),
      })),
    );
    setSaved(true);
    console.log(
      "API keys saved:",
      Object.keys(values).filter((k) => values[k]?.trim()),
    );
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
            <KeyRound className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <CardTitle className="text-lg">API Keys</CardTitle>
            <CardDescription>
              Configure API keys for AI and data services
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {keys.map((apiKey) => (
            <div key={apiKey.key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  {apiKey.label}
                </label>
                <StatusDot ok={apiKey.configured} />
              </div>
              <PasswordInput
                value={values[apiKey.key] || ""}
                onChange={(v) => handleValueChange(apiKey.key, v)}
                placeholder={apiKey.placeholder}
                configured={apiKey.configured}
              />
            </div>
          ))}

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleSave}
              className="bg-primary-600 text-white hover:bg-primary-700"
            >
              Save Keys
            </Button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" />
                Keys saved successfully
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────

export default function ConnectionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Connections"
        description="Connect your WordPress site and API integrations"
      />

      <div className="grid grid-cols-1 gap-6">
        <WordPressCard />
        <GSCCard />
        <ApiKeysCard />
      </div>
    </div>
  );
}
