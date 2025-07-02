import { Routes } from "@angular/router";
import { UserResolver } from "../../core/resolvers/user-resolver";
import { editGuard } from "../../shared/guards/edit.guard";
import { adminGuard } from "../../shared/guards/admin.guard";

export const USERS_PATH = "users";

export const USERS_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () => import("./users-list-page/users-list-page.component").then(c => c.UsersListPageComponent),
  },
  {
    path: "create",
    canActivate: [adminGuard],
    data: {
      mode: "create",
    },
    loadComponent: () => import("./user-form-page/user-form-page.component").then(c => c.UserFormPageComponent),
  },
  {
    path: ":id",
    resolve: {
      user: UserResolver,
    },
    data: {
      mode: "edit",
    },
    canActivate: [editGuard],
    loadComponent: () => import("./user-form-page/user-form-page.component").then(c => c.UserFormPageComponent),
  },
];
