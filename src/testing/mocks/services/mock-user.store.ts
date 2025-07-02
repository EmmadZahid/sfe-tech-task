import { signal } from "@angular/core";
import { User } from "../../../app/shared/models/user";

export class MockUserStore {
  users = signal<User[]>([]);
  user = signal<User | null>(null);
  loggedInUser = signal<User | null>(null);
  loading = signal(false);
  saving = signal(false);
  saved = signal(false);
  error = signal("");
  savingError = signal("");

  setUsers = jasmine.createSpy("setUsers");
  setUser = jasmine.createSpy("setUser");
  setLoggedInUser = jasmine.createSpy("setLoggedInUser");
  setLoading = jasmine.createSpy("setLoading");
  setSaving = jasmine.createSpy("setSaving");
  setSaved = jasmine.createSpy("setSaved");
  setError = jasmine.createSpy("setError");
  setSavingError = jasmine.createSpy("setSavingError");
  upsertUser = jasmine.createSpy("upsertUser");
}
