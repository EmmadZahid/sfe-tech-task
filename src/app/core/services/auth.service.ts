import { effect, inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { AuthResponse } from "../../shared/models/auth";
import { UserStore } from "../stores/users.store";

const TOKEN_KEY = "token";
@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);
  private store = inject(UserStore);
  private readonly apiUrl: string = "api/auth";
  private _token = signal<string>("");
  token = this._token.asReadonly();

  constructor() {
    try {
      this._token.set(localStorage.getItem(TOKEN_KEY) ?? "");
    } catch (error) {}
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, {
        username,
        password,
      })
      .pipe(
        tap(response => {
          this._token.set(response.token);
          localStorage.setItem(TOKEN_KEY, response.token);
          this.store.setUser(response.user);
        })
      );
  }

  logout(): void {
    this.store.setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    //This is a dirty hack for now
    //Need to reset all the services and user router to navigate to auth page
    location.reload();
  }
}
