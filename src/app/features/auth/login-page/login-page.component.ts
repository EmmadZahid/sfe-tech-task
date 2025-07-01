import { Component, inject, signal, WritableSignal } from "@angular/core";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { MatCard } from "@angular/material/card";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../../core/services/auth.service";
import { Router } from "@angular/router";
import { MatButton } from "@angular/material/button";
import { nospaceValidator } from "../../../shared/validators/no-space-validator";
import { MatFormFieldModule } from "@angular/material/form-field";
import { forbiddenWordValidator } from "../../../shared/validators/forbidden-word-validator";
import { whitespaceValidator } from "../../../shared/validators/white-space-validator";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { AuthResponse } from "../../../shared/models/auth";

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
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  error: WritableSignal<string> = signal("");
  authenticating: WritableSignal<boolean> = signal(false);

  form = this.fb.group({
    username: ["", [Validators.required, whitespaceValidator, nospaceValidator, forbiddenWordValidator(["test"])]],
    password: ["", [Validators.required]],
  });

  submit(): void {
    this.authenticating.set(true);
    this.authService.login(this.form.value.username ?? "", this.form.value.password ?? "").subscribe({
      next: (res: AuthResponse) => {
        this.authenticating.set(false);
        this.router.navigate(["users"]);
      },
      error: (errRes: HttpErrorResponse) => {
        this.error.set(errRes.error?.message || "Some error occurred");
        this.authenticating.set(false);
      },
    });
  }
}
