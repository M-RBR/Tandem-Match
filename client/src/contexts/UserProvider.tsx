import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../@types/user";
import { UserContext } from "./UserContext";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setTokenState(savedToken);
      try {
        setUserState(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        setUserState(null);
      }
    }
    setIsLoading(false);
  }, []);

  const setUser = (user: User | null, token?: string) => {
    setUserState(user);
    if (user && token) {
      setTokenState(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  const logout = () => {
    setUserState(null);
    setTokenState(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, token, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
