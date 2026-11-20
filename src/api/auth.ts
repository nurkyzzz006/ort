import { api } from "./api";

export interface User {
  id: string;
  email: string | null;
  display_name: string | null;
  locale: "ky" | "ru";
  timezone: string;
  grade_status: "grade_10" | "grade_11" | "graduate" | "other" | null;
  roles: string[];
  created_at: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthResponse {
  user: User;
  tokens: Tokens;
}

export interface LoginData {
  email: string;
  password: string;
}

// POST /api/v1/auth/login
export const login = async (data: LoginData) => {
  const res = await api.post<AuthResponse>("/auth/login", data);
  return res.data;
};
