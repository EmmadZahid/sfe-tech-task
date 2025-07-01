import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { AuthResponse } from "../../shared/models/auth";
import { UserStore } from "../stores/users.store";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);
  private store = inject(UserStore);
  private readonly apiUrl: string = "api/auth";
  private _token: string | null = null;

  constructor() {
    this._token = localStorage.getItem("token") || null;
  }

  login(username: string, password: string): Observable<AuthResponse> {
    this._token = null;
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, {
        username,
        password,
      })
      .pipe(
        tap(response => {
          this._token = response.token;
          localStorage.setItem("token", this._token);
          this.store.setUser(response.user);
        })
      );
  }

  get token(): string | null {
    return this._token;
  }
}
