import { computed, inject, Injectable } from "@angular/core";
import { UserStore } from "../stores/users.store";
import { UsersService } from "../services/users.service";
import { User } from "../../shared/models/user";
import { catchError, Observable, of, tap, throwError } from "rxjs";

@Injectable({ providedIn: "root" })
export class UsersFacadeService {
  private store = inject(UserStore);
  private api = inject(UsersService);

  users = this.store.users.asReadonly();
  user = this.store.user.asReadonly();
  loading = this.store.loading.asReadonly();
  updating = this.store.updating.asReadonly();
  error = this.store.error.asReadonly();
  updatingError = this.store.updatingError.asReadonly();

  isLoggedInUserAdmin = computed(() => {
    return this.user()?.role === "admin";
  });

  loadUsers(): void {
    this.store.setLoading(true);
    this.api.getUsers().subscribe({
      next: users => {
        this.store.setUsers(users);
        this.store.setError("");
        this.store.setLoading(false);
      },
      error: err => {
        this.store.setError("Failed to load users");
        this.store.setLoading(false);
      },
    });
  }

  saveUser(user: Partial<User>): Observable<User> {
    const action = user.id ? this.api.editUser(user) : this.api.addUser(user);
    this.store.setUpdating(true);
    this.store.setUpdatingError("");
    return action.pipe(
      tap(saved => {
        this.store.upsertUser(saved);
        this.store.setUpdatingError("");
        this.store.setUpdating(false);
      }),
      catchError(err => {
        this.store.setUpdatingError("Failed to save user");
        this.store.setUpdating(false);
        return throwError(() => err);
      })
    );
  }
}
