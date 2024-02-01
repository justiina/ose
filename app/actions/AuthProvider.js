'use client'
import { createContext, useContext, useState } from "react";
import { AuthService } from "./AuthService";

const AuthContext = createContext(null);

export default function useAuth() {
  return useContext(AuthContext);
}

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const login = async () => {
    const { error, user } = await AuthService.login();
    setUser(user ?? null);
    setError(error ?? "");
  };

  const logout = () => {
    AuthService.logout;
    setUser(null);
  };

  const value = { user, error, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
