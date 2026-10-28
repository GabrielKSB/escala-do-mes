import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { Moldura } from "@/components/Moldura";
import { LEIS } from "@/lib/escala/leis";

export const metadata: Metadata = {
  title: "Como funciona a escala 5x2 e perguntas frequentes",
  description:
    "Como montar a escala 5x2 em 3 passos, quantos funcionários são necessários, regras de domingo e o que mudou com a jornada de 40 horas (EC 141/2026).",
  alternates: { canonical: "/como-funciona/" },
};

const PERGUNTAS = [
  {
    pergunta: "A escala 6x1 acabou?",
    resposta:
      "A Emenda Constitucional 141/2026 mudou o art. 7º, XIII, da Constituição: a jornada passou a ter limite de 8 horas por dia e 40 horas por semana. Com turnos de 8 horas, isso dá 5 dias de trabalho por semana. Confira a data de vigência, as regras de transição e a convenção coletiva da sua categoria antes de mudar a escala.",
  },
  {
    pergunta: "Quantos funcionários preciso para a escala 5x2?",
    resposta:
      "Some o mínimo de pessoas de cada dia aberto e divida por 5, que são os dias que cada pessoa trabalha. Depois confira se sobra gente para revezar o domingo. O gerador faz essa conta na aba Equipe e mostra também quantas pessoas seriam na 6x1.",
  },
  {
    pergunta: "As duas folgas da 5x2 precisam ser seguidas?",
    resposta:
      "Os dispositivos que o gerador confere não exigem que as duas folgas sejam seguidas. Mesmo assim, o gerador tenta juntá-las, porque duas folgas em sequência descansam mais. A convenção coletiva pode trazer regra própria.",
  },
  {
    pergunta: "De quanto em quanto tempo a folga precisa cair no domingo?",
    resposta:
      "No comércio, a Lei 10.101/2000 exige que a folga coincida com o domingo pelo menos 1 vez a cada 3 semanas. A CLT, no art. 386, que fica no capítulo de proteção do trabalho da mulher, prevê revezamento quinzenal. Escolha a regra na aba Empresa ou ligue o domingo quinzenal pessoa por pessoa na aba Equipe.",
  },
  {
    pergunta: "Meus dados ficam salvos?",
    resposta:
      "A escala fica salva só no seu navegador, neste aparelho. Nada é enviado para um servidor. Para abrir em outro aparelho ou mandar para alguém, use Enviar e depois Copiar link.",
  },
  {
    pergunta: "Como mando a escala para a equipe?",
    resposta:
      "No botão Enviar você manda a lista de folgas de cada pessoa pelo WhatsApp ou baixa uma imagem para o grupo. Em Imprimir, a escala sai numa folha A4 deitada, pronta para o mural.",
  },
];

const SECOES = [
  { id: "passos", titulo: "Montar em 3 passos" },
  { id: "escala-5x2", titulo: "O que é a escala 5x2" },
  { id: "regras", titulo: "Regras conferidas" },
  { id: "perguntas", titulo: "Perguntas frequentes" },
];

const perguntasFrequentes = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PERGUNTAS.map(({ pergunta, resposta }) => ({
    "@type": "Question",
    name: pergunta,
    acceptedAnswer: { "@type": "Answer", text: resposta },
  })),
};

export default function ComoFunciona() {
  return (
    <Moldura pagina="como-funciona">
      <main className="mx-auto grid max-w-5xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[200px_minmax(0,1fr)]">
        <nav aria-label="Nesta página" className="hidden lg:block">
          <ul className="sticky top-8 space-y-1 border-l border-borda text-sm">
            {SECOES.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="-ml-px block border-l border-transparent py-1 pl-4 text-apagado hover:border-destaque hover:text-destaque">
                  {s.titulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <article className="max-w-2xl space-y-14 leading-relaxed">
          <header>
            <h1 className="text-3xl font-semibold text-destaque sm:text-4xl">Como funciona</h1>
            <p className="mt-3 text-lg text-apagado">
              O gerador monta a escala do mês sozinho. Você só diz como a empresa funciona e quem está na equipe.
            </p>
          </header>

          <section id="passos" className="scroll-mt-8">
            <h2 className="text-2xl font-semibold">Montar em 3 passos</h2>
            <ol className="mt-5 space-y-5">
              {[
                ["Empresa", "Desligue os dias em que fecha e diga quantas pessoas cada dia precisa no mínimo."],
                ["Equipe", "O gerador já sugere quantas pessoas você precisa. Digite os nomes e, se quiser, os dias em que cada um prefere folgar."],
                ["Escala", "As folgas aparecem marcadas no mês. Clique num dia para trocar, depois imprima ou mande pelo WhatsApp."],
              ].map(([titulo, texto], i) => (
                <li key={titulo} className="flex gap-4">
                  <span className="folga flex size-9 shrink-0 items-center justify-center text-lg font-semibold text-destaque">
                    {i + 1}
                  </span>
                  <p>
                    <strong>{titulo}.</strong> {texto}
                  </p>
                </li>
              ))}
            </ol>
            <Link
              href="/gerador/"
              className="mt-6 inline-flex rounded-lg bg-destaque px-4 py-2.5 font-semibold text-destaque-texto hover:bg-destaque-forte"
            >
              Abrir o gerador
            </Link>
          </section>

          <section id="escala-5x2" className="scroll-mt-8">
            <h2 className="text-2xl font-semibold">O que é a escala 5x2</h2>
            <p className="mt-4">
              Na escala 5x2 cada pessoa trabalha 5 dias e folga 2 por semana. Com turnos de 8 horas, isso fecha as 40
              horas semanais previstas no art. 7º, XIII, da Constituição, na redação dada pela Emenda Constitucional
              141/2026.
            </p>
            <p className="mt-4">
              Quando a empresa abre 6 ou 7 dias por semana, as folgas precisam ser revezadas para que todo dia tenha
              gente suficiente. É essa conta que o gerador faz: distribui as folgas, tenta deixar as duas juntas, reveza
              os domingos e avisa quando algum dia fica descoberto.
            </p>
          </section>

          <AdSlot />

          <section id="regras" className="scroll-mt-8">
            <h2 className="text-2xl font-semibold">Regras conferidas</h2>
            <p className="mt-4">Quando a escala passa de um destes limites, o gerador mostra o aviso com o artigo.</p>
            <dl className="mt-5 divide-y divide-borda border-y border-borda">
              {[LEIS.jornada, LEIS.descansoSemanal, LEIS.repousoMedio, LEIS.domingoComercio, LEIS.domingoQuinzenal].map(
                (lei) => (
                  <div key={lei.dispositivo} className="py-4">
                    <dt className="font-semibold">{lei.norma}</dt>
                    <dd className="mt-1">
                      {lei.dispositivo}.{" "}
                      <a href={lei.url} target="_blank" rel="noopener noreferrer" className="text-destaque underline underline-offset-2">
                        Texto oficial
                      </a>
                    </dd>
                  </div>
                ),
              )}
            </dl>
            <p className="mt-4 text-sm text-apagado">
              O gerador é informativo. Convenções e acordos coletivos podem trazer regras diferentes para a sua categoria.
            </p>
          </section>

          <section id="perguntas" className="scroll-mt-8">
            <h2 className="text-2xl font-semibold">Perguntas frequentes</h2>
            <div className="mt-5 divide-y divide-borda border-y border-borda">
              {PERGUNTAS.map(({ pergunta, resposta }) => (
                <details key={pergunta} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold marker:hidden">
                    {pergunta}
                    <span aria-hidden className="text-xl text-destaque transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-2">{resposta}</p>
                </details>
              ))}
            </div>
          </section>
        </article>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(perguntasFrequentes).replace(/</g, "\\u003c") }}
      />
    </Moldura>
  );
}
