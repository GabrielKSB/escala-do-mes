/** 0 = domingo, igual a Date.getUTCDay. */
export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Funcionario {
  id: string;
  nome: string;
  folgasPreferidas: DiaSemana[];
  domingoQuinzenal: boolean;
}

export type RegraDomingo = "comercio" | "quinzenal" | "nenhuma";

export type TipoEscala = "5x2" | "6x1" | "4x2" | "12x36";

export interface Configuracao {
  tipo: TipoEscala;
  ano: number;
  mes: number;
  diasAbertos: boolean[];
  minimoPorDia: number[];
  horasPorDia: number;
  regraDomingo: RegraDomingo;
}

export interface Dia {
  iso: string;
  ano: number;
  mes: number;
  dia: number;
  semana: DiaSemana;
  noMes: boolean;
}

/** Por funcionário, um valor por dia do intervalo: true = folga. */
export type Escala = Record<string, boolean[]>;

export interface Citacao {
  norma: string;
  dispositivo: string;
  url: string;
}

export type TipoAlerta = "cobertura" | "jornada" | "descanso" | "domingo";

export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  gravidade: "erro" | "aviso";
  mensagem: string;
  funcionarioId?: string;
  dias: number[];
  lei?: Citacao;
}
