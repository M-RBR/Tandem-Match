import { useUser } from "../contexts/UserContext";
import { baseURL } from "./baseURL";

export const useAuthFetch = () => {
  const { token } = useUser();

  const authFetch = async (
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
    return fetch(`${baseURL}${path}`, {
      ...options,
      headers,
    });
  };

  return authFetch;
};
