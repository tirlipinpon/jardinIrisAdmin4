export function getFormattedDate() {
  // Obtenez l'heure actuelle
  const now = new Date();

  // Formatez la date
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');

  // Récupérer les millisecondes et les convertir en microsecondes
  const milliseconds = String(now.getUTCMilliseconds()).padStart(3, '0');
  const microseconds = milliseconds + '000'; // Ajouter 000 pour convertir millisecondes en microsecondes

  // Construire la chaîne finale au format souhaité
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds}+00`;

  return formattedDate;
}
