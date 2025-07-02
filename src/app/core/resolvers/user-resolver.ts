import { Injectable, inject } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { UsersFacadeService } from "../facades/users-facade.service";

@Injectable({ providedIn: "root" })
export class UserResolver implements Resolve<boolean> {
  usersFacade = inject(UsersFacadeService);

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.paramMap.get("id");
    if (id) this.usersFacade.getUserById(+id);
    return of(true);
  }
}
