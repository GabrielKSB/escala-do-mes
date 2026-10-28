import { SIGLAS_DIAS, semanasDe } from "./calendario";
import { LEIS } from "./leis";
import { HORAS_DIA, HORAS_SEMANA, MAX_DIAS_SEGUIDOS, limiteDomingos } from "./regras";
import type { Alerta, Configuracao, Dia, Escala, Funcionario } from "./tipos";

export function dataCurta(dia: Dia): string {
  return `${String(dia.dia).padStart(2, "0")}/${String(dia.mes).padStart(2, "0")}`;
}

export function validar(
  config: Configuracao,
  funcionarios: Funcionario[],
  dias: Dia[],
  escala: Escala,
): Alerta[] {
  const alertas: Alerta[] = [];
  const folgasDe = (f: Funcionario) => escala[f.id] ?? dias.map(() => false);

  if (config.horasPorDia > HORAS_DIA) {
    alertas.push({
      id: "jornada-diaria",
      tipo: "jornada",
      gravidade: "erro",
      mensagem: `Turno de ${config.horasPorDia}h passa do limite de ${HORAS_DIA} horas por dia.`,
      dias: [],
      lei: LEIS.jornada,
    });
  }

  dias.forEach((dia, i) => {
    if (!config.diasAbertos[dia.semana]) return;
    const presentes = funcionarios.filter((f) => !folgasDe(f)[i]).length;
    const minimo = config.minimoPorDia[dia.semana];
    if (presentes < minimo) {
      alertas.push({
        id: `cobertura-${i}`,
        tipo: "cobertura",
        gravidade: "erro",
        mensagem: `${SIGLAS_DIAS[dia.semana]} ${dataCurta(dia)}: ${presentes} de ${minimo} pessoas no mínimo.`,
        dias: [i],
      });
    }
  });

  const semanas = semanasDe(dias.map((_, i) => i));

  for (const f of funcionarios) {
    const folgas = folgasDe(f);

    semanas.forEach((semana, s) => {
      const trabalhados = semana.filter((i) => !folgas[i]).length;
      const horas = trabalhados * config.horasPorDia;
      if (horas > HORAS_SEMANA) {
        alertas.push({
          id: `jornada-${f.id}-${s}`,
          tipo: "jornada",
          gravidade: "erro",
          funcionarioId: f.id,
          mensagem: `${f.nome} trabalha ${trabalhados} dias na semana de ${dataCurta(dias[semana[0]])} (${horas}h, limite de ${HORAS_SEMANA}h).`,
          dias: semana,
          lei: LEIS.jornada,
        });
      }
    });

    let inicio = -1;
    const fecharSequencia = (fim: number) => {
      const tamanho = fim - inicio + 1;
      if (inicio >= 0 && tamanho > MAX_DIAS_SEGUIDOS) {
        alertas.push({
          id: `seguidos-${f.id}-${inicio}`,
          tipo: "descanso",
          gravidade: "erro",
          funcionarioId: f.id,
          mensagem: `${f.nome} trabalha ${tamanho} dias seguidos (${dataCurta(dias[inicio])} a ${dataCurta(dias[fim])}) sem folga.`,
          dias: Array.from({ length: tamanho }, (_, k) => inicio + k),
          lei: LEIS.descansoSemanal,
        });
      }
      inicio = -1;
    };
    folgas.forEach((folga, i) => {
      if (folga) fecharSequencia(i - 1);
      else if (inicio < 0) inicio = i;
    });
    fecharSequencia(folgas.length - 1);

    const limite = limiteDomingos(config.regraDomingo, f);
    if (!config.diasAbertos[0] || !Number.isFinite(limite)) continue;
    let domingosSeguidos: number[] = [];
    for (const semana of semanas) {
      const domingo = semana[0];
      if (folgas[domingo]) {
        domingosSeguidos = [];
        continue;
      }
      domingosSeguidos.push(domingo);
      if (domingosSeguidos.length >= limite) {
        alertas.push({
          id: `domingo-${f.id}-${domingo}`,
          tipo: "domingo",
          gravidade: "aviso",
          funcionarioId: f.id,
          mensagem: `${f.nome} trabalha ${limite} domingos seguidos (até ${dataCurta(dias[domingo])}).`,
          dias: domingosSeguidos,
          lei: limite === 2 ? LEIS.domingoQuinzenal : LEIS.domingoComercio,
        });
        domingosSeguidos = [];
      }
    }
  }

  return alertas;
}
