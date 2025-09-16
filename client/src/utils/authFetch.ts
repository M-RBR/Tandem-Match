import { useCallback } from "react";
import { useUser } from "../contexts/useUser";
import { baseURL } from "./baseURL";

export const useAuthFetch = () => {
  const { token } = useUser();

  const authFetch = useCallback(async (
    path: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const headers = new Headers(options.headers || {});

    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${baseURL}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }

    return response;
  }, [token]);

  return authFetch;
};