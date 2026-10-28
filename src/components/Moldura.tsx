import { CalendarDays } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { SETORES } from "@/lib/setores";

export function Moldura({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="border-b border-slate-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold text-slate-900">
            <span className="inline-flex size-8 items-center justify-center rounded-xl bg-teal-700 text-white">
              <CalendarDays className="size-4.5" />
            </span>
            Escala 5x2
          </Link>
          <nav className="flex gap-4 text-sm text-slate-600">
            <a href="#como-funciona" className="hover:text-slate-900">
              Como funciona
            </a>
            <a href="#perguntas" className="hover:text-slate-900">
              Perguntas
            </a>
          </nav>
        </div>
      </header>
      {children}
      <footer className="mt-16 border-t border-slate-200 bg-white print:hidden">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-10 text-sm text-slate-600 sm:px-6 md:grid-cols-2">
          <div>
            <p className="font-semibold text-slate-900">Escala 5x2</p>
            <p className="mt-2 max-w-md">
              Ferramenta gratuita e informativa. Não substitui orientação jurídica nem a convenção coletiva da sua
              categoria. Os dados ficam só no seu navegador.
            </p>
            <p className="mt-2 max-w-md text-xs text-slate-500">
              Textos legais conferidos na compilação do Planalto, com apoio do acervo aberto{" "}
              <a href="https://github.com/ctresb/leis" className="underline" target="_blank" rel="noopener noreferrer">
                ctresb/leis
              </a>
              .
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Escala 5x2 por setor</p>
            <ul className="mt-2 grid grid-cols-2 gap-1">
              {SETORES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/escala-5x2/${s.slug}/`} className="hover:text-slate-900 hover:underline">
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
