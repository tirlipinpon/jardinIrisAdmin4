import {Component, inject} from '@angular/core';
import {LoginWithFormComponent} from "../../components/login-with-form/login-with-form.component";
import {AuthApplication} from "../../services/auth.application";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginWithFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
