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
  pessoasComAlerta: Set<string>;
  hoje: string;
  aoAlternar: (funcionarioId: string, indice: number) => void;
}

export const chaveCelula = (funcionarioId: string, indice: number) => `${funcionarioId}:${indice}`;

export const GradeEscala = forwardRef<HTMLTableElement, Props>(function GradeEscala(
  { titulo, config, funcionarios, dias, escala, editados, destacados, pessoasComAlerta, hoje, aoAlternar },
  ref,
) {
  const visiveis = dias.map((dia, i) => ({ dia, i })).filter(({ dia }) => dia.noMes);
  const presentes = (i: number) => funcionarios.filter((f) => !escala[f.id]?.[i]).length;
  const coluna = (dia: Dia) =>
    `${dia.semana === 0 ? "bg-tinta-clara/60" : ""} ${dia.semana === 0 && dia.dia > 1 ? "border-l border-l-grade" : ""}`;

  return (
    <table ref={ref} className="w-full border-separate border-spacing-0 bg-white">
      <caption className="sr-only print:not-sr-only print:pb-2 print:text-left print:text-lg print:font-bold">
        {titulo}
      </caption>
      <thead>
        <tr>
          <th
            scope="col"
            className="sticky top-0 left-0 z-30 min-w-32 border-b border-grade bg-white px-4 py-2 text-left text-sm font-normal text-apagado"
          >
            Equipe
          </th>
          {visiveis.map(({ dia }) => {
            const ehHoje = dia.iso === hoje;
            return (
              <th
                key={dia.iso}
                scope="col"
                title={`${NOMES_DIAS[dia.semana]}, ${dia.dia}/${dia.mes}`}
                className={`sticky top-0 z-20 border-b border-grade bg-white px-px py-1.5 text-center font-normal ${coluna(dia)}`}
              >
                <span className={`block text-[11px] ${config.diasAbertos[dia.semana] ? "text-apagado" : "text-grade"}`}>
                  {SIGLAS_DIAS[dia.semana]}
                </span>
                <span
                  className={`mx-auto mt-0.5 flex size-6 items-center justify-center rounded-full text-sm font-bold tabular-nums ${
                    ehHoje ? "bg-tinta text-white" : ""
                  }`}
                >
                  {dia.dia}
                </span>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {funcionarios.map((f, linha) => {
          const folgas = escala[f.id] ?? [];
          const folgasNoMes = visiveis.filter(({ i }) => folgas[i]).length;
          const comAlerta = pessoasComAlerta.has(f.id);
          return (
            <tr key={f.id} className="group">
              <th
                scope="row"
                className="sticky left-0 z-10 border-b border-grade bg-white px-4 py-1 text-left font-normal group-hover:bg-papel"
              >
                <span className="flex items-center gap-2.5">
                  <Avatar nome={f.nome} indice={linha} pequeno />
                  <span className="min-w-0 leading-tight">
                    <span className="block max-w-28 truncate font-bold">{f.nome || "Sem nome"}</span>
                    <span className={`block text-xs ${comAlerta ? "font-bold text-caneta" : "text-apagado"}`}>
                      {comAlerta ? "Precisa de ajuste" : `${folgasNoMes} folgas`}
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
                if (fechado) {
                  return (
                    <td key={dia.iso} title={rotulo} className={`hachurado border-b border-grade ${coluna(dia)}`}>
                      <span className="sr-only">Fechado</span>
                    </td>
                  );
                }
                return (
                  <td key={dia.iso} className={`border-b border-grade p-px text-center group-hover:bg-papel/60 ${coluna(dia)}`}>
                    <button
                      type="button"
                      title={`${rotulo}. Clique para trocar.`}
                      aria-label={`${rotulo}. Trocar.`}
                      aria-pressed={folga}
                      onClick={() => aoAlternar(f.id, i)}
                      className={`relative inline-flex h-8 w-full min-w-6 items-center justify-center rounded-sm text-sm font-bold focus-visible:outline-2 focus-visible:outline-tinta ${
                        folga ? "marca-texto text-tinta" : "text-transparent hover:text-grade"
                      } ${destacados.has(chave) ? "outline-2 outline-caneta" : ""}`}
                    >
                      {folga ? "F" : "+"}
                      {editados.has(chave) && (
                        <span className="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-tinta print:hidden" />
                      )}
                    </button>
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
            className="sticky left-0 z-10 bg-white px-4 py-2 text-left text-sm font-normal text-apagado"
          >
            Trabalhando
          </th>
          {visiveis.map(({ dia, i }) => {
            const minimo = config.minimoPorDia[dia.semana];
            const total = presentes(i);
            if (!config.diasAbertos[dia.semana]) return <td key={dia.iso} className={coluna(dia)} />;
            const falta = total < minimo;
            return (
              <td key={dia.iso} className={`px-px py-2 text-center text-xs tabular-nums ${coluna(dia)}`}>
                <span
                  title={`${total} trabalhando, mínimo ${minimo}`}
                  className={`inline-block min-w-6 rounded px-0.5 py-0.5 font-bold ${
                    falta ? "bg-caneta text-white" : "text-apagado"
                  }`}
                >
                  {total}
                </span>
              </td>
            );
          })}
        </tr>
      </tfoot>
    </table>
  );
});
