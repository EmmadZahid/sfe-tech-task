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
  loggedInUser = this.store.loggedInUser.asReadonly();
  loading = this.store.loading.asReadonly();
  saving = this.store.saving.asReadonly();
  saved = this.store.saved.asReadonly();
  error = this.store.error.asReadonly();
  savingError = this.store.savingError.asReadonly();
  isLoggedInUserAdmin = computed(() => {
    return this.loggedInUser()?.role === "admin";
  });

  loadUsers(): void {
    this.store.setLoading(true);
    this.store.setError("");
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

  getUserById(id: number): void {
    this.api.getUserById(id).subscribe({
      next: user => {
        this.store.setUser(user);
        this.store.setError("");
        this.store.setLoading(false);
      },
      error: err => {
        this.store.setError("Failed to load user");
        this.store.setLoading(false);
      },
    });
  }

  saveUser(user: Partial<User>): void {
    const action = user.id ? this.api.editUser(user) : this.api.addUser(user);
    this.store.setSaving(true);
    this.store.setSavingError("");
    action.subscribe({
      next: saved => {
        this.store.upsertUser(saved);
        this.store.setSavingError("");
        this.store.setSaved(true);
        this.store.setSaving(false);
      },
      error: err => {
        this.store.setSavingError("Failed to save user");
        this.store.setSaving(false);
      },
    });
  }

  resetSaved(): void {
    this.store.setSaved(false);
    this.store.setUser(null);
    this.store.setSavingError("");
    this.store.setSaving(false);
  }
}
