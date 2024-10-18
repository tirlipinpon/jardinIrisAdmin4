export function escapeHtmlForJson(html: string): string {
  return html
    .replace(/\\/g, '\\\\')  // Échappe les backslashes
    .replace(/"/g, '\\"')     // Échappe les guillemets doubles
    .replace(/\n/g, '\\n')    // Échappe les sauts de ligne
    .replace(/\r/g, '\\r')    // Échappe les retours chariot
    .replace(/\t/g, '\\t');   // Échappe les tabulations
}
