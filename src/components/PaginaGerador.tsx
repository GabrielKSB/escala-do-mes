import { ArrowDown, Check } from "lucide-react";
import { ConteudoSeo, dadosEstruturados } from "./ConteudoSeo";
import { Gerador, type Predefinicao } from "./gerador/Gerador";
import { Moldura } from "./Moldura";

export function PaginaGerador({
  titulo,
  introducao,
  predefinicao,
  chave,
  url,
  setor,
}: {
  titulo: string;
  introducao: string;
  predefinicao: Predefinicao;
  chave: string;
  url: string;
  setor?: string;
}) {
  return (
    <Moldura>
      <main>
        <div className="mx-auto max-w-[1440px] px-4 pt-8 pb-6 sm:px-6 print:hidden">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{titulo}</h1>
          <p className="mt-3 max-w-2xl text-slate-600">{introducao}</p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
            {["Grátis e sem cadastro", "2 folgas por semana", "Alertas da lei com o artigo"].map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-teal-600" />
                {item}
              </li>
            ))}
          </ul>
          <a
            href="#escala"
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white lg:hidden"
          >
            Ver a escala pronta
            <ArrowDown className="size-4" />
          </a>
        </div>
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 print:max-w-none print:px-0">
          <Gerador predefinicao={predefinicao} chave={chave} />
        </div>
        <ConteudoSeo setor={setor} />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados(url)).replace(/</g, "\\u003c") }}
      />
    </Moldura>
  );
}
