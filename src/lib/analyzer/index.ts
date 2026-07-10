import type { AnalysisResult } from "@/types";
import { config } from "@/lib/config";
import { analyzeLocal } from "./localAnalyzer";
import { analyzeWithGemini } from "./geminiAnalyzer";

/**
 * Unified analyzer entry point. Uses Gemini when an API key is configured,
 * otherwise the deterministic local analyzer. Either way the return shape is
 * identical, so the rest of the app doesn't care which engine ran.
 */
export async function analyzePrd(
  prd: string,
  projectName = "Project",
): Promise<AnalysisResult> {
  if (config.geminiEnabled) {
    return analyzeWithGemini(prd, projectName);
  }
  // Keep an async signature so callers are uniform.
  return Promise.resolve(analyzeLocal(prd, projectName));
}

export { analyzeLocal, analyzeWithGemini };
export type { AnalysisResult };
