import type { Configuracao, RegraDomingo } from "./escala/tipos";

export interface Setor {
  slug: string;
  nome: string;
  titulo: string;
  descricao: string;
  introducao: string;
  diasAbertos: boolean[];
  minimoPorDia: number[];
  regraDomingo: RegraDomingo;
}

const TODOS = [true, true, true, true, true, true, true];

export const SETORES: Setor[] = [
  {
    slug: "supermercado",
    nome: "Supermercado",
    titulo: "Escala 5x2 para supermercado",
    descricao: "Monte a escala 5x2 do supermercado com 2 folgas por semana, rodízio de domingos e cobertura nos dias de pico.",
    introducao:
      "Supermercado abre todos os dias e tem pico no fim de semana. O gerador distribui as folgas para manter mais gente na sexta e no sábado e faz o rodízio de domingos exigido no comércio.",
    diasAbertos: TODOS,
    minimoPorDia: [3, 3, 3, 3, 3, 4, 5],
    regraDomingo: "comercio",
  },
  {
    slug: "restaurante",
    nome: "Restaurante",
    titulo: "Escala 5x2 para restaurante",
    descricao: "Escala 5x2 para restaurante e bar: folgas nos dias de menor movimento e equipe completa no fim de semana.",
    introducao:
      "Restaurante costuma ter segunda e terça mais calmas e fim de semana cheio. Ajuste o mínimo de cada dia e o gerador concentra as folgas nos dias de menor movimento.",
    diasAbertos: TODOS,
    minimoPorDia: [4, 2, 2, 3, 3, 4, 5],
    regraDomingo: "comercio",
  },
  {
    slug: "farmacia",
    nome: "Farmácia",
    titulo: "Escala 5x2 para farmácia",
    descricao: "Gere a escala 5x2 da farmácia com cobertura todos os dias e folgas distribuídas de forma justa.",
    introducao:
      "Farmácia precisa de cobertura estável a semana inteira. O gerador mantém o mínimo de atendentes em cada dia e reveza quem folga no domingo.",
    diasAbertos: TODOS,
    minimoPorDia: [2, 3, 3, 3, 3, 3, 3],
    regraDomingo: "comercio",
  },
  {
    slug: "loja",
    nome: "Loja",
    titulo: "Escala 5x2 para loja e varejo",
    descricao: "Escala 5x2 para loja de rua ou de shopping, com rodízio de domingos e folgas em dupla.",
    introducao:
      "Lojas de shopping abrem todo dia e as de rua costumam fechar no domingo. Marque os dias em que a loja abre e o gerador faz o resto.",
    diasAbertos: TODOS,
    minimoPorDia: [2, 2, 2, 2, 2, 3, 3],
    regraDomingo: "comercio",
  },
  {
    slug: "padaria",
    nome: "Padaria",
    titulo: "Escala 5x2 para padaria",
    descricao: "Escala 5x2 para padaria que abre todos os dias, com cobertura no fim de semana e rodízio de domingos.",
    introducao:
      "Padaria abre todos os dias e o domingo de manhã costuma ser movimentado. Defina o mínimo de cada dia e gere a escala do mês.",
    diasAbertos: TODOS,
    minimoPorDia: [3, 2, 2, 2, 2, 3, 3],
    regraDomingo: "comercio",
  },
  {
    slug: "academia",
    nome: "Academia",
    titulo: "Escala 5x2 para academia",
    descricao: "Monte a escala 5x2 de recepção e professores da academia com folgas no fim de semana mais calmo.",
    introducao:
      "Academia tem movimento forte durante a semana e mais calmo no domingo. O gerador aproveita isso para dar folgas de domingo com mais frequência.",
    diasAbertos: TODOS,
    minimoPorDia: [1, 3, 3, 3, 3, 3, 2],
    regraDomingo: "quinzenal",
  },
  {
    slug: "escritorio",
    nome: "Escritório",
    titulo: "Escala 5x2 de segunda a sexta",
    descricao: "Escala 5x2 de segunda a sexta com folga no sábado e domingo: veja como fica a jornada de 40 horas.",
    introducao:
      "Quem funciona de segunda a sexta já está na 5x2: as duas folgas caem no sábado e no domingo. Use o gerador para conferir a jornada de 40 horas semanais.",
    diasAbertos: [false, true, true, true, true, true, false],
    minimoPorDia: [0, 2, 2, 2, 2, 2, 0],
    regraDomingo: "nenhuma",
  },
];

export const PADRAO: Pick<Configuracao, "diasAbertos" | "minimoPorDia" | "regraDomingo" | "horasPorDia"> = {
  diasAbertos: TODOS,
  minimoPorDia: [2, 2, 2, 2, 2, 3, 3],
  regraDomingo: "comercio",
  horasPorDia: 8,
};

export function setorPorSlug(slug: string) {
  return SETORES.find((s) => s.slug === slug);
}
