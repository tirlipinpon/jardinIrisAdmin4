import {Injectable} from "@angular/core";
import {delay, Observable, of} from "rxjs";
import {AuthUser} from "../models/auth-user";

const fakeService: AuthInfraStructure = {
  login(email, password) {
    const user: AuthUser = {
      surname: 'tony'
    }
    return of(user).pipe(delay(1500))
  }
}

@Injectable({
  providedIn: "root",
  useValue: fakeService
})
export class AuthInfraStructure {
  login(email: string, password: string): Observable<AuthUser> {
    throw new Error('Not implemented exception')
  }
}
