import { Component, DestroyRef, effect, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { MatCard } from "@angular/material/card";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatButton } from "@angular/material/button";
import { nospaceValidator } from "../../../shared/validators/no-space-validator";
import { MatFormFieldModule } from "@angular/material/form-field";
import { whitespaceValidator } from "../../../shared/validators/white-space-validator";

import { AuthFacadeService } from "../../../core/facades/auth-facade.service";

@Component({
  selector: "app-login-page",
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatFormField,
    MatCard,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButton,
  ],
  templateUrl: "./login-page.component.html",
  styleUrl: "./login-page.component.scss",
})
export class LoginPageComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private authFacade: AuthFacadeService = inject(AuthFacadeService);
  private router: Router = inject(Router);
  loading = this.authFacade.loading;
  error = this.authFacade.error;

  form = this.fb.group({
    username: ["", [Validators.required, whitespaceValidator, nospaceValidator]],
    password: ["", [Validators.required]],
  });

  constructor() {
    effect(() => {
      if (this.authFacade.token()) this.router.navigate(["users"]);
    });
  }

  submit(): void {
    this.authFacade.login(this.form.value.username ?? "", this.form.value.password ?? "");
  }
}
