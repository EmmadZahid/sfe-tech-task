import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "./core/services/auth.service";

@Component({
  selector: "app-root",
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "SFE Tech Task";
  authService = inject(AuthService);
  constructor() {}

  onLogoutClick(event: MouseEvent): void {
    event.preventDefault();
    this.authService.logout();
  }
}
