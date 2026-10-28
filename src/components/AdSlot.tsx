"use client";

import { useEffect, useRef } from "react";
import { SITE } from "@/lib/site";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT ?? "";

export function AdSlot({ className = "" }: { className?: string }) {
  const carregado = useRef(false);
  const ativo = Boolean(SITE.adsenseCliente && SLOT);

  useEffect(() => {
    if (!ativo || carregado.current) return;
    carregado.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [ativo]);

  if (!ativo) {
    if (process.env.NODE_ENV !== "development") return null;
    return (
      <div
        className={`flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-slate-300 text-xs text-slate-400 print:hidden ${className}`}
      >
        Espaço para anúncio
      </div>
    );
  }

  return (
    <div className={`min-h-[120px] print:hidden ${className}`}>
      <ins
        className="adsbygoogle block"
        data-ad-client={SITE.adsenseCliente}
        data-ad-slot={SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
