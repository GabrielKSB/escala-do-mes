import { NOMES_DIAS } from "@/lib/escala/calendario";
import type { Configuracao, RegraDomingo } from "@/lib/escala/tipos";
import { Contador, Interruptor } from "./ui";

const ORDEM_DIAS = [1, 2, 3, 4, 5, 6, 0];

const REGRAS: { valor: RegraDomingo; titulo: string; descricao: string }[] = [
  { valor: "comercio", titulo: "Comércio", descricao: "1 domingo de folga a cada 3 semanas" },
  { valor: "quinzenal", titulo: "Quinzenal", descricao: "1 domingo de folga a cada 2 semanas" },
  { valor: "nenhuma", titulo: "Sem regra", descricao: "Não conferir os domingos" },
];

export function PassoFuncionamento({
  config,
  aoMudar,
}: {
  config: Configuracao;
  aoMudar: (config: Configuracao) => void;
}) {
  const mudarDia = (dia: number, campo: "diasAbertos" | "minimoPorDia", valor: boolean | number) => {
    const lista = [...config[campo]] as (boolean | number)[];
    lista[dia] = valor;
    aoMudar({ ...config, [campo]: lista });
  };

  return (
    <div className="space-y-7 p-5">
      <section>
        <h3 className="font-bold">Dias e equipe mínima</h3>
        <p className="mt-0.5 text-sm text-apagado">Desligue os dias em que fecha. Os números são o mínimo de pessoas trabalhando.</p>
        <ul className="mt-3 divide-y divide-grade">
          {ORDEM_DIAS.map((dia) => {
            const aberto = config.diasAbertos[dia];
            return (
              <li key={dia} className="flex items-center gap-3 py-2">
                <Interruptor
                  ligado={aberto}
                  aoMudar={(v) => mudarDia(dia, "diasAbertos", v)}
                  rotulo={`${NOMES_DIAS[dia]} aberto`}
                />
                <span className={`flex-1 ${aberto ? "" : "text-apagado line-through decoration-grade"}`}>
                  {NOMES_DIAS[dia]}
                </span>
                {aberto ? (
                  <Contador
                    valor={config.minimoPorDia[dia]}
                    aoMudar={(v) => mudarDia(dia, "minimoPorDia", v)}
                    rotulo={`mínimo de pessoas na ${NOMES_DIAS[dia].toLowerCase()}`}
                  />
                ) : (
                  <span className="pr-2 text-sm text-apagado">Fechado</span>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex items-center justify-between gap-3">
        <label htmlFor="horas-por-dia" className="font-bold">
          Turno de cada pessoa
        </label>
        <select
          id="horas-por-dia"
          value={config.horasPorDia}
          onChange={(e) => aoMudar({ ...config, horasPorDia: Number(e.target.value) })}
          className="rounded-lg border border-grade bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-tinta"
        >
          {[4, 5, 6, 7, 8, 9, 10].map((h) => (
            <option key={h} value={h}>
              {h} horas
            </option>
          ))}
        </select>
      </section>

      {config.diasAbertos[0] && (
        <fieldset>
          <legend className="font-bold">Folga no domingo</legend>
          <div className="mt-3 grid gap-2">
            {REGRAS.map((regra) => {
              const ativa = config.regraDomingo === regra.valor;
              return (
                <label
                  key={regra.valor}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-tinta ${
                    ativa ? "border-tinta bg-tinta-clara" : "border-grade bg-white hover:border-apagado"
                  }`}
                >
                  <input
                    type="radio"
                    name="regraDomingo"
                    className="sr-only"
                    checked={ativa}
                    onChange={() => aoMudar({ ...config, regraDomingo: regra.valor })}
                  />
                  <span
                    aria-hidden
                    className={`size-4 shrink-0 rounded-full border-2 ${ativa ? "border-tinta bg-tinta ring-2 ring-inset ring-white" : "border-grade"}`}
                  />
                  <span className="text-sm">
                    <span className="font-bold">{regra.titulo}</span>
                    <span className="block text-apagado">{regra.descricao}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}
    </div>
  );
}
