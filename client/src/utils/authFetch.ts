import { useUser } from "../contexts/UserContext";
import { baseURL } from "./baseURL";

export const useAuthFetch = () => {
  const { token } = useUser();

  const authFetch = async (
    path: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const headers = {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    return fetch(`${baseURL}${path}`, {
      ...options,
      headers,
    });
  };

  return authFetch;
};
