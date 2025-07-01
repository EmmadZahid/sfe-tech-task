import { effect, inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { AuthResponse } from "../../shared/models/auth";

const TOKEN_KEY = "token";
@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = "api/auth";
  token = signal<string>("");

  constructor() {
    try {
      this.token.set(localStorage.getItem(TOKEN_KEY) ?? "");
    } catch (error) {}

    effect(() => {
      if (this.token()) {
        localStorage.setItem(TOKEN_KEY, this.token());
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    });
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, {
        username,
        password,
      })
      .pipe(
        tap(response => {
          this.token.set(response.token);
        })
      );
  }

  logout(): void {
    this.token.set("");
  }
}
