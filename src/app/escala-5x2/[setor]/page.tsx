import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaginaGerador } from "@/components/PaginaGerador";
import { PADRAO, SETORES, setorPorSlug } from "@/lib/setores";
import { SITE } from "@/lib/site";

type Parametros = { params: Promise<{ setor: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return SETORES.map((s) => ({ setor: s.slug }));
}

export async function generateMetadata({ params }: Parametros): Promise<Metadata> {
  const setor = setorPorSlug((await params).setor);
  if (!setor) return {};
  return {
    title: setor.titulo,
    description: setor.descricao,
    alternates: { canonical: `/escala-5x2/${setor.slug}/` },
  };
}

export default async function PaginaSetor({ params }: Parametros) {
  const setor = setorPorSlug((await params).setor);
  if (!setor) notFound();
  return (
    <PaginaGerador
      titulo={setor.titulo}
      introducao={setor.introducao}
      predefinicao={{
        ...PADRAO,
        diasAbertos: setor.diasAbertos,
        minimoPorDia: setor.minimoPorDia,
        regraDomingo: setor.regraDomingo,
      }}
      chave={`escala5x2:${setor.slug}`}
      url={`${SITE.url}/escala-5x2/${setor.slug}/`}
      setor={setor.nome}
    />
  );
}
