import { inject, Injectable } from "@angular/core";
import { UserStore } from "../stores/users.store";
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: "root" })
export class AuthFacadeService {
  private store = inject(UserStore);
  private authService = inject(AuthService);
  token = this.authService.token.asReadonly();
  loggedInUser = this.store.user.asReadonly();
  loading = this.store.loading.asReadonly();
  error = this.store.error.asReadonly();

  login(username: string, password: string): void {
    this.store.setLoading(true);
    this.store.setError("");
    this.authService.login(username, password).subscribe({
      next: response => {
        this.store.setLoggedInUser(response.user);
        this.store.setError("");
        this.store.setLoading(false);
      },
      error: err => {
        this.store.setError(err.error?.message || "Some error occurred");
        this.store.setLoading(false);
      },
    });
  }

  logout(): void {
    this.store.setLoggedInUser(null);
    this.authService.logout();
    //This is a dirty hack for now
    //Need to reset all the services and user router to navigate to auth page
    location.reload();
  }
}
