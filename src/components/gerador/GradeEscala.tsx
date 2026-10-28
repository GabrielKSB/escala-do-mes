import { forwardRef } from "react";
import { NOMES_DIAS, SIGLAS_DIAS } from "@/lib/escala/calendario";
import type { Configuracao, Dia, Escala, Funcionario } from "@/lib/escala/tipos";
import { Avatar } from "./ui";

interface Props {
  titulo: string;
  config: Configuracao;
  funcionarios: Funcionario[];
  dias: Dia[];
  escala: Escala;
  editados: Set<string>;
  destacados: Set<string>;
  aoAlternar: (funcionarioId: string, indice: number) => void;
}

export const chaveCelula = (funcionarioId: string, indice: number) => `${funcionarioId}:${indice}`;

export const GradeEscala = forwardRef<HTMLTableElement, Props>(function GradeEscala(
  { titulo, config, funcionarios, dias, escala, editados, destacados, aoAlternar },
  ref,
) {
  const visiveis = dias.map((dia, i) => ({ dia, i })).filter(({ dia }) => dia.noMes);
  const presentes = (i: number) => funcionarios.filter((f) => !escala[f.id]?.[i]).length;
  const coluna = (dia: Dia) =>
    `${dia.semana === 0 ? "bg-amber-50/70" : ""} ${dia.semana === 0 && dia.dia > 1 ? "border-l border-l-slate-200" : ""}`;

  return (
    <table ref={ref} className="w-full border-separate border-spacing-0 bg-white text-sm">
      <caption className="px-3 pt-3 pb-2 text-left text-base font-semibold">{titulo}</caption>
      <thead>
        <tr>
          <th
            scope="col"
            className="sticky left-0 z-10 min-w-32 border-b border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-500"
          >
            Pessoa
          </th>
          {visiveis.map(({ dia }) => (
            <th
              key={dia.iso}
              scope="col"
              title={`${NOMES_DIAS[dia.semana]}, ${dia.dia}/${dia.mes}`}
              className={`border-b border-slate-200 px-px py-1.5 text-center font-normal ${coluna(dia)}`}
            >
              <span
                className={`block text-[10px] uppercase ${
                  config.diasAbertos[dia.semana] ? "text-slate-500" : "text-slate-300"
                }`}
              >
                {SIGLAS_DIAS[dia.semana]}
              </span>
              <span className="block text-sm font-semibold tabular-nums">{dia.dia}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {funcionarios.map((f, linha) => {
          const folgas = escala[f.id] ?? [];
          const folgasNoMes = visiveis.filter(({ i }) => folgas[i]).length;
          return (
            <tr key={f.id}>
              <th
                scope="row"
                className="sticky left-0 z-10 border-b border-slate-100 bg-white px-3 py-1 text-left font-medium"
              >
                <span className="flex items-center gap-2">
                  <Avatar nome={f.nome} indice={linha} pequeno />
                  <span className="min-w-0 leading-tight">
                    <span className="block max-w-28 truncate">{f.nome || "Sem nome"}</span>
                    <span className="block text-[11px] font-normal text-slate-500">
                      {folgasNoMes} {folgasNoMes === 1 ? "folga" : "folgas"}
                    </span>
                  </span>
                </span>
              </th>
              {visiveis.map(({ dia, i }) => {
                const fechado = !config.diasAbertos[dia.semana];
                const folga = folgas[i];
                const chave = chaveCelula(f.id, i);
                const rotulo = `${f.nome}, ${NOMES_DIAS[dia.semana]} ${dia.dia}/${dia.mes}: ${
                  fechado ? "fechado" : folga ? "folga" : "trabalha"
                }`;
                return (
                  <td key={dia.iso} className={`border-b border-slate-100 p-px text-center ${coluna(dia)}`}>
                    {fechado ? (
                      <span
                        title={rotulo}
                        className="inline-flex size-8 items-center justify-center text-slate-300 lg:size-6 2xl:size-7"
                      >
                        –
                      </span>
                    ) : (
                      <button
                        type="button"
                        title={`${rotulo}. Clique para trocar.`}
                        aria-label={`${rotulo}. Trocar.`}
                        aria-pressed={folga}
                        onClick={() => aoAlternar(f.id, i)}
                        className={`relative inline-flex size-8 items-center justify-center rounded-md text-xs font-bold transition-colors lg:size-6 2xl:size-7 ${
                          folga
                            ? "bg-teal-600 text-white hover:bg-teal-700"
                            : "text-slate-300 hover:bg-slate-100 hover:text-slate-500"
                        } ${destacados.has(chave) ? "ring-2 ring-rose-500 ring-offset-1" : ""}`}
                      >
                        {folga ? "F" : "•"}
                        {editados.has(chave) && (
                          <span className="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-amber-400 print:hidden" />
                        )}
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <th
            scope="row"
            title="Pessoas trabalhando / mínimo do dia"
            className="sticky left-0 z-10 bg-white px-3 py-2 text-left text-xs font-medium text-slate-500"
          >
            Trabalham
          </th>
          {visiveis.map(({ dia, i }) => {
            const minimo = config.minimoPorDia[dia.semana];
            const fechado = !config.diasAbertos[dia.semana];
            const total = presentes(i);
            return (
              <td key={dia.iso} className={`px-px py-2 text-center text-[11px] tabular-nums ${coluna(dia)}`}>
                {fechado ? (
                  <span className="text-slate-300">–</span>
                ) : (
                  <span
                    title={`${total} trabalhando, mínimo ${minimo}`}
                    className={`inline-block rounded px-0.5 font-semibold ${
                      total < minimo ? "bg-rose-100 text-rose-700" : "text-slate-500"
                    }`}
                  >
                    {total}/{minimo}
                  </span>
                )}
              </td>
            );
          })}
        </tr>
      </tfoot>
    </table>
  );
});
