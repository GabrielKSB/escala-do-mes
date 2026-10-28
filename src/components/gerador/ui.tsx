import type { ReactNode } from "react";

const CORES_AVATAR = [
  "bg-teal-100 text-teal-800",
  "bg-sky-100 text-sky-800",
  "bg-violet-100 text-violet-800",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-800",
  "bg-lime-100 text-lime-800",
  "bg-indigo-100 text-indigo-800",
  "bg-orange-100 text-orange-800",
];

export function Avatar({ nome, indice, pequeno }: { nome: string; indice: number; pequeno?: boolean }) {
  const inicial = nome.trim().charAt(0).toUpperCase() || "?";
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${
        CORES_AVATAR[indice % CORES_AVATAR.length]
      } ${pequeno ? "size-6 text-[11px]" : "size-9 text-sm"}`}
    >
      {inicial}
    </span>
  );
}

export function Cartao({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</section>
  );
}

export function TituloPasso({
  numero,
  titulo,
  descricao,
  acao,
}: {
  numero: number;
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
}) {
  return (
    <header className="flex items-start gap-3 border-b border-slate-100 px-5 py-4">
      <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-teal-700 text-sm font-semibold text-white">
        {numero}
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-base font-semibold text-slate-900">{titulo}</h2>
        {descricao && <p className="mt-0.5 text-sm text-slate-500">{descricao}</p>}
      </div>
      {acao}
    </header>
  );
}

export function Interruptor({
  ligado,
  aoMudar,
  rotulo,
}: {
  ligado: boolean;
  aoMudar: (valor: boolean) => void;
  rotulo: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ligado}
      aria-label={rotulo}
      onClick={() => aoMudar(!ligado)}
      className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${
        ligado ? "bg-teal-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${
          ligado ? "translate-x-[18px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function Contador({
  valor,
  aoMudar,
  min = 0,
  max = 99,
  rotulo,
  desativado,
}: {
  valor: number;
  aoMudar: (valor: number) => void;
  min?: number;
  max?: number;
  rotulo: string;
  desativado?: boolean;
}) {
  const botao =
    "inline-flex size-8 items-center justify-center rounded-lg text-lg leading-none text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent";
  return (
    <div className={`inline-flex items-center rounded-xl border border-slate-200 ${desativado ? "opacity-40" : ""}`}>
      <button
        type="button"
        className={botao}
        aria-label={`Diminuir ${rotulo}`}
        disabled={desativado || valor <= min}
        onClick={() => aoMudar(valor - 1)}
      >
        −
      </button>
      <span className="w-7 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {valor}
      </span>
      <button
        type="button"
        className={botao}
        aria-label={`Aumentar ${rotulo}`}
        disabled={desativado || valor >= max}
        onClick={() => aoMudar(valor + 1)}
      >
        +
      </button>
    </div>
  );
}
