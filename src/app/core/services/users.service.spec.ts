import { TestBed } from "@angular/core/testing";
import { UsersService } from "./users.service";
import { provideHttpClientTesting, HttpTestingController } from "@angular/common/http/testing";
import { User } from "../../shared/models/user";
import { provideHttpClient } from "@angular/common/http";

describe("UsersService", () => {
  let service: UsersService;
  let http: HttpTestingController;

  const apiUrl = "api/users";

  const mockUser: User = {
    id: 1,
    username: "john",
    password: "123",
    role: "admin",
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UsersService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify(); // assert no outstanding requests
  });

  it("should GET all users", () => {
    const mockUsers: User[] = [mockUser];

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = http.expectOne(apiUrl);
    expect(req.request.method).toBe("GET");
    req.flush(mockUsers);
  });

  it("should GET user by ID", () => {
    service.getUserById(1).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = http.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe("GET");
    req.flush(mockUser);
  });

  it("should POST a new user", () => {
    const newUser: Partial<User> = { username: "new", password: "pw", role: "user" };

    service.addUser(newUser).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = http.expectOne(`${apiUrl}/create`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(newUser);
    req.flush(mockUser);
  });

  it("should PUT to update a user", () => {
    const update: Partial<User> = { id: 1, username: "johnny" };

    service.editUser(update).subscribe(user => {
      expect(user).toEqual({ ...mockUser, username: "johnny" });
    });

    const req = http.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe("PUT");
    expect(req.request.body).toEqual(update);
    req.flush({ ...mockUser, username: "johnny" });
  });
});
