"use client";

import { AlertTriangle, CheckCircle2, ExternalLink, OctagonAlert, ScanSearch, Users } from "lucide-react";
import { useState } from "react";
import type { Alerta } from "@/lib/escala/tipos";

const LIMITE_INICIAL = 6;

export function Resumo({
  alertas,
  diasCobertos,
  diasAbertos,
}: {
  alertas: Alerta[];
  diasCobertos: number;
  diasAbertos: number;
}) {
  const erros = alertas.filter((a) => a.gravidade === "erro" && a.tipo !== "cobertura").length;
  const avisos = alertas.filter((a) => a.gravidade === "aviso").length;
  const percentual = diasAbertos ? Math.round((diasCobertos / diasAbertos) * 100) : 100;

  const cartao = "rounded-2xl border bg-white p-4 shadow-sm";
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className={`${cartao} border-slate-200`}>
        <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Users className="size-3.5" /> Cobertura
        </p>
        <p className={`mt-1 text-2xl font-semibold ${percentual < 100 ? "text-rose-600" : "text-teal-700"}`}>{percentual}%</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${percentual < 100 ? "bg-rose-500" : "bg-teal-600"}`}
            style={{ width: `${percentual}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-slate-500">
          {diasCobertos} de {diasAbertos} dias
        </p>
      </div>
      <div className={`${cartao} ${erros ? "border-rose-200" : "border-slate-200"}`}>
        <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <OctagonAlert className="size-3.5" /> Regras da lei
        </p>
        <p className={`mt-1 text-2xl font-semibold ${erros ? "text-rose-600" : "text-teal-700"}`}>{erros}</p>
        <p className="mt-1.5 text-xs text-slate-500">{erros === 1 ? "problema" : "problemas"}</p>
      </div>
      <div className={`${cartao} ${avisos ? "border-amber-200" : "border-slate-200"}`}>
        <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <AlertTriangle className="size-3.5" /> Domingos
        </p>
        <p className={`mt-1 text-2xl font-semibold ${avisos ? "text-amber-600" : "text-teal-700"}`}>{avisos}</p>
        <p className="mt-1.5 text-xs text-slate-500">{avisos === 1 ? "aviso" : "avisos"}</p>
      </div>
    </div>
  );
}

export function ListaAlertas({
  alertas,
  selecionado,
  aoSelecionar,
}: {
  alertas: Alerta[];
  selecionado: string | null;
  aoSelecionar: (id: string | null) => void;
}) {
  const [todos, setTodos] = useState(false);

  if (alertas.length === 0) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-teal-600" />
        <p>
          <strong>Escala dentro das regras.</strong> Todos os dias têm o mínimo de pessoas, ninguém passa de 40 horas
          na semana nem de 6 dias seguidos sem folga.
        </p>
      </div>
    );
  }

  const visiveis = todos ? alertas : alertas.slice(0, LIMITE_INICIAL);

  return (
    <ul className="space-y-2">
      {visiveis.map((alerta) => {
        const erro = alerta.gravidade === "erro";
        const ativo = selecionado === alerta.id;
        return (
          <li
            key={alerta.id}
            className={`rounded-2xl border px-4 py-3 text-sm ${
              erro ? "border-rose-200 bg-rose-50 text-rose-950" : "border-amber-200 bg-amber-50 text-amber-950"
            } ${ativo ? "ring-2 ring-rose-400" : ""}`}
          >
            <div className="flex items-start gap-3">
              {erro ? (
                <OctagonAlert className="mt-0.5 size-4 shrink-0 text-rose-600" />
              ) : (
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium">{alerta.mensagem}</p>
                {alerta.lei && (
                  <a
                    href={alerta.lei.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs opacity-80 hover:underline"
                  >
                    {alerta.lei.norma}, {alerta.lei.dispositivo}
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
              {alerta.dias.length > 0 && (
                <button
                  type="button"
                  onClick={() => aoSelecionar(ativo ? null : alerta.id)}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white/70 px-2 py-1 text-xs font-medium hover:bg-white"
                >
                  <ScanSearch className="size-3.5" />
                  {ativo ? "Ocultar" : "Ver na escala"}
                </button>
              )}
            </div>
          </li>
        );
      })}
      {alertas.length > LIMITE_INICIAL && (
        <li>
          <button
            type="button"
            onClick={() => setTodos(!todos)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            {todos ? "Mostrar menos" : `Mostrar todos os ${alertas.length} alertas`}
          </button>
        </li>
      )}
    </ul>
  );
}
