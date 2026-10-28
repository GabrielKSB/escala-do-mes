const COLUNAS = [8, 16.5, 25, 33.5];
const LINHAS = [19, 26.5, 34];
const FOLGAS = new Set(["3-0", "0-2"]);

export function Simbolo({
  className = "",
  corpo = "#e6ecea",
  fundo = "#090c0b",
  folga = "#5ee6c8",
}: {
  className?: string;
  corpo?: string;
  fundo?: string;
  folga?: string;
}) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <path d="M9 8h30a5 5 0 0 1 5 5v19L32 44H9a5 5 0 0 1-5-5V13a5 5 0 0 1 5-5Z" fill={corpo} />
      <path d="M44 32h-8a4 4 0 0 0-4 4v8Z" fill={fundo} opacity="0.35" />
      <rect x="8" y="14" width="32" height="2" rx="1" fill={fundo} />
      {[13, 31].map((x) => (
        <rect key={x} x={x} y="3.5" width="4" height="8.5" rx="2" fill={corpo} stroke={fundo} strokeWidth="1.5" />
      ))}
      {LINHAS.flatMap((y, linha) =>
        COLUNAS.map((x, coluna) =>
          coluna === 3 && linha === 2 ? null : (
            <rect
              key={`${coluna}-${linha}`}
              x={x}
              y={y}
              width="6.5"
              height="6"
              rx="1.2"
              fill={FOLGAS.has(`${coluna}-${linha}`) ? folga : fundo}
            />
          ),
        ),
      )}
    </svg>
  );
}

export function Logo({ fundo }: { fundo?: string }) {
  return (
    <span className="flex items-center gap-2.5 font-display text-lg font-semibold">
      <Simbolo className="size-8" fundo={fundo} />
      Escala do Mês
    </span>
  );
}
