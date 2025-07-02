import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, delay, throwError } from "rxjs";
import { AuthFacadeService } from "../../core/facades/auth-facade.service";
import { Router } from "@angular/router";

const DELAY: number = 500;
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authFacade = inject(AuthFacadeService);
  const router = inject(Router);
  if (req.url.includes("/login")) {
    return next(req).pipe(delay(DELAY));
  }
  const newReq = req.clone({
    headers: req.headers.append("authorization", `BEARER ${authFacade.token()}`),
  });
  return next(newReq).pipe(
    delay(DELAY),
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        authFacade.logout();
        router.navigateByUrl("/auth");
      }

      return throwError(() => err);
    })
  );
}
