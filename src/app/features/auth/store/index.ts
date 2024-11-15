// etat a creer
import {AuthUser} from "../models/auth-user";
import {patchState, signalStore, withMethods, withState} from "@ngrx/signals";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {concatMap, pipe, tap} from "rxjs";
import {inject} from "@angular/core";
import {AuthInfraStructure} from "../services/auth.infraStructure";
import {tapResponse} from "@ngrx/operators";

export interface AuthState {
  user: AuthUser | undefined | null;
  isLoading: boolean
}
export type AuthType = {
  login: string,
  password: string
}
// valeur init
const initialValue: AuthState = {
  user: undefined,
  isLoading: false
}
// reducer / store
export const AuthStore = signalStore(
  {providedIn: 'root'},
  withState(initialValue),
  withMethods((store, infra = inject(AuthInfraStructure)) =>({
  logIn: rxMethod<AuthType>(
    pipe(
      tap(()=> patchState(store, {isLoading: true})),
      concatMap(input => {
        return infra.login(input.login, input.password).pipe(
          tapResponse({
            next: user=> patchState(store, { isLoading: false, user }),
            error: ()=> patchState(store, {isLoading: false})
          })
        )
      })
    )
  )
  }))
)
