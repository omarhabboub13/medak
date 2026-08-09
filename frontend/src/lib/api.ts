const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const TOKEN_KEY = "medak_token";
const COOKIE_NAME = "medak_token";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

interface ApiOptions extends RequestInit {
  auth?: boolean;
}

export async function api<T = unknown>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { auth = true, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new ApiError(401, "Unauthorized");
  }

  let body: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!res.ok) {
    const message =
      (body as { message?: string })?.message ||
      res.statusText ||
      "Request failed";
    throw new ApiError(
      res.status,
      Array.isArray(message) ? message.join(", ") : message,
    );
  }

  return body as T;
}

export const apiGet = <T = unknown>(path: string, opts?: ApiOptions) =>
  api<T>(path, { ...opts, method: "GET" });

export const apiPost = <T = unknown>(
  path: string,
  data?: unknown,
  opts?: ApiOptions,
) =>
  api<T>(path, {
    ...opts,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });

export const apiPatch = <T = unknown>(
  path: string,
  data?: unknown,
  opts?: ApiOptions,
) =>
  api<T>(path, {
    ...opts,
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });

export const apiDelete = <T = unknown>(path: string, opts?: ApiOptions) =>
  api<T>(path, { ...opts, method: "DELETE" });
