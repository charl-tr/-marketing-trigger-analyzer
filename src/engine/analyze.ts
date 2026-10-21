// Moteur d'analyse : Claude lit le texte à travers une lentille, on valide, on recale, on nettoie.
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { Lens } from "@/domain/lenses";
import { type Analysis, ModelOutput } from "@/domain/schema";
import { buildAnalysis } from "./build";
import { systemPrompt, userPrompt } from "./prompt";

export const MODEL = process.env.GLYPHEUR_MODEL || "claude-opus-5-5";
export const MAX_CHARS = 60_000;

export class AnalysisError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}

let client: Anthropic | null = null;
const anthropic = () => (client ??= new Anthropic());

export async function analyzeText(text: string, lensId: Lens["id"]): Promise<Analysis> {
  if (!text.trim()) throw new AnalysisError("Le texte est vide.", 400);
  if (text.length > MAX_CHARS) throw new AnalysisError(`Texte trop long (${text.length} caractères, ${MAX_CHARS} au plus).`, 413);

  const response = await anthropic().beta.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    // Un faux positif des filtres de sécurité ne doit pas bloquer l'analyse : repli géré par l'API.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium", format: betaZodOutputFormat(ModelOutput) },
    system: [{ type: "text", text: systemPrompt(lensId), cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: userPrompt(text) }],
  });

  if (response.stop_reason === "refusal") throw new AnalysisError("Le modèle a refusé d'analyser ce texte.", 422);
  if (response.stop_reason === "max_tokens") throw new AnalysisError("Analyse interrompue : texte trop dense, découpez-le.", 413);
  const out = response.parsed_output;
  if (!out) throw new AnalysisError("Réponse du modèle illisible.", 502);

  return buildAnalysis(text, lensId, out, response.model);
}
