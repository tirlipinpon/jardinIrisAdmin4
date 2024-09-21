import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UpdatePostByIdSubService {

  // Subject pour émettre des événements
  private notifyParentSource = new Subject<number>();
  private notifyChildSource = new Subject<number>();
  // Observable pour que les composants puissent s'abonner
  notifyParent$ = this.notifyParentSource.asObservable();
  notifyChild$ = this.notifyChildSource.asObservable();

  // Méthode pour déclencher l'événement
  notifyParent(idPost: number) {
    this.notifyParentSource.next(idPost);
  }
  notifyChild(idPost: number) {
    this.notifyChildSource.next(idPost);
  }
}
