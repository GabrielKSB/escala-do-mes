import { ChevronLeft, ChevronRight } from "lucide-react";
import { NOMES_DIAS, rotuloMes } from "@/lib/escala/calendario";
import type { Configuracao, RegraDomingo } from "@/lib/escala/tipos";
import { Cartao, Contador, Interruptor, TituloPasso } from "./ui";

const ORDEM_DIAS = [1, 2, 3, 4, 5, 6, 0];

const REGRAS: { valor: RegraDomingo; titulo: string; descricao: string }[] = [
  { valor: "comercio", titulo: "Comércio", descricao: "Folga no domingo pelo menos 1 vez a cada 3 semanas" },
  { valor: "quinzenal", titulo: "Quinzenal", descricao: "Folga no domingo a cada 2 semanas" },
  { valor: "nenhuma", titulo: "Não verificar", descricao: "Sem regra de domingo" },
];

export function PassoFuncionamento({
  config,
  aoMudar,
}: {
  config: Configuracao;
  aoMudar: (config: Configuracao) => void;
}) {
  const mudarMes = (delta: number) => {
    const total = config.ano * 12 + config.mes - 1 + delta;
    aoMudar({ ...config, ano: Math.floor(total / 12), mes: (total % 12) + 1 });
  };
  const mudarDia = (dia: number, campo: "diasAbertos" | "minimoPorDia", valor: boolean | number) => {
    const lista = [...config[campo]] as (boolean | number)[];
    lista[dia] = valor;
    aoMudar({ ...config, [campo]: lista });
  };

  return (
    <Cartao>
      <TituloPasso numero={1} titulo="Como sua empresa funciona" descricao="Dias abertos e quantas pessoas cada dia precisa." />
      <div className="space-y-5 px-5 py-4">
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-2 py-1.5">
          <button
            type="button"
            onClick={() => mudarMes(-1)}
            aria-label="Mês anterior"
            className="rounded-lg p-1.5 text-slate-600 hover:bg-white"
          >
            <ChevronLeft className="size-5" />
          </button>
          <span className="text-sm font-semibold">{rotuloMes(config.ano, config.mes)}</span>
          <button
            type="button"
            onClick={() => mudarMes(1)}
            aria-label="Próximo mês"
            className="rounded-lg p-1.5 text-slate-600 hover:bg-white"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div>
          <div className="mb-2 flex justify-between text-xs font-medium text-slate-500">
            <span>Dia aberto</span>
            <span>Mínimo de pessoas</span>
          </div>
          <ul className="divide-y divide-slate-100">
            {ORDEM_DIAS.map((dia) => {
              const aberto = config.diasAbertos[dia];
              return (
                <li key={dia} className="flex items-center gap-3 py-2">
                  <Interruptor
                    ligado={aberto}
                    aoMudar={(v) => mudarDia(dia, "diasAbertos", v)}
                    rotulo={`${NOMES_DIAS[dia]} aberto`}
                  />
                  <span className={`flex-1 text-sm ${aberto ? "font-medium" : "text-slate-400"}`}>
                    {NOMES_DIAS[dia]}
                    {!aberto && <span className="ml-2 text-xs">fechado</span>}
                  </span>
                  <Contador
                    valor={config.minimoPorDia[dia]}
                    aoMudar={(v) => mudarDia(dia, "minimoPorDia", v)}
                    rotulo={`mínimo de pessoas na ${NOMES_DIAS[dia].toLowerCase()}`}
                    desativado={!aberto}
                  />
                </li>
              );
            })}
          </ul>
        </div>

        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium">Horas por dia</span>
          <select
            value={config.horasPorDia}
            onChange={(e) => aoMudar({ ...config, horasPorDia: Number(e.target.value) })}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            {[4, 5, 6, 7, 8, 9, 10].map((h) => (
              <option key={h} value={h}>
                {h} horas
              </option>
            ))}
          </select>
        </label>

        {config.diasAbertos[0] && (
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Folga aos domingos</legend>
            <div className="grid gap-2">
              {REGRAS.map((regra) => (
                <label
                  key={regra.valor}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                    config.regraDomingo === regra.valor
                      ? "border-teal-600 bg-teal-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="regraDomingo"
                    className="mt-0.5 accent-teal-700"
                    checked={config.regraDomingo === regra.valor}
                    onChange={() => aoMudar({ ...config, regraDomingo: regra.valor })}
                  />
                  <span>
                    <span className="block font-medium">{regra.titulo}</span>
                    <span className="block text-slate-500">{regra.descricao}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </div>
    </Cartao>
  );
}
