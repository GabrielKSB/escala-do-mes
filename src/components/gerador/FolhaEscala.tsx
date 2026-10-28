import { forwardRef } from "react";
import { NOMES_MESES, SIGLAS_DIAS } from "@/lib/escala/calendario";
import { formatarHoras } from "@/lib/escala/regras";
import type { Configuracao, Dia, Escala, Funcionario } from "@/lib/escala/tipos";
import { Simbolo } from "../Logo";

const COR = {
  texto: "#0b1210",
  apagado: "#5a6763",
  borda: "#d6dedb",
  domingo: "#eef7f4",
  listra: "#f7f9f8",
  folga: "#5ee6c8",
  folgaTexto: "#052b23",
  falta: "#c8372d",
};

interface Props {
  config: Configuracao;
  funcionarios: Funcionario[];
  dias: Dia[];
  escala: Escala;
}

/** Folha clara na largura de um A4 deitado (1123 px a 96 dpi), usada na impressão e na imagem. */
export const FolhaEscala = forwardRef<HTMLDivElement, Props>(function FolhaEscala(
  { config, funcionarios, dias, escala },
  ref,
) {
  const visiveis = dias.map((dia, i) => ({ dia, i })).filter(({ dia }) => dia.noMes);
  const fechado = (dia: Dia) => !config.diasAbertos[dia.semana];
  const fundoColuna = (dia: Dia) => (dia.semana === 0 ? COR.domingo : undefined);
  const celula = { borderBottom: `1px solid ${COR.borda}`, padding: "5px 2px", textAlign: "center" as const };

  return (
    <div
      ref={ref}
      style={{ width: 1123, background: "#fff", color: COR.texto, padding: 32, fontFamily: "var(--font-inter), sans-serif" }}
      className="print:!w-full print:!p-0"
    >
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 600, fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            Escala de {NOMES_MESES[config.mes - 1]} de {config.ano}
          </div>
          <div style={{ fontSize: 14, color: COR.apagado, marginTop: 4 }}>
            Escala {config.tipo}, turno de {formatarHoras(config.horasPorDia)}, {funcionarios.length}{" "}
            {funcionarios.length === 1 ? "pessoa" : "pessoas"}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600 }}>
          <Simbolo tamanho={28} corpo={COR.texto} fundo="#ffffff" />
          Escala do Mês
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", fontSize: 12 }}>
        <colgroup>
          <col style={{ width: 132 }} />
          {visiveis.map(({ dia }) => (
            <col key={dia.iso} />
          ))}
          <col style={{ width: 52 }} />
        </colgroup>
        <thead>
          <tr>
            <th style={{ ...celula, textAlign: "left", color: COR.apagado, fontWeight: 500 }}>Equipe</th>
            {visiveis.map(({ dia }) => (
              <th key={dia.iso} style={{ ...celula, background: fundoColuna(dia), fontWeight: 500 }}>
                <div style={{ color: COR.apagado }}>{SIGLAS_DIAS[dia.semana]}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{dia.dia}</div>
              </th>
            ))}
            <th style={{ ...celula, color: COR.apagado, fontWeight: 500 }}>Folgas</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.map((f, linha) => {
            const folgas = escala[f.id] ?? [];
            return (
              <tr key={f.id} style={{ background: linha % 2 ? COR.listra : undefined }}>
                <td style={{ ...celula, textAlign: "left", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {f.nome || "Sem nome"}
                </td>
                {visiveis.map(({ dia, i }) => (
                  <td key={dia.iso} style={{ ...celula, background: fundoColuna(dia), color: COR.apagado }}>
                    {fechado(dia) ? (
                      "–"
                    ) : folgas[i] ? (
                      <div
                        className="folga"
                        style={{ background: COR.folga, color: COR.folgaTexto, borderRadius: 4, fontWeight: 600, lineHeight: "20px" }}
                      >
                        F
                      </div>
                    ) : null}
                  </td>
                ))}
                <td style={{ ...celula, fontWeight: 600 }}>{visiveis.filter(({ i }) => folgas[i]).length}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td style={{ ...celula, textAlign: "left", color: COR.apagado, borderBottom: "none" }}>Trabalhando</td>
            {visiveis.map(({ dia, i }) => {
              const presentes = funcionarios.filter((f) => !escala[f.id]?.[i]).length;
              const falta = !fechado(dia) && presentes < config.minimoPorDia[dia.semana];
              return (
                <td key={dia.iso} style={{ ...celula, borderBottom: "none", color: falta ? COR.falta : COR.apagado, fontWeight: falta ? 600 : 400 }}>
                  {fechado(dia) ? "–" : presentes}
                </td>
              );
            })}
            <td style={{ ...celula, borderBottom: "none" }} />
          </tr>
        </tfoot>
      </table>

      <div style={{ display: "flex", gap: 20, marginTop: 16, fontSize: 12, color: COR.apagado }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className="folga" style={{ background: COR.folga, color: COR.folgaTexto, borderRadius: 4, padding: "0 6px", fontWeight: 600 }}>
            F
          </span>
          Folga
        </span>
        <span>– Fechado</span>
        <span>Dias em branco: trabalho</span>
      </div>
    </div>
  );
});
