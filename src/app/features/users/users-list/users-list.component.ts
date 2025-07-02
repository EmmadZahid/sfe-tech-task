import { Component, inject, input, output, OutputEmitterRef } from "@angular/core";
import { User } from "../../../shared/models/user";
import { MatTableModule } from "@angular/material/table";

@Component({
  selector: "app-users-list",
  imports: [MatTableModule],
  templateUrl: "./users-list.component.html",
  styleUrl: "./users-list.component.scss",
})
export class UsersListComponent {
  loggedInUser = input<User | null>();
  isLoggedInUserAdmin = input<boolean>();
  users = input<User[]>([]);
  displayedColumns: string[] = ["username", "role", "editable"];

  edit: OutputEmitterRef<number> = output();

  onEditClick(event: MouseEvent, id: number): void {
    event.preventDefault();
    this.edit.emit(id);
  }
}
