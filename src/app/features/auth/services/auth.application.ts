import {inject, Injectable} from "@angular/core";
import {AuthStore} from "../store";

@Injectable({providedIn: 'root'})
export class AuthApplication {
  private readonly store = inject(AuthStore);

  login(login: string, password: string) {
     this.store.logIn({ login, password })

  }
}
