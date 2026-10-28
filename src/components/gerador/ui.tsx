const CORES_AVATAR = [
  "bg-[#dbe7fb] text-[#1e3a6e]",
  "bg-[#fde8c8] text-[#7a4a06]",
  "bg-[#d9f0e3] text-[#1f6a45]",
  "bg-[#f3dcef] text-[#7a2a6e]",
  "bg-[#e3e0fa] text-[#3d3394]",
  "bg-[#fbdcd6] text-[#8a2c1f]",
];

export function Avatar({ nome, indice, pequeno }: { nome: string; indice: number; pequeno?: boolean }) {
  const inicial = nome.trim().charAt(0).toUpperCase() || "?";
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold ${
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
      className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta ${
        ligado ? "bg-tinta" : "bg-grade"
      }`}
    >
      <span
        className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${
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
    "inline-flex size-8 items-center justify-center rounded-md text-lg leading-none text-tinta hover:bg-tinta-clara disabled:text-grade disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-tinta";
  return (
    <div
      className={`inline-flex items-center rounded-lg border border-grade bg-white ${desativado ? "opacity-50" : ""}`}
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
      <span className="w-6 text-center font-bold tabular-nums" aria-live="polite">
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
