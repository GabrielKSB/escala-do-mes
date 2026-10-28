import { limiteDomingos } from "./regras";
import type { Configuracao } from "./tipos";

export interface Dimensionamento {
  escala5x2: number;
  escala6x1: number;
}

/**
 * Estimativa de equipe mínima. Quem precisa folgar 1 domingo a cada L semanas ocupa,
 * em média, 1/L das vagas de folga de cada domingo.
 */
export function pessoasNecessarias(config: Configuracao, domingoQuinzenal = 0): Dimensionamento {
  const abertos = [0, 1, 2, 3, 4, 5, 6].filter((d) => config.diasAbertos[d]);
  const demanda = abertos.reduce((soma, d) => soma + config.minimoPorDia[d], 0);
  const pico = Math.max(0, ...abertos.map((d) => config.minimoPorDia[d]));

  const limite = limiteDomingos(config.regraDomingo);
  const fracao = Number.isFinite(limite) ? 1 / limite : 0;
  let porDomingo = 0;
  if (config.diasAbertos[0] && (fracao > 0 || domingoQuinzenal > 0)) {
    const necessario = (config.minimoPorDia[0] + domingoQuinzenal * (1 / 2 - fracao)) / (1 - fracao);
    porDomingo = Math.max(domingoQuinzenal, Math.ceil(necessario - 1e-9));
  }

  const minimo = (diasPorPessoa: number) => {
    if (abertos.length === 0) return 0;
    const porDemanda = Math.ceil(demanda / Math.min(diasPorPessoa, abertos.length));
    return Math.max(porDemanda, pico, porDomingo);
  };

  return { escala5x2: minimo(5), escala6x1: minimo(6) };
}
