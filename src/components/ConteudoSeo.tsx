import { LEIS } from "@/lib/escala/leis";
import { AdSlot } from "./AdSlot";

export const PERGUNTAS = [
  {
    pergunta: "A escala 6x1 acabou?",
    resposta:
      "A Emenda Constitucional 141/2026 mudou o art. 7º, XIII, da Constituição: a jornada passou a ter limite de 8 horas por dia e 40 horas por semana. Com turnos de 8 horas, isso dá 5 dias de trabalho por semana. Confira a data de vigência, as regras de transição e a convenção coletiva da sua categoria antes de mudar a escala.",
  },
  {
    pergunta: "As duas folgas da 5x2 precisam ser seguidas?",
    resposta:
      "Os dispositivos que o gerador confere não exigem que as duas folgas sejam seguidas. Mesmo assim, o gerador tenta juntá-las, porque duas folgas em sequência descansam mais. A convenção coletiva pode trazer regra própria.",
  },
  {
    pergunta: "De quanto em quanto tempo a folga precisa cair no domingo?",
    resposta:
      "No comércio, a Lei 10.101/2000 exige que a folga coincida com o domingo pelo menos 1 vez a cada 3 semanas. A CLT, no art. 386, que fica no capítulo de proteção do trabalho da mulher, prevê revezamento quinzenal. Escolha a regra no passo 1 ou marque o domingo quinzenal pessoa por pessoa.",
  },
  {
    pergunta: "Quantos funcionários preciso para a escala 5x2?",
    resposta:
      "Some o mínimo de pessoas de cada dia aberto e divida por 5, que são os dias que cada pessoa trabalha. Depois confira se sobra gente para revezar o domingo. O gerador faz essa conta sozinho e mostra também quantas pessoas seriam na 6x1.",
  },
  {
    pergunta: "Meus dados ficam salvos?",
    resposta:
      "A escala fica salva só no seu navegador, neste aparelho. Nada é enviado para um servidor. Para abrir em outro aparelho ou mandar para alguém, use o botão Copiar link.",
  },
  {
    pergunta: "Como mando a escala para a equipe?",
    resposta:
      "Use Enviar no WhatsApp para mandar a lista de folgas de cada pessoa, Baixar imagem para postar no grupo ou Imprimir para colar no mural.",
  },
];

const REGRAS = [
  LEIS.jornada,
  LEIS.descansoSemanal,
  LEIS.repousoMedio,
  LEIS.domingoComercio,
  LEIS.domingoQuinzenal,
];

export function ConteudoSeo({ setor }: { setor?: string }) {
  return (
    <div className="mx-auto mt-16 max-w-3xl space-y-12 px-4 text-slate-700 sm:px-6 print:hidden">
      <section id="como-funciona" className="scroll-mt-6">
        <h2 className="text-2xl font-semibold text-slate-900">Como montar a escala 5x2{setor ? ` para ${setor.toLowerCase()}` : ""}</h2>
        <ol className="mt-4 space-y-3">
          <li>
            <strong className="text-slate-900">1. Diga como a empresa funciona.</strong> Marque os dias em que abre e
            quantas pessoas cada dia precisa no mínimo.
          </li>
          <li>
            <strong className="text-slate-900">2. Monte a equipe.</strong> O gerador já calcula quantas pessoas você
            precisa. Troque os nomes e, se quiser, marque os dias em que cada um prefere folgar.
          </li>
          <li>
            <strong className="text-slate-900">3. Confira e compartilhe.</strong> A escala aparece pronta, com 2 folgas
            por semana para cada pessoa. Clique em qualquer dia para ajustar e mande pelo WhatsApp, em imagem ou impressa.
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-900">O que é a escala 5x2</h2>
        <p className="mt-4">
          Na escala 5x2 cada pessoa trabalha 5 dias e folga 2 por semana. Com turnos de 8 horas, isso fecha as 40
          horas semanais previstas no art. 7º, XIII, da Constituição, na redação dada pela Emenda Constitucional
          141/2026. Quando a empresa abre 6 ou 7 dias por semana, as folgas precisam ser revezadas para que todo dia
          tenha gente suficiente, e é aí que o gerador ajuda.
        </p>
      </section>

      <AdSlot />

      <section>
        <h2 className="text-2xl font-semibold text-slate-900">Regras que o gerador confere</h2>
        <ul className="mt-4 space-y-3">
          {REGRAS.map((lei) => (
            <li key={lei.dispositivo} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="font-medium text-slate-900">{lei.norma}</p>
              <p className="text-sm">{lei.dispositivo}.</p>
              <a href={lei.url} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-700 hover:underline">
                Ler o texto oficial
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-slate-500">
          O gerador é informativo. Convenções e acordos coletivos podem trazer regras diferentes para a sua categoria.
        </p>
      </section>

      <section id="perguntas" className="scroll-mt-6">
        <h2 className="text-2xl font-semibold text-slate-900">Perguntas frequentes</h2>
        <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {PERGUNTAS.map(({ pergunta, resposta }) => (
            <details key={pergunta} className="group px-5 py-4">
              <summary className="cursor-pointer list-none font-medium text-slate-900 marker:hidden">
                <span className="flex items-center justify-between gap-4">
                  {pergunta}
                  <span className="text-slate-400 transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-2 text-sm">{resposta}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

export function dadosEstruturados(url: string) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Gerador de escala 5x2",
      url,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      inLanguage: "pt-BR",
      offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: PERGUNTAS.map(({ pergunta, resposta }) => ({
        "@type": "Question",
        name: pergunta,
        acceptedAnswer: { "@type": "Answer", text: resposta },
      })),
    },
  ];
}
