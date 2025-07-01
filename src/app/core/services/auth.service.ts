import { inject, Injectable, signal } from "@angular/core";
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
    this._token.set(localStorage.getItem(TOKEN_KEY) ?? "");
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
    localStorage.removeItem(TOKEN_KEY);
  }
}
