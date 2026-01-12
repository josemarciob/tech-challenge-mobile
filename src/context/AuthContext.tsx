import React, { createContext, useContext, useState } from "react";
import { api, setAuthToken } from "../services/api";

// Tipagem do usuário: agora só "aluno" ou "professor"
export type Role = "aluno" | "professor";

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    console.log("Resposta do backend:", data);

    setToken(data.token);
    setAuthToken(data.token);

    // monta o objeto user corretamente
    setUser({
      id: String(data.user?.id || data.id),
      name: data.user?.name || data.name,
      role: data.user?.role || data.role, // agora só "aluno" ou "professor"
      email: data.user?.email || data.email,
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(undefined);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
