export function aprovado(media?: number, presenca?: number) {
  return (media >= 95) || (presenca === 100)
}