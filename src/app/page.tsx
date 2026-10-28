import type { Metadata } from "next";
import { PaginaGerador } from "@/components/PaginaGerador";
import { PADRAO } from "@/lib/setores";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Inicio() {
  return (
    <PaginaGerador
      titulo="Gerador de escala 5x2"
      introducao="Monte a escala do mês em poucos minutos: cada pessoa com 2 folgas por semana, rodízio justo de domingos e aviso quando algo passa do limite da lei."
      predefinicao={PADRAO}
      chave="escala5x2:geral"
      url={`${SITE.url}/`}
    />
  );
}
