import type { Dia, DiaSemana } from "./tipos";

export const NOMES_DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
export const SIGLAS_DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const NOMES_MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export function rotuloMes(ano: number, mes: number): string {
  const nome = NOMES_MESES[mes - 1];
  return `${nome.charAt(0).toUpperCase()}${nome.slice(1)} de ${ano}`;
}

const UM_DIA = 86_400_000;

export const diaAbsoluto = (dia: Dia) => Math.round(Date.UTC(dia.ano, dia.mes - 1, dia.dia) / UM_DIA);

function paraDia(ms: number, mes: number): Dia {
  const d = new Date(ms);
  const m = d.getUTCMonth() + 1;
  return {
    iso: d.toISOString().slice(0, 10),
    ano: d.getUTCFullYear(),
    mes: m,
    dia: d.getUTCDate(),
    semana: d.getUTCDay() as DiaSemana,
    noMes: m === mes,
  };
}

/** Dias do mês completados até fechar semanas de domingo a sábado. */
export function intervaloDoMes(ano: number, mes: number): Dia[] {
  const primeiro = Date.UTC(ano, mes - 1, 1);
  const ultimo = Date.UTC(ano, mes, 0);
  const inicio = primeiro - new Date(primeiro).getUTCDay() * UM_DIA;
  const fim = ultimo + (6 - new Date(ultimo).getUTCDay()) * UM_DIA;
  const dias: Dia[] = [];
  for (let ms = inicio; ms <= fim; ms += UM_DIA) dias.push(paraDia(ms, mes));
  return dias;
}

export function semanasDe<T>(itens: T[]): T[][] {
  const semanas: T[][] = [];
  for (let i = 0; i < itens.length; i += 7) semanas.push(itens.slice(i, i + 7));
  return semanas;
}

export function proximoMes(hoje = new Date()): { ano: number; mes: number } {
  const mes = hoje.getMonth() + 2;
  return mes > 12 ? { ano: hoje.getFullYear() + 1, mes: 1 } : { ano: hoje.getFullYear(), mes };
}
