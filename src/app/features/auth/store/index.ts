// etat a creer
import {AuthUser} from "../models/auth-user";
import {patchState, signalStore, withMethods, withState} from "@ngrx/signals";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {pipe, tap} from "rxjs";

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
  withMethods((store) =>({
  logIn: rxMethod<AuthType>(
    pipe(
      tap(()=> patchState(store, {isLoading: true}))
    )
  )
  }))
)
