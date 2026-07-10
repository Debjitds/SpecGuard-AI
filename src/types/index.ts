/**
 * SpecGuard AI — shared domain types.
 *
 * These types are the single source of truth across the AI layer, the storage
 * layer (Supabase), and the UI. The category set matches the PRD §11.3 / §17.
 */

/** Issue categories surfaced by the analyzer (PRD §11.3 / §17). */
export type IssueCategory =
  | "ambiguity"
  | "missing_acceptance_criteria"
  | "inconsistent_flows"
  | "missing_permissions"
  | "weak_edge_cases"
  | "testability_risks"
  | "unclear_requirements";

/** Severity used for prioritisation + colour coding. */
export type Severity = "critical" | "major" | "minor";

/** Review lifecycle actions a user can take on a finding (PRD §11.4). */
export type ReviewStatus = "open" | "accepted" | "ignored" | "resolved";

/** A single AI finding + its mutable review state. */
export interface Finding {
  id: string;
  category: IssueCategory;
  severity: Severity;
  title: string;
  description: string;
  /** Where in the document the issue is anchored (section ref / line hint). */
  location?: string;
  /** Concrete suggestion the team can act on. */
  recommendation?: string;
  status: ReviewStatus;
}

/** Summary metrics shown on the dashboard cards (PRD §11.5). */
export interface Scores {
  completeness: number; // 0-100
  ambiguity: number; // 0-100 (higher = worse)
  testability: number; // 0-100
  consistency: number; // 0-100
}

/** A complete AI analysis result for a project version. */
export interface AnalysisResult {
  scores: Scores;
  findings: Finding[];
  /** Short prose summary written by the AI. */
  summary: string;
  analyzedAt: string;
}

/** A version of a project's PRD (PRD §11.6). */
export interface ProjectVersion {
  id: string;
  label: string; // e.g. "v1.0", "v1.3_draft"
  status: string; // e.g. "Analyzed" | "Issues Found" | "In Review" | "Current"
  createdAt: string;
  /** Snapshot of the analysis result attached to this version. */
  analysis?: AnalysisResult;
}

/** A project/workspace owned by a user. */
export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  /** Whether the project was created from a demo template. */
  demoKey?: string;
  /** The raw PRD content (markdown). */
  prdContent: string;
  /** Filename when the PRD was uploaded. */
  prdFileName?: string;
  /** Current semantic version label. */
  currentVersion: string;
  /** Versions timeline. */
  versions: ProjectVersion[];
  /** Latest analysis (mirrors the current version's analysis). */
  analysis?: AnalysisResult;
}

/** Minimal demo project descriptor. */
export interface DemoProject {
  key: string;
  name: string;
  blurb: string;
  accent: string; // tailwind bg class for the demo card
  prd: string; // markdown content
}

/** Auth user shape (works for both Supabase and local fallback). */
export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
}

export const CATEGORY_META: Record<
  IssueCategory,
  { label: string; short: string; accent: string }
> = {
  ambiguity: { label: "Ambiguity", short: "Ambiguity", accent: "coral" },
  missing_acceptance_criteria: {
    label: "Missing Acceptance Criteria",
    short: "Missing Criteria",
    accent: "yellow",
  },
  inconsistent_flows: {
    label: "Inconsistent Flows",
    short: "Inconsistent Flow",
    accent: "lavender",
  },
  missing_permissions: {
    label: "Missing Permissions",
    short: "Permissions",
    accent: "rose-deep",
  },
  weak_edge_cases: {
    label: "Weak Edge Cases",
    short: "Edge Case",
    accent: "coral-deep",
  },
  testability_risks: {
    label: "Testability Risks",
    short: "Testability",
    accent: "teal",
  },
  unclear_requirements: {
    label: "Unclear Requirements",
    short: "Unclear",
    accent: "teal-bright",
  },
};

export const SEVERITY_META: Record<
  Severity,
  { label: string; text: string; bg: string; order: number }
> = {
  critical: { label: "Critical", text: "text-coral-deep", bg: "bg-coral-deep", order: 0 },
  major: { label: "Major", text: "text-coral", bg: "bg-coral", order: 1 },
  minor: { label: "Minor", text: "text-on-surface-variant", bg: "bg-surface-container-highest", order: 2 },
};

export const STATUS_META: Record<
  ReviewStatus,
  { label: string; badge: string; dot: string }
> = {
  open: {
    label: "Open",
    badge: "bg-white text-on-surface",
    dot: "bg-coral-deep",
  },
  accepted: {
    label: "Accepted",
    badge: "bg-teal-mint text-ink",
    dot: "bg-teal",
  },
  ignored: {
    label: "Ignored",
    badge: "bg-surface-container-high text-on-surface-variant",
    dot: "bg-surface-container-highest",
  },
  resolved: {
    label: "Resolved",
    badge: "bg-teal-bright text-ink",
    dot: "bg-teal",
  },
};
