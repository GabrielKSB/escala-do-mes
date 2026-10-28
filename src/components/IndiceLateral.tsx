"use client";

import { useEffect, useState } from "react";

const PROPORCAO_DA_TELA = 0.3;

export function IndiceLateral({ secoes }: { secoes: { id: string; titulo: string }[] }) {
  const [ativa, setAtiva] = useState<string | undefined>(secoes[0]?.id);

  useEffect(() => {
    const atualizar = () => {
      const noFim = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (noFim) return setAtiva(secoes.at(-1)?.id);
      const passadas = secoes.filter(({ id }) => {
        const elemento = document.getElementById(id);
        return elemento && elemento.getBoundingClientRect().top <= window.innerHeight * PROPORCAO_DA_TELA;
      });
      setAtiva((passadas.at(-1) ?? secoes[0])?.id);
    };
    atualizar();
    window.addEventListener("scroll", atualizar, { passive: true });
    window.addEventListener("resize", atualizar);
    return () => {
      window.removeEventListener("scroll", atualizar);
      window.removeEventListener("resize", atualizar);
    };
  }, [secoes]);

  return (
    <nav aria-label="Nesta página" className="hidden lg:block">
      <ul className="sticky top-8 space-y-1 border-l border-borda text-sm">
        {secoes.map(({ id, titulo }) => {
          const atual = id === ativa;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={atual ? "location" : undefined}
                onClick={() => setAtiva(id)}
                className={`-ml-px block border-l-2 py-1.5 pl-4 transition-colors ${
                  atual
                    ? "border-destaque font-medium text-destaque"
                    : "border-transparent text-apagado hover:border-borda-forte hover:text-texto"
                }`}
              >
                {titulo}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
