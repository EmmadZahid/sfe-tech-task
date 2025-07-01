import { Component, inject } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { AuthService } from "./core/services/auth.service";

@Component({
  selector: "app-root",
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "SFE Tech Task";
  router = inject(Router);
  authService = inject(AuthService);
  constructor() {
    if (this.authService.token) {
      this.router.navigate(["users"]);
    }
  }
}
