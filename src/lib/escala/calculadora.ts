import { MODELOS, limiteDomingos } from "./regras";
import type { Configuracao, TipoEscala } from "./tipos";

export interface Dimensionamento {
  pessoas: number;
  comparacao: { tipo: TipoEscala; pessoas: number };
}

function minimoPara(config: Configuracao, tipo: TipoEscala, domingoQuinzenal: number): number {
  const abertos = [0, 1, 2, 3, 4, 5, 6].filter((d) => config.diasAbertos[d]);
  if (abertos.length === 0) return 0;
  const pico = Math.max(0, ...abertos.map((d) => config.minimoPorDia[d]));
  const { trabalho, folga, ciclico } = MODELOS[tipo];

  if (ciclico) return Math.ceil((pico * (trabalho + folga)) / trabalho);

  const demanda = abertos.reduce((soma, d) => soma + config.minimoPorDia[d], 0);
  const porDemanda = Math.ceil(demanda / Math.min(trabalho, abertos.length));

  // Quem precisa folgar 1 domingo a cada L semanas ocupa, em média, 1/L das vagas de folga do domingo.
  const limite = limiteDomingos(config.regraDomingo);
  const fracao = Number.isFinite(limite) ? 1 / limite : 0;
  let porDomingo = 0;
  if (folga > 1 && config.diasAbertos[0] && (fracao > 0 || domingoQuinzenal > 0)) {
    const necessario = (config.minimoPorDia[0] + domingoQuinzenal * (1 / 2 - fracao)) / (1 - fracao);
    porDomingo = Math.max(domingoQuinzenal, Math.ceil(necessario - 1e-9));
  }

  return Math.max(porDemanda, pico, porDomingo);
}

export function pessoasNecessarias(config: Configuracao, domingoQuinzenal = 0): Dimensionamento {
  const outro: TipoEscala = config.tipo === "5x2" ? "6x1" : "5x2";
  return {
    pessoas: minimoPara(config, config.tipo, domingoQuinzenal),
    comparacao: { tipo: outro, pessoas: minimoPara(config, outro, domingoQuinzenal) },
  };
}
