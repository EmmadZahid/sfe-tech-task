import { signal } from "@angular/core";
import { single } from "rxjs";
import { User } from "../../../app/shared/models/user";

export class MockUsersFacade {
  users = signal([{ id: 1, username: "john", role: "user" }]);
  loading = signal(false);
  error = signal("");
  isLoggedInUserAdmin = signal(true);
  loggedInUser = signal<User | null>(null);
  loadUsers = jasmine.createSpy("loadUsers");
  resetSaved = jasmine.createSpy("resetSaved");
  resetLoading = jasmine.createSpy("resetLoading");
}
