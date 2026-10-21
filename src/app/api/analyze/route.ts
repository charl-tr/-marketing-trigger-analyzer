// POST /api/analyze — { text, lens } → Analysis (schéma glypheur.analysis/1).
// C'est aussi l'amorce de l'API publique prévue en v4 : même contrat d'entrée et de sortie.
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { z } from "zod";
import { AnalysisError, analyzeText } from "@/engine/analyze";

export const maxDuration = 300;

const Body = z.object({ text: z.string(), lens: z.enum(["structure", "triggers"]).default("structure") });

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Analyse indisponible : la clé ANTHROPIC_API_KEY n'est pas configurée." }, { status: 503 });
  }
  const body = Body.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Requête invalide : { text, lens } attendus." }, { status: 400 });

  try {
    return NextResponse.json(await analyzeText(body.data.text, body.data.lens));
  } catch (err) {
    if (err instanceof AnalysisError) return NextResponse.json({ error: err.message }, { status: err.status });
    if (err instanceof Anthropic.RateLimitError) return NextResponse.json({ error: "Trop de demandes, réessayez dans un instant." }, { status: 429 });
    if (err instanceof Anthropic.AuthenticationError) return NextResponse.json({ error: "Clé API refusée." }, { status: 502 });
    if (err instanceof Anthropic.APIError) return NextResponse.json({ error: `Erreur du modèle (${err.status}).` }, { status: 502 });
    throw err;
  }
}
