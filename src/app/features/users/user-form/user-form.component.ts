import { Component, effect, inject, input, output, OutputEmitterRef } from "@angular/core";
import { User } from "../../../shared/models/user";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { whitespaceValidator } from "../../../shared/validators/white-space-validator";
import { nospaceValidator } from "../../../shared/validators/no-space-validator";
import { forbiddenWordValidator } from "../../../shared/validators/forbidden-word-validator";

@Component({
  selector: "app-user-form",
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: "./user-form.component.html",
  styleUrl: "./user-form.component.scss",
})
export class UserFormComponent {
  user = input<User | null>();
  disableSave = input<boolean>(false);

  save: OutputEmitterRef<Partial<User>> = output();
  cancel: OutputEmitterRef<void> = output();

  private fb = inject(FormBuilder);
  form = this.fb.group({
    username: ["", [Validators.required, whitespaceValidator, nospaceValidator, forbiddenWordValidator(["test"])]],
    role: ["", [Validators.required]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  });
  constructor() {
    effect(() => {
      const user = this.user();
      if (user) {
        this.form.patchValue({
          username: user.username,
          role: user.role,
        });
      }
    });
  }

  submit(): void {
    if (this.form.valid) {
      const userData = { ...this.user(), ...this.form.value };
      this.save.emit(userData as Partial<User>);
    }
  }
}
