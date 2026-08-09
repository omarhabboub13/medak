import { apiPost, setToken, clearToken } from "./api";

export type Role = "PATIENT" | "DOCTOR" | "ADMIN";

export interface AuthUser {
  id: string;
  phone: string;
  fullName: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

const USER_KEY = "medak_user";

export async function login(
  phone: string,
  password: string,
): Promise<AuthUser> {
  const res = await apiPost<AuthResponse>(
    "/auth/login",
    { phone, password },
    { auth: false },
  );
  setToken(res.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  return res.user;
}

export async function register(data: {
  phone: string;
  password: string;
  fullName: string;
  role: Role;
  email?: string;
}): Promise<AuthUser> {
  const res = await apiPost<AuthResponse>("/auth/register", data, {
    auth: false,
  });
  setToken(res.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  return res.user;
}

export function clearSession() {
  clearToken();
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
  }
}

export function logout() {
  clearSession();
  window.location.href = "/admin/login";
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}
