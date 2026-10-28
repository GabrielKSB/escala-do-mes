import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { SIGLAS_DIAS, intervaloDoMes, rotuloMes } from "@/lib/escala/calendario";
import { gerarEscala } from "@/lib/escala/gerador";
import type { Configuracao, Funcionario } from "@/lib/escala/tipos";

const CONFIG: Configuracao = {
  tipo: "5x2",
  ano: 2026,
  mes: 12,
  diasAbertos: [true, true, true, true, true, true, true],
  minimoPorDia: [3, 3, 3, 3, 3, 4, 4],
  horasPorDia: 8,
  regraDomingo: "comercio",
};

const EQUIPE: Funcionario[] = ["Ana", "Bruno", "Carla", "Diego", "Elisa", "Fábio"].map((nome, i) => ({
  id: `p${i}`,
  nome,
  folgasPreferidas: [],
  domingoQuinzenal: false,
}));

const DIAS_VISIVEIS = 14;

export function PreviaEscala() {
  const dias = intervaloDoMes(CONFIG.ano, CONFIG.mes);
  const escala = gerarEscala(CONFIG, EQUIPE, dias);
  const visiveis = dias.map((dia, i) => ({ dia, i })).filter(({ dia }) => dia.noMes).slice(0, DIAS_VISIVEIS);

  return (
    <div aria-hidden className="overflow-hidden rounded-2xl border border-borda bg-superficie shadow-[0_24px_64px_-24px_rgb(0_0_0/0.6)]">
      <div className="flex items-center gap-4 border-b border-borda px-5 py-3">
        <span className="flex gap-1.5">
          <span className="size-3 rounded-full bg-borda-forte" />
          <span className="size-3 rounded-full bg-borda-forte" />
          <span className="size-3 rounded-full bg-borda-forte" />
        </span>
        <span className="flex items-center gap-1 font-display font-semibold">
          <ChevronLeft className="size-4 text-apagado" />
          {rotuloMes(CONFIG.ano, CONFIG.mes)}
          <ChevronRight className="size-4 text-apagado" />
        </span>
        <span className="ml-auto hidden items-center gap-1.5 text-sm font-medium text-destaque sm:inline-flex">
          <Check className="size-4" />
          Dentro das regras
        </span>
      </div>
      <div className="overflow-hidden px-2 pb-3">
        <table className="w-full table-fixed border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className="w-24 px-3 py-2 text-left text-xs font-normal text-apagado">Equipe</th>
              {visiveis.map(({ dia }) => (
                <th key={dia.iso} className="px-px py-2 text-center font-normal">
                  <span className="block text-xs text-apagado">{SIGLAS_DIAS[dia.semana]}</span>
                  <span className="block font-medium tabular-nums">{dia.dia}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EQUIPE.map((f) => (
              <tr key={f.id}>
                <th className="border-t border-borda px-3 py-1.5 text-left font-medium">{f.nome}</th>
                {visiveis.map(({ dia, i }) => (
                  <td key={dia.iso} className="border-t border-borda p-0.5 text-center">
                    <span
                      className={`flex h-7 items-center justify-center rounded-md text-xs font-semibold ${
                        escala[f.id][i] ? "folga" : ""
                      }`}
                    >
                      {escala[f.id][i] ? "F" : ""}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
