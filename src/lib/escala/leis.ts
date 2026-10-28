import type { Citacao } from "./tipos";

const CF = "https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm";
const CLT = "https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm";
const LEI_10101 = "https://www.planalto.gov.br/ccivil_03/leis/l10101.htm";

export const LEIS = {
  jornada: {
    norma: "Constituição Federal",
    dispositivo: "art. 7º, XIII (redação da EC 141/2026): até 8 horas diárias e 40 horas semanais",
    url: CF,
  },
  repousoMedio: {
    norma: "Constituição Federal",
    dispositivo:
      "art. 7º, § 2º (EC 141/2026): regime compensatório deve garantir pelo menos 1 folga dentro de no máximo 1 semana de trabalho",
    url: CF,
  },
  descansoSemanal: {
    norma: "CLT",
    dispositivo: "art. 67: descanso semanal de 24 horas consecutivas, preferencialmente aos domingos",
    url: CLT,
  },
  domingoComercio: {
    norma: "Lei 10.101/2000",
    dispositivo:
      "art. 6º, parágrafo único: no comércio, a folga deve coincidir com o domingo pelo menos 1 vez a cada 3 semanas",
    url: LEI_10101,
  },
  domingoQuinzenal: {
    norma: "CLT",
    dispositivo: "art. 386: havendo trabalho aos domingos, revezamento quinzenal que favoreça o repouso dominical",
    url: CLT,
  },
} satisfies Record<string, Citacao>;
