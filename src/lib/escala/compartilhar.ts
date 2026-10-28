import { NOMES_MESES, SIGLAS_DIAS } from "./calendario";
import { TIPOS } from "./regras";
import type { Configuracao, Dia, DiaSemana, Escala, Funcionario, RegraDomingo } from "./tipos";

/** Ajustes manuais por `${funcionarioId}|${iso}`: true = folga, false = trabalho. */
export type Edicoes = Record<string, boolean>;

export interface EstadoSalvo {
  config: Configuracao;
  funcionarios: Funcionario[];
  edicoes: Edicoes;
}

export const chaveEdicao = (funcionarioId: string, iso: string) => `${funcionarioId}|${iso}`;

export function aplicarEdicoes(escala: Escala, dias: Dia[], edicoes: Edicoes): Escala {
  return Object.fromEntries(
    Object.entries(escala).map(([id, folgas]) => [
      id,
      folgas.map((folga, i) => edicoes[chaveEdicao(id, dias[i].iso)] ?? folga),
    ]),
  );
}

const REGRAS: RegraDomingo[] = ["comercio", "quinzenal", "nenhuma"];
const inteiro = (v: unknown, min: number, max: number) =>
  typeof v === "number" && Number.isInteger(v) && v >= min && v <= max;
const listaDe = (v: unknown, n: number, ok: (x: unknown) => boolean) =>
  Array.isArray(v) && v.length === n && v.every(ok);

export function estadoValido(dados: unknown): EstadoSalvo | null {
  if (!dados || typeof dados !== "object") return null;
  const { config, funcionarios, edicoes } = dados as Record<string, unknown>;
  const c = config as Configuracao | undefined;
  if (
    !c ||
    !inteiro(c.ano, 2000, 2100) ||
    !inteiro(c.mes, 1, 12) ||
    !listaDe(c.diasAbertos, 7, (x) => typeof x === "boolean") ||
    !listaDe(c.minimoPorDia, 7, (x) => inteiro(x, 0, 500)) ||
    typeof c.horasPorDia !== "number" ||
    !(c.horasPorDia >= 1 && c.horasPorDia <= 24) ||
    !REGRAS.includes(c.regraDomingo)
  ) {
    return null;
  }
  if (!Array.isArray(funcionarios) || funcionarios.length > 500) return null;
  const pessoas: Funcionario[] = [];
  for (const f of funcionarios as Partial<Funcionario>[]) {
    if (typeof f?.id !== "string" || typeof f.nome !== "string") return null;
    pessoas.push({
      id: f.id.slice(0, 40),
      nome: f.nome.slice(0, 60),
      folgasPreferidas: (Array.isArray(f.folgasPreferidas) ? f.folgasPreferidas : []).filter((d): d is DiaSemana =>
        inteiro(d, 0, 6),
      ),
      domingoQuinzenal: f.domingoQuinzenal === true,
    });
  }
  const ajustes: Edicoes = {};
  if (edicoes && typeof edicoes === "object") {
    for (const [chave, valor] of Object.entries(edicoes)) {
      if (typeof valor === "boolean" && chave.length < 60) ajustes[chave] = valor;
    }
  }
  return {
    config: {
      tipo: TIPOS.includes(c.tipo) ? c.tipo : "5x2",
      ano: c.ano,
      mes: c.mes,
      diasAbertos: [...c.diasAbertos],
      minimoPorDia: [...c.minimoPorDia],
      horasPorDia: c.horasPorDia,
      regraDomingo: c.regraDomingo,
    },
    funcionarios: pessoas,
    edicoes: ajustes,
  };
}

export function codificar(estado: EstadoSalvo): string {
  const bytes = new TextEncoder().encode(JSON.stringify(estado));
  let binario = "";
  bytes.forEach((b) => (binario += String.fromCharCode(b)));
  return btoa(binario).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodificar(texto: string): EstadoSalvo | null {
  try {
    const binario = atob(texto.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = Uint8Array.from(binario, (c) => c.charCodeAt(0));
    return estadoValido(JSON.parse(new TextDecoder().decode(bytes)));
  } catch {
    return null;
  }
}

export function textoWhatsApp(config: Configuracao, funcionarios: Funcionario[], dias: Dia[], escala: Escala) {
  const linhas = [`*Escala de ${NOMES_MESES[config.mes - 1]} de ${config.ano}*`, "Dias de folga de cada pessoa:", ""];
  for (const f of funcionarios) {
    const folgas = dias
      .filter((d, i) => d.noMes && escala[f.id]?.[i])
      .map((d) => `${SIGLAS_DIAS[d.semana].toLowerCase()} ${d.dia}`);
    linhas.push(`*${f.nome || "Sem nome"}*: ${folgas.join(", ") || "sem folgas"}`);
  }
  return linhas.join("\n");
}
