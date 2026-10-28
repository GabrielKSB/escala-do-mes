"use client";

import { ChevronDown, Plus, X } from "lucide-react";
import { type FormEvent, useRef, useState } from "react";
import type { Dimensionamento } from "@/lib/escala/calculadora";
import { SIGLAS_DIAS } from "@/lib/escala/calendario";
import { MODELOS } from "@/lib/escala/regras";
import type { DiaSemana, Funcionario, TipoEscala } from "@/lib/escala/tipos";
import { Avatar, Interruptor } from "./ui";

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
  tipo,
  aoMudar,
}: {
  funcionarios: Funcionario[];
  necessario: Dimensionamento;
  tipo: TipoEscala;
  aoMudar: (funcionarios: Funcionario[]) => void;
}) {
  const ciclico = MODELOS[tipo].ciclico;
  const [aberto, setAberto] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const fimDaLista = useRef<HTMLLIElement>(null);
  const faltam = necessario.pessoas - funcionarios.length;

  const atualizar = (id: string, parcial: Partial<Funcionario>) =>
    aoMudar(funcionarios.map((f) => (f.id === id ? { ...f, ...parcial } : f)));

  const adicionar = (nomes: string[]) => {
    aoMudar([...funcionarios, ...nomes.map(novoFuncionario)]);
    requestAnimationFrame(() => fimDaLista.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
  };

  const enviar = (evento: FormEvent) => {
    evento.preventDefault();
    adicionar([nome.trim() || `Pessoa ${funcionarios.length + 1}`]);
    setNome("");
  };

  const alternarPreferencia = (f: Funcionario, dia: DiaSemana) =>
    atualizar(f.id, {
      folgasPreferidas: f.folgasPreferidas.includes(dia)
        ? f.folgasPreferidas.filter((d) => d !== dia)
        : [...f.folgasPreferidas, dia],
    });

  return (
    <div className="flex min-h-full flex-col">
      <div className="p-5 pb-3">
        <p className={`rounded-lg px-4 py-3 text-sm ${faltam > 0 ? "bg-perigo-suave" : "bg-destaque-suave"}`}>
          Na {tipo}, os mínimos que você definiu pedem <strong>{necessario.pessoas} pessoas</strong>
          {necessario.comparacao.pessoas !== necessario.pessoas && (
            <>
              {" "}
              (na {necessario.comparacao.tipo} seriam {necessario.comparacao.pessoas})
            </>
          )}
          .{" "}
          {faltam > 0 ? (
            <button
              type="button"
              onClick={() =>
                adicionar(Array.from({ length: faltam }, (_, i) => `Pessoa ${funcionarios.length + i + 1}`))
              }
              className="font-semibold text-destaque underline underline-offset-2"
            >
              Adicionar {faltam === 1 ? "1 pessoa" : `${faltam} pessoas`}
            </button>
          ) : (
            <span>Sua equipe dá conta.</span>
          )}
        </p>
      </div>

      <ul className="flex-1 space-y-1 px-3">
        {funcionarios.map((f, indice) => {
          const expandido = aberto === f.id;
          const temPreferencia = f.folgasPreferidas.length > 0 || f.domingoQuinzenal;
          return (
            <li key={f.id} className={`rounded-lg ${expandido ? "bg-superficie ring-1 ring-borda" : ""}`}>
              <div className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-superficie">
                <Avatar nome={f.nome} indice={indice} />
                <input
                  value={f.nome}
                  onChange={(e) => atualizar(f.id, { nome: e.target.value })}
                  aria-label={`Nome da pessoa ${indice + 1}`}
                  maxLength={60}
                  className="min-w-0 flex-1 rounded-md bg-transparent px-1.5 py-1 font-semibold focus:bg-superficie focus:outline-2 focus:outline-destaque"
                />
                {!ciclico && (
                  <button
                    type="button"
                    onClick={() => setAberto(expandido ? null : f.id)}
                    aria-expanded={expandido}
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm hover:bg-destaque-suave focus-visible:outline-2 focus-visible:outline-destaque ${
                      temPreferencia ? "text-destaque" : "text-apagado"
                    }`}
                  >
                    Folgas
                    {temPreferencia && <span className="size-1.5 rounded-full bg-destaque" aria-label="com preferência" />}
                    <ChevronDown className={`size-4 transition-transform ${expandido ? "rotate-180" : ""}`} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => aoMudar(funcionarios.filter((x) => x.id !== f.id))}
                  aria-label={`Remover ${f.nome}`}
                  title={`Remover ${f.nome}`}
                  className="rounded-md p-1.5 text-apagado hover:bg-perigo-suave hover:text-perigo focus-visible:outline-2 focus-visible:outline-destaque"
                >
                  <X className="size-4" />
                </button>
              </div>
              {expandido && !ciclico && (
                <div className="space-y-4 px-3 pt-1 pb-4">
                  <div>
                    <p className="mb-2 text-sm text-apagado">Dias em que prefere folgar</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ORDEM_DIAS.map((dia) => {
                        const ativo = f.folgasPreferidas.includes(dia);
                        return (
                          <button
                            key={dia}
                            type="button"
                            aria-pressed={ativo}
                            onClick={() => alternarPreferencia(f, dia)}
                            className={`rounded-md px-2.5 py-1.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-destaque ${
                              ativo ? "folga text-destaque" : "bg-fundo text-apagado hover:text-texto"
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
                      Domingo de folga a cada 2 semanas
                      <span className="block text-apagado">Revezamento quinzenal da CLT, art. 386</span>
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
        <li ref={fimDaLista} aria-hidden className="h-2" />
      </ul>

      <form
        onSubmit={enviar}
        className="sticky bottom-16 flex gap-2 border-t border-borda bg-fundo p-3 lg:bottom-0"
      >
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da pessoa"
          aria-label="Nome da nova pessoa"
          maxLength={60}
          className="min-w-0 flex-1 rounded-lg border border-borda bg-superficie px-3 py-2 focus-visible:outline-2 focus-visible:outline-destaque"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-lg bg-destaque px-3.5 py-2 font-semibold text-destaque-texto hover:bg-destaque-forte focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destaque"
        >
          <Plus className="size-4" />
          Adicionar
        </button>
      </form>
    </div>
  );
}
