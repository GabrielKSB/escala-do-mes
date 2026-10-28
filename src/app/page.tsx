import type { Metadata } from "next";
import { PaginaGerador } from "@/components/PaginaGerador";
import { PADRAO } from "@/lib/setores";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const aplicativo = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Gerador de escala 5x2",
  url: `${SITE.url}/`,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  inLanguage: "pt-BR",
  offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
};

export default function Inicio() {
  return (
    <>
      <PaginaGerador
        titulo="Gerador de escala 5x2"
        introducao="A escala do mês já vem pronta, com 2 folgas por semana para cada pessoa. Ajuste e mande para a equipe."
        predefinicao={PADRAO}
        chave="escala5x2:geral"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aplicativo) }} />
    </>
  );
}
