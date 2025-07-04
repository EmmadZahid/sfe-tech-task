import { User } from "./user";

export interface AuthResponse {
  token: string;
  user: Omit<User, "password">;
}
