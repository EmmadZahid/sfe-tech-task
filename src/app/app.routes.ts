import { Routes } from "@angular/router";
import { USERS_PATH } from "./features/users/users.routes";

import { redirectIfAuthenticatedGuard } from "./shared/guards/redirect-if-authenticated.guard";
import { authenticatedGuard } from "./shared/guards/authenticated.guard";

export const routes: Routes = [
  {
    path: "auth",
    canActivate: [redirectIfAuthenticatedGuard],
    loadComponent: () => import("./features/auth/login-page/login-page.component").then(m => m.LoginPageComponent),
  },
  {
    path: USERS_PATH,
    canActivate: [authenticatedGuard],
    loadChildren: () => import("./features/users/users.routes").then(r => r.USERS_ROUTES),
  },
  { path: "", redirectTo: "/auth", pathMatch: "full" },
];
