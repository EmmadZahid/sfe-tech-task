import { Component, input, InputSignal, output, OutputEmitterRef } from "@angular/core";
import { User } from "../../../shared/models/user";
import { MatTableModule } from "@angular/material/table";

@Component({
  selector: "app-users-list",
  imports: [MatTableModule],
  templateUrl: "./users-list.component.html",
  styleUrl: "./users-list.component.scss",
})
export class UsersListComponent {
  users = input<User[]>([]);
  displayedColumns: string[] = ["username", "role", "editAble"];

  edit: OutputEmitterRef<number> = output();

  onEditClick(event: MouseEvent, id: number): void {
    event.preventDefault();
    this.edit.emit(id);
  }
}
