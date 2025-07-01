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
  isLoggedIn = this.authService.token;
  constructor() {
    if (this.authService.token()) {
      this.router.navigate(["users"]);
    }
  }

  onLogoutClick(event: MouseEvent): void {
    event.preventDefault();
    this.authService.logout();
    //This is a dirty hack for now
    //Need to reset all the services and user router to navigate to auth page
    location.reload();
  }
}
