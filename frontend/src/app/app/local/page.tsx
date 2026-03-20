"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import {
  MapPin,
  Building2,
  Loader2,
  CheckCircle,
  Search,
  ArrowRight,
} from "lucide-react";

const SERVICE_CATEGORIES = [
  "Plumber",
  "Electrician",
  "Dentist",
  "Lawyer",
  "Accountant",
  "Real Estate Agent",
  "Personal Trainer",
  "Photographer",
  "Restaurant",
  "Auto Mechanic",
  "Hair Salon",
  "Chiropractor",
  "Veterinarian",
  "Cleaning Service",
  "Landscaping",
  "HVAC",
  "Roofing",
  "Interior Designer",
  "Marketing Agency",
  "Web Developer",
];

interface LocalQuery {
  id: string;
  businessName: string;
  city: string;
  category: string;
  queries: string[];
  status: "pending" | "validating" | "gap-found" | "no-gap";
  createdAt: string;
}

export default function LocalBusinessPage() {
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [submissions, setSubmissions] = useState<LocalQuery[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !city.trim() || !category) return;

    setSubmitting(true);

    // Generate target queries automatically
    const queries = [
      `Best ${category.toLowerCase()} in ${city}`,
      `${businessName} ${city} reviews`,
      `Is ${businessName} good`,
      `${category.toLowerCase()} near ${city}`,
      `${businessName} vs competitors ${city}`,
    ];

    // Simulate processing
    await new Promise((r) => setTimeout(r, 1500));

    const newSubmission: LocalQuery = {
      id: `local-${Date.now()}`,
      businessName: businessName.trim(),
      city: city.trim(),
      category,
      queries,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setSubmissions((prev) => [newSubmission, ...prev]);
    setSuccess(`"${businessName}" in ${city} added. ${queries.length} target queries generated.`);
    setSubmitting(false);

    // Reset form
    setBusinessName("");
    setCity("");
    setRegion("");
    setCategory("");
    setWebsite("");
    setPhone("");
    setNotes("");

    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Local Business GEO"
        description="Module B — Generate local authority content for businesses"
      >
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">Module B</Badge>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-primary-600" />
                Add Local Business
              </CardTitle>
              <CardDescription>
                Enter a business name, city, and category. The system will auto-generate target queries
                and check if LLMs can recommend this business for local searches.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <div className="mb-4 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Business Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g. Smith & Sons Plumbing"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      City <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g. Austin"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">State / Region</label>
                    <Input
                      placeholder="e.g. Texas"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Business Website</label>
                    <Input
                      placeholder="https://smithplumbing.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      placeholder="+1 (512) 555-0123"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    placeholder="Any additional info — services offered, competitive advantages, target areas..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Preview generated queries */}
                {businessName && city && category && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Target queries that will be generated:</p>
                    <ul className="space-y-1">
                      {[
                        `Best ${category.toLowerCase()} in ${city}`,
                        `${businessName} ${city} reviews`,
                        `Is ${businessName} good`,
                        `${category.toLowerCase()} near ${city}`,
                        `${businessName} vs competitors ${city}`,
                      ].map((q, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <Search className="h-3 w-3 text-gray-400 shrink-0" />
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary-600 text-white hover:bg-primary-700"
                  disabled={!businessName.trim() || !city.trim() || !category || submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Add Business & Generate Queries
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* How it works */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">How Module B Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0 text-xs font-bold text-primary-700">1</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">You input the business</p>
                  <p className="text-xs text-gray-500">Name, city, category</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0 text-xs font-bold text-primary-700">2</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Queries auto-generated</p>
                  <p className="text-xs text-gray-500">&ldquo;Best plumber in Austin&rdquo;, etc.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0 text-xs font-bold text-primary-700">3</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">LLM gap validation</p>
                  <p className="text-xs text-gray-500">Check if ChatGPT/Perplexity recommends this business</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0 text-xs font-bold text-primary-700">4</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Local content generated</p>
                  <p className="text-xs text-gray-500">Local Authority page + Service FAQ</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0 text-xs font-bold text-primary-700">5</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Publish + Monitor</p>
                  <p className="text-xs text-gray-500">WordPress with LocalBusiness schema, then track citations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submissions list */}
      {submissions.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{sub.businessName}</p>
                      <p className="text-xs text-gray-500">{sub.category} in {sub.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{sub.queries.length} queries</span>
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      {sub.status === "pending" ? "Pending Validation" : sub.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          title="No local businesses yet"
          description="Add a business above to start generating local GEO content."
        />
      )}
    </div>
  );
}
