import Link from "next/link";
import type { ReactNode } from "react";
import { SETORES } from "@/lib/setores";

export function Moldura({ children, pagina }: { children: ReactNode; pagina: "gerador" | "como-funciona" }) {
  const link = (ativo: boolean) =>
    `rounded-lg px-3 py-1.5 font-bold transition-colors ${ativo ? "bg-tinta-clara text-tinta" : "text-apagado hover:text-texto"}`;

  return (
    <>
      <header className="border-b border-grade bg-white print:hidden">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-tinta">
            <span aria-hidden className="marca-texto px-1.5 leading-tight">
              5x2
            </span>
            Escala
          </Link>
          <nav aria-label="Principal" className="flex gap-1 text-sm">
            <Link href="/" className={link(pagina === "gerador")} aria-current={pagina === "gerador" ? "page" : undefined}>
              Gerador
            </Link>
            <Link
              href="/como-funciona/"
              className={link(pagina === "como-funciona")}
              aria-current={pagina === "como-funciona" ? "page" : undefined}
            >
              Como funciona
            </Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="mt-12 border-t border-grade bg-white pb-16 lg:pb-0 print:hidden">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-10 text-sm text-apagado sm:px-6 md:grid-cols-[2fr_1fr]">
          <div>
            <p className="font-bold text-texto">Escala 5x2</p>
            <p className="mt-2 max-w-prose">
              Ferramenta gratuita e informativa. Não substitui orientação jurídica nem a convenção coletiva da sua
              categoria. A escala fica salva só no seu navegador.
            </p>
            <p className="mt-2 max-w-prose">
              Textos legais conferidos na compilação do Planalto, com apoio do acervo aberto{" "}
              <a href="https://github.com/ctresb/leis" className="underline" target="_blank" rel="noopener noreferrer">
                ctresb/leis
              </a>
              .
            </p>
          </div>
          <div>
            <p className="font-bold text-texto">Escala por tipo de negócio</p>
            <ul className="mt-2 grid grid-cols-2 gap-1">
              {SETORES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/escala-5x2/${s.slug}/`} className="hover:text-tinta hover:underline">
                    {s.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
