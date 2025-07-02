import { signal } from "@angular/core";

export class MockAuthFacadeService {
  token = signal("");
  login = jasmine.createSpy("login");
  logout = jasmine.createSpy("logout");
  loading = signal(false);
  error = signal("");
}
