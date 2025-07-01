import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { delay } from "rxjs";
import { AuthFacadeService } from "../../core/facades/auth-facade.service";

const DELAY: number = 500;
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const token = inject(AuthFacadeService).token();
  if (req.url.includes("/login")) {
    return next(req).pipe(delay(DELAY));
  }
  const newReq = req.clone({
    headers: req.headers.append("authorization", `BEARER ${token}`),
  });
  return next(newReq).pipe(delay(DELAY));
}
