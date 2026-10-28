import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const editor = SITE.adsenseCliente.replace(/^ca-/, "");
  const conteudo = editor ? `google.com, ${editor}, DIRECT, f08c47fec0942fa0\n` : "";
  return new Response(conteudo, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
