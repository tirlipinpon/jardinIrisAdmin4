import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChronometreService {
  private startTime: number | null = null;
  private elapsedTime: number = 0;
  private elapsedTimeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('00h-00m-00s');

  // Méthode pour démarrer le chronomètre
  start(): void {
    if (this.startTime === null) {
      this.startTime = Date.now();
    }
  }

  // Méthode pour arrêter le chronomètre et envoyer le temps écoulé
  stop(): void {
    if (this.startTime !== null) {
      this.elapsedTime = Date.now() - this.startTime;
      this.startTime = null;
    }

    this.elapsedTimeSubject.next(this.formatTime(this.elapsedTime));
  }

  // Obtenir le temps écoulé formaté
  getElapsedTime(): Observable<string> {
    return this.elapsedTimeSubject.asObservable();
  }

  // Formater le temps en hh-mm-ss
  private formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${this.padZero(hours)}h-${this.padZero(minutes)}m-${this.padZero(seconds)}s`;
  }

  // Ajouter des zéros devant les nombres inférieurs à 10
  private padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
