import { Injectable, effect, signal } from "@angular/core";
import { User } from "../../shared/models/user";

const USER_KEY = "user";
@Injectable({ providedIn: "root" })
export class UserStore {
  users = signal<User[]>([]);
  user = signal<User | null>(null);
  loading = signal(false);
  error = signal("");

  constructor() {
    try {
      const savedUser = JSON.parse(localStorage.getItem(USER_KEY) ?? "{}");
      if (Object.entries(savedUser).length) this.setUser(savedUser);
    } catch (error) {}
  }

  setUsers(newUsers: User[]) {
    this.users.set(newUsers);
  }

  setUser(user: User | null) {
    this.user.set(user);
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }

  setLoading(value: boolean) {
    this.loading.set(value);
  }

  setError(message: string) {
    this.error.set(message);
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
      if (this.user()?.id === user.id) {
        this.setUser({ ...user, password: undefined });
      }
    }
  }
}
