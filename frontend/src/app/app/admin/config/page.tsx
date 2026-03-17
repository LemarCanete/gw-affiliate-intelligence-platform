"use client";

import React, { useCallback, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { getSystemConfig } from "@/lib/mock-data/admin";
import type { SystemConfig } from "@/lib/mock-data/admin";

const CATEGORY_LABELS: Record<SystemConfig["category"], string> = {
  scoring: "Scoring",
  feeds: "Feeds",
  content: "Content",
  publishing: "Publishing",
};

const CATEGORY_ORDER: SystemConfig["category"][] = ["scoring", "feeds", "content", "publishing"];

export default function AdminConfigPage() {
  const fetchConfig = useCallback(() => getSystemConfig(), []);
  const { data: config } = useAsyncData<SystemConfig[]>(fetchConfig);

  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  // Initialise local values from fetched config
  React.useEffect(() => {
    if (config && Object.keys(values).length === 0) {
      const init: Record<string, string> = {};
      config.forEach((c) => { init[c.key] = c.value; });
      setValues(init);
    }
  }, [config, values]);

  const handleChange = (key: string, newValue: string) => {
    setValues((prev) => ({ ...prev, [key]: newValue }));
    console.log(`Config changed: ${key} = ${newValue}`);
    setSaved(false);
  };

  const handleSave = () => {
    console.log("Saving config:", values);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const grouped = React.useMemo(() => {
    if (!config) return {};
    const map: Record<string, SystemConfig[]> = {};
    config.forEach((c) => {
      if (!map[c.category]) map[c.category] = [];
      map[c.category].push(c);
    });
    return map;
  }, [config]);

  return (
    <div className="space-y-6">
      <PageHeader title="System Configuration" description="Manage scoring, feed, content, and publishing settings" />

      {CATEGORY_ORDER.map((cat) => {
        const items = grouped[cat];
        if (!items) return null;
        return (
          <Card key={cat}>
            <CardHeader>
              <CardTitle className="text-lg">{CATEGORY_LABELS[cat]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => {
                const val = values[item.key] ?? item.value;
                return (
                  <div key={item.key} className="flex items-start justify-between gap-6 py-2 border-b border-gray-50 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    </div>
                    <div className="w-48 shrink-0">
                      {item.type === "toggle" ? (
                        <button
                          onClick={() => handleChange(item.key, val === "true" ? "false" : "true")}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            val === "true" ? "bg-primary-600" : "bg-gray-300"
                          }`}
                          role="switch"
                          aria-checked={val === "true"}
                          aria-label={item.label}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              val === "true" ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      ) : item.type === "number" ? (
                        <Input
                          type="number"
                          value={val}
                          onChange={(e) => handleChange(item.key, e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        <Input
                          type="text"
                          value={val}
                          onChange={(e) => handleChange(item.key, e.target.value)}
                          className="w-full"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          Save Changes
        </button>
        {saved && (
          <span className="text-sm text-green-600 font-medium">
            Configuration saved successfully.
          </span>
        )}
      </div>
    </div>
  );
}
