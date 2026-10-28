const CORES_AVATAR = [
  "bg-[#12302a] text-[#5ee6c8]",
  "bg-[#2e2611] text-[#f2c94c]",
  "bg-[#172436] text-[#8fb8ff]",
  "bg-[#2d1a2e] text-[#e39be0]",
  "bg-[#211f3b] text-[#ab9fff]",
  "bg-[#2c1714] text-[#f49c8c]",
];

export function Avatar({ nome, indice, pequeno }: { nome: string; indice: number; pequeno?: boolean }) {
  const inicial = nome.trim().charAt(0).toUpperCase() || "?";
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${
        CORES_AVATAR[indice % CORES_AVATAR.length]
      } ${pequeno ? "size-6 text-xs" : "size-8 text-sm"}`}
    >
      {inicial}
    </span>
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
      className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destaque ${
        ligado ? "bg-destaque" : "bg-borda"
      }`}
    >
      <span
        className={`inline-block size-5 rounded-full bg-texto shadow-sm transition-transform ${
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
    "inline-flex size-8 items-center justify-center rounded-md text-lg leading-none text-destaque hover:bg-destaque-suave disabled:text-borda disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-destaque";
  return (
    <div
      className={`inline-flex items-center rounded-lg border border-borda bg-superficie ${desativado ? "opacity-50" : ""}`}
    >
      <button
        type="button"
        className={botao}
        aria-label={`Diminuir ${rotulo}`}
        disabled={desativado || valor <= min}
        onClick={() => aoMudar(valor - 1)}
      >
        −
      </button>
      <span className="w-6 text-center font-semibold tabular-nums" aria-live="polite">
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
