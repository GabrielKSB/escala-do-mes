import type { Metadata } from "next";
import { BotaoMudarConsentimento } from "@/components/Consentimento";
import { Moldura } from "@/components/Moldura";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Como o Escala do Mês trata seus dados, os cookies de anúncios do Google e como mudar sua escolha.",
  alternates: { canonical: "/privacidade/" },
};

const LINK = "text-destaque underline underline-offset-2";

export default function Privacidade() {
  return (
    <Moldura pagina="como-funciona">
      <main className="mx-auto max-w-2xl px-4 py-12 leading-relaxed sm:px-6">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Política de privacidade</h1>
        <p className="mt-3 text-apagado">Atualizada em 28 de outubro de 2026.</p>

        <div className="mt-10 space-y-10">
          <section>
            <h2 className="text-xl font-semibold">Sua escala fica no seu aparelho</h2>
            <p className="mt-3">
              Os nomes da equipe, os dias de funcionamento e as folgas que você digita ficam salvos só no armazenamento
              do seu navegador. Não existe cadastro e esses dados não são enviados para nenhum servidor do Escala do Mês.
              Se você limpar os dados do navegador, a escala some.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Quando você compartilha</h2>
            <p className="mt-3">
              No link compartilhado, a escala vai dentro do próprio endereço, depois do símbolo #. Essa parte não é enviada
              ao servidor, mas quem receber o link vê os nomes e as folgas. Ao usar Enviar no WhatsApp, o texto da escala
              vai para o WhatsApp, que segue a política de privacidade da Meta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Anúncios e cookies</h2>
            <p className="mt-3">
              O site é gratuito porque mostra anúncios do Google AdSense. O Google e seus parceiros usam cookies para
              exibir e medir anúncios. Na primeira visita você escolhe entre anúncios personalizados, que podem usar seus
              interesses, e anúncios básicos, que não usam seu histórico para personalização.
            </p>
            <p className="mt-3">
              Veja{" "}
              <a href="https://policies.google.com/technologies/partner-sites" className={LINK} target="_blank" rel="noopener noreferrer">
                como o Google usa dados de sites parceiros
              </a>{" "}
              e ajuste a personalização em{" "}
              <a href="https://myadcenter.google.com/" className={LINK} target="_blank" rel="noopener noreferrer">
                Minha Central de Anúncios
              </a>
              .
            </p>
            <div className="mt-5">
              <BotaoMudarConsentimento />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Dados técnicos de acesso</h2>
            <p className="mt-3">
              Como em qualquer site, o serviço de hospedagem pode registrar dados técnicos das visitas, como endereço IP,
              navegador e páginas acessadas, para manter o site funcionando e seguro.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Seus direitos</h2>
            <p className="mt-3">
              A Lei Geral de Proteção de Dados (Lei 13.709/2018) garante, entre outros, o direito de saber quais dados
              são tratados e de pedir correção ou exclusão. Como a escala fica só no seu navegador, você mesmo pode apagá-la
              a qualquer momento em Começar uma escala nova ou limpando os dados do site no navegador.
            </p>
            {SITE.emailContato && (
              <p className="mt-3">
                Dúvidas sobre privacidade:{" "}
                <a href={`mailto:${SITE.emailContato}`} className={LINK}>
                  {SITE.emailContato}
                </a>
                .
              </p>
            )}
          </section>
        </div>
      </main>
    </Moldura>
  );
}
