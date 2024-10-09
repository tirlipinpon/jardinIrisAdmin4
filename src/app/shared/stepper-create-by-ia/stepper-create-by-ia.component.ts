import {Component, Input,  OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatStepper, MatStepperModule} from "@angular/material/stepper";
import {MatButtonModule} from "@angular/material/button";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-stepper-create-by-ia',
  standalone: true,
  imports: [MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule, JsonPipe],
  templateUrl: './stepper-create-by-ia.component.html',
  styleUrl: './stepper-create-by-ia.component.css'
})
export class StepperCreateByIaComponent implements OnChanges {
  // @ts-ignore
  @ViewChild('stepper') private myStepper: MatStepper;
  @Input() goStep = 0
  @Input() messageToStepper: any


  ngOnChanges(changes: SimpleChanges) {
    const change = changes["goStep"];
    if (change) {
      // console.log('test lecture objet = ' + this.messageToStepper)
      if (change.currentValue > change.previousValue) {
        this.goForward()
      } else if (change.currentValue < change.previousValue) {
        this.goBack()
      }
    }
  }

  goBack(){
    this.myStepper.previous();
  }

  goForward(){
    this.myStepper.next();
  }

  lireValeurs(obj: any) {
    // Vérifie si l'argument est un objet
    if (typeof obj !== 'object' || obj === null) {
      // throw new Error('L\'argument doit être un objet.');
      return
    }
    // Retourne un tableau contenant toutes les valeurs de l'objet
    const test =  Object.values(obj);
    return Object.values(obj);
  }

}
