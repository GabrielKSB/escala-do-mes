"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT ?? "";

export function AdSlot({ className = "" }: { className?: string }) {
  const anuncio = useRef<HTMLModElement>(null);
  const carregado = useRef(false);
  const [vazio, setVazio] = useState(false);
  const ativo = Boolean(SITE.adsenseCliente && SLOT);

  useEffect(() => {
    const elemento = anuncio.current;
    if (!ativo || !elemento || carregado.current) return;
    carregado.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}

    // O AdSense marca o bloco com data-ad-status="unfilled" quando não tem anúncio para mostrar.
    const observador = new MutationObserver(() => {
      if (elemento.dataset.adStatus === "unfilled") setVazio(true);
    });
    observador.observe(elemento, { attributes: true, attributeFilter: ["data-ad-status"] });
    return () => observador.disconnect();
  }, [ativo]);

  if (!ativo) {
    if (process.env.NODE_ENV !== "development") return null;
    return (
      <div
        className={`flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-borda text-sm text-apagado print:hidden ${className}`}
      >
        Espaço para anúncio
      </div>
    );
  }

  return (
    <div className={`print:hidden ${vazio ? "hidden" : `min-h-[120px] ${className}`}`}>
      <ins
        ref={anuncio}
        className="adsbygoogle block"
        data-ad-client={SITE.adsenseCliente}
        data-ad-slot={SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
