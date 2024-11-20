import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {AuthApplication} from "../../services/auth.application";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-login-with-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './login-with-form.component.html',
  styleUrl: './login-with-form.component.css'
})
export class LoginWithFormComponent {
  private readonly application = inject(AuthApplication)
  loginForm = inject(FormBuilder).group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  save() {
    if(this.loginForm.value.email && this.loginForm.value.password)
    this.application.login(this.loginForm.value.email, this.loginForm.value.password)
  }

}
