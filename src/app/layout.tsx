import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Spectral, Spectral_SC } from "next/font/google";
import "./globals.css";

const spectral = Spectral({ variable: "--font-text", subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"] });
const spectralSC = Spectral_SC({ variable: "--font-caps", subsets: ["latin"], weight: ["500", "600"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "Glypheur — le surligneur des métastructures",
  description: "Révèle la structure d'un texte persuasif : Big Idea, hook, douleur, mécanisme, preuve, offre, appel à l'action.",
};

export const viewport: Viewport = { themeColor: "#1f2a24", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${spectral.variable} ${spectralSC.variable} ${plexMono.variable}`}>{children}</body>
    </html>
  );
}
