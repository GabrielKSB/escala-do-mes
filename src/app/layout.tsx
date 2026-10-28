import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next } from "next/font/google";
import Script from "next/script";
import { SITE } from "@/lib/site";
import "./globals.css";

const atkinson = Atkinson_Hyperlegible_Next({ variable: "--font-atkinson", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Gerador de escala 5x2 grátis | Escala 5x2",
    template: "%s | Escala 5x2",
  },
  description:
    "Monte a escala 5x2 do mês em minutos: 2 folgas por semana, rodízio de domingos e alertas da jornada de 40 horas (EC 141/2026). Grátis e sem cadastro.",
  openGraph: { type: "website", locale: "pt_BR", siteName: SITE.nome },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${atkinson.variable} font-sans`}>
        {children}
        {SITE.adsenseCliente && (
          <Script
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adsenseCliente}`}
          />
        )}
      </body>
    </html>
  );
}
