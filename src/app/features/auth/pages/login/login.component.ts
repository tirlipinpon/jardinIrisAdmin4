import {Component, inject} from '@angular/core';
import {LoginWithFormComponent} from "../../components/login-with-form/login-with-form.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {AuthApplication} from "../../services/auth.application";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginWithFormComponent, MatProgressSpinner],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoading = inject(AuthApplication).isLoading

}
