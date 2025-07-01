import { Component, OnInit, effect, inject, signal } from "@angular/core";
import { UserFormComponent } from "../user-form/user-form.component";
import { User } from "../../../shared/models/user";
import { ActivatedRoute, Router } from "@angular/router";
import { UsersFacadeService } from "../../../core/facades/users-facade.service";

@Component({
  selector: "app-user-form-page",
  imports: [UserFormComponent],
  templateUrl: "./user-form-page.component.html",
  styleUrl: "./user-form-page.component.scss",
})
export class UserFormPageComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private facade = inject(UsersFacadeService);
  user = signal<User | null>(null);
  loading = this.facade.loading;
  constructor() {
    effect(() => {
      if (this.facade.users().length) {
        const id = this.activatedRoute.snapshot.paramMap.get("id");
        if (id) {
          if (!Number.isNaN(+id)) {
            const foundUser = this.facade.users().find(user => user.id === +id);
            if (!foundUser) {
              this.router.navigate(["/users"]);
              return;
            }
            this.user.set(foundUser);
          }
        }
      } else {
        this.facade.loadUsers();
      }
    });
  }
  ngOnInit(): void {
    //TODO: Move this to route level
  }

  handleSave(user: Partial<User>) {
    this.facade.saveUser(user);
    this.goBack();
  }

  goBack(): void {
    this.router.navigate(["/users"]);
  }
}
