import { Injectable, effect, signal } from "@angular/core";
import { User } from "../../shared/models/user";

const USER_KEY = "user";
@Injectable({ providedIn: "root" })
export class UserStore {
  users = signal<User[]>([]);
  user = signal<User | null>(null);
  loggedInUser = signal<User | null>(null);
  loading = signal(false);
  saved = signal(false);
  error = signal("");
  savingError = signal("");

  constructor() {
    try {
      const savedUser = JSON.parse(localStorage.getItem(USER_KEY) ?? "{}");
      if (Object.entries(savedUser).length) this.setLoggedInUser(savedUser);
    } catch (error) {}
  }

  setUsers(newUsers: User[]) {
    this.users.set(newUsers);
  }

  setUser(user: User | null) {
    this.user.set(user);
  }

  setLoggedInUser(user: User | null) {
    this.loggedInUser.set(user);
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }

  setLoading(value: boolean) {
    this.loading.set(value);
  }

  setSaved(value: boolean) {
    this.saved.set(value);
  }

  setError(message: string) {
    this.error.set(message);
  }

  setSavingError(message: string) {
    this.savingError.set(message);
  }

  upsertUser(user: User) {
    const current = this.users();
    const index = current.findIndex(u => u.id === user.id);
    if (index === -1) {
      this.users.set([...current, user]);
    } else {
      const updated = [...current];
      updated[index] = user;
      this.users.set(updated);
      //Updating the current user
      if (this.loggedInUser()?.id === user.id) {
        this.setLoggedInUser({ ...user, password: undefined });
      }
    }
  }
}
