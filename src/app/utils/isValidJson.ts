export function isValidJson(input: any): boolean {
  // Si l'entrée est déjà un objet JSON, elle est valide
  if (typeof input === 'object' && input !== null) {
    return true;
  }
  if (typeof input === 'string') {
    try {
      JSON.parse(input);
      return true;
    } catch (error) {
      return false;
    }
  }
  // Si ce n'est ni un objet ni une chaîne, ce n'est pas un JSON valide
  return false;
}
