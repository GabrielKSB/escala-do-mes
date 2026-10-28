import { describe, expect, it } from "vitest";
import { intervaloDoMes } from "./calendario";
import { type EstadoSalvo, aplicarEdicoes, chaveEdicao, codificar, decodificar, textoWhatsApp } from "./compartilhar";
import { escalaVazia } from "./gerador";

const estado: EstadoSalvo = {
  config: {
    tipo: "5x2",
    ano: 2026,
    mes: 11,
    diasAbertos: [false, true, true, true, true, true, false],
    minimoPorDia: [0, 1, 1, 1, 1, 1, 0],
    horasPorDia: 8,
    regraDomingo: "comercio",
  },
  funcionarios: [{ id: "a", nome: "Joana Conceição", folgasPreferidas: [1], domingoQuinzenal: true }],
  edicoes: { "a|2026-11-02": true },
};

describe("link compartilhado", () => {
  it("volta igual depois de codificar, com acentos", () => {
    expect(decodificar(codificar(estado))).toEqual(estado);
  });

  it("recusa texto inválido ou adulterado", () => {
    expect(decodificar("não é base64")).toBeNull();
    const ruim = (parcial: object) => codificar({ ...estado, ...parcial } as EstadoSalvo);
    expect(decodificar(ruim({ config: { ...estado.config, mes: 13 } }))).toBeNull();
    expect(decodificar(ruim({ config: { ...estado.config, minimoPorDia: [1, 2] } }))).toBeNull();
    expect(decodificar(ruim({ funcionarios: [{ id: 1, nome: "x" }] }))).toBeNull();
  });

  it("limpa campos fora do formato", () => {
    const sujo = codificar({
      ...estado,
      funcionarios: [{ id: "a", nome: "Ana", folgasPreferidas: [9, 2, "x"], domingoQuinzenal: "sim", extra: 1 }],
      edicoes: { ok: true, ruim: "sim" },
    } as unknown as EstadoSalvo);
    expect(decodificar(sujo)).toEqual({
      ...estado,
      funcionarios: [{ id: "a", nome: "Ana", folgasPreferidas: [2], domingoQuinzenal: false }],
      edicoes: { ok: true },
    });
  });
});

describe("textoWhatsApp", () => {
  it("lista só as folgas dentro do mês", () => {
    const dias = intervaloDoMes(2026, 11);
    const escala = aplicarEdicoes(escalaVazia(estado.config, estado.funcionarios, dias), dias, estado.edicoes);
    const texto = textoWhatsApp(estado.config, estado.funcionarios, dias, escala);
    expect(texto.split("\n")[0]).toBe("*Escala de novembro de 2026*");
    expect(texto).toContain("*Joana Conceição*: dom 1, seg 2, sáb 7, dom 8");
    expect(texto.endsWith("sáb 28, dom 29")).toBe(true);
  });

  it("aplica ajustes manuais por data", () => {
    const dias = intervaloDoMes(2026, 11);
    const escala = aplicarEdicoes({ a: dias.map(() => true) }, dias, { [chaveEdicao("a", "2026-11-01")]: false });
    expect(escala.a[dias.findIndex((d) => d.iso === "2026-11-01")]).toBe(false);
  });
});
