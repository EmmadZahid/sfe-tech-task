import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { UsersFacadeService } from "../../core/facades/users-facade.service";

export const adminGuard: CanActivateFn = () => {
  const facade = inject(UsersFacadeService);
  const router = inject(Router);
  const hasPermission = facade.isLoggedInUserAdmin();
  if (!hasPermission) router.navigate(["users"]);
  return hasPermission;
};
