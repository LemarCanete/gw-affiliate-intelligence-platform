export interface WorkflowRun {
  id: string;
  status: "success" | "failed" | "running";
  startedAt: string;
  completedAt: string | null;
  duration: number | null; // seconds
  itemsProcessed: number;
  errors: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: "cron" | "webhook";
  schedule: string | null;
  status: "active" | "paused" | "error";
  lastRun: WorkflowRun | null;
  nextRun: string | null;
  totalRuns: number;
  successRate: number;
  avgDuration: number;
  recentRuns: WorkflowRun[];
}

function makeRun(
  id: string,
  status: WorkflowRun["status"],
  startedAt: string,
  durationSeconds: number | null,
  items: number,
  errors: number
): WorkflowRun {
  const start = new Date(startedAt);
  const completedAt =
    status === "running" || durationSeconds === null
      ? null
      : new Date(start.getTime() + durationSeconds * 1000).toISOString();
  return {
    id,
    status,
    startedAt: start.toISOString(),
    completedAt,
    duration: durationSeconds,
    itemsProcessed: items,
    errors,
  };
}

export async function getWorkflows(): Promise<Workflow[]> {
  await new Promise((r) => setTimeout(r, 100));

  return [
    {
      id: "wf-daily-discovery",
      name: "Daily Discovery",
      description:
        "Scans ProductHunt and AppSumo for new AI/SaaS launches, scores initial potential",
      trigger: "cron",
      schedule: "Daily at 6:00 AM",
      status: "active",
      lastRun: makeRun("run-dd-8", "success", "2026-03-17T06:00:00Z", 142, 14, 0),
      nextRun: "2026-03-18T06:00:00Z",
      totalRuns: 214,
      successRate: 96,
      avgDuration: 138,
      recentRuns: [
        makeRun("run-dd-8", "success", "2026-03-17T06:00:00Z", 142, 14, 0),
        makeRun("run-dd-7", "success", "2026-03-16T06:00:00Z", 131, 11, 0),
        makeRun("run-dd-6", "success", "2026-03-15T06:00:00Z", 155, 18, 0),
        makeRun("run-dd-5", "failed", "2026-03-14T06:00:00Z", 34, 0, 1),
        makeRun("run-dd-4", "success", "2026-03-13T06:00:00Z", 129, 9, 0),
        makeRun("run-dd-3", "success", "2026-03-12T06:00:00Z", 147, 16, 0),
        makeRun("run-dd-2", "success", "2026-03-11T06:00:00Z", 136, 12, 0),
        makeRun("run-dd-1", "success", "2026-03-10T06:00:00Z", 141, 13, 0),
      ],
    },
    {
      id: "wf-weekly-intelligence",
      name: "Weekly Intelligence",
      description:
        "Merges all 8 intelligence feeds into master product queue, applies 5-point scoring engine",
      trigger: "cron",
      schedule: "Every Monday at 7:00 AM",
      status: "active",
      lastRun: makeRun("run-wi-4", "success", "2026-03-16T07:00:00Z", 487, 847, 0),
      nextRun: "2026-03-23T07:00:00Z",
      totalRuns: 47,
      successRate: 100,
      avgDuration: 462,
      recentRuns: [
        makeRun("run-wi-4", "success", "2026-03-16T07:00:00Z", 487, 847, 0),
        makeRun("run-wi-3", "success", "2026-03-09T07:00:00Z", 451, 793, 0),
        makeRun("run-wi-2", "success", "2026-03-02T07:00:00Z", 470, 821, 0),
        makeRun("run-wi-1", "success", "2026-02-23T07:00:00Z", 439, 756, 0),
      ],
    },
    {
      id: "wf-content-generation",
      name: "Content Generation",
      description:
        "Generates 6 content formats per product: SEO article, YouTube script, Pinterest pins, social posts, Reddit draft, email",
      trigger: "webhook",
      schedule: null,
      status: "active",
      lastRun: makeRun("run-cg-12", "success", "2026-03-16T14:32:00Z", 218, 6, 0),
      nextRun: null,
      totalRuns: 156,
      successRate: 92,
      avgDuration: 205,
      recentRuns: [
        makeRun("run-cg-12", "success", "2026-03-16T14:32:00Z", 218, 6, 0),
        makeRun("run-cg-11", "success", "2026-03-15T11:15:00Z", 194, 6, 0),
        makeRun("run-cg-10", "failed", "2026-03-14T16:48:00Z", 87, 2, 1),
        makeRun("run-cg-9", "success", "2026-03-14T09:22:00Z", 211, 6, 0),
        makeRun("run-cg-8", "success", "2026-03-13T13:05:00Z", 199, 6, 0),
        makeRun("run-cg-7", "failed", "2026-03-12T10:41:00Z", 45, 0, 1),
        makeRun("run-cg-6", "success", "2026-03-11T15:30:00Z", 224, 6, 0),
        makeRun("run-cg-5", "success", "2026-03-10T12:18:00Z", 203, 6, 0),
        makeRun("run-cg-4", "success", "2026-03-09T14:55:00Z", 189, 6, 0),
        makeRun("run-cg-3", "success", "2026-03-08T11:40:00Z", 215, 6, 0),
        makeRun("run-cg-2", "success", "2026-03-07T16:12:00Z", 198, 6, 0),
        makeRun("run-cg-1", "failed", "2026-03-06T09:33:00Z", 62, 1, 1),
      ],
    },
    {
      id: "wf-publish-pipeline",
      name: "Publish Pipeline",
      description:
        "14-step publishing sequence: WordPress, YouTube, Pinterest, social (Buffer/Publer), email (ConvertKit)",
      trigger: "webhook",
      schedule: null,
      status: "active",
      lastRun: makeRun("run-pp-10", "success", "2026-03-16T15:10:00Z", 324, 5, 1),
      nextRun: null,
      totalRuns: 132,
      successRate: 88,
      avgDuration: 310,
      recentRuns: [
        makeRun("run-pp-10", "success", "2026-03-16T15:10:00Z", 324, 5, 1),
        makeRun("run-pp-9", "success", "2026-03-15T12:45:00Z", 298, 6, 0),
        makeRun("run-pp-8", "failed", "2026-03-14T17:20:00Z", 156, 3, 2),
        makeRun("run-pp-7", "success", "2026-03-13T14:30:00Z", 315, 6, 0),
        makeRun("run-pp-6", "success", "2026-03-12T11:55:00Z", 307, 6, 0),
        makeRun("run-pp-5", "failed", "2026-03-11T16:08:00Z", 89, 2, 1),
        makeRun("run-pp-4", "success", "2026-03-10T13:42:00Z", 321, 6, 0),
        makeRun("run-pp-3", "success", "2026-03-09T15:20:00Z", 299, 6, 0),
        makeRun("run-pp-2", "success", "2026-03-08T12:35:00Z", 318, 6, 0),
        makeRun("run-pp-1", "success", "2026-03-07T17:00:00Z", 312, 6, 0),
      ],
    },
    {
      id: "wf-performance-check",
      name: "Performance Check",
      description:
        "Collects SERP rankings, GEO citations, commission data and generates weekly performance report",
      trigger: "cron",
      schedule: "Every Friday at 5:00 PM",
      status: "active",
      lastRun: makeRun("run-pc-4", "success", "2026-03-13T17:00:00Z", 195, 1, 0),
      nextRun: "2026-03-20T17:00:00Z",
      totalRuns: 38,
      successRate: 100,
      avgDuration: 188,
      recentRuns: [
        makeRun("run-pc-4", "success", "2026-03-13T17:00:00Z", 195, 1, 0),
        makeRun("run-pc-3", "success", "2026-03-06T17:00:00Z", 182, 1, 0),
        makeRun("run-pc-2", "success", "2026-02-27T17:00:00Z", 191, 1, 0),
        makeRun("run-pc-1", "success", "2026-02-20T17:00:00Z", 184, 1, 0),
      ],
    },
  ];
}
