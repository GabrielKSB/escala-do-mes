"use client";

import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal, Undo2, Users } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { pessoasNecessarias } from "@/lib/escala/calculadora";
import { NOMES_MESES, intervaloDoMes, proximoMes, rotuloMes } from "@/lib/escala/calendario";
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
import { FolhaEscala } from "./FolhaEscala";
import { GradeEscala, chaveCelula } from "./GradeEscala";
import { ListaAlertas } from "./PainelAlertas";
import { PassoEquipe, novoFuncionario } from "./PassoEquipe";
import { PassoFuncionamento } from "./PassoFuncionamento";

export type Predefinicao = Pick<Configuracao, "tipo" | "diasAbertos" | "minimoPorDia" | "regraDomingo" | "horasPorDia">;
type Aba = "empresa" | "equipe";
type Vista = "escala" | Aba;

function estadoInicial(predefinicao: Predefinicao): EstadoSalvo {
  const config: Configuracao = { ...proximoMes(), ...predefinicao };
  const quantidade = Math.max(1, pessoasNecessarias(config).pessoas);
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

function hojeIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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
    return (
      <div
        className="h-[calc(100dvh-10rem)] min-h-[560px] animate-pulse rounded-2xl border border-borda bg-superficie"
        aria-label="Carregando o gerador"
      />
    );
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
  const [aba, setAba] = useState<Aba>("empresa");
  const [vista, setVista] = useState<Vista>("escala");
  const [alertasAbertos, setAlertasAbertos] = useState(false);
  const [alertaSelecionado, setAlertaSelecionado] = useState<string | null>(null);
  const folha = useRef<HTMLDivElement>(null);
  const hoje = useMemo(hojeIso, []);

  const dias = useMemo(() => intervaloDoMes(config.ano, config.mes), [config.ano, config.mes]);
  const base = useMemo(() => gerarEscala(config, funcionarios, dias), [config, funcionarios, dias]);
  const escala = useMemo(() => aplicarEdicoes(base, dias, edicoes), [base, dias, edicoes]);
  const alertas = useMemo(() => validar(config, funcionarios, dias, escala), [config, funcionarios, dias, escala]);
  const necessario = useMemo(
    () => pessoasNecessarias(config, funcionarios.filter((f) => f.domingoQuinzenal).length),
    [config, funcionarios],
  );

  const quantidadeAlertas = alertas.length;
  const anterior = useRef(quantidadeAlertas);
  useEffect(() => {
    if (anterior.current === 0 && quantidadeAlertas > 0) setAlertasAbertos(true);
    if (quantidadeAlertas === 0) setAlertasAbertos(false);
    anterior.current = quantidadeAlertas;
  }, [quantidadeAlertas]);

  const editados = useMemo(() => {
    const conjunto = new Set<string>();
    for (const f of funcionarios) {
      dias.forEach((d, i) => {
        if (chaveEdicao(f.id, d.iso) in edicoes) conjunto.add(chaveCelula(f.id, i));
      });
    }
    return conjunto;
  }, [funcionarios, dias, edicoes]);

  const alerta = alertas.find((a) => a.id === alertaSelecionado);
  const destacados = useMemo(() => {
    if (!alerta) return new Set<string>();
    const pessoas = alerta.funcionarioId ? [alerta.funcionarioId] : funcionarios.map((f) => f.id);
    return new Set(pessoas.flatMap((id) => alerta.dias.map((i) => chaveCelula(id, i))));
  }, [alerta, funcionarios]);
  const pessoasComAlerta = useMemo(
    () => new Set(alertas.flatMap((a) => (a.funcionarioId ? [a.funcionarioId] : []))),
    [alertas],
  );

  const alternar = (funcionarioId: string, indice: number) => {
    const chave = chaveEdicao(funcionarioId, dias[indice].iso);
    const novoValor = !escala[funcionarioId][indice];
    atualizar((e) => {
      const proximas = { ...e.edicoes };
      if (base[funcionarioId][indice] === novoValor) delete proximas[chave];
      else proximas[chave] = novoValor;
      return { ...e, edicoes: proximas };
    });
  };

  const [anoHoje, mesHoje] = hoje.split("-").map(Number);
  const mesesAteHoje = anoHoje * 12 + mesHoje - (config.ano * 12 + config.mes);

  const mudarMes = (delta: number) => {
    const total = config.ano * 12 + config.mes - 1 + delta;
    atualizar((e) => ({ ...e, config: { ...e.config, ano: Math.floor(total / 12), mes: (total % 12) + 1 } }));
  };

  const mudarEquipe = (lista: typeof funcionarios) =>
    atualizar((e) => {
      const ids = new Set(lista.map((f) => f.id));
      const proximas = Object.fromEntries(Object.entries(e.edicoes).filter(([c]) => ids.has(c.split("|")[0])));
      return { ...e, funcionarios: lista, edicoes: proximas };
    });

  const abrir = (destino: Vista) => {
    setVista(destino);
    if (destino !== "escala") setAba(destino);
  };

  return (
    <>
      <div className="overflow-clip rounded-2xl border border-borda bg-superficie shadow-sm lg:grid lg:h-[calc(100dvh-10rem)] lg:min-h-[560px] lg:grid-cols-[360px_minmax(0,1fr)] print:hidden">
        <aside
          className={`${vista === "escala" ? "hidden" : "flex"} flex-col bg-fundo lg:flex lg:min-h-0 lg:border-r lg:border-borda print:hidden`}
        >
          <div role="tablist" aria-label="Configurações" className="hidden gap-1 border-b border-borda p-2 lg:flex">
            <BotaoAba ativa={aba === "empresa"} onClick={() => setAba("empresa")}>
              Empresa
            </BotaoAba>
            <BotaoAba ativa={aba === "equipe"} onClick={() => setAba("equipe")}>
              Equipe <span className="ml-1 rounded-full bg-destaque-suave px-1.5 text-xs text-destaque">{funcionarios.length}</span>
            </BotaoAba>
          </div>
          <div role="tabpanel" className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
            {aba === "empresa" ? (
              <>
                <PassoFuncionamento config={config} aoMudar={(c) => atualizar((e) => ({ ...e, config: c }))} />
                <div className="border-t border-borda px-5 py-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Apagar a equipe e os ajustes e começar uma escala nova?")) recomecar();
                    }}
                    className="text-sm text-apagado underline underline-offset-2 hover:text-perigo"
                  >
                    Começar uma escala nova
                  </button>
                </div>
              </>
            ) : (
              <PassoEquipe funcionarios={funcionarios} necessario={necessario} tipo={config.tipo} aoMudar={mudarEquipe} />
            )}
          </div>
        </aside>

        <section
          aria-label="Escala do mês"
          className={`${vista === "escala" ? "flex" : "hidden"} min-w-0 flex-col lg:flex lg:min-h-0 print:flex`}
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-borda px-4 py-3 print:hidden">
            <div className="flex items-center">
              <BotaoIcone rotulo="Mês anterior" onClick={() => mudarMes(-1)}>
                <ChevronLeft className="size-5" />
              </BotaoIcone>
              <h2 className="min-w-40 text-center font-display text-lg font-semibold" aria-live="polite">
                {rotuloMes(config.ano, config.mes)}
              </h2>
              <BotaoIcone rotulo="Próximo mês" onClick={() => mudarMes(1)}>
                <ChevronRight className="size-5" />
              </BotaoIcone>
              {mesesAteHoje !== 0 && (
                <button
                  type="button"
                  onClick={() => mudarMes(mesesAteHoje)}
                  className="ml-1 min-h-9 rounded-lg border border-borda px-3 text-sm font-medium text-apagado hover:border-borda-forte hover:text-texto focus-visible:outline-2 focus-visible:outline-destaque"
                >
                  Mês atual
                </button>
              )}
            </div>

            {quantidadeAlertas === 0 ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-destaque">
                <Check className="size-4" />
                Dentro das regras
              </span>
            ) : (
              <button
                type="button"
                aria-expanded={alertasAbertos}
                aria-controls="lista-alertas"
                onClick={() => setAlertasAbertos(!alertasAbertos)}
                className="inline-flex items-center gap-1.5 rounded-full bg-perigo-suave px-3 py-1 text-sm font-semibold text-perigo hover:bg-perigo hover:text-fundo focus-visible:outline-2 focus-visible:outline-perigo"
              >
                {quantidadeAlertas} {quantidadeAlertas === 1 ? "ponto para ajustar" : "pontos para ajustar"}
                <ChevronDown className={`size-4 transition-transform ${alertasAbertos ? "rotate-180" : ""}`} />
              </button>
            )}

            {editados.size > 0 && (
              <button
                type="button"
                onClick={() => atualizar((e) => ({ ...e, edicoes: {} }))}
                className="inline-flex items-center gap-1.5 text-sm text-apagado hover:text-destaque"
              >
                <Undo2 className="size-4" />
                Desfazer {editados.size === 1 ? "1 troca" : `${editados.size} trocas`}
              </button>
            )}

            <div className="ml-auto">
              <BarraExportar
                alvo={folha}
                nomeArquivo={`escala-${NOMES_MESES[config.mes - 1]}-${config.ano}.png`}
                textoWhatsApp={() => textoWhatsApp(config, funcionarios, dias, escala)}
                linkCompartilhar={() => `${window.location.origin}${window.location.pathname}#e=${codificar(estado)}`}
              />
            </div>
          </div>

          {doLink && (
            <p className="border-b border-borda bg-destaque-suave px-5 py-2.5 text-sm print:hidden">
              Esta escala veio de um link. Ela só fica salva neste aparelho depois que você mudar alguma coisa.
            </p>
          )}

          {alertasAbertos && quantidadeAlertas > 0 && (
            <div id="lista-alertas" className="max-h-52 shrink-0 overflow-y-auto border-b border-borda print:hidden">
              <ListaAlertas alertas={alertas} selecionado={alertaSelecionado} aoSelecionar={setAlertaSelecionado} />
            </div>
          )}

          <div className="overflow-auto lg:min-h-0 lg:flex-1 print:overflow-visible">
            <GradeEscala
              titulo={`Escala de ${NOMES_MESES[config.mes - 1]} de ${config.ano}`}
              config={config}
              funcionarios={funcionarios}
              dias={dias}
              escala={escala}
              editados={editados}
              destacados={destacados}
              pessoasComAlerta={pessoasComAlerta}
              hoje={hoje}
              aoAlternar={alternar}
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-borda px-4 py-2.5 text-sm text-apagado">
            <span className="inline-flex items-center gap-1.5">
              <span className="folga inline-flex h-4 w-5 items-center justify-center text-xs font-semibold text-destaque">F</span>
              Folga
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="hachurado inline-block h-4 w-5 rounded-sm" />
              Fechado
            </span>
            <span className="inline-flex items-center gap-1.5 print:hidden">
              <span className="size-1.5 rounded-full bg-destaque" />
              Trocado por você
            </span>
            <span className="print:hidden">Clique num dia para trocar entre trabalho e folga.</span>
          </div>
        </section>
      </div>

      <div aria-hidden className="pointer-events-none fixed top-0 -left-[20000px] print:static">
        <FolhaEscala ref={folha} config={config} funcionarios={funcionarios} dias={dias} escala={escala} />
      </div>

      <nav
        aria-label="Seções do gerador"
        className="fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-3 border-t border-borda bg-superficie lg:hidden print:hidden"
      >
        <ItemNav ativo={vista === "escala"} onClick={() => abrir("escala")} icone={<CalendarDays className="size-5" />}>
          Escala
          {quantidadeAlertas > 0 && <span className="absolute top-2 right-[calc(50%-1.25rem)] size-2 rounded-full bg-perigo" />}
        </ItemNav>
        <ItemNav ativo={vista === "empresa"} onClick={() => abrir("empresa")} icone={<SlidersHorizontal className="size-5" />}>
          Empresa
        </ItemNav>
        <ItemNav ativo={vista === "equipe"} onClick={() => abrir("equipe")} icone={<Users className="size-5" />}>
          Equipe
        </ItemNav>
      </nav>
    </>
  );
}

function BotaoAba({ ativa, onClick, children }: { ativa: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={ativa}
      onClick={onClick}
      className={`flex flex-1 items-center justify-center rounded-lg px-3 py-2 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-destaque ${
        ativa ? "bg-superficie text-destaque shadow-sm" : "text-apagado hover:text-texto"
      }`}
    >
      {children}
    </button>
  );
}

function BotaoIcone({ rotulo, onClick, children }: { rotulo: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={rotulo}
      title={rotulo}
      onClick={onClick}
      className="rounded-lg p-1.5 text-destaque hover:bg-destaque-suave focus-visible:outline-2 focus-visible:outline-destaque"
    >
      {children}
    </button>
  );
}

function ItemNav({
  ativo,
  onClick,
  icone,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  icone: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-current={ativo ? "page" : undefined}
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center gap-0.5 text-sm font-semibold ${
        ativo ? "text-destaque" : "text-apagado"
      }`}
    >
      {icone}
      {children}
      {ativo && <span className="absolute top-0 h-0.5 w-10 rounded-full bg-destaque" />}
    </button>
  );
}
