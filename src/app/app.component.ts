import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthFacadeService } from "./core/facades/auth-facade.service";

@Component({
  selector: "app-root",
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "SFE Tech Task";
  authFacade = inject(AuthFacadeService);
  token = this.authFacade.token;
  constructor() {}

  onLogoutClick(event: MouseEvent): void {
    event.preventDefault();
    this.authFacade.logout();
  }
}
