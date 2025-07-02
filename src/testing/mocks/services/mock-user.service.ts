export class MockUsersService {
  getUsers = jasmine.createSpy("getUsers");
  getUserById = jasmine.createSpy("getUserById");
  addUser = jasmine.createSpy("addUser");
  editUser = jasmine.createSpy("editUser");
}
