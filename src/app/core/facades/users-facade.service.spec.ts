import { TestBed } from "@angular/core/testing";
import { UsersFacadeService } from "./users-facade.service";
import { UserStore } from "../stores/users.store";
import { UsersService } from "../services/users.service";
import { of, throwError } from "rxjs";
import { User } from "../../shared/models/user";
import { MockUserStore } from "../../../testing/mocks/mock-user.store";
import { MockUsersService } from "../../../testing/mocks/mock-user.service";

const list: User[] = [
  { id: 1, username: "john", password: "pw", role: "user" } as User,
  { id: 2, username: "admin", password: "pw", role: "admin" } as User,
];
const john = list[0];
const saved = { ...john, username: "johnny" } as User;

describe("UsersFacadeService", () => {
  let facade: UsersFacadeService;
  let userStore: MockUserStore;
  let usersService: MockUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsersFacadeService,
        { provide: UserStore, useClass: MockUserStore },
        { provide: UsersService, useClass: MockUsersService },
      ],
    });

    facade = TestBed.inject(UsersFacadeService);
    userStore = TestBed.inject(UserStore) as unknown as MockUserStore;
    usersService = TestBed.inject(UsersService) as unknown as MockUsersService;
  });

  it("loadUsers() should fill store on success", () => {
    usersService.getUsers.and.returnValue(of(list));

    facade.loadUsers();

    expect(userStore.setLoading).toHaveBeenCalledWith(true);
    expect(usersService.getUsers).toHaveBeenCalled();
    expect(userStore.setUsers).toHaveBeenCalledWith(list);
    expect(userStore.setError).toHaveBeenCalledWith("");
    expect(userStore.setLoading).toHaveBeenCalledWith(false);
  });

  it("loadUsers() should set error on failure", () => {
    usersService.getUsers.and.returnValue(throwError(() => new Error("boom")));

    facade.loadUsers();

    expect(userStore.setError).toHaveBeenCalledWith("Failed to load users");
    expect(userStore.setLoading).toHaveBeenCalledWith(false);
  });

  it("getUserById() should fill store on success", () => {
    usersService.getUserById.and.returnValue(of(john));

    facade.getUserById(1);

    expect(userStore.setLoading).toHaveBeenCalledWith(true);
    expect(usersService.getUserById).toHaveBeenCalledWith(1);
    expect(userStore.setUser).toHaveBeenCalledWith(john);
    expect(userStore.setLoading).toHaveBeenCalledWith(false);
  });

  it("getUserById() should set error on failure", () => {
    usersService.getUserById.and.returnValue(throwError(() => new Error("boom")));

    facade.getUserById(1);

    expect(userStore.setError).toHaveBeenCalledWith("Failed to load user");
    expect(userStore.setLoading).toHaveBeenCalledWith(false);
  });

  it("saveUser() should call addUser for new user and upsert on success", () => {
    usersService.addUser.and.returnValue(of(saved));

    facade.saveUser({ username: "new" });

    expect(userStore.setSaving).toHaveBeenCalledWith(true);
    expect(usersService.addUser).toHaveBeenCalled();
    expect(userStore.upsertUser).toHaveBeenCalledWith(saved);
    expect(userStore.setSaved).toHaveBeenCalledWith(true);
    expect(userStore.setSaving).toHaveBeenCalledWith(false);
  });

  it("saveUser() should call editUser for existing user id ≠ 0", () => {
    usersService.editUser.and.returnValue(of(saved));

    facade.saveUser({ id: 1, username: "johnny" });

    expect(usersService.editUser).toHaveBeenCalledWith({ id: 1, username: "johnny" });
    expect(userStore.upsertUser).toHaveBeenCalledWith(saved);
  });

  it("saveUser() should set savingError on failure", () => {
    usersService.addUser.and.returnValue(throwError(() => new Error("fail")));

    facade.saveUser({ username: "oops" });

    expect(userStore.setSavingError).toHaveBeenCalledWith("Failed to save user");
    expect(userStore.setSaving).toHaveBeenCalledWith(false);
  });

  it("resetSaved() should reset saved flags and clear form state", () => {
    facade.resetSaved();

    expect(userStore.setSaved).toHaveBeenCalledWith(false);
    expect(userStore.setUser).toHaveBeenCalledWith(null);
    expect(userStore.setSavingError).toHaveBeenCalledWith("");
    expect(userStore.setSaving).toHaveBeenCalledWith(false);
  });

  it("resetLoading() should clear loading flag and error", () => {
    facade.resetLoading();

    expect(userStore.setLoading).toHaveBeenCalledWith(false);
    expect(userStore.setError).toHaveBeenCalledWith("");
  });

  it("isLoggedInUserAdmin should reflect admin role", () => {
    userStore.loggedInUser.set(list[1]);
    expect(facade.isLoggedInUserAdmin()).toBeTrue();

    userStore.loggedInUser.set(list[0]);
    expect(facade.isLoggedInUserAdmin()).toBeFalse();
  });
});
