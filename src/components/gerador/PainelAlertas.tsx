"use client";

import { ExternalLink } from "lucide-react";
import type { Alerta } from "@/lib/escala/tipos";

export function ListaAlertas({
  alertas,
  selecionado,
  aoSelecionar,
}: {
  alertas: Alerta[];
  selecionado: string | null;
  aoSelecionar: (id: string | null) => void;
}) {
  return (
    <ul className="divide-y divide-borda">
      {alertas.map((alerta) => {
        const ativo = selecionado === alerta.id;
        const erro = alerta.gravidade === "erro";
        return (
          <li key={alerta.id} className={`flex items-start gap-3 px-5 py-3 ${ativo ? "bg-perigo-suave" : ""}`}>
            <span
              aria-hidden
              className={`mt-1.5 size-2 shrink-0 rounded-full ${erro ? "bg-perigo" : "bg-amber-400"}`}
            />
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-semibold">{alerta.mensagem}</p>
              {alerta.lei && (
                <a
                  href={alerta.lei.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 inline-flex items-center gap-1 text-apagado hover:text-destaque hover:underline"
                >
                  {alerta.lei.norma}, {alerta.lei.dispositivo}
                  <ExternalLink className="size-3 shrink-0" />
                </a>
              )}
            </div>
            {alerta.dias.length > 0 && (
              <button
                type="button"
                aria-pressed={ativo}
                onClick={() => aoSelecionar(ativo ? null : alerta.id)}
                className="shrink-0 rounded-md border border-borda bg-superficie px-2.5 py-1 text-sm font-semibold text-destaque hover:border-destaque focus-visible:outline-2 focus-visible:outline-destaque"
              >
                {ativo ? "Ocultar" : "Mostrar"}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
