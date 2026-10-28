import Link from "next/link";
import type { ReactNode } from "react";
import { SETORES } from "@/lib/setores";
import { Logo } from "./Logo";

type Pagina = "inicio" | "gerador" | "como-funciona";

export function Moldura({ children, pagina }: { children: ReactNode; pagina: Pagina }) {
  const link = (ativo: boolean) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${ativo ? "text-texto" : "text-apagado hover:text-texto"}`;

  return (
    <>
      <header
        className={`print:hidden ${pagina === "inicio" ? "absolute inset-x-0 top-0 z-30" : "border-b border-borda bg-superficie"}`}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" aria-label="Escala do Mês, página inicial">
            <Logo fundo={pagina === "inicio" ? undefined : "#101513"} />
          </Link>
          <nav aria-label="Principal" className="flex items-center gap-1">
            <Link
              href="/como-funciona/"
              className={`hidden sm:inline-flex ${link(pagina === "como-funciona")}`}
              aria-current={pagina === "como-funciona" ? "page" : undefined}
            >
              Como funciona
            </Link>
            {pagina === "gerador" ? (
              <span className={`${link(true)} hidden sm:inline-flex`} aria-current="page">
                Gerador
              </span>
            ) : (
              <Link
                href="/gerador/"
                className="ml-2 inline-flex min-h-11 items-center rounded-full bg-destaque px-4 text-sm font-semibold text-destaque-texto hover:bg-destaque-forte focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destaque"
              >
                Montar escala
              </Link>
            )}
          </nav>
        </div>
      </header>
      {children}
      <footer className="mt-12 border-t border-borda bg-superficie pb-16 lg:pb-0 print:hidden">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-10 text-sm text-apagado sm:px-6 md:grid-cols-[2fr_1fr]">
          <div>
            <div className="text-texto">
              <Logo fundo="#101513" />
            </div>
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
            <p className="font-semibold text-texto">Escala por tipo de negócio</p>
            <ul className="mt-2 grid grid-cols-2 gap-1">
              {SETORES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/escala-5x2/${s.slug}/`} className="hover:text-destaque hover:underline">
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
