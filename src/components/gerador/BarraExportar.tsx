"use client";

import { Check, ChevronDown, CircleAlert, ImageDown, Link2, MessageCircle, Printer, Send } from "lucide-react";
import { type ReactNode, type RefObject, useEffect, useRef, useState } from "react";

export function BarraExportar({
  alvo,
  nomeArquivo,
  textoWhatsApp,
  linkCompartilhar,
}: {
  alvo: RefObject<HTMLElement | null>;
  nomeArquivo: string;
  textoWhatsApp: () => string;
  linkCompartilhar: () => string;
}) {
  const [aberto, setAberto] = useState(false);
  const [aviso, setAviso] = useState<{ texto: string; ok: boolean } | null>(null);
  const area = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const fecharFora = (e: PointerEvent) => {
      if (!area.current?.contains(e.target as Node)) setAberto(false);
    };
    const fecharEsc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    document.addEventListener("pointerdown", fecharFora);
    document.addEventListener("keydown", fecharEsc);
    return () => {
      document.removeEventListener("pointerdown", fecharFora);
      document.removeEventListener("keydown", fecharEsc);
    };
  }, [aberto]);

  const avisar = (texto: string, ok = true) => {
    setAberto(false);
    setAviso({ texto, ok });
    window.setTimeout(() => setAviso(null), 2500);
  };

  const baixarImagem = async () => {
    if (!alvo.current) return;
    try {
      const { toPng } = await import("html-to-image");
      const url = await toPng(alvo.current, { backgroundColor: "#ffffff", pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = nomeArquivo;
      link.href = url;
      link.click();
      avisar("Imagem baixada");
    } catch {
      avisar("Não deu para gerar a imagem. Tente imprimir em PDF.", false);
    }
  };

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(linkCompartilhar());
      avisar("Link copiado");
    } catch {
      avisar("O navegador bloqueou a cópia do link.", false);
    }
  };

  const enviarWhatsApp = () => {
    setAberto(false);
    window.open(`https://wa.me/?text=${encodeURIComponent(textoWhatsApp())}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div ref={area} className="relative flex items-center gap-2 print:hidden">
      {aviso && (
        <span
          role="status"
          className={`hidden items-center gap-1 text-sm font-semibold sm:inline-flex ${aviso.ok ? "text-destaque" : "text-perigo"}`}
        >
          {aviso.ok ? <Check className="size-4" /> : <CircleAlert className="size-4" />}
          {aviso.texto}
        </span>
      )}
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-1.5 rounded-lg border border-borda bg-superficie px-3 py-2 text-sm font-semibold text-destaque hover:border-destaque focus-visible:outline-2 focus-visible:outline-destaque"
      >
        <Printer className="size-4" />
        Imprimir
      </button>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={aberto}
        onClick={() => setAberto(!aberto)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-destaque px-3 py-2 text-sm font-semibold text-destaque-texto hover:bg-destaque-forte focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destaque"
      >
        <Send className="size-4" />
        Enviar
        <ChevronDown className={`size-4 transition-transform ${aberto ? "rotate-180" : ""}`} />
      </button>
      {aberto && (
        <div
          role="menu"
          className="absolute top-full right-0 z-40 mt-2 w-64 overflow-hidden rounded-xl border border-borda bg-superficie py-1 shadow-lg"
        >
          <ItemMenu icone={<MessageCircle className="size-4" />} titulo="WhatsApp" descricao="Lista de folgas de cada pessoa" onClick={enviarWhatsApp} />
          <ItemMenu icone={<ImageDown className="size-4" />} titulo="Baixar imagem" descricao="Para postar no grupo" onClick={baixarImagem} />
          <ItemMenu icone={<Link2 className="size-4" />} titulo="Copiar link" descricao="Abre esta escala em outro aparelho" onClick={copiarLink} />
        </div>
      )}
      {aviso && (
        <span role="status" className={`absolute top-full right-0 mt-2 text-sm font-semibold sm:hidden ${aviso.ok ? "text-destaque" : "text-perigo"}`}>
          {aviso.texto}
        </span>
      )}
    </div>
  );
}

function ItemMenu({
  icone,
  titulo,
  descricao,
  onClick,
}: {
  icone: ReactNode;
  titulo: string;
  descricao: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-start gap-3 px-4 py-2.5 text-left hover:bg-fundo focus-visible:bg-fundo focus-visible:outline-none"
    >
      <span className="mt-0.5 text-destaque">{icone}</span>
      <span>
        <span className="block font-semibold">{titulo}</span>
        <span className="block text-sm text-apagado">{descricao}</span>
      </span>
    </button>
  );
}
