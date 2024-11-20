// etat a creer
import {AuthUser} from "../models/auth-user";
import {patchState, signalStore, withComputed, withMethods, withState} from "@ngrx/signals";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {concatMap, pipe, tap} from "rxjs";
import {computed, inject} from "@angular/core";
import {AuthInfraStructure} from "../services/auth.infraStructure";
import {tapResponse} from "@ngrx/operators";
import {updateState, withDevtools} from '@angular-architects/ngrx-toolkit';

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
  withDevtools('auth'),
  withState(initialValue),
  withComputed(store => ({
    isAuth: computed(() => store.user() !== undefined)
})),
  withMethods((store, infra = inject(AuthInfraStructure)) =>({
  logIn: rxMethod<AuthType>(
    pipe(
      tap(()=> updateState(store, 'update loading', {isLoading: true})),
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

