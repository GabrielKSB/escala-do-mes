import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { Consentimento } from "@/components/Consentimento";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], weight: ["500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Escala do Mês: gerador de escala de trabalho grátis",
    template: "%s | Escala do Mês",
  },
  description:
    "Monte a escala de trabalho do mês em minutos: 5x2, 6x1, 4x2 ou 12x36, com rodízio de domingos e alertas da jornada de 40 horas (EC 141/2026). Grátis e sem cadastro.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.nome,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Escala do Mês: a escala de trabalho pronta em um minuto" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  other: SITE.adsenseCliente ? { "google-adsense-account": SITE.adsenseCliente } : undefined,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        {children}
        {SITE.adsenseCliente && <Consentimento />}
        {process.env.VERCEL === "1" && <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />}
      </body>
    </html>
  );
}
