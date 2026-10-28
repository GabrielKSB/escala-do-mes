import Link from "next/link";
import { AdSlot } from "./AdSlot";
import { Gerador, type Predefinicao } from "./gerador/Gerador";
import { Moldura } from "./Moldura";

export function PaginaGerador({
  titulo,
  introducao,
  predefinicao,
  chave,
}: {
  titulo: string;
  introducao: string;
  predefinicao: Predefinicao;
  chave: string;
}) {
  return (
    <Moldura pagina="gerador">
      <main className="mx-auto max-w-[1440px] px-4 pb-4 sm:px-6 print:max-w-none print:px-0">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4 print:hidden">
          <h1 className="text-2xl font-bold text-tinta">{titulo}</h1>
          <p className="text-apagado">
            {introducao}{" "}
            <Link href="/como-funciona/" className="text-tinta underline underline-offset-2">
              Como funciona
            </Link>
          </p>
        </div>
        <Gerador predefinicao={predefinicao} chave={chave} />
        <AdSlot className="mt-8" />
      </main>
    </Moldura>
  );
}
