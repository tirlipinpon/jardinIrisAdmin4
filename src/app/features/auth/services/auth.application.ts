import {effect, inject, Injectable, Signal} from "@angular/core";
import {AuthStore} from "../store";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class AuthApplication {
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router)

  private redirectToLoginEffect = effect(() => {
    if(this.store.isAuth()) {
      this.router.navigate(['home'])
    }
  })
  login(login: string, password: string) {
    this.store.logIn({ login, password });
  }
  get isLoading(): Signal<boolean> {
    return this.store.isLoading
  }

  get isAuth(): Signal<any> {
    return this.store.isAuth;
}
}
