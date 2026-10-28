"use client";

import { Check, CircleAlert, ImageDown, Link2, MessageCircle, Printer } from "lucide-react";
import { useState, type ReactNode, type RefObject } from "react";

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
  const [aviso, setAviso] = useState<{ texto: string; ok: boolean } | null>(null);
  const avisar = (texto: string, ok = true) => {
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
    } catch {
      avisar("Não foi possível gerar a imagem.", false);
    }
  };

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(linkCompartilhar());
      avisar("Link copiado!");
    } catch {
      avisar("Não foi possível copiar o link.", false);
    }
  };

  const enviarWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(textoWhatsApp())}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <Botao principal onClick={() => window.print()} icone={<Printer className="size-4" />}>
        Imprimir ou PDF
      </Botao>
      <Botao onClick={baixarImagem} icone={<ImageDown className="size-4" />}>
        Baixar imagem
      </Botao>
      <Botao onClick={enviarWhatsApp} icone={<MessageCircle className="size-4" />}>
        Enviar no WhatsApp
      </Botao>
      <Botao onClick={copiarLink} icone={<Link2 className="size-4" />}>
        Copiar link
      </Botao>
      <span
        role="status"
        className={`inline-flex items-center gap-1 text-sm font-medium ${aviso?.ok === false ? "text-rose-600" : "text-teal-700"}`}
      >
        {aviso && (
          <>
            {aviso.ok ? <Check className="size-4" /> : <CircleAlert className="size-4" />}
            {aviso.texto}
          </>
        )}
      </span>
    </div>
  );
}

function Botao({
  children,
  icone,
  onClick,
  principal,
}: {
  children: ReactNode;
  icone: ReactNode;
  onClick: () => void;
  principal?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
        principal
          ? "bg-slate-900 text-white hover:bg-slate-800"
          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {icone}
      {children}
    </button>
  );
}
