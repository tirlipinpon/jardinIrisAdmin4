export class Chronometre {
  private startTime: number | null = null;
  private elapsedTime: number = 0;

  // Méthode pour démarrer le chronomètre
  start(): void {
    if (this.startTime === null) {
      this.startTime = Date.now();
    }
  }

  // Méthode pour arrêter le chronomètre et obtenir le temps écoulé
  stop(): string {
    if (this.startTime !== null) {
      this.elapsedTime = Date.now() - this.startTime;
      this.startTime = null;
    }

    return this.formatTime(this.elapsedTime);
  }

  // Méthode pour formater le temps écoulé en hh:mm:ss
  private formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${this.padZero(hours)}h-${this.padZero(minutes)}m-${this.padZero(seconds)}s`;
  }

  // Ajoute un zéro devant les chiffres inférieurs à 10
  private padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
