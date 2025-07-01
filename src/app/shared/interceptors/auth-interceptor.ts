import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { AuthService } from "../../core/services/auth.service";
import { inject } from "@angular/core";
import { delay } from "rxjs";

const DELAY: number = 1000;
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authToken = inject(AuthService).token();
  if (req.url.includes("/login")) {
    return next(req).pipe(delay(DELAY));
  }
  const newReq = req.clone({
    headers: req.headers.append("authorization", `BEARER ${authToken}`),
  });
  return next(newReq).pipe(delay(DELAY));
}
