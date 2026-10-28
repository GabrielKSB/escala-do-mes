import type { Funcionario, RegraDomingo, TipoEscala } from "./tipos";

export const HORAS_DIA = 8;
export const HORAS_SEMANA = 40;
export const MAX_DIAS_SEGUIDOS = 6;

export interface Modelo {
  trabalho: number;
  folga: number;
  ciclico: boolean;
  horasPadrao: number;
  titulo: string;
  descricao: string;
}

export const MODELOS: Record<TipoEscala, Modelo> = {
  "5x2": {
    trabalho: 5,
    folga: 2,
    ciclico: false,
    horasPadrao: 8,
    titulo: "5x2",
    descricao: "5 dias de trabalho e 2 folgas por semana",
  },
  "6x1": {
    trabalho: 6,
    folga: 1,
    ciclico: false,
    horasPadrao: 20 / 3,
    titulo: "6x1",
    descricao: "6 dias de trabalho e 1 folga por semana",
  },
  "4x2": {
    trabalho: 4,
    folga: 2,
    ciclico: true,
    horasPadrao: 8,
    titulo: "4x2",
    descricao: "Ciclo de 4 dias de trabalho e 2 de folga",
  },
  "12x36": {
    trabalho: 1,
    folga: 1,
    ciclico: true,
    horasPadrao: 12,
    titulo: "12x36",
    descricao: "Plantão de 12 horas e 36 horas de descanso",
  },
};

export const TIPOS = Object.keys(MODELOS) as TipoEscala[];

export function limiteDomingos(regra: RegraDomingo, funcionario?: Funcionario): number {
  if (funcionario?.domingoQuinzenal || regra === "quinzenal") return 2;
  if (regra === "comercio") return 3;
  return Infinity;
}

export function formatarHoras(horas: number): string {
  const minutos = Math.round(horas * 60);
  const resto = minutos % 60;
  return resto ? `${Math.floor(minutos / 60)}h${String(resto).padStart(2, "0")}` : `${minutos / 60}h`;
}
