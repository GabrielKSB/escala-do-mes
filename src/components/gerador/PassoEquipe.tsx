"use client";

import { ChevronDown, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import type { Dimensionamento } from "@/lib/escala/calculadora";
import { SIGLAS_DIAS } from "@/lib/escala/calendario";
import type { DiaSemana, Funcionario } from "@/lib/escala/tipos";
import { Avatar, Cartao, Interruptor, TituloPasso } from "./ui";

const ORDEM_DIAS: DiaSemana[] = [1, 2, 3, 4, 5, 6, 0];

export function novoFuncionario(nome: string): Funcionario {
  return {
    id: Math.random().toString(36).slice(2, 10),
    nome,
    folgasPreferidas: [],
    domingoQuinzenal: false,
  };
}

export function PassoEquipe({
  funcionarios,
  necessario,
  aoMudar,
}: {
  funcionarios: Funcionario[];
  necessario: Dimensionamento;
  aoMudar: (funcionarios: Funcionario[]) => void;
}) {
  const [aberto, setAberto] = useState<string | null>(null);
  const faltam = necessario.escala5x2 - funcionarios.length;

  const atualizar = (id: string, parcial: Partial<Funcionario>) =>
    aoMudar(funcionarios.map((f) => (f.id === id ? { ...f, ...parcial } : f)));
  const adicionar = (quantidade = 1) =>
    aoMudar([
      ...funcionarios,
      ...Array.from({ length: quantidade }, (_, i) => novoFuncionario(`Pessoa ${funcionarios.length + i + 1}`)),
    ]);
  const alternarPreferencia = (f: Funcionario, dia: DiaSemana) =>
    atualizar(f.id, {
      folgasPreferidas: f.folgasPreferidas.includes(dia)
        ? f.folgasPreferidas.filter((d) => d !== dia)
        : [...f.folgasPreferidas, dia],
    });

  return (
    <Cartao>
      <TituloPasso
        numero={2}
        titulo="Sua equipe"
        descricao="Troque os nomes e, se quiser, os dias preferidos de folga."
        acao={
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            <Users className="size-3.5" />
            {funcionarios.length}
          </span>
        }
      />
      <div className="space-y-4 px-5 py-4">
        <div className={`rounded-xl px-4 py-3 text-sm ${faltam > 0 ? "bg-amber-50 text-amber-900" : "bg-teal-50 text-teal-900"}`}>
          <p>
            Na 5x2 você precisa de pelo menos <strong>{necessario.escala5x2} pessoas</strong>
            {necessario.escala6x1 !== necessario.escala5x2 && <> (na 6x1 seriam {necessario.escala6x1})</>}.
          </p>
          {faltam > 0 ? (
            <button
              type="button"
              onClick={() => adicionar(faltam)}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
            >
              <Plus className="size-3.5" />
              Adicionar {faltam === 1 ? "1 pessoa" : `${faltam} pessoas`}
            </button>
          ) : (
            <p className="mt-1 text-teal-700">Sua equipe é suficiente.</p>
          )}
        </div>

        <ul className="space-y-2">
          {funcionarios.map((f, indice) => {
            const expandido = aberto === f.id;
            return (
              <li key={f.id} className="rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 px-2 py-2">
                  <Avatar nome={f.nome} indice={indice} />
                  <input
                    value={f.nome}
                    onChange={(e) => atualizar(f.id, { nome: e.target.value })}
                    aria-label={`Nome da pessoa ${indice + 1}`}
                    maxLength={60}
                    className="min-w-0 flex-1 rounded-lg px-2 py-1.5 text-sm font-medium hover:bg-slate-50 focus:bg-white focus:outline-2 focus:outline-teal-600"
                  />
                  <button
                    type="button"
                    onClick={() => setAberto(expandido ? null : f.id)}
                    aria-expanded={expandido}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-100"
                  >
                    {f.folgasPreferidas.length > 0 || f.domingoQuinzenal ? "Preferências ✓" : "Preferências"}
                    <ChevronDown className={`size-3.5 transition-transform ${expandido ? "rotate-180" : ""}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => aoMudar(funcionarios.filter((x) => x.id !== f.id))}
                    aria-label={`Remover ${f.nome}`}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                {expandido && (
                  <div className="space-y-3 border-t border-slate-100 px-3 py-3">
                    <div>
                      <p className="mb-1.5 text-xs font-medium text-slate-500">Prefere folgar em</p>
                      <div className="flex flex-wrap gap-1.5">
                        {ORDEM_DIAS.map((dia) => {
                          const ativo = f.folgasPreferidas.includes(dia);
                          return (
                            <button
                              key={dia}
                              type="button"
                              aria-pressed={ativo}
                              onClick={() => alternarPreferencia(f, dia)}
                              className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                                ativo ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }`}
                            >
                              {SIGLAS_DIAS[dia]}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span>
                        Domingo quinzenal
                        <span className="block text-xs text-slate-500">Folga no domingo a cada 2 semanas (CLT art. 386)</span>
                      </span>
                      <Interruptor
                        ligado={f.domingoQuinzenal}
                        aoMudar={(v) => atualizar(f.id, { domingoQuinzenal: v })}
                        rotulo={`Domingo quinzenal para ${f.nome}`}
                      />
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => adicionar()}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 py-2.5 text-sm font-medium text-slate-600 hover:border-teal-600 hover:text-teal-700"
        >
          <Plus className="size-4" />
          Adicionar pessoa
        </button>
      </div>
    </Cartao>
  );
}
