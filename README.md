# Escala do Mês

Gerador gratuito de escala de trabalho (5x2, 6x1, 4x2 e 12x36), com rodízio de domingos e alertas quando a escala passa dos limites da lei, com o artigo citado.

No ar em [escaladomes.com.br](https://escaladomes.com.br).

Roda inteiro no navegador. Não há servidor nem banco de dados: a escala fica no `localStorage` e pode ser compartilhada por link.

## O que confere

| Regra | Fonte |
| --- | --- |
| Até 8 horas por dia e 40 por semana | Constituição, art. 7º, XIII (redação da EC 141/2026) |
| No máximo 6 dias seguidos sem folga | CLT, art. 67; Constituição, art. 7º, § 2º |
| Folga no domingo a cada 3 semanas no comércio | Lei 10.101/2000, art. 6º, parágrafo único |
| Revezamento quinzenal de domingos | CLT, art. 386 |
| Na 12x36, nunca dois plantões seguidos | CLT, art. 59-A |
| Mínimo de pessoas por dia | configurado pelo usuário |

A ferramenta é informativa e não substitui a convenção coletiva de cada categoria.

## Desenvolvimento

Requer Node 22.

```bash
npm install
npm run dev
npm test
npm run build
```

`npm run build` gera o site estático em `out/`.

## Variáveis de ambiente

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site, usada no sitemap, robots e URLs canônicas |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | ID do cliente AdSense (`ca-pub-...`); sem ele, nenhum anúncio é carregado |
| `NEXT_PUBLIC_ADSENSE_SLOT` | ID do bloco de anúncio |
| `NEXT_PUBLIC_EMAIL_CONTATO` | E-mail de contato mostrado na política de privacidade |

Com `NEXT_PUBLIC_ADSENSE_CLIENT` definido, o build gera `/ads.txt` com a linha do Google e o site mostra o aviso de cookies. O script do AdSense só carrega depois da escolha do visitante; quem escolhe anúncios básicos recebe anúncios não personalizados.

## Estrutura

- `src/lib/escala`: motor da escala (geração, validação, calculadora de equipe e link compartilhado), sem dependência de React
- `src/components/gerador`: interface do gerador
- `src/app/escala-5x2/[setor]`: páginas por setor geradas a partir de `src/lib/setores.ts`
