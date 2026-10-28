import type { Funcionario, RegraDomingo } from "./tipos";

export const HORAS_DIA = 8;
export const HORAS_SEMANA = 40;
export const FOLGAS_POR_SEMANA = 2;
export const MAX_DIAS_SEGUIDOS = 6;

export function limiteDomingos(regra: RegraDomingo, funcionario?: Funcionario): number {
  if (funcionario?.domingoQuinzenal || regra === "quinzenal") return 2;
  if (regra === "comercio") return 3;
  return Infinity;
}
