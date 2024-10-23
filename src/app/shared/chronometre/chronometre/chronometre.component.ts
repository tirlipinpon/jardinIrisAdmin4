import {Component, OnInit} from '@angular/core';
import {ChronometreService} from "../../../services/chronometre/chronometre.service";

@Component({
  selector: 'app-chronometre',
  standalone: true,
  imports: [],
  templateUrl: './chronometre.component.html',
  styleUrl: './chronometre.component.css'
})
export class ChronometreComponent implements OnInit {
  elapsedTime: string = '00h-00m-00s';

  constructor(private chronometreService: ChronometreService) {}

  ngOnInit(): void {
    // S'abonner aux changements de temps écoulé
    this.chronometreService.getElapsedTime().subscribe(time => {
      this.elapsedTime = time;
    });
  }

  // Méthode pour démarrer le chronomètre
  startChronometre(): void {
    this.chronometreService.start();
  }

  // Méthode pour arrêter le chronomètre
  stopChronometre(): void {
    this.chronometreService.stop();
  }
}
