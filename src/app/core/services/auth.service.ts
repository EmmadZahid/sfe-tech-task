import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { AuthResponse } from "../../shared/models/auth";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly apiUrl: string = "api/auth";
  private _token: string | null = null;

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
        })
      );
  }

  get token(): string | null {
    return this._token;
  }
}
