import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";

export const redirectIfAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.token()) {
    router.navigateByUrl("/users");
    return false;
  }

  return true;
};
