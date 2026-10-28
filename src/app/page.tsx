import { CalendarCheck2, Calculator, MousePointerClick, Repeat, Scale, Send, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { Moldura } from "@/components/Moldura";
import { PreviaEscala } from "@/components/PreviaEscala";
import { SETORES } from "@/lib/setores";

export const metadata: Metadata = {
  title: { absolute: "Gerador de escala 5x2 grátis: a escala do mês pronta em um minuto" },
  alternates: { canonical: "/" },
};

const RECURSOS = [
  {
    icone: CalendarCheck2,
    titulo: "2 folgas por semana para todos",
    texto: "Cada pessoa trabalha 5 dias e folga 2, e o gerador tenta deixar as duas folgas juntas.",
  },
  {
    icone: Repeat,
    titulo: "Domingos em rodízio justo",
    texto: "Quem está há mais tempo sem folgar no domingo tem a vez, seguindo a regra do comércio ou a quinzenal.",
  },
  {
    icone: Scale,
    titulo: "Aviso com o artigo da lei",
    texto: "Passou de 40 horas na semana ou de 6 dias sem folga? Você vê o problema e o artigo que ele fere.",
  },
  {
    icone: Calculator,
    titulo: "Quantas pessoas você precisa",
    texto: "Diga o mínimo de cada dia e saiba o tamanho da equipe na 5x2, comparado com a 6x1.",
  },
  {
    icone: MousePointerClick,
    titulo: "Troca de folga com um clique",
    texto: "Clique num dia para trocar trabalho por folga. A cobertura do dia é recalculada na hora.",
  },
  {
    icone: Send,
    titulo: "Pronta para mandar",
    texto: "Envie a lista de folgas pelo WhatsApp, baixe uma imagem para o grupo ou imprima para o mural.",
  },
];

const PASSOS = [
  ["Conte como a empresa funciona", "Desligue os dias em que fecha e diga quantas pessoas cada dia precisa no mínimo."],
  ["Coloque a equipe", "Digite os nomes. Se quiser, marque os dias em que cada pessoa prefere folgar."],
  ["Confira e mande", "As folgas aparecem no mês. Ajuste o que quiser e envie para a equipe."],
];

const PERGUNTAS = [
  [
    "Precisa pagar ou criar conta?",
    "Não. O gerador é grátis e funciona direto no navegador, sem cadastro. A escala fica salva no seu aparelho.",
  ],
  [
    "A escala 6x1 acabou?",
    "A Emenda Constitucional 141/2026 limitou a jornada a 8 horas por dia e 40 por semana. Com turnos de 8 horas, isso dá 5 dias de trabalho. Confira a vigência e a convenção coletiva da sua categoria.",
  ],
  [
    "Serve para o meu tipo de negócio?",
    "Serve para qualquer empresa que abre de 5 a 7 dias por semana: supermercado, restaurante, farmácia, padaria, loja, academia e outros.",
  ],
];

const CTA =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-destaque px-6 font-semibold text-destaque-texto transition-colors hover:bg-destaque-forte focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destaque";

export default function Inicio() {
  return (
    <Moldura pagina="inicio">
      <main>
        <section className="brilho-topo relative overflow-hidden px-4 pt-32 pb-16 sm:px-6 sm:pt-40">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-borda bg-superficie px-3 py-1.5 text-sm text-apagado">
              <Sparkles className="size-4 text-destaque" />
              Pronto para a jornada de 40 horas
            </p>
            <h1 className="mt-6 font-display text-4xl leading-tight font-semibold tracking-tight sm:text-6xl sm:leading-[1.1]">
              A escala do mês pronta em um minuto
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-apagado">
              Diga os dias em que a loja abre e quem está na equipe. O gerador distribui 2 folgas por semana para cada
              pessoa, reveza os domingos e avisa quando algo passa do limite da lei.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/gerador/" className={CTA}>
                Montar minha escala
              </Link>
              <Link
                href="/como-funciona/"
                className="inline-flex min-h-12 items-center rounded-full border border-borda px-6 font-medium hover:border-borda-forte"
              >
                Ver como funciona
              </Link>
            </div>
            <p className="mt-4 text-sm text-apagado">Grátis, sem cadastro e sem instalar nada.</p>
          </div>
          <div className="mx-auto mt-16 max-w-5xl">
            <PreviaEscala />
          </div>
        </section>

        <section className="border-y border-borda px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-apagado">Monte já com os dias e mínimos típicos do seu negócio</p>
            <ul className="mt-5 flex flex-wrap justify-center gap-2">
              {SETORES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/escala-5x2/${s.slug}/`}
                    className="inline-flex min-h-11 items-center rounded-full border border-borda bg-superficie px-4 text-sm font-medium hover:border-destaque hover:text-destaque"
                  >
                    {s.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="max-w-xl font-display text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
              Tudo o que a escala precisa, sem planilha
            </h2>
            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-borda bg-borda sm:grid-cols-2 lg:grid-cols-3">
              {RECURSOS.map(({ icone: Icone, titulo, texto }) => (
                <div key={titulo} className="bg-superficie p-6">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-destaque-suave text-destaque">
                    <Icone className="size-5" />
                  </span>
                  <h3 className="mt-4 font-semibold">{titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-apagado">{texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                Três passos e a escala está na parede
              </h2>
              <p className="mt-4 max-w-md text-apagado">
                Nada de calcular folga por folga. O gerador faz a conta, e você só confere.
              </p>
              <Link href="/gerador/" className={`${CTA} mt-8`}>
                Começar agora
              </Link>
            </div>
            <ol className="space-y-4">
              {PASSOS.map(([titulo, texto], i) => (
                <li key={titulo} className="flex gap-4 rounded-2xl border border-borda bg-superficie p-5">
                  <span className="folga flex size-9 shrink-0 items-center justify-center rounded-lg font-display font-semibold">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{titulo}</h3>
                    <p className="mt-1 text-sm text-apagado">{texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <AdSlot />
        </div>

        <section className="px-4 py-24 sm:px-6">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                Perguntas frequentes
              </h2>
              <p className="mt-4 text-apagado">
                Regras de domingo, cálculo da equipe e mais na página{" "}
                <Link href="/como-funciona/#perguntas" className="text-destaque underline underline-offset-4">
                  Como funciona
                </Link>
                .
              </p>
            </div>
            <div className="divide-y divide-borda border-y border-borda">
              {PERGUNTAS.map(([pergunta, resposta]) => (
                <details key={pergunta} className="group py-5">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-medium marker:hidden">
                    {pergunta}
                    <span aria-hidden className="text-xl text-destaque transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-2 text-apagado">{resposta}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-8 sm:px-6">
          <div className="brilho-topo mx-auto max-w-5xl rounded-3xl border border-borda bg-superficie px-6 py-16 text-center">
            <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
              Monte a escala do próximo mês agora
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-apagado">
              A primeira versão aparece pronta assim que você abre. Leva menos tempo que um café.
            </p>
            <Link href="/gerador/" className={`${CTA} mt-8`}>
              Montar minha escala
            </Link>
          </div>
        </section>
      </main>
    </Moldura>
  );
}
