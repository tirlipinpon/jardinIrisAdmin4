import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {AuthApplication} from "../services/auth.application";

export const userIsAuth: CanActivateFn = (
    route,
    state,
    application = inject(AuthApplication),
    router = inject(Router)
) => {
  if(!application.isAuth) {
    router.navigate((['auth/login']))
  }
  return application.isAuth()
}
