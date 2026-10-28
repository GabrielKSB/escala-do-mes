"use client";

import { RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { pessoasNecessarias } from "@/lib/escala/calculadora";
import { NOMES_MESES, intervaloDoMes, proximoMes } from "@/lib/escala/calendario";
import {
  type EstadoSalvo,
  aplicarEdicoes,
  chaveEdicao,
  codificar,
  decodificar,
  estadoValido,
  textoWhatsApp,
} from "@/lib/escala/compartilhar";
import { gerarEscala } from "@/lib/escala/gerador";
import type { Configuracao } from "@/lib/escala/tipos";
import { validar } from "@/lib/escala/validacao";
import { BarraExportar } from "./BarraExportar";
import { GradeEscala, chaveCelula } from "./GradeEscala";
import { ListaAlertas, Resumo } from "./PainelAlertas";
import { PassoEquipe, novoFuncionario } from "./PassoEquipe";
import { PassoFuncionamento } from "./PassoFuncionamento";
import { Cartao, TituloPasso } from "./ui";

export type Predefinicao = Pick<Configuracao, "diasAbertos" | "minimoPorDia" | "regraDomingo" | "horasPorDia">;

function estadoInicial(predefinicao: Predefinicao): EstadoSalvo {
  const config: Configuracao = { ...proximoMes(), ...predefinicao };
  const quantidade = Math.max(1, pessoasNecessarias(config).escala5x2);
  return {
    config,
    funcionarios: Array.from({ length: quantidade }, (_, i) => novoFuncionario(`Pessoa ${i + 1}`)),
    edicoes: {},
  };
}

function lerSalvo(chave: string): EstadoSalvo | null {
  try {
    const texto = localStorage.getItem(chave);
    return texto ? estadoValido(JSON.parse(texto)) : null;
  } catch {
    return null;
  }
}

export function Gerador({ predefinicao, chave }: { predefinicao: Predefinicao; chave: string }) {
  const [estado, setEstado] = useState<EstadoSalvo | null>(null);
  const [doLink, setDoLink] = useState(false);

  useEffect(() => {
    const lerLink = () => {
      const parametro = new URLSearchParams(window.location.hash.slice(1)).get("e");
      const compartilhado = parametro ? decodificar(parametro) : null;
      if (compartilhado) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
        setDoLink(true);
      }
      return compartilhado;
    };
    setEstado(lerLink() ?? lerSalvo(chave) ?? estadoInicial(predefinicao));

    const aoMudarHash = () => {
      const compartilhado = lerLink();
      if (compartilhado) setEstado(compartilhado);
    };
    window.addEventListener("hashchange", aoMudarHash);
    return () => window.removeEventListener("hashchange", aoMudarHash);
  }, [chave, predefinicao]);

  useEffect(() => {
    if (!estado || doLink) return;
    try {
      localStorage.setItem(chave, JSON.stringify(estado));
    } catch {}
  }, [estado, doLink, chave]);

  const atualizar = useCallback((mudanca: (anterior: EstadoSalvo) => EstadoSalvo) => {
    setDoLink(false);
    setEstado((anterior) => (anterior ? mudanca(anterior) : anterior));
  }, []);

  if (!estado) {
    return <div className="h-[640px] animate-pulse rounded-2xl bg-slate-200/60" aria-label="Carregando o gerador" />;
  }

  return (
    <Editor
      estado={estado}
      atualizar={atualizar}
      doLink={doLink}
      recomecar={() => atualizar(() => estadoInicial(predefinicao))}
    />
  );
}

function Editor({
  estado,
  atualizar,
  doLink,
  recomecar,
}: {
  estado: EstadoSalvo;
  atualizar: (mudanca: (anterior: EstadoSalvo) => EstadoSalvo) => void;
  doLink: boolean;
  recomecar: () => void;
}) {
  const { config, funcionarios, edicoes } = estado;
  const [alertaSelecionado, setAlertaSelecionado] = useState<string | null>(null);
  const tabela = useRef<HTMLTableElement>(null);
  const areaGrade = useRef<HTMLDivElement>(null);

  const dias = useMemo(() => intervaloDoMes(config.ano, config.mes), [config.ano, config.mes]);
  const base = useMemo(() => gerarEscala(config, funcionarios, dias), [config, funcionarios, dias]);
  const escala = useMemo(() => aplicarEdicoes(base, dias, edicoes), [base, dias, edicoes]);
  const alertas = useMemo(() => validar(config, funcionarios, dias, escala), [config, funcionarios, dias, escala]);
  const necessario = useMemo(
    () => pessoasNecessarias(config, funcionarios.filter((f) => f.domingoQuinzenal).length),
    [config, funcionarios],
  );

  const editados = useMemo(() => {
    const conjunto = new Set<string>();
    for (const f of funcionarios) {
      dias.forEach((d, i) => {
        if (chaveEdicao(f.id, d.iso) in edicoes) conjunto.add(chaveCelula(f.id, i));
      });
    }
    return conjunto;
  }, [funcionarios, dias, edicoes]);
  const totalEditados = editados.size;

  const alerta = alertas.find((a) => a.id === alertaSelecionado);
  const destacados = useMemo(() => {
    if (!alerta) return new Set<string>();
    const pessoas = alerta.funcionarioId ? [alerta.funcionarioId] : funcionarios.map((f) => f.id);
    return new Set(pessoas.flatMap((id) => alerta.dias.map((i) => chaveCelula(id, i))));
  }, [alerta, funcionarios]);

  const descobertos = new Set(alertas.filter((a) => a.tipo === "cobertura").flatMap((a) => a.dias));
  const abertosNoMes = dias.flatMap((d, i) => (d.noMes && config.diasAbertos[d.semana] ? [i] : []));
  const diasCobertos = abertosNoMes.filter((i) => !descobertos.has(i)).length;

  const alternar = (funcionarioId: string, indice: number) => {
    const dia = dias[indice];
    const chave = chaveEdicao(funcionarioId, dia.iso);
    const novoValor = !escala[funcionarioId][indice];
    atualizar((anterior) => {
      const proximas = { ...anterior.edicoes };
      if (base[funcionarioId][indice] === novoValor) delete proximas[chave];
      else proximas[chave] = novoValor;
      return { ...anterior, edicoes: proximas };
    });
  };

  const selecionarAlerta = (id: string | null) => {
    setAlertaSelecionado(id);
    if (id) areaGrade.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const nomeMes = `${NOMES_MESES[config.mes - 1]}-${config.ano}`;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      <div className="space-y-6 print:hidden">
        <PassoFuncionamento config={config} aoMudar={(c) => atualizar((e) => ({ ...e, config: c }))} />
        <PassoEquipe
          funcionarios={funcionarios}
          necessario={necessario}
          aoMudar={(lista) =>
            atualizar((e) => {
              const ids = new Set(lista.map((f) => f.id));
              const edicoes = Object.fromEntries(
                Object.entries(e.edicoes).filter(([chave]) => ids.has(chave.split("|")[0])),
              );
              return { ...e, funcionarios: lista, edicoes };
            })
          }
        />
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Recomeçar do zero? A equipe e os ajustes desta escala serão apagados.")) recomecar();
          }}
          className="text-sm text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline"
        >
          Recomeçar do zero
        </button>
      </div>

      <div id="escala" className="min-w-0 scroll-mt-4 space-y-4">
        {doLink && (
          <p className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900 print:hidden">
            Você abriu uma escala compartilhada. Ela só fica salva neste navegador depois que você fizer alguma alteração.
          </p>
        )}
        <div className="print:hidden">
          <Resumo alertas={alertas} diasCobertos={diasCobertos} diasAbertos={abertosNoMes.length} />
        </div>

        <Cartao className="overflow-hidden print:border-0 print:shadow-none">
          <div className="print:hidden">
            <TituloPasso
              numero={3}
              titulo="Sua escala"
              descricao="Clique em um dia para trocar entre trabalho e folga."
              acao={
                totalEditados > 0 && (
                  <button
                    type="button"
                    onClick={() => atualizar((e) => ({ ...e, edicoes: {} }))}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    <RotateCcw className="size-3.5" />
                    Desfazer {totalEditados} {totalEditados === 1 ? "ajuste" : "ajustes"}
                  </button>
                )
              }
            />
          </div>
          <div ref={areaGrade} className="overflow-x-auto print:overflow-visible">
            <GradeEscala
              ref={tabela}
              titulo={`Escala de ${NOMES_MESES[config.mes - 1]} de ${config.ano}`}
              config={config}
              funcionarios={funcionarios}
              dias={dias}
              escala={escala}
              editados={editados}
              destacados={destacados}
              aoAlternar={alternar}
            />
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex size-4 items-center justify-center rounded bg-teal-600 text-[9px] font-bold text-white">
                F
              </span>
              Folga
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-slate-400">•</span> Trabalha
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-slate-400">–</span> Fechado
            </span>
            <span className="inline-flex items-center gap-1.5 print:hidden">
              <span className="size-1.5 rounded-full bg-amber-400" /> Ajustado por você
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-3 rounded bg-amber-50 ring-1 ring-amber-200" /> Domingo
            </span>
          </div>
        </Cartao>

        <BarraExportar
          alvo={tabela}
          nomeArquivo={`escala-${nomeMes}.png`}
          textoWhatsApp={() => textoWhatsApp(config, funcionarios, dias, escala)}
          linkCompartilhar={() =>
            `${window.location.origin}${window.location.pathname}#e=${codificar(estado)}`
          }
        />

        <div className="print:hidden">
          <ListaAlertas alertas={alertas} selecionado={alertaSelecionado} aoSelecionar={selecionarAlerta} />
        </div>
      </div>
    </div>
  );
}
