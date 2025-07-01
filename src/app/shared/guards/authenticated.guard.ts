import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthFacadeService } from "../../core/facades/auth-facade.service";

export const authenticatedGuard: CanActivateFn = () => {
  const token = inject(AuthFacadeService).token();
  const router = inject(Router);
  if (!token) {
    router.navigateByUrl("/auth");
    return false;
  }

  return true;
};
