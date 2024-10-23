export function inLineString(chaine: string) {
  // Remplace les retours à la ligne (\n) et les espaces multiples par un seul espace
  return chaine.replace(/\s+/g, ' ').trim();
}
