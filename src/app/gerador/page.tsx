import type { Metadata } from "next";
import { PaginaGerador } from "@/components/PaginaGerador";
import { PADRAO } from "@/lib/setores";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gerador de escala de trabalho grátis",
  alternates: { canonical: "/gerador/" },
};

const aplicativo = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Escala do Mês",
  url: `${SITE.url}/gerador/`,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  inLanguage: "pt-BR",
  offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
};

export default function PaginaGeradorGeral() {
  return (
    <>
      <PaginaGerador
        titulo="Gerador de escala"
        introducao="A escala do mês já vem pronta. Escolha o tipo, ajuste e mande para a equipe."
        predefinicao={PADRAO}
        chave="escala5x2:geral"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aplicativo) }} />
    </>
  );
}
