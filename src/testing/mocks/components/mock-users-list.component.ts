import { Component, OutputEmitterRef, input, output } from "@angular/core";
import { User } from "../../../app/shared/models/user";

export
@Component({
  selector: "app-users-list",
  template: "",
})
class MockUsersListComponent {
  users = input<User[]>([]);
  edit: OutputEmitterRef<number> = output();
}
