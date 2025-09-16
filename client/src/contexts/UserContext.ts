import { createContext } from "react";
import type { User } from "../@types/user";

type UserContextType = {
  user: User | null;
  setUser: (user: User | null, token?: string) => void;
  token: string | null;
  logout: () => void;
  isLoading: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);
export type { UserContextType };
