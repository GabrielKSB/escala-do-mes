import { describe, expect, it } from "vitest";
import { pessoasNecessarias } from "./calculadora";
import { intervaloDoMes, semanasDe } from "./calendario";
import { gerarEscala } from "./gerador";
import type { Configuracao, DiaSemana, Escala, Funcionario } from "./tipos";
import { validar } from "./validacao";

const configBase = (parcial: Partial<Configuracao> = {}): Configuracao => ({
  tipo: "5x2",
  ano: 2026,
  mes: 11,
  diasAbertos: [true, true, true, true, true, true, true],
  minimoPorDia: [3, 3, 3, 3, 3, 3, 3],
  horasPorDia: 8,
  regraDomingo: "comercio",
  ...parcial,
});

const equipe = (n: number): Funcionario[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `f${i}`,
    nome: `Pessoa ${i + 1}`,
    folgasPreferidas: [],
    domingoQuinzenal: false,
  }));

describe("intervaloDoMes", () => {
  it("fecha semanas de domingo a sábado e inclui todos os dias do mês", () => {
    for (let mes = 1; mes <= 12; mes++) {
      const dias = intervaloDoMes(2026, mes);
      expect(dias.length % 7).toBe(0);
      expect(dias[0].semana).toBe(0);
      expect(dias.at(-1)!.semana).toBe(6);
      expect(dias.filter((d) => d.noMes).length).toBe(new Date(2026, mes, 0).getDate());
    }
  });
});

describe("gerarEscala", () => {
  it("dá exatamente 2 folgas por semana a cada pessoa quando abre todos os dias", () => {
    const config = configBase();
    const dias = intervaloDoMes(config.ano, config.mes);
    const escala = gerarEscala(config, equipe(6), dias);
    for (const folgas of Object.values(escala)) {
      for (const semana of semanasDe(folgas)) {
        expect(semana.filter(Boolean).length).toBe(2);
      }
    }
  });

  it("conta o dia fechado como folga", () => {
    const config = configBase({ diasAbertos: [false, true, true, true, true, true, true] });
    const dias = intervaloDoMes(config.ano, config.mes);
    const escala = gerarEscala(config, equipe(5), dias);
    for (const folgas of Object.values(escala)) {
      for (const semana of semanasDe(folgas)) {
        expect(semana[0]).toBe(true);
        expect(semana.filter(Boolean).length).toBe(2);
      }
    }
  });

  it("não gera alertas com a equipe mínima calculada", () => {
    for (const mes of [1, 2, 6, 11]) {
      const config = configBase({ mes, minimoPorDia: [2, 3, 3, 3, 3, 4, 4] });
      const dias = intervaloDoMes(config.ano, config.mes);
      const n = pessoasNecessarias(config).pessoas;
      const funcionarios = equipe(n);
      expect(validar(config, funcionarios, dias, gerarEscala(config, funcionarios, dias))).toEqual([]);
    }
  });

  it("resolve quase todos os cenários aleatórios com a equipe mínima calculada", () => {
    let semente = 7;
    const aleatorio = () => (semente = (semente * 1103515245 + 12345) % 2147483648) / 2147483648;
    const cenarios = 300;
    let comAlerta = 0;
    for (let t = 0; t < cenarios; t++) {
      const config = configBase({
        mes: 1 + Math.floor(aleatorio() * 12),
        diasAbertos: Array.from({ length: 7 }, (_, d) => aleatorio() < (d === 0 ? 0.7 : 0.93)),
        minimoPorDia: Array.from({ length: 7 }, () => 1 + Math.floor(aleatorio() * 6)),
        regraDomingo: (["comercio", "quinzenal", "nenhuma"] as const)[Math.floor(aleatorio() * 3)],
      });
      const quinzenais = Math.floor(aleatorio() * 3);
      const n = pessoasNecessarias(config, quinzenais).pessoas + Math.floor(aleatorio() * 3);
      const funcionarios = equipe(n).map((f, i) => ({ ...f, domingoQuinzenal: i < quinzenais }));
      const dias = intervaloDoMes(config.ano, config.mes);
      if (validar(config, funcionarios, dias, gerarEscala(config, funcionarios, dias)).length) comAlerta++;
    }
    expect(comAlerta / cenarios).toBeLessThan(0.03);
  });

  it("respeita o domingo quinzenal individual", () => {
    const config = configBase({ minimoPorDia: [2, 2, 2, 2, 2, 2, 2] });
    const dias = intervaloDoMes(config.ano, config.mes);
    const funcionarios = equipe(5).map((f, i) => ({ ...f, domingoQuinzenal: i < 2 }));
    const alertas = validar(config, funcionarios, dias, gerarEscala(config, funcionarios, dias));
    expect(alertas.filter((a) => a.tipo === "domingo")).toEqual([]);
  });

  it("prefere as folgas escolhidas quando há sobra", () => {
    const config = configBase({ minimoPorDia: [1, 1, 1, 1, 1, 1, 1], regraDomingo: "nenhuma" });
    const dias = intervaloDoMes(config.ano, config.mes);
    const funcionarios = equipe(4).map((f, i) => (i === 0 ? { ...f, folgasPreferidas: [3, 4] as DiaSemana[] } : f));
    const folgas = gerarEscala(config, funcionarios, dias).f0;
    dias.forEach((d, i) => expect(folgas[i]).toBe(d.semana === 3 || d.semana === 4));
  });
});

describe("validar", () => {
  const config = configBase({ minimoPorDia: [0, 0, 0, 0, 0, 0, 0] });
  const dias = intervaloDoMes(config.ano, config.mes);
  const [ana] = equipe(1);

  it("aponta semana acima de 40 horas na escala 6x1", () => {
    const escala: Escala = { [ana.id]: dias.map((d) => d.semana === 1) };
    const alertas = validar(config, [ana], dias, escala);
    expect(alertas.filter((a) => a.tipo === "jornada").length).toBe(semanasDe(dias).length);
  });

  it("aponta mais de 6 dias seguidos de trabalho", () => {
    const folgas = dias.map((d) => d.semana === 0 || d.semana === 1);
    folgas[7] = false;
    folgas[8] = false;
    folgas[13] = true;
    folgas[12] = true;
    const alertas = validar(config, [ana], dias, { [ana.id]: folgas });
    expect(alertas.filter((a) => a.tipo === "descanso").map((a) => a.dias.length)).toEqual([10]);
  });

  it("avisa 3 domingos seguidos de trabalho no comércio", () => {
    const folgas = dias.map((d) => d.semana === 2 || d.semana === 3);
    const alertas = validar(config, [ana], dias, { [ana.id]: folgas });
    expect(alertas.filter((a) => a.tipo === "domingo").length).toBe(Math.floor(semanasDe(dias).length / 3));
  });

  it("aponta falta de cobertura no dia", () => {
    const comMinimo = configBase({ minimoPorDia: [1, 1, 1, 1, 1, 1, 1] });
    const alertas = validar(comMinimo, [ana], dias, { [ana.id]: dias.map((d) => d.semana >= 5) });
    expect(alertas.filter((a) => a.tipo === "cobertura").length).toBe(dias.filter((d) => d.semana >= 5).length);
  });
});

describe("pessoasNecessarias", () => {
  it("calcula 5x2 e 6x1 com a regra de domingo do comércio", () => {
    expect(pessoasNecessarias(configBase())).toEqual({ pessoas: 5, comparacao: { tipo: "6x1", pessoas: 4 } });
    expect(pessoasNecessarias(configBase({ minimoPorDia: [2, 3, 3, 3, 3, 4, 4] }))).toEqual({
      pessoas: 5,
      comparacao: { tipo: "6x1", pessoas: 4 },
    });
  });

  it("reserva vagas de domingo para quem tem revezamento quinzenal", () => {
    const config = configBase({ minimoPorDia: [6, 3, 3, 3, 3, 3, 3] });
    expect(pessoasNecessarias(config).pessoas).toBe(9);
    expect(pessoasNecessarias(config, 5).pessoas).toBe(11);
  });

  it("considera dias fechados", () => {
    const config = configBase({ diasAbertos: [false, true, true, true, true, true, false] });
    expect(pessoasNecessarias(config)).toEqual({ pessoas: 3, comparacao: { tipo: "6x1", pessoas: 3 } });
  });
});

describe("tipos de escala", () => {
  it("6x1 dá 1 folga por semana e respeita 40 horas com turno de 6h40", () => {
    const config = configBase({ tipo: "6x1", horasPorDia: 20 / 3, regraDomingo: "nenhuma", minimoPorDia: [2, 3, 3, 3, 3, 4, 4] });
    const dias = intervaloDoMes(config.ano, config.mes);
    const funcionarios = equipe(pessoasNecessarias(config).pessoas);
    const escala = gerarEscala(config, funcionarios, dias);
    for (const folgas of Object.values(escala)) {
      for (const semana of semanasDe(folgas)) expect(semana.filter(Boolean).length).toBe(1);
    }
    expect(validar(config, funcionarios, dias, escala)).toEqual([]);
  });

  it("6x1 com turno de 8 horas passa de 40 horas na semana", () => {
    const config = configBase({ tipo: "6x1", minimoPorDia: [1, 1, 1, 1, 1, 1, 1] });
    const dias = intervaloDoMes(config.ano, config.mes);
    const funcionarios = equipe(3);
    const alertas = validar(config, funcionarios, dias, gerarEscala(config, funcionarios, dias));
    expect(alertas.some((a) => a.tipo === "jornada")).toBe(true);
  });

  it.each([
    ["12x36", 2],
    ["4x2", 3],
  ] as const)("%s cobre todos os dias e segue o ciclo de um mês para o outro", (tipo, minimo) => {
    const config = configBase({ tipo, regraDomingo: "nenhuma", horasPorDia: tipo === "12x36" ? 12 : 8, minimoPorDia: Array(7).fill(minimo) });
    const funcionarios = equipe(pessoasNecessarias(config).pessoas);
    for (const mes of [11, 12]) {
      const dias = intervaloDoMes(2026, mes);
      expect(validar({ ...config, mes }, funcionarios, dias, gerarEscala({ ...config, mes }, funcionarios, dias))).toEqual([]);
    }
    const novembro = intervaloDoMes(2026, 11);
    const dezembro = intervaloDoMes(2026, 12);
    const emNovembro = gerarEscala(config, funcionarios, novembro);
    const emDezembro = gerarEscala({ ...config, mes: 12 }, funcionarios, dezembro);
    const comum = novembro.findIndex((d) => d.iso === dezembro[0].iso);
    for (const f of funcionarios) expect(emNovembro[f.id].slice(comum)).toEqual(emDezembro[f.id].slice(0, novembro.length - comum));
  });

  it("12x36 acusa dois plantões seguidos com o artigo 59-A", () => {
    const config = configBase({ tipo: "12x36", horasPorDia: 12, minimoPorDia: Array(7).fill(0) });
    const dias = intervaloDoMes(config.ano, config.mes);
    const [ana] = equipe(1);
    const folgas = dias.map((_, i) => i % 2 === 1);
    folgas[5] = false;
    const alertas = validar(config, [ana], dias, { [ana.id]: folgas });
    expect(alertas.filter((a) => a.tipo === "descanso").map((a) => a.lei?.dispositivo.slice(0, 9))).toEqual(["art. 59-A"]);
    expect(alertas.some((a) => a.tipo === "jornada")).toBe(false);
  });
});
