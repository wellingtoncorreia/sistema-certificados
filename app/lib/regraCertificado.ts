export type ResultadoCertificado = {
  aprovado: boolean;
  texto: string | null;
};

/**
 * Regras SENAI
 */
export function avaliarCertificado(
  media: number,
  frequencia: number
): ResultadoCertificado {

  const excelente = media >= 95;
  const frequenciaTotal = frequencia === 100;

  // não gera certificado
  if (!excelente && !frequenciaTotal) {
    return {
      aprovado: false,
      texto: null,
    };
  }

  // ambos critérios
  if (excelente && frequenciaTotal) {
    return {
      aprovado: true,
      texto:
        "EXCELENTE APROVEITAMENTO ESCOLAR + 100% de FREQUÊNCIA ESCOLAR",
    };
  }

  // somente média
  if (excelente) {
    return {
      aprovado: true,
      texto: "EXCELENTE APROVEITAMENTO ESCOLAR",
    };
  }

  // somente frequência
  return {
    aprovado: true,
    texto: "100% de FREQUÊNCIA ESCOLAR",
  };
}