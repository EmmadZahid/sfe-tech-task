import { Component, DestroyRef, OnInit, computed, effect, inject, signal } from "@angular/core";
import { UserFormComponent } from "../user-form/user-form.component";
import { User } from "../../../shared/models/user";
import { ActivatedRoute, Router } from "@angular/router";
import { UsersFacadeService } from "../../../core/facades/users-facade.service";
import { MatButtonModule } from "@angular/material/button";
import { AppSpinnerComponent } from "../../../shared/components/app-spinner.component";

@Component({
  selector: "app-user-form-page",
  imports: [UserFormComponent, MatButtonModule, AppSpinnerComponent],
  templateUrl: "./user-form-page.component.html",
  styleUrl: "./user-form-page.component.scss",
})
export class UserFormPageComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  usersfacade = inject(UsersFacadeService);
  user = this.usersfacade.user;
  loading = this.usersfacade.loading;
  error = this.usersfacade.error;
  savingError = this.usersfacade.savingError;
  saving = this.usersfacade.saving;
  mode = signal(this.route.snapshot.data["mode"]);
  constructor() {
    effect(() => {
      if (this.usersfacade.saved() && !this.usersfacade.error()) {
        this.goBack();
      }
    });
  }

  handleSave(user: Partial<User>) {
    this.usersfacade.saveUser(user);
  }

  goBack(): void {
    this.router.navigate(["/users"]);
  }
}
