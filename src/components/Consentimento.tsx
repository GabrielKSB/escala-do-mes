"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

type Escolha = "personalizados" | "basicos";

const CHAVE = "escaladomes:consentimento";
const EVENTO_REABRIR = "escaladomes:reabrir-consentimento";

function lerEscolha(): Escolha | null {
  try {
    const valor = localStorage.getItem(CHAVE);
    return valor === "personalizados" || valor === "basicos" ? valor : null;
  } catch {
    return null;
  }
}

function carregarAnuncios(escolha: Escolha) {
  if (document.getElementById("script-adsense")) return;
  const fila = (window.adsbygoogle = window.adsbygoogle || []) as unknown[] & { requestNonPersonalizedAds?: number };
  fila.requestNonPersonalizedAds = escolha === "basicos" ? 1 : 0;
  const script = document.createElement("script");
  script.id = "script-adsense";
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adsenseCliente}`;
  document.head.appendChild(script);
}

export function reabrirConsentimento() {
  try {
    localStorage.removeItem(CHAVE);
  } catch {}
  window.dispatchEvent(new Event(EVENTO_REABRIR));
}

export function Consentimento() {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const escolha = lerEscolha();
    if (escolha) carregarAnuncios(escolha);
    else setAberto(true);
    const reabrir = () => setAberto(true);
    window.addEventListener(EVENTO_REABRIR, reabrir);
    return () => window.removeEventListener(EVENTO_REABRIR, reabrir);
  }, []);

  const escolher = (escolha: Escolha) => {
    try {
      localStorage.setItem(CHAVE, escolha);
    } catch {}
    setAberto(false);
    if (document.getElementById("script-adsense")) window.location.reload();
    else carregarAnuncios(escolha);
  };

  if (!aberto) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookies e anúncios"
      className="fixed inset-x-4 bottom-20 z-50 mx-auto max-w-lg rounded-2xl border border-borda bg-superficie-2 p-5 shadow-lg lg:bottom-4 print:hidden"
    >
      <p className="font-semibold">Cookies e anúncios</p>
      <p className="mt-1 text-sm text-apagado">
        O site é grátis porque mostra anúncios do Google. Você escolhe se eles podem usar cookies para mostrar anúncios do
        seu interesse. Sua escala nunca sai do seu aparelho.{" "}
        <Link href="/privacidade/" className="text-destaque underline underline-offset-2">
          Política de privacidade
        </Link>
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => escolher("personalizados")}
          className="min-h-11 flex-1 rounded-lg bg-destaque px-4 text-sm font-semibold text-destaque-texto hover:bg-destaque-forte focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destaque"
        >
          Aceitar anúncios personalizados
        </button>
        <button
          type="button"
          onClick={() => escolher("basicos")}
          className="min-h-11 flex-1 rounded-lg border border-borda px-4 text-sm font-medium hover:border-borda-forte focus-visible:outline-2 focus-visible:outline-destaque"
        >
          Só anúncios básicos
        </button>
      </div>
    </div>
  );
}

export function BotaoMudarConsentimento() {
  return (
    <button
      type="button"
      onClick={reabrirConsentimento}
      className="rounded-lg border border-borda px-4 py-2 text-sm font-medium hover:border-borda-forte"
    >
      Mudar minha escolha de cookies
    </button>
  );
}
