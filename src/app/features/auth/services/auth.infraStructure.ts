import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AuthUser} from "../models/auth-user";

@Injectable({providedIn: "root"})
export class AuthInfraStructure {
  login(email: string, password: string): Observable<AuthUser> {
    throw new Error('Not implemented exception')
  }
}
