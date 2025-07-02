import { Component, inject } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: "app-spinner",
  imports: [MatProgressSpinnerModule],
  templateUrl: "./app-spinner.component.html",
  styleUrl: "./app-spinner.component.scss",
})
export class AppSpinnerComponent {}
