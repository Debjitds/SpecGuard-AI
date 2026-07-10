import type {
  AnalysisResult,
  Finding,
  IssueCategory,
  Scores,
  Severity,
} from "@/types";

/**
 * Deterministic, rule-based PRD analyzer used as a fallback when no Gemini API
 * key is configured, and as a guaranteed-working path for demos/tests.
 *
 * It scans the markdown for common requirement smells — vague language, missing
 * acceptance criteria, conflicting terms, missing permissions/edge-cases, and
 * unmeasurable non-functional requirements — and produces structured findings
 * in the exact shape the UI expects.
 */

type Rule = {
  category: IssueCategory;
  severity: Severity;
  title: string;
  description: string;
  recommendation: string;
  /** returns the matched location/quote, or null if rule doesn't apply */
  match: (text: string, lower: string) => string | null;
};

const VAGUE_TERMS = [
  "should be fast",
  "fast and responsive",
  "be fast",
  "easy to use",
  "smooth",
  "relevant",
  "timely",
  "secure",
  "accurate",
  "highly available",
  "minimize abandoned carts",
  "feel lively",
];

const QUANTITY_TERMS = [
  "threshold",
  "select regions",
  "a threshold",
  "repeat offender",
  "recurring",
  "duplicate",
];

const RULES: Rule[] = [
  // Ambiguity — vague / unmeasurable phrasing
  {
    category: "ambiguity",
    severity: "major",
    title: "Vague, unmeasurable requirement language",
    description:
      'The PRD uses qualitative phrasing such as "fast", "secure", or "easy to use" without a measurable definition, making it impossible to verify or test objectively.',
    recommendation:
      "Replace each qualitative term with a concrete, measurable acceptance criterion (e.g. '< 2s p95 response time', 'OWASP ASVS Level 2', '5-task usability success rate').",
    match: (_t, lower) =>
      VAGUE_TERMS.some((v) => lower.includes(v)) ? "Non-Functional Requirements" : null,
  },
  // Missing acceptance criteria — open questions section present
  {
    category: "missing_acceptance_criteria",
    severity: "major",
    title: "Open Questions left unresolved in the spec",
    description:
      "The document ships a list of unresolved 'Open Questions'. These are exactly the gaps that become ambiguous acceptance criteria during implementation.",
    recommendation:
      "Convert each Open Question into an explicit decision + acceptance criterion before development, or formally mark it as out of scope.",
    match: (_t, lower) =>
      lower.includes("## 4. open questions") || lower.includes("open questions")
        ? "Open Questions"
        : null,
  },
  // Unclear requirements — unspecified quantity terms
  {
    category: "unclear_requirements",
    severity: "major",
    title: "Unspecified quantity / boundary terms",
    description:
      'Terms like "a threshold", "select regions", or "repeat offender" are used without a concrete value, leaving room for divergent implementations.',
    recommendation:
      "Define each quantity explicitly (e.g. transfer threshold = 10,000; Express regions = X,Y,Z; repeat offender = 3 reports within 30 days).",
    match: (_t, lower) =>
      QUANTITY_TERMS.some((v) => lower.includes(v)) ? "Functional Requirements" : null,
  },
  // Inconsistent flows — recurring/duplicate referenced without handling
  {
    category: "inconsistent_flows",
    severity: "minor",
    title: "Recurring / import flows referenced without conflict handling",
    description:
      "Features mention recurring schedules or CSV imports but do not define how conflicts, duplicates, or overlaps are resolved, which leads to inconsistent behaviour across flows.",
    recommendation:
      "Specify conflict/duplicate handling rules (skip, overwrite, merge, or reject) for every import, recurring, or concurrent operation.",
    match: (text, lower) =>
      lower.includes("recurring") || lower.includes("duplicate") || lower.includes("csv")
        ? text.split("\n").find((l) => /recurring|duplicate|csv/i.test(l)) ?? "Functional Requirements"
        : null,
  },
  // Missing permissions — roles referenced without access rules
  {
    category: "missing_permissions",
    severity: "major",
    title: "Role-based access rules not fully specified",
    description:
      "Roles (admin, manager, rep, moderator) are referenced but the permission boundaries — who can create, read, update, or reassign — are not enumerated.",
    recommendation:
      "Add a permissions matrix (role × resource × action) covering create, read, update, delete, approve, and override for every role.",
    match: (_t, lower) =>
      /(admin|manager|moderator|reps?|approv)/i.test("x" + lower) &&
      /(admin|manager|moderator)/i.test(lower)
        ? "Functional Requirements"
        : null,
  },
  // Weak edge cases — concurrency / expiry / failure paths
  {
    category: "weak_edge_cases",
    severity: "critical",
    title: "Concurrency & expiry edge cases not addressed",
    description:
      "The PRD does not define behaviour for concurrent actions (e.g. two users booking the same resource at the same instant), payment/expiry failures, or session timeouts.",
    recommendation:
      "Enumerate edge cases (concurrent writes, payment failures, session expiry, offline behaviour) and define the expected system response for each.",
    match: (_t, lower) =>
      lower.includes("booking") ||
      lower.includes("payment") ||
      lower.includes("session") ||
      lower.includes("at the exact same")
        ? "Functional Requirements"
        : null,
  },
  // Testability risks — NFRs not measurable
  {
    category: "testability_risks",
    severity: "minor",
    title: "Non-functional requirements are not testable",
    description:
      "Non-functional requirements are stated as goals without thresholds, latencies, or success metrics, so QA cannot write a pass/fail test against them.",
    recommendation:
      "For each NFR add a testable metric and target (e.g. p95 latency, uptime %, error rate budget, accessibility level).",
    match: (_t, lower) =>
      lower.includes("## 3. non-functional") || lower.includes("non-functional")
        ? "Non-Functional Requirements"
        : null,
  },
];

function countMatches(text: string): {
  critical: number;
  major: number;
  minor: number;
} {
  const lower = text.toLowerCase();
  let critical = 0;
  let major = 0;
  let minor = 0;
  for (const rule of RULES) {
    const loc = rule.match(text, lower);
    if (!loc) continue;
    if (rule.severity === "critical") critical++;
    else if (rule.severity === "major") major++;
    else minor++;
  }
  return { critical, major, minor };
}

/** Build a deterministic finding list from the rule set. */
function buildFindings(text: string): Finding[] {
  const lower = text.toLowerCase();
  const findings: Finding[] = [];
  RULES.forEach((rule, i) => {
    const loc = rule.match(text, lower);
    if (!loc) return;
    findings.push({
      id: `local-${i}-${rule.category}`,
      category: rule.category,
      severity: rule.severity,
      title: rule.title,
      description: rule.description,
      recommendation: rule.recommendation,
      location: loc,
      status: "open",
    });
  });
  return findings;
}

/** Derive the four summary metrics from the finding distribution. */
function deriveScores(text: string, findings: Finding[]): Scores {
  const counts = countMatches(text);
  // Heuristic weights — critical/major findings drag the scores down more.
  const penalty =
    counts.critical * 14 + counts.major * 7 + counts.minor * 3;

  const hasContent = text.trim().length > 200;
  const sectionCount = (text.match(/^#{1,3}\s/gm) ?? []).length;

  const completeness = clamp(92 - penalty + Math.min(sectionCount * 1.5, 8));
  const ambiguity = clamp(8 + counts.major * 5 + counts.minor * 2); // higher = worse
  const testability = clamp(95 - penalty * 0.9);
  const consistency = clamp(88 - counts.critical * 6 - counts.major * 4);

  return {
    completeness: hasContent ? Math.round(completeness) : 0,
    ambiguity: Math.round(ambiguity),
    testability: Math.round(testability),
    consistency: Math.round(consistency),
  };
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

export function analyzeLocal(prd: string, projectName = "Project"): AnalysisResult {
  const findings = buildFindings(prd).sort(bySeverity);
  const scores = deriveScores(prd, findings);
  const summary = buildSummary(projectName, findings, scores);
  return {
    scores,
    findings,
    summary,
    analyzedAt: new Date().toISOString(),
  };
}

function bySeverity(a: Finding, b: Finding) {
  const order = { critical: 0, major: 1, minor: 2 };
  return order[a.severity] - order[b.severity];
}

function buildSummary(
  name: string,
  findings: Finding[],
  scores: Scores,
): string {
  const c = {
    critical: findings.filter((f) => f.severity === "critical").length,
    major: findings.filter((f) => f.severity === "major").length,
    minor: findings.filter((f) => f.severity === "minor").length,
  };
  return `**${name}** reviewed with a completeness score of **${scores.completeness}%**. The spec review surfaced **${c.critical} critical**, **${c.major} major**, and **${c.minor} minor** findings. Prioritise the critical edge-case and permission gaps first, then tighten the non-functional requirements so they are testable.`;
}
