import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { UsersFacadeService } from "../../core/facades/users-facade.service";

@Injectable({ providedIn: "root" })
export class AdminGuard implements CanActivate {
  facade = inject(UsersFacadeService);
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.facade.isLoggedInUserAdmin();
  }
}
