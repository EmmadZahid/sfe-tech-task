import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LoginPageComponent } from "./login-page.component";
import { ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { signal } from "@angular/core";
import { By } from "@angular/platform-browser";
import { AuthFacadeService } from "../../../core/facades/auth-facade.service";
import { MockAuthFacadeService } from "../../../../testing/mocks/mock-auth-facade.service";
import { MockRouter } from "../../../../testing/mocks/mock-router";

describe("LoginPageComponent", () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let mockAuthFacade: MockAuthFacadeService;
  let mockRouter: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        { provide: AuthFacadeService, useClass: MockAuthFacadeService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    mockAuthFacade = TestBed.inject(AuthFacadeService) as unknown as MockAuthFacadeService;
    mockRouter = TestBed.inject(Router) as unknown as MockRouter;

    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should render form and title", () => {
    const title = fixture.debugElement.query(By.css("h2")).nativeElement;
    expect(title.textContent).toContain("Login");

    const usernameInput = fixture.debugElement.query(By.css('input[formControlName="username"]'));
    const passwordInput = fixture.debugElement.query(By.css('input[formControlName="password"]'));
    expect(usernameInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
  });

  it("should disable submit button when form is invalid", () => {
    component.form.setValue({ username: "", password: "" });
    fixture.detectChanges();

    let button = fixture.debugElement.query(By.css("button")).nativeElement;
    expect(button.disabled).toBeTrue();

    component.form.setValue({ username: "john", password: "" });
    fixture.detectChanges();

    button = fixture.debugElement.query(By.css("button")).nativeElement;
    expect(button.disabled).toBeTrue();

    component.form.setValue({ username: "", password: "123" });
    fixture.detectChanges();

    button = fixture.debugElement.query(By.css("button")).nativeElement;
    expect(button.disabled).toBeTrue();
  });

  it("should show username required error", () => {
    const usernameControl = component.form.get("username");
    usernameControl?.markAsTouched();
    usernameControl?.setValue("");
    fixture.detectChanges();

    const error = fixture.debugElement.query(By.css("mat-error"));
    expect(error.nativeElement.textContent).toContain("Please enter username");
  });

  it("should show username required error for whitespaces", () => {
    const usernameControl = component.form.get("username");
    usernameControl?.markAsTouched();
    usernameControl?.setValue("   ");
    fixture.detectChanges();

    const error = fixture.debugElement.query(By.css("mat-error"));
    expect(error.nativeElement.textContent).toContain("Please enter username");
  });

  it("should show no spaces allowed error", () => {
    const usernameControl = component.form.get("username");
    usernameControl?.markAsTouched();
    usernameControl?.setValue("john john");
    fixture.detectChanges();

    const error = fixture.debugElement.query(By.css("mat-error"));
    expect(error.nativeElement.textContent).toContain("No spaces allowed");
  });

  it("should show password required error", () => {
    const passwordControl = component.form.get("password");
    passwordControl?.markAsTouched();
    passwordControl?.setValue("");
    fixture.detectChanges();

    const error = fixture.debugElement.query(By.css("mat-error"));
    expect(error.nativeElement.textContent).toContain("Please enter password");
  });

  it("should call login on valid form submit", () => {
    component.form.setValue({ username: "john", password: "12345" });
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css("button")).nativeElement;
    expect(button.disabled).toBeFalse();

    button.click();
    expect(mockAuthFacade.login).toHaveBeenCalledWith("john", "12345");
  });

  it("should display error message from facade", () => {
    mockAuthFacade.error.set("Invalid credentials");
    fixture.detectChanges();

    const errorText = fixture.debugElement.query(By.css(".app-error")).nativeElement;
    expect(errorText.textContent).toContain("Invalid credentials");
  });

  it("should redirect to /users if token is set", () => {
    mockAuthFacade.token.set("mock-token");
    fixture.detectChanges();
    expect(mockRouter.navigate).toHaveBeenCalledWith(["users"]);
  });

  it("should call authFacade.login with form values on submit", () => {
    component.form.setValue({ username: "john", password: "123456" });
    component.submit();
    expect(mockAuthFacade.login).toHaveBeenCalledWith("john", "123456");
  });
});
