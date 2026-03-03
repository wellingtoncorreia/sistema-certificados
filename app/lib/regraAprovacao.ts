export function aprovado(nota: number, frequencia: number) {
  // regra SENAI
  if (frequencia === 100) return true;
  if (nota >= 7 && frequencia >= 75) return true;
  return false;
}