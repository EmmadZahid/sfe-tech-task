import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UsersListPageComponent } from "./users-list-page.component";
import { UsersFacadeService } from "../../../core/facades/users-facade.service";
import { Router } from "@angular/router";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { By } from "@angular/platform-browser";
import { signal } from "@angular/core";
import { MockUsersListComponent } from "../../../../testing/mocks/components/mock-users-list.component";
import { MockAppSpinnerComponent } from "../../../../testing/mocks/components/mock-app-spinner.component";
import { MockUsersFacade } from "../../../../testing/mocks/services/mock-users-facade.service";
import { MockRouter } from "../../../../testing/mocks/services/mock-router";

describe("UsersListPageComponent", () => {
  let component: UsersListPageComponent;
  let fixture: ComponentFixture<UsersListPageComponent>;
  let facade: MockUsersFacade;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersListPageComponent, MockUsersListComponent, MockAppSpinnerComponent],
      providers: [
        { provide: UsersFacadeService, useClass: MockUsersFacade },
        {
          provide: Router,
          useClass: MockRouter,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListPageComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(UsersFacadeService) as any;
    router = TestBed.inject(Router) as unknown as MockRouter;

    fixture.detectChanges();
  });

  it("should call loadUsers on init", () => {
    expect(facade.loadUsers).toHaveBeenCalledTimes(1);
  });

  it("should navigate to create page on goToNew()", () => {
    component.goToNew();
    expect(facade.resetSaved).toHaveBeenCalled();
    expect(facade.resetLoading).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(["/users/create"]);
  });

  it("should navigate to edit page with correct ID on goToEdit()", () => {
    component.goToEdit(42);
    expect(facade.resetSaved).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(["/users", 42]);
  });

  it("should show Add User button if user is admin", () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("button"));
    expect(button.nativeElement.textContent).toContain("Add User");
  });

  it("should not show Add User button if user is not admin", () => {
    facade.isLoggedInUserAdmin.set(false);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("button"));
    expect(button).toBeNull();
  });

  it("should show error message if error signal is set", () => {
    facade.error.set("Something went wrong");
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.css(".app-error"));
    expect(error.nativeElement.textContent).toContain("Something went wrong");
  });

  it("should show spinner if loading signal is true", () => {
    facade.loading.set(true);
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css("app-spinner"));
    expect(spinner).toBeTruthy();
  });

  it("should show users list if not loading and no error", () => {
    facade.loading.set(false);
    facade.error.set("");
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css("app-users-list"));
    expect(list).toBeTruthy();
  });

  it("should show title", () => {
    const title = fixture.debugElement.query(By.css("h2")).nativeElement;
    expect(title.textContent).toContain("Users");
  });
});
