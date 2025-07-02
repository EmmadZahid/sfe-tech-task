import { TestBed } from "@angular/core/testing";

import { User } from "../../shared/models/user";
import { USER_KEY, UserStore } from "./users.store";

const mockUser: User = { id: 1, username: "alice", password: "pw", role: "admin" } as User;
const updatedMockUser: User = { ...mockUser, username: "alice-updated" } as User;
const anotherUser: User = { id: 2, username: "bob", password: "pw", role: "user" } as User;

describe("UserStore", () => {
  let store: UserStore;

  let localStorageGet: jasmine.Spy;
  let localStorageSet: jasmine.Spy;
  let localStorageRemove: jasmine.Spy;

  beforeEach(() => {
    localStorage.clear();

    localStorageGet = spyOn(localStorage, "getItem");
    localStorageSet = spyOn(localStorage, "setItem");
    localStorageRemove = spyOn(localStorage, "removeItem");

    TestBed.resetTestingModule();
  });

  it("should populate loggedInUser from localStorage on construction", () => {
    localStorageGet.and.returnValue(JSON.stringify(mockUser));

    store = TestBed.inject(UserStore);

    expect(store.loggedInUser()).toEqual(mockUser);
  });

  it("should set signals via their setters", () => {
    localStorageGet.and.returnValue(null);
    store = TestBed.inject(UserStore);

    store.setLoading(true);
    store.setSaving(true);
    store.setSaved(true);
    store.setUser(mockUser);
    store.setUsers([mockUser, anotherUser]);
    store.setError("e");
    store.setSavingError("se");
    expect(store.loading()).toBeTrue();
    expect(store.saving()).toBeTrue();
    expect(store.saved()).toBeTrue();
    expect(store.user()).toBe(mockUser);
    expect(store.users()).toEqual([mockUser, anotherUser]);
    expect(store.error()).toBe("e");
    expect(store.savingError()).toBe("se");
  });

  it("should persist and clear loggedInUser in localStorage", () => {
    localStorageGet.and.returnValue(null);
    store = TestBed.inject(UserStore);

    store.setLoggedInUser(mockUser);
    expect(store.loggedInUser()).toBe(mockUser);
    expect(localStorageSet).toHaveBeenCalledWith(USER_KEY, JSON.stringify(mockUser));

    store.setLoggedInUser(null);
    expect(store.loggedInUser()).toBeNull();
    expect(localStorageRemove).toHaveBeenCalledWith(USER_KEY);
  });

  it("should add new user when id not found", () => {
    localStorageGet.and.returnValue(null);
    store = TestBed.inject(UserStore);

    store.setUsers([mockUser]);
    store.upsertUser(anotherUser);
    expect(store.users().length).toBe(2);
    expect(store.users()).toContain(anotherUser);
  });

  it("should update existing user and refresh loggedInUser if ids match", () => {
    localStorageGet.and.returnValue(null);
    store = TestBed.inject(UserStore);

    store.setUsers([mockUser]);
    store.setLoggedInUser(mockUser);

    store.upsertUser(updatedMockUser);
    expect(store.users()[0]).toEqual(updatedMockUser);
    expect(store.loggedInUser()?.username).toBe("alice-updated");
  });
});
