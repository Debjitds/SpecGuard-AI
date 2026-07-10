import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  AnalysisResult,
  Finding,
  IssueCategory,
  Severity,
} from "@/types";
import { config } from "@/lib/config";
import { analyzeLocal } from "./localAnalyzer";

/**
 * Gemini-powered analyzer.
 *
 * Uses Gemini's `responseMimeType: "application/json"` with a strict schema
 * prompt so the output is structured for the UI. The response is validated and
 * normalised; if Gemini is unavailable, errors, or returns malformed JSON, we
 * transparently fall back to the deterministic local analyzer so the workflow
 * never breaks.
 */

const MODEL = "gemini-1.5-flash";

const SYSTEM_INSTRUCTION = `You are SpecGuard AI, a senior requirements engineer performing a structured PRD review.
You NEVER rewrite the document. You ONLY surface review findings.
You think in seven categories exactly: ambiguity, missing_acceptance_criteria, inconsistent_flows, missing_permissions, weak_edge_cases, testability_risks, unclear_requirements.
You are concise, concrete, and engineering-focused. No chat, no filler.`;

const PROMPT_TEMPLATE = (prd: string) => `Analyse the following Product Requirements Document (PRD) and produce a STRICT JSON object matching this TypeScript type:

type Result = {
  summary: string;            // 2-3 sentence review summary
  scores: {
    completeness: number;     // 0-100
    ambiguity: number;        // 0-100, higher = worse
    testability: number;      // 0-100
    consistency: number;      // 0-100
  };
  findings: Array<{
    category: "ambiguity" | "missing_acceptance_criteria" | "inconsistent_flows" | "missing_permissions" | "weak_edge_cases" | "testability_risks" | "unclear_requirements";
    severity: "critical" | "major" | "minor";
    title: string;            // short, imperative
    description: string;      // what is wrong + why it matters
    recommendation: string;   // concrete, actionable fix
    location: string;         // section/requirement the issue anchors to
  }>;
};

Rules:
- Return ONLY the JSON object. No markdown fences, no commentary.
- Produce between 4 and 9 findings, prioritised by severity.
- severity "critical" is reserved for security, data-integrity, or concurrency gaps.
- Make every recommendation specific and testable.
- If a category has no issues, simply omit findings for it.

PRD DOCUMENT:
"""
${prd.slice(0, 20000)}
"""`;

const VALID_CATEGORIES: IssueCategory[] = [
  "ambiguity",
  "missing_acceptance_criteria",
  "inconsistent_flows",
  "missing_permissions",
  "weak_edge_cases",
  "testability_risks",
  "unclear_requirements",
];

const VALID_SEVERITIES: Severity[] = ["critical", "major", "minor"];

function coerceCategory(v: unknown): IssueCategory {
  return (VALID_CATEGORIES as string[]).includes(v as string)
    ? (v as IssueCategory)
    : "ambiguity";
}

function coerceSeverity(v: unknown): Severity {
  if (typeof v === "string") {
    const lower = v.toLowerCase();
    if (lower.includes("crit")) return "critical";
    if (lower.includes("maj")) return "major";
    if (lower.includes("min")) return "minor";
  }
  return "minor";
}

function clampScore(n: unknown): number {
  const num = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(num)) return 50;
  return Math.max(0, Math.min(100, Math.round(num)));
}

/** Validate + normalise Gemini's JSON into our AnalysisResult shape. */
function normalise(raw: unknown, fallback: AnalysisResult): AnalysisResult {
  if (!raw || typeof raw !== "object") return fallback;
  const obj = raw as Record<string, unknown>;

  const rawFindings = Array.isArray(obj.findings) ? obj.findings : [];
  const findings: Finding[] = rawFindings
    .filter((f) => f && typeof f === "object")
    .map((f, i) => {
      const fr = f as Record<string, unknown>;
      return {
        id: `gemini-${i}`,
        category: coerceCategory(fr.category),
        severity: coerceSeverity(fr.severity),
        title: String(fr.title ?? "Untitled finding").slice(0, 200),
        description: String(fr.description ?? "").slice(0, 1000),
        recommendation: String(fr.recommendation ?? "").slice(0, 1000),
        location: fr.location ? String(fr.location) : undefined,
        status: "open" as const,
      };
    });

  const scores = obj.scores && typeof obj.scores === "object"
    ? (obj.scores as Record<string, unknown>)
    : {};

  const result: AnalysisResult = {
    summary: typeof obj.summary === "string" && obj.summary.trim()
      ? obj.summary
      : fallback.summary,
    scores: {
      completeness: clampScore(scores.completeness),
      ambiguity: clampScore(scores.ambiguity),
      testability: clampScore(scores.testability),
      consistency: clampScore(scores.consistency),
    },
    findings: findings.length ? findings.sort(bySeverity) : fallback.findings,
    analyzedAt: new Date().toISOString(),
  };

  return result;
}

function bySeverity(a: Finding, b: Finding) {
  const order = { critical: 0, major: 1, minor: 2 };
  return order[a.severity] - order[b.severity];
}

export async function analyzeWithGemini(
  prd: string,
  projectName = "Project",
): Promise<AnalysisResult> {
  // Always compute a fallback so we can never leave the UI empty.
  const fallback = analyzeLocal(prd, projectName);

  if (!config.geminiEnabled) {
    return fallback;
  }

  try {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
        maxOutputTokens: 4096,
      },
    });

    const result = await model.generateContent(PROMPT_TEMPLATE(prd));
    const text = result.response.text();
    const parsed = JSON.parse(text);
    return normalise(parsed, fallback);
  } catch (err) {
    console.warn("[SpecGuard] Gemini analysis failed, falling back to local analyzer.", err);
    return fallback;
  }
}
