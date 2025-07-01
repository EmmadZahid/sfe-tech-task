import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";

@Injectable({ providedIn: "root" })
export class AuthenticatedGuard implements CanActivate {
  authService: AuthService = inject(AuthService);
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return !!this.authService.token();
  }
}
