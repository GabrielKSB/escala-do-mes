import { diaAbsoluto, semanasDe } from "./calendario";
import { MAX_DIAS_SEGUIDOS, MODELOS, limiteDomingos } from "./regras";
import type { Configuracao, Dia, DiaSemana, Escala, Funcionario } from "./tipos";
import { validar } from "./validacao";

export function diasTrabalhadosAntes(folgas: boolean[], indice: number): number {
  let total = 0;
  for (let i = indice - 1; i >= 0 && !folgas[i]; i--) total++;
  return total;
}

export function escalaVazia(config: Configuracao, funcionarios: Funcionario[], dias: Dia[]): Escala {
  return Object.fromEntries(
    funcionarios.map((f) => [f.id, dias.map((d) => !config.diasAbertos[d.semana])]),
  );
}

/** Cada pessoa recebe uma fase do ciclo, espalhada pela equipe e contada a partir de uma data fixa. */
function gerarCiclica(config: Configuracao, funcionarios: Funcionario[], dias: Dia[]): Escala {
  const { trabalho, folga } = MODELOS[config.tipo];
  const ciclo = trabalho + folga;
  return Object.fromEntries(
    funcionarios.map((f, k) => {
      const fase = Math.floor((k * ciclo) / funcionarios.length);
      return [f.id, dias.map((d) => !config.diasAbertos[d.semana] || (diaAbsoluto(d) + fase) % ciclo >= trabalho)];
    }),
  );
}

/**
 * Com 1 folga por semana e no máximo 6 dias seguidos, a folga só pode cair no mesmo dia ou antes
 * do da semana anterior, então cada pessoa fica com um dia fixo.
 */
function gerarFolgaFixa(config: Configuracao, funcionarios: Funcionario[], dias: Dia[]): Escala {
  const escala = escalaVazia(config, funcionarios, dias);
  const abertos = [0, 1, 2, 3, 4, 5, 6].filter((d) => config.diasAbertos[d]);
  if (abertos.length < 7) return escala;

  const folgando = new Map(abertos.map((d) => [d, 0]));
  for (const f of funcionarios) {
    const pontuar = (d: number) => {
      const sobra = funcionarios.length - folgando.get(d)! - 1 - config.minimoPorDia[d];
      return (sobra >= 0 ? sobra * 10 : -1000 + sobra * 100) + (f.folgasPreferidas.includes(d as DiaSemana) ? 30 : 0);
    };
    const dia = abertos.reduce((melhor, d) => (pontuar(d) > pontuar(melhor) ? d : melhor));
    folgando.set(dia, folgando.get(dia)! + 1);
    dias.forEach((d, i) => {
      if (d.semana === dia) escala[f.id][i] = true;
    });
  }
  return escala;
}

export function gerarEscala(config: Configuracao, funcionarios: Funcionario[], dias: Dia[]): Escala {
  const modelo = MODELOS[config.tipo];
  if (modelo.ciclico) return gerarCiclica(config, funcionarios, dias);
  if (modelo.folga === 1) return gerarFolgaFixa(config, funcionarios, dias);

  const escala = escalaVazia(config, funcionarios, dias);
  const semanasSemDomingo = new Map(funcionarios.map((f) => [f.id, 0]));
  const total = funcionarios.length;
  const limiteGeral = limiteDomingos(config.regraDomingo);

  semanasDe(dias.map((_, i) => i)).forEach((semana, s) => {
    const abertos = semana.filter((i) => config.diasAbertos[dias[i].semana]);
    const folgasNecessarias = Math.max(0, modelo.folga - (semana.length - abertos.length));
    const trabalhando = new Map(abertos.map((i) => [i, total]));
    const darFolga = (f: Funcionario, i: number) => {
      escala[f.id][i] = true;
      trabalhando.set(i, trabalhando.get(i)! - 1);
    };

    const espera = (f: Funcionario) => semanasSemDomingo.get(f.id)!;
    const urgente = (f: Funcionario) => espera(f) + 1 >= limiteDomingos(config.regraDomingo, f);
    const ordem = funcionarios
      .map((f, i) => ({ f, vez: (i - (s % total) + total) % total }))
      .sort((a, b) => Number(urgente(b.f)) - Number(urgente(a.f)) || espera(b.f) - espera(a.f) || a.vez - b.vez)
      .map(({ f }) => f);

    const folgasNaSemana = (f: Funcionario) => abertos.filter((i) => escala[f.id][i]).length;
    const prazoDe = (f: Funcionario) =>
      abertos.find((i) => !escala[f.id][i] && diasTrabalhadosAntes(escala[f.id], i) >= MAX_DIAS_SEGUIDOS);

    const escolher = (f: Funcionario, ate = Infinity) => {
      const folgas = escala[f.id];
      const candidatos = abertos.filter((i) => !folgas[i] && i <= ate);
      if (candidatos.length === 0) return false;
      const prazo = prazoDe(f);
      const pontuar = (i: number) => {
        const dia = dias[i];
        const sobra = trabalhando.get(i)! - 1 - config.minimoPorDia[dia.semana];
        let pontos = sobra >= 0 ? sobra * 10 : -1000 + sobra * 100;
        if (prazo !== undefined && i <= prazo) pontos += 3000;
        if (f.folgasPreferidas.includes(dia.semana)) pontos += 30;
        if (folgas[i - 1] || folgas[i + 1]) pontos += 25;
        return pontos;
      };
      darFolga(f, candidatos.reduce((melhor, i) => (pontuar(i) > pontuar(melhor) ? i : melhor)));
      return true;
    };

    const domingo = semana[0];
    const vagasDomingo = total - config.minimoPorDia[0];
    const preencherDomingo = (candidatos: Funcionario[], meta: number, folgasMaximas: number) => {
      for (const f of candidatos) {
        if (total - trabalhando.get(domingo)! >= Math.min(meta, vagasDomingo)) break;
        if (!escala[f.id][domingo] && folgasNaSemana(f) < folgasMaximas) darFolga(f, domingo);
      }
    };

    if (trabalhando.has(domingo)) {
      preencherDomingo(ordem.filter(urgente), Infinity, Math.max(folgasNecessarias, 1));
    }

    ordem
      .map((f) => ({ f, prazo: folgasNaSemana(f) < folgasNecessarias ? prazoDe(f) : undefined }))
      .filter((p): p is { f: Funcionario; prazo: number } => p.prazo !== undefined)
      .sort((a, b) => a.prazo - b.prazo)
      .forEach(({ f, prazo }) => escolher(f, prazo));

    if (trabalhando.has(domingo) && Number.isFinite(limiteGeral)) {
      preencherDomingo(ordem, Math.ceil(total / limiteGeral), Math.max(folgasNecessarias, 1));
    }

    for (const f of ordem) {
      while (folgasNaSemana(f) < folgasNecessarias && escolher(f));
    }

    for (const f of funcionarios) {
      semanasSemDomingo.set(f.id, escala[f.id][domingo] ? 0 : espera(f) + 1);
    }
  });

  return ajustar(config, funcionarios, dias, escala);
}

const MAX_RODADAS_AJUSTE = 20;

function penalidade(config: Configuracao, funcionarios: Funcionario[], dias: Dia[], escala: Escala) {
  return validar(config, funcionarios, dias, escala).reduce((soma, a) => soma + (a.gravidade === "erro" ? 10 : 4), 0);
}

/** Troca folga por dia trabalhado na mesma semana enquanto isso reduzir os alertas. */
function ajustar(config: Configuracao, funcionarios: Funcionario[], dias: Dia[], escala: Escala): Escala {
  let atual = penalidade(config, funcionarios, dias, escala);
  const semanas = semanasDe(dias.map((_, i) => i)).map((s) => s.filter((i) => config.diasAbertos[dias[i].semana]));

  for (let rodada = 0; rodada < MAX_RODADAS_AJUSTE && atual > 0; rodada++) {
    let melhorou = false;
    for (const f of funcionarios) {
      const folgas = escala[f.id];
      for (const abertos of semanas) {
        for (const de of abertos.filter((i) => folgas[i])) {
          for (const para of abertos.filter((i) => !folgas[i])) {
            folgas[de] = false;
            folgas[para] = true;
            const nova = penalidade(config, funcionarios, dias, escala);
            if (nova < atual) {
              atual = nova;
              melhorou = true;
              break;
            }
            folgas[de] = true;
            folgas[para] = false;
          }
          if (atual === 0) return escala;
        }
      }
    }
    if (!melhorou) break;
  }
  return escala;
}
