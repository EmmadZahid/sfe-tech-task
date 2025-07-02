import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { UsersFacadeService } from "../../core/facades/users-facade.service";

export const editGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const facade = inject(UsersFacadeService);
  const router = inject(Router);
  const hasPermission =
    facade.isLoggedInUserAdmin() || route.paramMap.get("id") == facade.loggedInUser()?.id.toString();
  if (!hasPermission) router.navigate(["users"]);
  return hasPermission;
};
